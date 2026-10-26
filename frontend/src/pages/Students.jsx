import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { User, Plus, X, Send, Trash2, Phone, MapPin, ArrowRight } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const GRADES = ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس', 'أولى متوسط', 'ثانية متوسط', 'ثالثة متوسط'];

export default function Students() {
  const [selectedGrade, setSelectedGrade] = useState(null); // لحفظ الصف المختار
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ fullName: '', guardianName: '', address: '', guardianPhone: '', grade: '' });

  // تحميل الطلاب حسب الصف المختار
  useEffect(() => {
    if (selectedGrade) {
      axios.get(`${API}/api/students?grade=${selectedGrade}`)
        .then(res => setStudents(res.data))
        .catch(console.error);
    }
  }, [selectedGrade]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // التأكد من إرسال الصف المختار مع البيانات
    await axios.post(`${API}/api/students`, { ...form, grade: selectedGrade });
    setShowModal(false);
    setForm({ fullName: '', guardianName: '', address: '', guardianPhone: '', grade: '' });
    // إعادة تحميل القائمة
    axios.get(`${API}/api/students?grade=${selectedGrade}`).then(res => setStudents(res.data));
  };

  const handleDelete = async (id) => {
    if(window.confirm('حذف الطالب؟')) {
      await axios.delete(`${API}/api/students/${id}`);
      axios.get(`${API}/api/students?grade=${selectedGrade}`).then(res => setStudents(res.data));
    }
  };

  // 1️⃣ شاشة اختيار الصف (تظهر أولاً)
  if (!selectedGrade) {
    return (
      <Layout title="👨‍🎓 إدارة الطلاب" subtitle="اختر الصف للبدء">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GRADES.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className="glass rounded-2xl p-6 text-center hover:scale-105 transition-all font-bold text-lg"
            >
              {g}
            </button>
          ))}
        </div>
      </Layout>
    );
  }

  // 2️⃣ شاشة عرض طلاب الصف المختار
  return (
    <Layout title={`👨‍🎓 طلاب: ${selectedGrade}`} subtitle="إدارة بيانات الطلاب">
      
      {/* زر الرجوع لتغيير الصف */}
      <button onClick={() => setSelectedGrade(null)} className="mb-4 flex items-center gap-2 text-indigo-400 hover:text-indigo-300">
        <ArrowRight size={18} /> تغيير الصف
      </button>

      {/* زر إضافة طالب جديد */}
      <button onClick={() => setShowModal(true)} className="w-full mb-6 p-5 rounded-2xl bg-gradient-to-l from-blue-500 to-cyan-600 text-white font-bold flex items-center justify-between">
        <span>إضافة طالب جديد</span> <Plus size={24} />
      </button>

      {students.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center opacity-70">لا يوجد طلاب في هذا الصف حالياً.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {students.map(s => (
            <div key={s._id} className="glass rounded-2xl p-5 relative group">
              <button onClick={() => handleDelete(s._id)} className="absolute top-3 left-3 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">{s.grade}</span>
              <h3 className="text-lg font-bold mb-2 mt-2">{s.fullName}</h3>
              <p className="text-sm opacity-70 mb-1"><User size={14} className="inline"/> {s.guardianName}</p>
              <p className="text-sm opacity-70 mb-1"><Phone size={14} className="inline"/> {s.guardianPhone}</p>
              <p className="text-sm opacity-70"><MapPin size={14} className="inline"/> {s.address}</p>
            </div>
          ))}
        </div>
      )}

      {/* نموذج الإضافة */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-xl">إضافة طالب إلى: {selectedGrade}</h3>
              <button type="button" onClick={()=>setShowModal(false)}><X/></button>
            </div>
            
            <input required placeholder="الاسم الرباعي" className="w-full p-3 mb-3 bg-slate-800 rounded-xl" onChange={e=>setForm({...form, fullName: e.target.value})} value={form.fullName}/>
            <input required placeholder="ولي الأمر" className="w-full p-3 mb-3 bg-slate-800 rounded-xl" onChange={e=>setForm({...form, guardianName: e.target.value})} value={form.guardianName}/>
            <input required placeholder="رقم الهاتف" className="w-full p-3 mb-3 bg-slate-800 rounded-xl" onChange={e=>setForm({...form, guardianPhone: e.target.value})} value={form.guardianPhone}/>
            <input placeholder="السكن" className="w-full p-3 mb-4 bg-slate-800 rounded-xl" onChange={e=>setForm({...form, address: e.target.value})} value={form.address}/>
            
            <button type="submit" className="w-full py-3 bg-blue-600 rounded-xl font-bold flex justify-center gap-2"><Send size={18}/> إضافة الطالب</button>
          </form>
        </div>
      )}
    </Layout>
  );
}