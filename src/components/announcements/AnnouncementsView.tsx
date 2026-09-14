import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import { AnnouncementItem } from '../../types.ts';
import { Bell, Pin, Calendar, Tag, Info } from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await api.getAnnouncements();
        if (isMounted) setAnnouncements(res.announcements);
      } catch (err) {
        console.error('Failed to load announcements', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAnnouncements();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            University Notices
          </span>
          <span className="text-xs text-slate-500">• Official Communications</span>
        </div>
        <h1 className="text-xl font-bold font-academic-title text-slate-900 mt-1">
          Academic Announcements & Deliberation Calendar
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Important updates regarding examination schedules, deliberation dates, and transcript delivery.
        </p>
      </div>

      {/* Announcement List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-8 text-center text-xs text-slate-500 rounded-lg border border-slate-200">
            Loading announcements...
          </div>
        ) : (
          announcements.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-lg border shadow-xs transition-all ${
                item.isPinned
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {item.isPinned && (
                      <span className="flex items-center space-x-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        <Pin className="w-3 h-3" />
                        <span>Pinned Notice</span>
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 pt-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
