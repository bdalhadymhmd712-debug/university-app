import { useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { ArrowRight, Calendar } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const GRADES = ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس', 'أولى متوسط', 'ثانية متوسط', 'ثالثة متوسط'];

export default function AttendanceHistory() {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async (grade, selectedDate) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/attendance/history?grade=${grade}&date=${selectedDate}`);
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    fetchHistory(grade, date);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    if (selectedGrade) fetchHistory(selectedGrade, newDate);
  };

  if (!selectedGrade) {
    return (
      <Layout title="📅 سجل الحضور" subtitle="اختر الصف لعرض السجل">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GRADES.map(g => (
            <button key={g} onClick={() => handleGradeSelect(g)} className="glass rounded-2xl p-6 text-center hover:scale-105 transition-all font-bold text-lg">
              {g}
            </button>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`📅 سجل: ${selectedGrade}`} subtitle="اختر التاريخ لعرض الحضور">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <button onClick={() => setSelectedGrade(null)} className="flex items-center gap-2 text-indigo-400">
          <ArrowRight size={18} /> تغيير الصف
        </button>
        
        <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl">
          <Calendar size={18} className="text-indigo-400"/>
          <input type="date" value={date} onChange={handleDateChange} className="bg-transparent focus:outline-none text-sm" />
        </div>
      </div>

      {loading ? (
        <div className="text-center p-10 animate-pulse">جاري تحميل السجل...</div>
      ) : records.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center opacity-70">لا توجد سجلات لهذا اليوم.</div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-4 text-right">اسم الطالب</th>
                <th className="p-4 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r._id} className="border-t border-slate-700">
                  <td className="p-4">{r.student.fullName}</td>
                  <td className="p-4 text-center font-bold">
                    {r.status === 'حاضر' ? <span className="text-green-400">حاضر</span> : <span className="text-red-400">غائب</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}