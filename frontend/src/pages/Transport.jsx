import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import { ArrowRight, User, Phone, MapPin, Plus, X, Send, CheckCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AREAS_SCHOOL = ['شقر مربع 7', 'شقر مربع 12', 'شقر الإيطالي', 'سلالاب مربع 1', 'سلالاب 3 أ', 'الإسكان', 'القرية', 'الثور/ديم النور'];
const AREAS_KG = ['الإسكان', 'سلالاب'];
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function Transport() {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [type, setType] = useState(null);
  const [area, setArea] = useState(null);
  const [transport, setTransport] = useState(null);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ studentName: '', address: '', guardianPhone: '' });
  const [editingDriver, setEditingDriver] = useState(false);
  const [driverForm, setDriverForm] = useState({});
  
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editStudentForm, setEditStudentForm] = useState({ studentName: '', address: '', guardianPhone: '' });

  // استقبال البيانات من البحث (الحي + نوع الترحيل + معرف الطالب)
  const [highlightedStudentId, setHighlightedStudentId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.directArea) {
      setType(location.state.directType === 'مدرسة' ? 'school' : 'kindergarten');
      setArea(location.state.directArea);
      setStep(3);
      
      if (location.state.studentId) {
        setHighlightedStudentId(location.state.studentId);
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (step === 3 && area) {
      const typeStr = type === 'school' ? 'مدرسة' : 'روضة';
      axios.get(`${API}/api/transport/details?type=${typeStr}&area=${area}`).then(res => {
        setTransport(res.data);
        setDriverForm(res.data);
        axios.get(`${API}/api/transport/students?transportId=${res.data._id}`).then(r => setStudents(r.data));
      });
    }
  }, [step, area, type]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/api/transport/students`, { ...form, transport: transport._id });
    setShowModal(false);
    setForm({ studentName: '', address: '', guardianPhone: '' });
    axios.get(`${API}/api/transport/students?transportId=${transport._id}`).then(r => setStudents(r.data));
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطالب؟')) return;
    await axios.delete(`${API}/api/transport/students/${id}`);
    setStudents(students.filter(s => s._id !== id));
    setOpenMenuId(null);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student._id);
    setEditStudentForm({
      studentName: student.studentName,
      address: student.address,
      guardianPhone: student.guardianPhone
    });
    setOpenMenuId(null);
  };

  const submitEditStudent = async (e) => {
    e.preventDefault();
    const res = await axios.put(`${API}/api/transport/students/${editingStudent}`, editStudentForm);
    setStudents(students.map(s => s._id === editingStudent ? res.data : s));
    setEditingStudent(null);
  };

  const handlePay = async (studentId, month) => {
    const res = await axios.put(`${API}/api/transport/students/${studentId}/pay`, { month });
    setStudents(students.map(s => s._id === studentId ? res.data : s));
  };

  const handleUpdateDriver = async (e) => {
    e.preventDefault();
    await axios.put(`${API}/api/transport/details/${transport._id}`, driverForm);
    setTransport(driverForm);
    setEditingDriver(false);
  };

  if (step === 1) {
    return (
      <Layout title="🚌 التراحيل" subtitle="اختر نوع الترحيل">
        <div className="grid grid-cols-2 gap-6">
          <button onClick={() => { setType('school'); setStep(2); }} className="glass p-8 rounded-2xl text-center hover:scale-105 transition-all text-2xl font-bold">تراحيل المدرسة</button>
          <button onClick={() => { setType('kindergarten'); setStep(2); }} className="glass p-8 rounded-2xl text-center hover:scale-105 transition-all text-2xl font-bold">تراحيل الروضة</button>
        </div>
      </Layout>
    );
  }

  if (step === 2) {
    const areas = type === 'school' ? AREAS_SCHOOL : AREAS_KG;
    return (
      <Layout title={`🚌 تراحيل ${type === 'school' ? 'المدرسة' : 'الروضة'}`} subtitle="اختر الحي">
        <button onClick={() => setStep(1)} className="mb-4 flex items-center gap-2 text-indigo-400"><ArrowRight size={18} /> رجوع</button>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {areas.map(a => (
            <button key={a} onClick={() => { setArea(a); setStep(3); }} className="glass p-6 rounded-2xl text-center hover:scale-105 transition-all font-bold">{a}</button>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`🚌 ${area}`} subtitle="تفاصيل الترحيل">
      <button onClick={() => { setStep(2); setArea(null); setHighlightedStudentId(null); }} className="mb-4 flex items-center gap-2 text-indigo-400"><ArrowRight size={18} /> تغيير الحي</button>

      <div className="glass p-6 rounded-2xl mb-6">
        {editingDriver ? (
          <form onSubmit={handleUpdateDriver} className="space-y-3">
            <input placeholder="اسم السائق" value={driverForm.driverName || ''} onChange={e => setDriverForm({...driverForm, driverName: e.target.value})} className="w-full p-2 bg-slate-800 rounded-lg" />
            <input placeholder="هاتف السائق" value={driverForm.driverPhone || ''} onChange={e => setDriverForm({...driverForm, driverPhone: e.target.value})} className="w-full p-2 bg-slate-800 rounded-lg" />
            <input placeholder="سكن السائق" value={driverForm.driverAddress || ''} onChange={e => setDriverForm({...driverForm, driverAddress: e.target.value})} className="w-full p-2 bg-slate-800 rounded-lg" />
            <input placeholder="اسم المشرف" value={driverForm.supervisorName || ''} onChange={e => setDriverForm({...driverForm, supervisorName: e.target.value})} className="w-full p-2 bg-slate-800 rounded-lg" />
            <input placeholder="هاتف المشرف" value={driverForm.supervisorPhone || ''} onChange={e => setDriverForm({...driverForm, supervisorPhone: e.target.value})} className="w-full p-2 bg-slate-800 rounded-lg" />
            <button type="submit" className="bg-blue-600 px-4 py-2 rounded-lg font-bold">حفظ</button>
          </form>
        ) : (
          <div className="flex justify-between items-start">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><User size={16} className="inline text-blue-400"/> السائق: {transport?.driverName || '—'}</p>
              <p><Phone size={16} className="inline text-blue-400"/> هاتف: {transport?.driverPhone || '—'}</p>
              <p><MapPin size={16} className="inline text-blue-400"/> سكن: {transport?.driverAddress || '—'}</p>
              <p><User size={16} className="inline text-emerald-400"/> المشرف: {transport?.supervisorName || '—'}</p>
              <p><Phone size={16} className="inline text-emerald-400"/> هاتف: {transport?.supervisorPhone || '—'}</p>
            </div>
            <button onClick={() => setEditingDriver(true)} className="text-xs bg-slate-700 px-3 py-1 rounded-lg">تعديل البيانات</button>
          </div>
        )}
      </div>

      <button onClick={() => setShowModal(true)} className="w-full mb-6 p-4 rounded-xl bg-gradient-to-l from-emerald-500 to-green-600 text-white font-bold flex justify-between items-center">
        <span>إضافة طالب</span> <Plus />
      </button>

      {/* عرض الطالب المحدد (إذا تم البحث عنه) */}
      {highlightedStudentId && students.some(s => s._id === highlightedStudentId) && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3 text-indigo-400 flex items-center gap-2">
            <User size={20} /> الطالب الذي بحثت عنه:
          </h3>
          {students.filter(s => s._id === highlightedStudentId).map(s => (
            <div key={s._id} className="glass p-5 rounded-2xl border-2 border-indigo-500 shadow-lg shadow-indigo-500/20">
              <h3 className="font-bold text-xl mb-2">{s.studentName}</h3>
              <p className="text-sm opacity-80 mb-3">{s.address} | {s.guardianPhone}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {MONTHS.map(m => {
                  const isPaid = s.paidMonths?.includes(m);
                  return (
                    <button key={m} onClick={() => handlePay(s._id, m)} className={`px-3 py-1.5 text-sm rounded-lg transition-all ${isPaid ? 'bg-green-500 text-white shadow-md' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                      شهر {m} {isPaid && <CheckCircle size={14} className="inline mr-1"/>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <hr className="border-slate-700 my-6" />
          <h3 className="text-sm font-bold opacity-60 mb-3">باقي طلاب الحي:</h3>
        </div>
      )}

      <div className="space-y-4">
        {students.map(s => (
          <div key={s._id} className={`glass p-4 rounded-xl relative ${s._id === highlightedStudentId ? 'opacity-50' : ''}`}>
            <div className="flex justify-between mb-2">
              <h3 className="font-bold">{s.studentName}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-60">{s.address} | {s.guardianPhone}</span>
                <div className="relative">
                  <button onClick={() => setOpenMenuId(openMenuId === s._id ? null : s._id)} className="p-1 rounded hover:bg-slate-700">
                    <MoreVertical size={18} />
                  </button>
                  {openMenuId === s._id && (
                    <div className="absolute left-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-32 z-10 overflow-hidden">
                      <button onClick={() => handleEditStudent(s)} className="w-full text-right px-4 py-2 hover:bg-slate-700 flex items-center gap-2"><Edit size={14}/> تعديل</button>
                      <button onClick={() => handleDeleteStudent(s._id)} className="w-full text-right px-4 py-2 hover:bg-red-500/20 text-red-400 flex items-center gap-2"><Trash2 size={14}/> حذف</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {MONTHS.map(m => {
                const isPaid = s.paidMonths?.includes(m);
                return (
                  <button key={m} onClick={() => handlePay(s._id, m)} className={`px-2 py-1 text-xs rounded ${isPaid ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    شهر {m} {isPaid && <CheckCircle size={12} className="inline"/>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddStudent} className="glass p-6 rounded-2xl w-full max-w-md">
            <div className="flex justify-between mb-4"><h3 className="font-bold">إضافة طالب للترحيل</h3><button type="button" onClick={()=>setShowModal(false)}><X/></button></div>
            <input required placeholder="اسم الطالب" onChange={e=>setForm({...form, studentName: e.target.value})} value={form.studentName} className="w-full p-3 mb-3 bg-slate-800 rounded-xl"/>
            <input required placeholder="السكن" onChange={e=>setForm({...form, address: e.target.value})} value={form.address} className="w-full p-3 mb-3 bg-slate-800 rounded-xl"/>
            <input required placeholder="رقم هاتف ولي الأمر" onChange={e=>setForm({...form, guardianPhone: e.target.value})} value={form.guardianPhone} className="w-full p-3 mb-4 bg-slate-800 rounded-xl"/>
            <button type="submit" className="w-full py-3 bg-blue-600 rounded-xl font-bold flex justify-center gap-2"><Send size={18}/> إضافة</button>
          </form>
        </div>
      )}

      {editingStudent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <form onSubmit={submitEditStudent} className="glass p-6 rounded-2xl w-full max-w-md">
            <div className="flex justify-between mb-4"><h3 className="font-bold">تعديل بيانات الطالب</h3><button type="button" onClick={()=>setEditingStudent(null)}><X/></button></div>
            <input required placeholder="اسم الطالب" onChange={e=>setEditStudentForm({...editStudentForm, studentName: e.target.value})} value={editStudentForm.studentName} className="w-full p-3 mb-3 bg-slate-800 rounded-xl"/>
            <input required placeholder="السكن" onChange={e=>setEditStudentForm({...editStudentForm, address: e.target.value})} value={editStudentForm.address} className="w-full p-3 mb-3 bg-slate-800 rounded-xl"/>
            <input required placeholder="رقم هاتف ولي الأمر" onChange={e=>setEditStudentForm({...editStudentForm, guardianPhone: e.target.value})} value={editStudentForm.guardianPhone} className="w-full p-3 mb-4 bg-slate-800 rounded-xl"/>
            <button type="submit" className="w-full py-3 bg-emerald-600 rounded-xl font-bold flex justify-center gap-2"><Send size={18}/> حفظ التعديلات</button>
          </form>
        </div>
      )}
    </Layout>
  );
}