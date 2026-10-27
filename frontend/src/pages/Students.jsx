import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { User, Plus, X, Send, Trash2, Phone, MapPin, ArrowRight, MoreVertical, Edit } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const GRADES = ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس', 'أولى متوسط', 'ثانية متوسط', 'ثالثة متوسط'];

export default function Students() {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ fullName: '', guardianName: '', address: '', guardianPhone: '' });
  
  // حالات التعديل والقائمة
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editStudentForm, setEditStudentForm] = useState({ fullName: '', guardianName: '', address: '', guardianPhone: '' });

  useEffect(() => {
    if (selectedGrade) {
      axios.get(`${API}/api/students?grade=${selectedGrade}`).then(res => setStudents(res.data)).catch(console.error);
    }
  }, [selectedGrade]);

  const reloadStudents = () => {
    axios.get(`${API}/api/students?grade=${selectedGrade}`).then(res => setStudents(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/api/students`, { ...form, grade: selectedGrade });
    setShowModal(false);
    setForm({ fullName: '', guardianName: '', address: '', guardianPhone: '' });
    reloadStudents();
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      await axios.delete(`${API}/api/students/${id}`);
      reloadStudents();
      setOpenMenuId(null);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student._id);
    setEditStudentForm({
      fullName: student.fullName,
      guardianName: student.guardianName,
      address: student.address,
      guardianPhone: student.guardianPhone
    });
    setOpenMenuId(null);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    await axios.put(`${API}/api/students/${editingStudent}`, editStudentForm);
    setEditingStudent(null);
    reloadStudents();
  };

  if (!selectedGrade) {
    return (
      <Layout title="👨‍🎓 إدارة الطلاب" subtitle="اختر الصف للبدء">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GRADES.map(g => (
            <button key={g} onClick={() => setSelectedGrade(g)} className="glass rounded-2xl p-6 text-center hover:scale-105 transition-all font-bold text-lg">
              {g}
            </button>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`👨‍🎓 طلاب: ${selectedGrade}`} subtitle="إدارة بيانات الطلاب">
      <button onClick={() => setSelectedGrade(null)} className="mb-4 flex items-center gap-2 text-indigo-400 hover:text-indigo-300">
        <ArrowRight size={18} /> تغيير الصف
      </button>

      <button onClick={() => setShowModal(true)} className="w-full mb-6 p-5 rounded-2xl bg-gradient-to-l from-blue-500 to-cyan-600 text-white font-bold flex items-center justify-between">
        <span>إضافة طالب جديد</span> <Plus size={24} />
      </button>

      {students.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center opacity-70">لا يوجد طلاب في هذا الصف حالياً.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {students.map(s => (
            <div key={s._id} className="glass rounded-2xl p-5 relative group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">{s.grade}</span>
                <div className="relative">
                  <button onClick={() => setOpenMenuId(openMenuId === s._id ? null : s._id)} className="p-1 rounded hover:bg-slate-700">
                    <MoreVertical size={18} />
                  </button>
                  {openMenuId === s._id && (
                    <div className="absolute left-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-32 z-10 overflow-hidden">
                      <button onClick={() => handleEdit(s)} className="w-full text-right px-4 py-2 hover:bg-slate-700 flex items-center gap-2"><Edit size={14}/> تعديل</button>
                      <button onClick={() => handleDelete(s._id)} className="w-full text-right px-4 py-2 hover:bg-red-500/20 text-red-400 flex items-center gap-2"><Trash2 size={14}/> حذف</button>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">{s.fullName}</h3>
              <p className="text-sm opacity-70 mb-1"><User size={14} className="inline"/> {s.guardianName}</p>
              <p className="text-sm opacity-70 mb-1"><Phone size={14} className="inline"/> {s.guardianPhone}</p>
              <p className="text-sm opacity-70"><MapPin size={14} className="inline"/> {s.address}</p>
            </div>
          ))}
        </div>
      )}

      {/* نموذج إضافة طالب */}
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

      {/* نموذج تعديل طالب */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <form onSubmit={submitEdit} className="glass p-6 rounded-2xl w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-xl">تعديل بيانات الطالب</h3>
              <button type="button" onClick={()=>setEditingStudent(null)}><X/></button>
            </div>
            <input required placeholder="الاسم الرباعي" className="w-full p-3 mb-3 bg-slate-800 rounded-xl" onChange={e=>setEditStudentForm({...editStudentForm, fullName: e.target.value})} value={editStudentForm.fullName}/>
            <input required placeholder="ولي الأمر" className="w-full p-3 mb-3 bg-slate-800 rounded-xl" onChange={e=>setEditStudentForm({...editStudentForm, guardianName: e.target.value})} value={editStudentForm.guardianName}/>
            <input required placeholder="رقم الهاتف" className="w-full p-3 mb-3 bg-slate-800 rounded-xl" onChange={e=>setEditStudentForm({...editStudentForm, guardianPhone: e.target.value})} value={editStudentForm.guardianPhone}/>
            <input placeholder="السكن" className="w-full p-3 mb-4 bg-slate-800 rounded-xl" onChange={e=>setEditStudentForm({...editStudentForm, address: e.target.value})} value={editStudentForm.address}/>
            <button type="submit" className="w-full py-3 bg-emerald-600 rounded-xl font-bold flex justify-center gap-2"><Send size={18}/> حفظ التعديلات</button>
          </form>
        </div>
      )}
    </Layout>
  );
}