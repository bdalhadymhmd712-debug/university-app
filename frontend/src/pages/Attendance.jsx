import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // جلب الطلاب
    axios.get(`${API}/api/students`).then(res => setStudents(res.data));
    // جلب غياب اليوم
    axios.get(`${API}/api/attendance/today`).then(res => setRecords(res.data));
  }, []);

  const getStatus = (studentId) => {
    const record = records.find(r => r.student?._id === studentId);
    return record ? record.status : null;
  };

  const markAttendance = async (studentId, status) => {
    await axios.post(`${API}/api/attendance`, { studentId, status });
    // تحديث الحالة محلياً
    const existing = records.find(r => r.student?._id === studentId);
    if (existing) {
      setRecords(records.map(r => r.student?._id === studentId ? { ...r, status } : r));
    } else {
      setRecords([...records, { student: { _id: studentId }, status }]);
    }
  };

  return (
    <Layout title="✅ الغياب" subtitle="تسجيل حضور وغياب الطلاب لليوم">
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="p-4 text-right">اسم الطالب</th>
              <th className="p-4 text-center">الحالة</th>
              <th className="p-4 text-center">الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => {
              const status = getStatus(s._id);
              return (
                <tr key={s._id} className="border-t border-slate-700">
                  <td className="p-4">{s.fullName}</td>
                  <td className="p-4 text-center font-bold">
                    {status === 'حاضر' ? <span className="text-green-400">حاضر</span> : status === 'غائب' ? <span className="text-red-400">غائب</span> : '—'}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => markAttendance(s._id, 'حاضر')} className="mx-1 p-2 text-green-400 hover:bg-green-500/20 rounded-lg"><CheckCircle /></button>
                    <button onClick={() => markAttendance(s._id, 'غائب')} className="mx-1 p-2 text-red-400 hover:bg-red-500/20 rounded-lg"><XCircle /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}