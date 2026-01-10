import React, { useState, useEffect } from 'react';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';
import { userAPI } from '../services/userAPI';
import { ActiveMedicine } from '../../../shared/types';

const defaultNewMedicine: ActiveMedicine = {
  name: '',
  timeToTake: '',
  daysGap: 1,
  startDate: new Date(),
};

const formatTimeDisplays = (hhmm: string): React.ReactNode => {
  if (!hhmm) return '';
  const [hRaw, mRaw] = hhmm.split(':');
  const h = Number(hRaw);
  const m = Number(mRaw);
  if (isNaN(h) || isNaN(m)) return '';

  const pad = (n: number) => n.toString().padStart(2, '0');
  const hh24 = `${pad(h)}:${pad(m)}`;
  const hour12 = (h % 12) || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  const hh12 = `${pad(hour12)}:${pad(m)} ${ampm}`;

  return (
    <>
      <span>{hh12}</span>
      <span className="text-gray-500"> · {hh24}</span>
    </>
  );
};

const ActiveMedicinePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [medicines, setMedicines] = useState<ActiveMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editList, setEditList] = useState<ActiveMedicine[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveMedicine = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await userAPI.getActiveMedicine();
        setMedicines(res.data?.active_medicine || []);
      } catch (err) {
        setError('Failed to load medicines.');
      }
      setLoading(false);
    };
    fetchActiveMedicine();
  }, []);

  const medicinesForToday = (): ActiveMedicine[] => {
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const today = new Date();
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    const due = medicines.filter((m) => {
      if (!m.startDate) return false;
      const start = new Date(m.startDate);
      const startMid = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
      const gap = (m.daysGap && m.daysGap > 0) ? m.daysGap : 1;
      if (todayMid < startMid) return false;
      const diffDays = Math.floor((todayMid - startMid) / MS_PER_DAY);
      return diffDays % gap === 0;
    });

    due.sort((a, b) => {
      const parse = (t?: string) => {
        if (!t) return 24 * 60 + 1;
        const [hh, mm] = t.split(':').map(Number);
        if (isNaN(hh) || isNaN(mm)) return 24 * 60 + 1;
        return hh * 60 + mm;
      };
      return parse(a.timeToTake) - parse(b.timeToTake);
    });

    return due;
  };

  const handleEdit = () => {
    setEditList(medicines.length > 0 ? medicines : [defaultNewMedicine]);
    setEditing(true);
    setError(null);
  };

  const handleAddRow = () => {
    setEditList([...editList, { ...defaultNewMedicine, startDate: new Date() }]);
  };

  const handleRemoveRow = (index: number) => {
    setEditList(editList.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof ActiveMedicine, value: any) => {
    setEditList(
      editList.map((m, i) =>
        i === index ? { ...m, [field]: field === 'daysGap' ? Number(value) : value } : m
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await userAPI.updateActiveMedicine(editList);
      setMedicines(editList);
      setEditing(false);
    } catch (err) {
      setError('Failed to save medicines.');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 flex">
      <UserSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <UserNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-10 space-y-10 max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
                  Active Medicines
                </h1>
                <p className="text-gray-500 mt-1">Your ongoing prescribed medications</p>
              </div>
              <button
                onClick={handleEdit}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-gray-700 transition-all duration-200"
              >
                Edit
              </button>
            </div>

            {/* Medicines for Today */}
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-md rounded-2xl p-6 transition-all hover:shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Today's Medicines</h2>
              {loading ? (
                <div className="text-gray-500">Checking today's medicines...</div>
              ) : (
                (() => {
                  const todays = medicinesForToday();
                  if (todays.length === 0) {
                    return <div className="text-gray-500 italic">No medicines scheduled for today.</div>;
                  }
                  return (
                    <ul className="divide-y divide-gray-100">
                      {todays.map((m, i) => (
                        <li key={i} className="flex items-center justify-between py-4">
                          <div>
                            <div className="font-medium text-gray-900 text-lg">{m.name || 'Untitled'}</div>
                            <div className="text-sm text-gray-500">
                              {m.daysGap && m.daysGap > 1 ? `${m.daysGap}-day gap` : 'Daily'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-gray-800 font-semibold">{formatTimeDisplays(m.timeToTake)}</div>
                            <div className="text-xs text-gray-400">Start: {new Date(m.startDate).toLocaleDateString()}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  );
                })()
              )}
            </div>

            {/* Medicine Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all">
              {loading ? (
                <div className="text-center text-gray-500 py-10">Loading...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-10">{error}</div>
              ) : medicines.length === 0 ? (
                <div className="text-center text-gray-500 py-10">No active medicines found.</div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide text-xs">
                    <tr>
                      <th className="py-3 px-5 text-left font-semibold">Name</th>
                      <th className="py-3 px-5 font-semibold">Time</th>
                      <th className="py-3 px-5 font-semibold">Gap (days)</th>
                      <th className="py-3 px-5 font-semibold">Start Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {medicines.map((med, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50/70 transition-all duration-200"
                      >
                        <td className="py-3 px-5 text-gray-900 font-medium ">{med.name}</td>
                        <td className="py-3 px-5 text-center">{formatTimeDisplays(med.timeToTake)}</td>
                        <td className="py-3 px-5 text-gray-700 text-center">{med.daysGap}</td>
                        <td className="py-3 px-5 text-gray-600 text-center">
                          {new Date(med.startDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Edit Modal */}
            {editing && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/50 backdrop-blur-sm transition">
                <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative border border-gray-200">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">Edit Active Medicines</h2>
                  {error && <div className="text-red-600 mb-2">{error}</div>}

                  <div className="overflow-x-auto rounded-lg border border-gray-200 mb-4">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr>
                          <th className="py-2 px-3">Name</th>
                          <th className="py-2 px-3">Time</th>
                          <th className="py-2 px-3">Gap</th>
                          <th className="py-2 px-3">Start Date</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {editList.map((med, i) => (
                          <tr key={i} className="border-t border-gray-100">
                            <td className="py-2 px-3">
                              <input
                                className="border border-gray-300 rounded-md px-2 py-1 w-full focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition"
                                value={med.name}
                                placeholder="Medicine name"
                                onChange={e => handleChange(i, 'name', e.target.value)}
                              />
                            </td>
                            <td className="py-2 px-3">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="time"
                                  className="border border-gray-300 rounded-md px-2 py-1 w-28 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition"
                                  value={med.timeToTake}
                                  onChange={e => handleChange(i, 'timeToTake', e.target.value)}
                                />
                                <span className="text-xs text-gray-500">{formatTimeDisplays(med.timeToTake)}</span>
                              </div>
                            </td>
                            <td className="py-2 px-3 w-24">
                              <input
                                type="number"
                                min={1}
                                className="border border-gray-300 rounded-md px-2 py-1 w-full focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition"
                                value={med.daysGap}
                                onChange={e => handleChange(i, 'daysGap', e.target.value)}
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="date"
                                className="border border-gray-300 rounded-md px-2 py-1 w-full focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition"
                                value={med.startDate ? new Date(med.startDate).toISOString().substring(0, 10) : ''}
                                onChange={e => handleChange(i, 'startDate', e.target.value ? new Date(e.target.value) : new Date())}
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <button
                                className="text-gray-500 hover:text-red-500 font-bold text-lg transition"
                                onClick={() => handleRemoveRow(i)}
                                disabled={editList.length === 1}
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleAddRow}
                      className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
                    >
                      + Add Medicine
                    </button>
                    <div className="space-x-2">
                      <button
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50"
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                  {saving && <div className="text-gray-400 mt-3 text-sm">Saving changes...</div>}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActiveMedicinePage;
