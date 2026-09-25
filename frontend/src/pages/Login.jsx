import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'خطأ في الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full filter blur-[120px] opacity-30" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full filter blur-[120px] opacity-30" />

      <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 w-full max-w-md relative z-10 glow-border animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 animate-glow">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">بوابة الطالب</h1>
          <p className="opacity-60 text-sm">سجّل دخولك للمتابعة</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <div className="relative mb-4">
          <Mail className="absolute top-4 left-4 opacity-40" size={20} />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 pr-4 pl-12 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
          />
        </div>

        <div className="relative mb-6">
          <Lock className="absolute top-4 left-4 opacity-40" size={20} />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 pr-4 pl-12 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'جاري الدخول...' : (<><span>تسجيل الدخول</span><ArrowLeft size={18} /></>)}
        </button>

        <p className="text-center mt-6 text-sm opacity-70">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-indigo-400 font-bold hover:underline">
            سجّل الآن
          </Link>
        </p>
      </form>
    </div>
  );
}