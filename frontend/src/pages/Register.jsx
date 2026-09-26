import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap, User, Mail, Lock, Hash, Building2, Layers,
  BookOpen, Users
} from 'lucide-react';

export default function Register() {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    universityId: '', department: '', level: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...form, role });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'خطأ في التسجيل');
    } finally {
      setLoading(false);
    }
  };

  const studentFields = [
    { name: 'name', icon: User, placeholder: 'الاسم الكامل', type: 'text' },
    { name: 'email', icon: Mail, placeholder: 'البريد الإلكتروني', type: 'email' },
    { name: 'password', icon: Lock, placeholder: 'كلمة المرور', type: 'password' },
    { name: 'universityId', icon: Hash, placeholder: 'الرقم الجامعي', type: 'text' },
    { name: 'department', icon: Building2, placeholder: 'القسم', type: 'text' },
    { name: 'level', icon: Layers, placeholder: 'المستوى الدراسي', type: 'text' },
  ];

  const teacherFields = [
    { name: 'name', icon: User, placeholder: 'الاسم الكامل', type: 'text' },
    { name: 'email', icon: Mail, placeholder: 'البريد الإلكتروني', type: 'email' },
    { name: 'password', icon: Lock, placeholder: 'كلمة المرور', type: 'password' },
    { name: 'universityId', icon: Hash, placeholder: 'الرقم الوظيفي', type: 'text' },
    { name: 'department', icon: Building2, placeholder: 'القسم', type: 'text' },
  ];

  const fields = role === 'student' ? studentFields : teacherFields;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full filter blur-[120px] opacity-30" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full filter blur-[120px] opacity-30" />

      <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 w-full max-w-md relative z-10 glow-border animate-slide-up my-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">حساب جديد</h1>
          <p className="opacity-60 text-sm">انضم إلى بوابة الجامعة</p>
        </div>

        <div className="mb-5">
          <label className="block text-sm mb-2 opacity-80 text-center">اختر نوع الحساب</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                role === 'student'
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-800/40 border-slate-700 opacity-70 hover:opacity-100'
              }`}
            >
              <Users size={24} />
              <span className="font-bold">طالب</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                role === 'teacher'
                  ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-slate-800/40 border-slate-700 opacity-70 hover:opacity-100'
              }`}
            >
              <BookOpen size={24} />
              <span className="font-bold">أستاذ</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-center text-sm">
            {error}
          </div>
        )}

        {fields.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.name} className="relative mb-3">
              <Icon className="absolute top-4 left-4 opacity-40" size={18} />
              <input
                name={f.name}
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.name]}
                onChange={handleChange}
                required
                className="w-full p-3.5 pl-12 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition text-sm"
              />
            </div>
          );
        })}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition disabled:opacity-50 mt-4 ${
            role === 'student'
              ? 'bg-gradient-to-l from-indigo-600 to-purple-600 shadow-indigo-500/30'
              : 'bg-gradient-to-l from-purple-600 to-pink-600 shadow-purple-500/30'
          }`}
        >
          {loading ? 'جاري التسجيل...' : `إنشاء حساب ${role === 'student' ? 'طالب' : 'أستاذ'}`}
        </button>

        <p className="text-center mt-5 text-sm opacity-70">
          لديك حساب؟{' '}
          <Link to="/login" className="text-indigo-400 font-bold hover:underline">
            ادخل
          </Link>
        </p>
      </form>
    </div>
  );
}