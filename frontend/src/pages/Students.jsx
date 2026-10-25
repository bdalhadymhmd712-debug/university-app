import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { User, Plus, X, Send, Trash2, Phone, MapPin } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ fullName: '', guardianName: '', address: '', guardianPhone: '' });

  useEffect(() => { loadStudents(); }, []);
  
  const loadStudents = () => axios.get(`${API}/api/students`).then(res => setStudents(res.data)).catch(console.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/api/students`, form);
    setShowModal(false);
    setForm({ fullName: '', guardianName: '', address: '', guardianPhone: '' });
    loadStudents();
  };

  const handleDelete = async (id) => {
    if(window.confirm('حذف الطالب؟')) {
      await axios.delete(`${API}/api/students/${id}`);
      loadStudents();
    }
  };

  return (
    <Layout title="👨‍🎓 إدارة الطلاب" subtitle="بيانات طلاب المدرسة">
      <button onClick={() => setShowModal(true)} className="w-full mb-6 p-5 rounded-2xl bg-gradient-to-l from-blue-500 to-cyan-600 text-white font-bold flex items-center justify-between">
        <span>إضافة طالب جديد</span> <Plus size={24} />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {students.map(s => (
          <div key={s._id} className="glass rounded-2xl p-5 relative group">
            <button onClick={() => handleDelete(s._id)} className="absolute top-3 left-3 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
            <h3 className="text-lg font-bold mb-2">{s.fullName}</h3>
            <p className="text-sm opacity-70 mb-1"><User size={14} className="inline"/> ولي الأمر: {s.guardianName}</p>
            <p className="text-sm opacity-70 mb-1"><Phone size={14} className="inline"/> {s.guardianPhone}</p>
            <p className="text-sm opacity-70"><MapPin size={14} className="inline"/> {s.address}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl w-full max-w-md">
            <div className="flex justify-between mb-4"><h3 className="font-bold text-xl">إضافة طالب</h3><button type="button" onClick={()=>setShowModal(false)}><X/></button></div>
            <input required placeholder="الاسم الرباعي" className="w-full p-3 mb-3 bg-slate-800 rounded-xl" onChange={e=>setForm({...form, fullName: e.target.value})} value={form.fullName}/>
            <input required placeholder="ولي الأمر" className="w-full p-3 mb-3 bg-slate-800 rounded-xl" onChange={e=>setForm({...form, guardianName: e.target.value})} value={form.guardianName}/>
            <input required placeholder="رقم الهاتف" className="w-full p-3 mb-3 bg-slate-800 rounded-xl" onChange={e=>setForm({...form, guardianPhone: e.target.value})} value={form.guardianPhone}/>
            <input placeholder="السكن" className="w-full p-3 mb-4 bg-slate-800 rounded-xl" onChange={e=>setForm({...form, address: e.target.value})} value={form.address}/>
            <button type="submit" className="w-full py-3 bg-blue-600 rounded-xl font-bold flex justify-center gap-2"><Send size={18}/> إضافة</button>
          </form>
        </div>
      )}
    </Layout>
  );
}