import assert from 'assert';
import { calculateProgramGrades, roundToTwoDecimals } from '../services/calculationEngine.ts';
import { calculateCohortRanking, simulateProjectedRank } from '../services/rankingEngine.ts';

console.log('=== Running UFAZ Academic Formula & Ranking Test Suite ===\n');

// 1. Test CS Vector Analysis Formula
console.log('Test 1: CS Vector Analysis Formula');
const csVaTest = calculateProgramGrades({
  programId: 'cs',
  scores: {
    cs_va_nb: 20, // 20 * 2 = 40
    cs_va_mid: 20, // 20 * 3 = 60
    cs_va_fin: 20, // 20 * 5 = 100 -> sum 200 / 10 = 20.00
    cs_phy3_elec: 20,
    cs_phy3_em_mid: 20,
    cs_phy3_em_fin: 20,
    cs_fr_mid: 20,
    cs_fr_spk: 20,
    cs_fr_fin: 20,
    cs_se_pw: 20,
    cs_se_fin: 20,
    cs_sp_pw: 20,
    cs_sp_fin: 20,
    cs_sys_pw: 20,
    cs_sys_fin: 20,
    cs_net_mid: 20,
    cs_net_fin: 20,
    cs_be_part: 20,
    cs_be_pw: 20,
    cs_be_fin: 20,
  },
});
assert.strictEqual(csVaTest.moduleResults[0].grade, 20.0);
assert.strictEqual(csVaTest.finalGpa, 20.0);
console.log('  PASSED: Perfect 20/20 yields GPA 20.00 and Vector Analysis 20.00');

// Decimal and custom values for CS
const csCustom = calculateProgramGrades({
  programId: 'cs',
  scores: {
    cs_va_nb: 17,
    cs_va_mid: 16.5,
    cs_va_fin: 18, // (17*2 + 16.5*3 + 18*5) / 10 = (34 + 49.5 + 90) / 10 = 173.5 / 10 = 17.35
  },
});
assert.strictEqual(csCustom.moduleResults[0].grade, 17.35);
console.log('  PASSED: Decimal Vector Analysis: (17*2 + 16.5*3 + 18*5)/10 = 17.35');

// 2. Test Physics_3 Formula: (Electricity * 2 + ((EM Midterm + EM Final) * 3 / 2)) / 5
console.log('\nTest 2: CS Physics_3 Formula');
const phyCustom = calculateProgramGrades({
  programId: 'cs',
  scores: {
    cs_phy3_elec: 14,
    cs_phy3_em_mid: 16,
    cs_phy3_em_fin: 18, // (14*2 + (16+18)*1.5) / 5 = (28 + 51) / 5 = 79 / 5 = 15.80
  },
});
const phyMod = phyCustom.moduleResults.find((m) => m.moduleId === 'cs_phy3');
assert.strictEqual(phyMod?.grade, 15.8);
console.log('  PASSED: Physics_3 calculated: (14*2 + ((16+18)*3/2))/5 = 15.80');

// 3. Test French Formula: (French Midterm * 2 + French Speaking * 3 + French Final * 3) / 8
console.log('\nTest 3: French Formula');
const frCustom = calculateProgramGrades({
  programId: 'cs',
  scores: {
    cs_fr_mid: 14,
    cs_fr_spk: 16,
    cs_fr_fin: 18, // (14*2 + 16*3 + 18*3) / 8 = (28 + 48 + 54) / 8 = 130 / 8 = 16.25
  },
});
const frMod = frCustom.moduleResults.find((m) => m.moduleId === 'cs_fr');
assert.strictEqual(frMod?.grade, 16.25);
console.log('  PASSED: French calculated: (14*2 + 16*3 + 18*3)/8 = 16.25');

// 4. Test CS Module (5 sub-modules)
console.log('\nTest 4: Computer Science Module (5 grouped sub-modules)');
const csModTest = calculateProgramGrades({
  programId: 'cs',
  scores: {
    cs_se_pw: 16,
    cs_se_fin: 18, // SE = 17.00
    cs_sp_pw: 15,
    cs_sp_fin: 20, // SP = (15*2 + 20*3) / 5 = (30 + 60)/5 = 18.00
    cs_sys_pw: 14,
    cs_sys_fin: 16, // Sys = 15.00
    cs_net_mid: 15,
    cs_net_fin: 17, // Net = 16.00
    cs_be_part: 20,
    cs_be_pw: 18,
    cs_be_fin: 18, // BE = (20 + 72 + 90) / 10 = 18.20
  },
});
// Total CS = (17 + 18 + 15 + 16 + 18.2) / 5 = 84.2 / 5 = 16.84
const csMod = csModTest.moduleResults.find((m) => m.moduleId === 'cs_cs_mod');
assert.strictEqual(csMod?.grade, 16.84);
assert.strictEqual(csMod?.subGroupResults?.['Software Engineering'], 17.0);
assert.strictEqual(csMod?.subGroupResults?.['Signal Processing'], 18.0);
assert.strictEqual(csMod?.subGroupResults?.['Systems Programming'], 15.0);
assert.strictEqual(csMod?.subGroupResults?.['IP Networks'], 16.0);
assert.strictEqual(csMod?.subGroupResults?.['Back-End Development'], 18.2);
console.log('  PASSED: CS module and all 5 sub-groups calculated accurately: 16.84');

// 5. Test Chemical Engineering Formulas
console.log('\nTest 5: Chemical Engineering Formulas');
const cheTest = calculateProgramGrades({
  programId: 'che',
  scores: {
    che_va_nb: 20,
    che_va_mid: 20,
    che_va_fin: 20,
    che_chem3_react_mid: 15,
    che_chem3_react_fin: 18, // Reactivity = (15 + 18*2)/3 = 51/3 = 17.00
    che_chem3_tk_mid: 16,
    che_chem3_tk_fin: 18, // Thermo = (16+18)/2 = 17.00
    che_chem3_eval_pw: 17, // Evaluated PW = 17.00 -> Chemistry_3 = (17*3 + 17*2 + 17*3)/8 = 17.00
    che_ce3_dist_fin: 16,
    che_ce3_solids_written: 14,
    che_ce3_solids_rep: 16,
    che_ce3_solids_pw_exam: 16, // solids = (14 + 16*0.5 + 16*0.5)/2 = 30/2 = 15.00
    che_ce3_lle: 18, // ce3 = (16 + 15*2 + 18)/4 = 64/4 = 16.00
    che_phy3_elec: 16,
    che_phy3_th_mid: 14,
    che_phy3_th_fin: 18, // thermoAvg = (14+18)/2 = 16. phy3 = (16+16)/2 = 16.00
    che_fr_mid: 20,
    che_fr_spk: 20,
    che_fr_fin: 20, // French = 20.00
  },
});
const ce3Mod = cheTest.moduleResults.find((m) => m.moduleId === 'che_ce3');
const chem3Mod = cheTest.moduleResults.find((m) => m.moduleId === 'che_chem3');
const chePhyMod = cheTest.moduleResults.find((m) => m.moduleId === 'che_phy3');
assert.strictEqual(ce3Mod?.grade, 16.0);
assert.strictEqual(ce3Mod?.gpaWeight, 8);
assert.strictEqual(chem3Mod?.grade, 17.0);
assert.strictEqual(chem3Mod?.gpaWeight, 9);
assert.strictEqual(chePhyMod?.grade, 16.0);
assert.strictEqual(chePhyMod?.gpaWeight, 5);
// GPA = (20*5 + 17*9 + 16*8 + 16*5 + 20*3) / 30 = (100 + 153 + 128 + 80 + 60) / 30 = 521 / 30 = 17.37
assert.strictEqual(cheTest.finalGpa, 17.37);
console.log('  PASSED: Chemical Engineering: Chem3=17.00 (w:9), CE3=16.00 (w:8), Phy3=16.00 (w:5), GPA=17.37');

// 6. Test Geophysical Engineering Formulas
console.log('\nTest 6: Geophysical Engineering Formulas');
const geTest = calculateProgramGrades({
  programId: 'ge',
  scores: {
    ge_va_nb: 20,
    ge_va_mid: 20,
    ge_va_fin: 20, // VA = 20.00 (w: 5)
    ge_phy3_em_mid: 14,
    ge_phy3_em_fin: 18, // EM = (14+18)*1.5 = 48
    ge_phy3_th_mid: 14,
    ge_phy3_th_fin: 16, // Thermo = (14+16) = 30
    ge_phy3_sm: 16, // SM = 16*2 = 32 -> sum = 110 / 7 = 15.71 (w: 8)
    ge_fr_mid: 20,
    ge_fr_spk: 20,
    ge_fr_fin: 20, // French = 20.00 (w: 3)
    ge_sed: 11, // 11
    ge_dep_fin: 11, // 22
    ge_gis_fin: 11, // 11
    ge_gis_proj: 11, // 11
    ge_struct: 11, // 22
    ge_basin_fin: 11, // 22
    ge_geochem_pw: 11, // 11
    ge_geochem_fin: 11, // 11 -> sum = 121 / 11 = 11.00 (w: 14)
  },
});
const geo1Mod = geTest.moduleResults.find((m) => m.moduleId === 'ge_geo1');
const gePhyMod = geTest.moduleResults.find((m) => m.moduleId === 'ge_phy3');
assert.strictEqual(geo1Mod?.grade, 11.0);
assert.strictEqual(geo1Mod?.gpaWeight, 14);
assert.strictEqual(gePhyMod?.grade, 15.71);
assert.strictEqual(gePhyMod?.gpaWeight, 8);
// GPA = (20*5 + 15.71*8 + 20*3 + 11*14) / 30 = (100 + 125.68 + 60 + 154) / 30 = 439.68 / 30 = 14.66
assert.strictEqual(geTest.finalGpa, 14.66);
console.log('  PASSED: Geophysical Engineering: Geo1=11.00 (w:14), Phy3=15.71 (w:8), GPA=14.66');

// 7. Test Petroleum Engineering Formulas
console.log('\nTest 7: Petroleum Engineering Formulas');
const peTest = calculateProgramGrades({
  programId: 'pe',
  scores: {
    pe_va_nb: 20,
    pe_va_mid: 20,
    pe_va_fin: 20, // VA = 20.00 (w: 5)
    pe_phy3_th_mid: 16,
    pe_phy3_th_fin: 18,
    pe_phy3_sm: 15, // Phy3 = ((16+18)/2 + 15)/2 = (17+15)/2 = 16.00 (w: 5)
    pe_fr_mid: 20,
    pe_fr_spk: 20,
    pe_fr_fin: 20, // French = 20.00 (w: 3)
    pe_sed: 15,
    pe_dep_fin: 15,
    pe_gis_fin: 15,
    pe_gis_proj: 15,
    pe_struct: 15,
    pe_basin_fin: 15,
    pe_ps_fin: 15,
    pe_res_eng: 15,
    pe_geochem_proj: 15,
    pe_geochem_fin: 15, // Petro Geology = 15.00 (w: 17)
  },
});
const petroMod = peTest.moduleResults.find((m) => m.moduleId === 'pe_petro_geo');
const pePhyMod = peTest.moduleResults.find((m) => m.moduleId === 'pe_phy3');
assert.strictEqual(petroMod?.grade, 15.0);
assert.strictEqual(petroMod?.gpaWeight, 17);
assert.strictEqual(pePhyMod?.grade, 16.0);
assert.strictEqual(pePhyMod?.gpaWeight, 5);
// GPA = (20*5 + 16*5 + 20*3 + 15*17) / 30 = (100 + 80 + 60 + 255) / 30 = 495 / 30 = 16.50
assert.strictEqual(peTest.finalGpa, 16.5);
console.log('  PASSED: Petroleum Engineering: PetroGeo=15.00 (w:17), Phy3=16.00 (w:5), GPA=16.50');

// 8. Test Chemistry Formulas
console.log('\nTest 8: Chemistry Formulas');
const chemTest = calculateProgramGrades({
  programId: 'chem',
  scores: {
    chem_va_nb: 20,
    chem_va_mid: 20,
    chem_va_fin: 20, // VA = 20.00 (w: 5)
    chem_chem3_react_mid: 16,
    chem_chem3_react_fin: 16, // Reactivity = 16
    chem_chem3_tk_mid: 16,
    chem_chem3_tk_fin: 16, // Thermo = 16
    chem_chem3_eval_pw: 16, // Chem3 = 16.00 (w: 9)
    chem_fr_mid: 20,
    chem_fr_spk: 20,
    chem_fr_fin: 20, // French = 20.00 (w: 3)
    chem_phy3_elec: 14,
    chem_phy3_th_mid: 16,
    chem_phy3_th_fin: 18, // Phy3 = (14 + (16+18)/2)/2 = (14+17)/2 = 15.50 (w: 5)
    chem_pmc1_pw: 16,
    chem_pmc1_tp: 14,
    chem_pmc1_rep: 18, // SISDP = 16*0.5 + 14*0.3 + 18*0.2 = 8 + 4.2 + 3.6 = 15.80
    chem_pmc1_moldyn: 17,
    chem_pmc1_molchem: 15, // PMC1 = 15.80 * 0.4 + 17 * 0.3 + 15 * 0.3 = 6.32 + 5.1 + 4.5 = 15.92 (w: 8)
  },
});
const chemChem3Mod = chemTest.moduleResults.find((m) => m.moduleId === 'chem_chem3');
const chemPhyMod = chemTest.moduleResults.find((m) => m.moduleId === 'chem_phy3');
const pmc1Mod = chemTest.moduleResults.find((m) => m.moduleId === 'chem_pmc1');
assert.strictEqual(chemChem3Mod?.grade, 16.0);
assert.strictEqual(chemChem3Mod?.gpaWeight, 9);
assert.strictEqual(chemPhyMod?.grade, 15.5);
assert.strictEqual(chemPhyMod?.gpaWeight, 5);
assert.strictEqual(pmc1Mod?.grade, 15.92);
assert.strictEqual(pmc1Mod?.gpaWeight, 8);
// GPA = (20*5 + 16*9 + 20*3 + 15.5*5 + 15.92*8) / 30 = (100 + 144 + 60 + 77.5 + 127.36) / 30 = 508.86 / 30 = 16.96
assert.strictEqual(chemTest.finalGpa, 16.96);
console.log('  PASSED: Chemistry: Chem3=16.00 (w:9), Phy3=15.50 (w:5), PMC1=15.92 (w:8), GPA=16.96');

// 9. Test Ranking Tie Handling & Competition Algorithm
console.log('\nTest 9: Ranking Competition & Tie-Handling');
const dummyCohort = [
  { id: '1', studentId: '220101', fullName: 'Student 1', gpa: 18.0, programId: 'cs', academicLevel: 'L2', cohortId: 'cs' },
  { id: '2', studentId: '220102', fullName: 'Student 2', gpa: 17.5, programId: 'cs', academicLevel: 'L2', cohortId: 'cs' },
  { id: '3', studentId: '220103', fullName: 'Student 3', gpa: 17.5, programId: 'cs', academicLevel: 'L2', cohortId: 'cs' }, // tie
  { id: '4', studentId: '220104', fullName: 'Student 4', gpa: 16.0, programId: 'cs', academicLevel: 'L2', cohortId: 'cs' },
];
const { entries } = calculateCohortRanking(dummyCohort, '4');
assert.strictEqual(entries[0].rank, 1);
assert.strictEqual(entries[1].rank, 2);
assert.strictEqual(entries[2].rank, 2); // tie at rank 2
assert.strictEqual(entries[3].rank, 4); // competition skip to rank 4
console.log('  PASSED: Tie handling correctly implements 1224 competition rank');

// 10. Test Ranking Simulation
console.log('\nTest 10: Ranking Simulation (What-If)');
const sim = simulateProjectedRank(entries, 4, 17.8);
assert.strictEqual(sim.estimatedRank, 2); // 17.8 is greater than Student 2 & 3 (17.5)
assert.strictEqual(sim.rankDelta, 2); // jumped from 4 to 2 (+2 positions)
console.log('  PASSED: Projected GPA 17.80 simulates estimated rank #2 (+2 jump)');

// 11. Boundary and Error Validation
console.log('\nTest 11: Validation and Boundary Constraints');
const boundaryTest = calculateProgramGrades({
  programId: 'cs',
  scores: {
    cs_va_nb: 25, // Invalid! > 20
    cs_va_mid: -5, // Invalid! < 0
  },
});
assert.ok(boundaryTest.validationErrors && boundaryTest.validationErrors.length >= 2);
console.log('  PASSED: Boundary checking flags invalid scores > 20 and < 0 with descriptive errors');

console.log('\nALL 11 AUTOMATED ACADEMIC TEST SUITES PASSED WITH 100% ACCURACY!\n');
