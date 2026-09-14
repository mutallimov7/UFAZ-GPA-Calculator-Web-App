import { CalculationResult, ProgramId } from '../../src/types.ts';
import { UFAZ_PROGRAMS } from '../config/academicPrograms.ts';

export interface CalculationInput {
  programId: ProgramId;
  scores: Record<string, number | undefined | null>;
}

export function roundToTwoDecimals(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function getHonors(gpa: number): CalculationResult['honors'] {
  if (gpa <= 0) return 'En cours (No Exam Yet)';
  if (gpa >= 16.0) return 'Très Bien (High Honors)';
  if (gpa >= 14.0) return 'Bien (Honors)';
  if (gpa >= 12.0) return 'Assez Bien (Satisfactory)';
  if (gpa >= 10.0) return 'Passable (Pass)';
  return 'Ajourné (Fail)';
}

export function calculateProgramGrades(input: CalculationInput): CalculationResult {
  const program = UFAZ_PROGRAMS[input.programId] || UFAZ_PROGRAMS.cs;
  const scores = input.scores || {};

  const validationErrors: { field: string; message: string }[] = [];

  // Helper to safely fetch score with validation
  const getScore = (id: string, label: string = id): number => {
    const val = scores[id];
    if (val === undefined || val === null || isNaN(Number(val))) {
      return 0;
    }
    const num = Number(val);
    if (num < 0 || num > 20) {
      validationErrors.push({ field: id, message: `${label} score must be between 0.00 and 20.00 (received ${num})` });
    }
    return Math.max(0, Math.min(20, num));
  };

  const moduleResults: CalculationResult['moduleResults'] = [];

  if (input.programId === 'cs') {
    // 4.1 Vector Analysis
    const va_nb = getScore('cs_va_nb', 'Vector Analysis Notebook');
    const va_mid = getScore('cs_va_mid', 'Vector Analysis Midterm');
    const va_fin = getScore('cs_va_fin', 'Vector Analysis Final');
    const vaGrade = roundToTwoDecimals((va_nb * 2 + va_mid * 3 + va_fin * 5) / 10);
    moduleResults.push({
      moduleId: 'cs_va',
      moduleName: 'Vector Analysis',
      grade: vaGrade,
      ects: 5,
      gpaWeight: 5,
      passed: vaGrade >= 10.0,
    });

    // 4.2 Physics_3
    const phy_elec = getScore('cs_phy3_elec', 'Electricity');
    const phy_em_mid = getScore('cs_phy3_em_mid', 'Electromagnetism Midterm');
    const phy_em_fin = getScore('cs_phy3_em_fin', 'Electromagnetism Final');
    const phy3Grade = roundToTwoDecimals((phy_elec * 2 + ((phy_em_mid + phy_em_fin) * 3) / 2) / 5);
    moduleResults.push({
      moduleId: 'cs_phy3',
      moduleName: 'Physics_3',
      grade: phy3Grade,
      ects: 7,
      gpaWeight: 7,
      passed: phy3Grade >= 10.0,
    });

    // 4.3 French
    const fr_mid = getScore('cs_fr_mid', 'French Midterm');
    const fr_spk = getScore('cs_fr_spk', 'French Speaking');
    const fr_fin = getScore('cs_fr_fin', 'French Final');
    const frGrade = roundToTwoDecimals((fr_mid * 2 + fr_spk * 3 + fr_fin * 3) / 8);
    moduleResults.push({
      moduleId: 'cs_fr',
      moduleName: 'French',
      grade: frGrade,
      ects: 3,
      gpaWeight: 3,
      passed: frGrade >= 10.0,
    });

    // 4.4 Computer Science (Grouped sub-modules)
    // Software Eng
    const se_pw = getScore('cs_se_pw', 'Software Engineering PW');
    const se_fin = getScore('cs_se_fin', 'Software Engineering Final');
    const seGrade = roundToTwoDecimals((se_pw + se_fin) / 2);

    // Signal Processing
    const sp_pw = getScore('cs_sp_pw', 'Signal Processing PW');
    const sp_fin = getScore('cs_sp_fin', 'Signal Processing Final');
    const spGrade = roundToTwoDecimals((sp_pw * 2 + sp_fin * 3) / 5);

    // Systems Programming
    const sys_pw = getScore('cs_sys_pw', 'Systems Programming PW');
    const sys_fin = getScore('cs_sys_fin', 'Systems Programming Final');
    const sysGrade = roundToTwoDecimals((sys_pw + sys_fin) / 2);

    // IP Networks
    const net_mid = getScore('cs_net_mid', 'IP Networks Midterm');
    const net_fin = getScore('cs_net_fin', 'IP Networks Final');
    const netGrade = roundToTwoDecimals((net_mid + net_fin) / 2);

    // Back-End
    const be_part = getScore('cs_be_part', 'Back-End Participation');
    const be_pw = getScore('cs_be_pw', 'Back-End PW');
    const be_fin = getScore('cs_be_fin', 'Back-End Final');
    const beGrade = roundToTwoDecimals((be_part + be_pw * 4 + be_fin * 5) / 10);

    // Final CS Module
    const csModuleGrade = roundToTwoDecimals((seGrade + spGrade + sysGrade + netGrade + beGrade) / 5);
    moduleResults.push({
      moduleId: 'cs_cs_mod',
      moduleName: 'Computer Science',
      grade: csModuleGrade,
      ects: 15,
      gpaWeight: 15,
      passed: csModuleGrade >= 10.0,
      subGroupResults: {
        'Software Engineering': seGrade,
        'Signal Processing': spGrade,
        'Systems Programming': sysGrade,
        'IP Networks': netGrade,
        'Back-End Development': beGrade,
      },
    });
  } else if (input.programId === 'che') {
    // Chemical Engineering
    // 5.1 Vector Analysis (weight 5)
    const va_nb = getScore('che_va_nb', 'Vector Analysis Notebook');
    const va_mid = getScore('che_va_mid', 'Vector Analysis Midterm');
    const va_fin = getScore('che_va_fin', 'Vector Analysis Final');
    const vaGrade = roundToTwoDecimals((va_nb * 2 + va_mid * 3 + va_fin * 5) / 10);
    moduleResults.push({ moduleId: 'che_va', moduleName: 'Vector Analysis', grade: vaGrade, ects: 5, gpaWeight: 5, passed: vaGrade >= 10.0 });

    // 5.2 Chemistry_3 (weight 9)
    // Formula: ((Reactivity Midterm + Reactivity Final * 2)/3 + (Thermo and Kinetics Midterm + Thermo and Kinetics Final)/2 + Chem Evaluated PW)/8
    // With weights: Reactivity (coeff 3), Thermo (coeff 2), Chem Evaluated PW (coeff 3)
    const react_mid = getScore('che_chem3_react_mid', 'Reactivity Midterm');
    const react_fin = getScore('che_chem3_react_fin', 'Reactivity Final');
    const reactGrade = roundToTwoDecimals((react_mid + react_fin * 2) / 3);

    const tk_mid = getScore('che_chem3_tk_mid', 'Thermo Midterm');
    const tk_fin = getScore('che_chem3_tk_fin', 'Thermo Final');
    const tkGrade = roundToTwoDecimals((tk_mid + tk_fin) / 2);

    const eval_pw = scores['che_chem3_eval_pw'] !== undefined
      ? getScore('che_chem3_eval_pw', 'Chem Evaluated PW')
      : getScore('che_chem3_pw', 'Chem PW');

    const chem3Grade = roundToTwoDecimals(
      (reactGrade * 3 + tkGrade * 2 + eval_pw * 3) / 8
    );
    moduleResults.push({
      moduleId: 'che_chem3',
      moduleName: 'Chemistry_3',
      grade: chem3Grade,
      ects: 9,
      gpaWeight: 9,
      passed: chem3Grade >= 10.0,
      subGroupResults: {
        'Reactivity (3/8)': reactGrade,
        'Thermo & Kinetics (2/8)': tkGrade,
        'Evaluated PW (3/8)': eval_pw,
      },
    });

    // 5.3 Chemical Engineering_3 (weight 8)
    // Formula: (Distillation Final + (Operation on Solids Written Exam + Report/Behavior * 0.5 + PW Written Exam * 0.5)/2 * 2 + Liquid-liquid Extraction)/4
    const dist_fin = getScore('che_ce3_dist_fin', 'Distillation Final');
    const solids_written = scores['che_ce3_solids_written'] !== undefined
      ? getScore('che_ce3_solids_written', 'Operation on Solids Written Exam')
      : getScore('che_ce3_solids_fin', 'Operation on Solids Final');
    const solids_rep = scores['che_ce3_solids_rep'] !== undefined
      ? getScore('che_ce3_solids_rep', 'Report / Behavior')
      : getScore('che_ce3_solids_pw', 'Report/PW');
    const solids_pw_exam = scores['che_ce3_solids_pw_exam'] !== undefined
      ? getScore('che_ce3_solids_pw_exam', 'PW Written Exam')
      : solids_rep;
    const lle = getScore('che_ce3_lle', 'Liquid-Liquid Extraction');

    const solidsGrade = roundToTwoDecimals((solids_written + solids_rep * 0.5 + solids_pw_exam * 0.5) / 2);
    const ce3Grade = roundToTwoDecimals((dist_fin + solidsGrade * 2 + lle) / 4);
    moduleResults.push({
      moduleId: 'che_ce3',
      moduleName: 'Chemical Engineering_3',
      grade: ce3Grade,
      ects: 8,
      gpaWeight: 8,
      passed: ce3Grade >= 10.0,
      subGroupResults: {
        Distillation: dist_fin,
        'Operation on Solids': solidsGrade,
        'Liquid-Liquid Extraction': lle,
      },
    });

    // 5.4 Physics_3 (weight 5)
    // Formula: (Electricity + ((Thermodynamics Midterm + Thermodynamics Final)/2))/2
    const elec = getScore('che_phy3_elec', 'Electricity');
    const th_mid = getScore('che_phy3_th_mid', 'Thermo Midterm');
    const th_fin = getScore('che_phy3_th_fin', 'Thermo Final');
    const thermoAvg = roundToTwoDecimals((th_mid + th_fin) / 2);
    const phy3Grade = roundToTwoDecimals((elec + thermoAvg) / 2);
    moduleResults.push({ moduleId: 'che_phy3', moduleName: 'Physics_3', grade: phy3Grade, ects: 5, gpaWeight: 5, passed: phy3Grade >= 10.0 });

    // 5.5 French (weight 3)
    const fr_mid = getScore('che_fr_mid', 'French Midterm');
    const fr_spk = getScore('che_fr_spk', 'French Speaking');
    const fr_fin = getScore('che_fr_fin', 'French Final');
    const frGrade = roundToTwoDecimals((fr_mid * 2 + fr_spk * 3 + fr_fin * 3) / 8);
    moduleResults.push({ moduleId: 'che_fr', moduleName: 'French', grade: frGrade, ects: 3, gpaWeight: 3, passed: frGrade >= 10.0 });
  } else if (input.programId === 'ge') {
    // Geophysical Engineering
    // 6.1 Vector Analysis (weight 5)
    const va_nb = getScore('ge_va_nb', 'Vector Analysis Notebook');
    const va_mid = getScore('ge_va_mid', 'Vector Analysis Midterm');
    const va_fin = getScore('ge_va_fin', 'Vector Analysis Final');
    const vaGrade = roundToTwoDecimals((va_nb * 2 + va_mid * 3 + va_fin * 5) / 10);
    moduleResults.push({ moduleId: 'ge_va', moduleName: 'Vector Analysis', grade: vaGrade, ects: 5, gpaWeight: 5, passed: vaGrade >= 10.0 });

    // 6.2 Physics_3 (weight 8)
    // Formula: ((Electromagnetism Midterm + Electromagnetism Final)*3/2 + (Thermodynamics Midterm + Thermodynamics Final)/2 * 2 + Solid mechanics * 2)/7
    const em_mid = getScore('ge_phy3_em_mid', 'Electromagnetism Midterm');
    const em_fin = getScore('ge_phy3_em_fin', 'Electromagnetism Final');
    const emGrade = roundToTwoDecimals((em_mid + em_fin) / 2);

    const th_mid = getScore('ge_phy3_th_mid', 'Thermo Midterm');
    const th_fin = getScore('ge_phy3_th_fin', 'Thermo Final');
    const thGrade = roundToTwoDecimals((th_mid + th_fin) / 2);

    const sm = getScore('ge_phy3_sm', 'Solid Mechanics');
    const phy3Grade = roundToTwoDecimals((((em_mid + em_fin) * 3) / 2 + (th_mid + th_fin) + sm * 2) / 7);
    moduleResults.push({
      moduleId: 'ge_phy3',
      moduleName: 'Physics_3',
      grade: phy3Grade,
      ects: 8,
      gpaWeight: 8,
      passed: phy3Grade >= 10.0,
      subGroupResults: {
        Electromagnetism: emGrade,
        Thermodynamics: thGrade,
        'Solid Mechanics': sm,
      },
    });

    // 6.3 French (weight 3)
    const fr_mid = getScore('ge_fr_mid', 'French Midterm');
    const fr_spk = getScore('ge_fr_spk', 'French Speaking');
    const fr_fin = getScore('ge_fr_fin', 'French Final');
    const frGrade = roundToTwoDecimals((fr_mid * 2 + fr_spk * 3 + fr_fin * 3) / 8);
    moduleResults.push({ moduleId: 'ge_fr', moduleName: 'French', grade: frGrade, ects: 3, gpaWeight: 3, passed: frGrade >= 10.0 });

    // 6.4 Geology_1 (weight 14)
    // Formula: (Sedimentology + Depositional Environments Final * 2 + (Cartography and GIS Final + Project) / 2 * 2 + Structural Geology * 2 + Basin analysis and stratigraphy Final* 2 + (Geochemistry(PW) + Geochemistry Final) / 2 * 2)/11
    const sed = getScore('ge_sed', 'Sedimentology');
    const dep_fin = getScore('ge_dep_fin', 'Depositional Environments Final');
    const gis_fin = getScore('ge_gis_fin', 'Cartography and GIS Final');
    const gis_proj = getScore('ge_gis_proj', 'Cartography and GIS Project');
    const struct = getScore('ge_struct', 'Structural Geology');
    const basin_fin = getScore('ge_basin_fin', 'Basin Analysis Final');
    const geochem_pw = getScore('ge_geochem_pw', 'Geochemistry(PW)');
    const geochem_fin = getScore('ge_geochem_fin', 'Geochemistry Final');

    const gisAvg = roundToTwoDecimals((gis_fin + gis_proj) / 2);
    const geochemAvg = roundToTwoDecimals((geochem_pw + geochem_fin) / 2);

    const geo1Grade = roundToTwoDecimals(
      (sed + dep_fin * 2 + (gis_fin + gis_proj) + struct * 2 + basin_fin * 2 + (geochem_pw + geochem_fin)) / 11
    );
    moduleResults.push({
      moduleId: 'ge_geo1',
      moduleName: 'Geology_1',
      grade: geo1Grade,
      ects: 14,
      gpaWeight: 14,
      passed: geo1Grade >= 10.0,
      subGroupResults: {
        Sedimentology: sed,
        'Depositional Environments': dep_fin,
        'Cartography & GIS': gisAvg,
        'Structural Geology': struct,
        'Basin Stratigraphy': basin_fin,
        Geochemistry: geochemAvg,
      },
    });
  } else if (input.programId === 'pe') {
    // Petroleum Engineering
    // 7.1 Vector Analysis (weight 5)
    const va_nb = getScore('pe_va_nb', 'Vector Analysis Notebook');
    const va_mid = getScore('pe_va_mid', 'Vector Analysis Midterm');
    const va_fin = getScore('pe_va_fin', 'Vector Analysis Final');
    const vaGrade = roundToTwoDecimals((va_nb * 2 + va_mid * 3 + va_fin * 5) / 10);
    moduleResults.push({ moduleId: 'pe_va', moduleName: 'Vector Analysis', grade: vaGrade, ects: 5, gpaWeight: 5, passed: vaGrade >= 10.0 });

    // 7.2 Physics_3 (weight 5)
    // Formula: ((Thermodynamics Midterm + Thermodynamics Final)/2 + Solid mechanics)/2
    const th_mid = getScore('pe_phy3_th_mid', 'Thermo Midterm');
    const th_fin = getScore('pe_phy3_th_fin', 'Thermo Final');
    const sm = getScore('pe_phy3_sm', 'Solid Mechanics');
    const phy3Grade = roundToTwoDecimals(((th_mid + th_fin) / 2 + sm) / 2);
    moduleResults.push({
      moduleId: 'pe_phy3',
      moduleName: 'Physics_3',
      grade: phy3Grade,
      ects: 5,
      gpaWeight: 5,
      passed: phy3Grade >= 10.0,
    });

    // 7.3 French (weight 3)
    const fr_mid = getScore('pe_fr_mid', 'French Midterm');
    const fr_spk = getScore('pe_fr_spk', 'French Speaking');
    const fr_fin = getScore('pe_fr_fin', 'French Final');
    const frGrade = roundToTwoDecimals((fr_mid * 2 + fr_spk * 3 + fr_fin * 3) / 8);
    moduleResults.push({ moduleId: 'pe_fr', moduleName: 'French', grade: frGrade, ects: 3, gpaWeight: 3, passed: frGrade >= 10.0 });

    // 7.4 Petroleum Geology (weight 17)
    // Formula: (Sedimentology + Depositional Environments Final * 2 + (Cartography and GIS Final + Project) / 2 * 2 + Structural Geology * 2 + Basin analysis and stratigraphy Final * 2 + Geology for PS Final * 2 + Reservoir Engineering * 2 + (Geochemistry(Project) + Geochemistry Final) / 2 * 2)/15
    const sed = getScore('pe_sed', 'Sedimentology');
    const dep_fin = getScore('pe_dep_fin', 'Depositional Environments Final');
    const gis_fin = getScore('pe_gis_fin', 'Cartography and GIS Final');
    const gis_proj = getScore('pe_gis_proj', 'Cartography and GIS Project');
    const struct = getScore('pe_struct', 'Structural Geology');
    const basin_fin = getScore('pe_basin_fin', 'Basin Analysis Final');
    const ps_fin = getScore('pe_ps_fin', 'Geology for PS Final');
    const res_eng = getScore('pe_res_eng', 'Reservoir Engineering');
    const geochem_proj = scores['pe_geochem_proj'] !== undefined
      ? getScore('pe_geochem_proj', 'Geochemistry(Project)')
      : getScore('pe_geochem_pw', 'Geochemistry PW');
    const geochem_fin = getScore('pe_geochem_fin', 'Geochemistry Final');

    const petroGeoGrade = roundToTwoDecimals(
      (sed +
        dep_fin * 2 +
        (gis_fin + gis_proj) +
        struct * 2 +
        basin_fin * 2 +
        ps_fin * 2 +
        res_eng * 2 +
        (geochem_proj + geochem_fin)) /
        15
    );
    moduleResults.push({
      moduleId: 'pe_petro_geo',
      moduleName: 'Petroleum Geology',
      grade: petroGeoGrade,
      ects: 17,
      gpaWeight: 17,
      passed: petroGeoGrade >= 10.0,
    });
  } else if (input.programId === 'chem') {
    // Chemistry
    // 8.1 Vector Analysis (weight 5)
    const va_nb = getScore('chem_va_nb', 'Vector Analysis Notebook');
    const va_mid = getScore('chem_va_mid', 'Vector Analysis Midterm');
    const va_fin = getScore('chem_va_fin', 'Vector Analysis Final');
    const vaGrade = roundToTwoDecimals((va_nb * 2 + va_mid * 3 + va_fin * 5) / 10);
    moduleResults.push({ moduleId: 'chem_va', moduleName: 'Vector Analysis', grade: vaGrade, ects: 5, gpaWeight: 5, passed: vaGrade >= 10.0 });

    // 8.2 Chemistry_3 (weight 9)
    // Formula: ((Reactivity Midterm + Reactivity Final * 2)/3 + (Thermo and Kinetics Midterm + Thermo and Kinetics Final)/2 + Chem Evaluated PW)/8
    const react_mid = getScore('chem_chem3_react_mid', 'Reactivity Midterm');
    const react_fin = getScore('chem_chem3_react_fin', 'Reactivity Final');
    const tk_mid = getScore('chem_chem3_tk_mid', 'Thermo Midterm');
    const tk_fin = getScore('chem_chem3_tk_fin', 'Thermo Final');
    const eval_pw = scores['chem_chem3_eval_pw'] !== undefined
      ? getScore('chem_chem3_eval_pw', 'Chem Evaluated PW')
      : getScore('chem_chem3_pw', 'Chem PW');

    const reactGrade = roundToTwoDecimals((react_mid + react_fin * 2) / 3);
    const tkGrade = roundToTwoDecimals((tk_mid + tk_fin) / 2);
    const chem3Grade = roundToTwoDecimals((reactGrade * 3 + tkGrade * 2 + eval_pw * 3) / 8);

    moduleResults.push({
      moduleId: 'chem_chem3',
      moduleName: 'Chemistry_3',
      grade: chem3Grade,
      ects: 9,
      gpaWeight: 9,
      passed: chem3Grade >= 10.0,
      subGroupResults: {
        'Reactivity (3/8)': reactGrade,
        'Thermo & Kinetics (2/8)': tkGrade,
        'Evaluated PW (3/8)': eval_pw,
      },
    });

    // 8.3 French (weight 3)
    const fr_mid = getScore('chem_fr_mid', 'French Midterm');
    const fr_spk = getScore('chem_fr_spk', 'French Speaking');
    const fr_fin = getScore('chem_fr_fin', 'French Final');
    const frGrade = roundToTwoDecimals((fr_mid * 2 + fr_spk * 3 + fr_fin * 3) / 8);
    moduleResults.push({ moduleId: 'chem_fr', moduleName: 'French', grade: frGrade, ects: 3, gpaWeight: 3, passed: frGrade >= 10.0 });

    // 8.4 Physics_3 (weight 5)
    // Formula: (Electricity + ((Thermodynamics Midterm + Thermodynamics Final)/2))/2
    const elec = getScore('chem_phy3_elec', 'Electricity');
    const th_mid = getScore('chem_phy3_th_mid', 'Thermo Midterm');
    const th_fin = getScore('chem_phy3_th_fin', 'Thermo Final');
    const thermoAvg = roundToTwoDecimals((th_mid + th_fin) / 2);
    const phy3Grade = roundToTwoDecimals((elec + thermoAvg) / 2);
    moduleResults.push({ moduleId: 'chem_phy3', moduleName: 'Physics_3', grade: phy3Grade, ects: 5, gpaWeight: 5, passed: phy3Grade >= 10.0 });

    // 8.5 Physical and Molecular Chemistry 1 (weight 8)
    // Formula: ((SISDP PW Exam * 0.5 + SISDP TP noted * 0.3 + SISDP report * 0.2) * 0.4 + Molecular Dynamics/Cheminfo Exam * 0.3 + Molecular Chemistry 1 Exam * 0.3)
    const sci_pw = getScore('chem_pmc1_pw', 'SISDP PW Exam');
    const sci_tp = scores['chem_pmc1_tp'] !== undefined
      ? getScore('chem_pmc1_tp', 'SISDP TP noted')
      : getScore('chem_pmc1_pwnote', 'SISDP TP noted');
    const sci_rep = getScore('chem_pmc1_rep', 'SISDP report');

    const mol_dyn = scores['chem_pmc1_moldyn'] !== undefined
      ? getScore('chem_pmc1_moldyn', 'Molecular Dynamics/Cheminfo Exam')
      : getScore('chem_pmc1_mol_fin', 'Molecular Dynamics Final');
    const mol_chem = scores['chem_pmc1_molchem'] !== undefined
      ? getScore('chem_pmc1_molchem', 'Molecular Chemistry 1 Exam')
      : getScore('chem_pmc1_mol_chem', 'Molecular Chemistry');

    const sisdpSub = roundToTwoDecimals(sci_pw * 0.5 + sci_tp * 0.3 + sci_rep * 0.2);
    const pmc1Grade = roundToTwoDecimals(sisdpSub * 0.4 + mol_dyn * 0.3 + mol_chem * 0.3);
    moduleResults.push({
      moduleId: 'chem_pmc1',
      moduleName: 'Physical and Molecular Chemistry 1',
      grade: pmc1Grade,
      ects: 8,
      gpaWeight: 8,
      passed: pmc1Grade >= 10.0,
      subGroupResults: {
        'SISDP (40%)': sisdpSub,
        'Mol. Dynamics (30%)': mol_dyn,
        'Mol. Chemistry 1 (30%)': mol_chem,
      },
    });
  }

  // Calculate Overall Weighted GPA
  let weightedSum = 0;
  let totalWeights = 0;
  let ectsEarned = 0;
  const totalEcts = program.totalEcts;

  for (const mod of moduleResults) {
    weightedSum += mod.grade * mod.gpaWeight;
    totalWeights += mod.gpaWeight;
    if (mod.grade >= 10.0) {
      ectsEarned += mod.ects;
    }
  }

  const finalGpa = totalWeights > 0 ? roundToTwoDecimals(weightedSum / totalWeights) : 0;
  const honors = getHonors(finalGpa);

  // In French University system, if final GPA >= 10.00, student passes semester (compensation)
  const status: CalculationResult['status'] =
    finalGpa >= 10.0
      ? ectsEarned === totalEcts
        ? 'admitted'
        : 'admitted_with_compensation'
      : 'repeat';

  return {
    programId: program.id,
    academicLevel: program.level,
    semester: program.semester,
    moduleResults,
    finalGpa,
    totalEcts,
    ectsEarned: finalGpa >= 10.0 ? totalEcts : ectsEarned, // under compensation rules, all 30 ECTS are awarded if GPA >= 10
    honors,
    status,
    validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
  };
}
