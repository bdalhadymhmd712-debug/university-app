import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/schedule/my`)
      .then(res => setSchedule(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="📅 الجدول الدراسي" subtitle="جدول محاضراتك الأسبوعي">
      {loading ? (
        <div className="text-center text-xl p-10 animate-pulse">جاري التحميل...</div>
      ) : schedule.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-xl mb-2">📭 لا يوجد جدول دراسي بعد</p>
          <p className="opacity-60">تواصل مع الإدارة لإضافة جدولك</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schedule.map((item) => (
            <div key={item._id} className="glass rounded-2xl p-5 hover:scale-[1.02] transition animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Calendar size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold">{item.course?.name}</h3>
                  <p className="text-xs opacity-60">{item.course?.code}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 opacity-80">
                  <Clock size={16} className="text-indigo-400" />
                  <span>{item.day} — {item.time}</span>
                </div>
                <div className="flex items-center gap-2 opacity-80">
                  <MapPin size={16} className="text-indigo-400" />
                  <span>{item.hall}</span>
                </div>
                <div className="flex items-center gap-2 opacity-80">
                  <User size={16} className="text-indigo-400" />
                  <span>{item.course?.doctor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}