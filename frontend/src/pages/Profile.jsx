import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import axios from 'axios';
import {
  User, Mail, Hash, Building2, Layers, Lock, Save, CheckCircle, AlertCircle
} from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    universityId: user?.universityId || '',
    department: user?.department || '',
    level: user?.level || '',
  });
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePassChange = (e) => setPassForm({ ...passForm, [e.target.name]: e.target.value });

  const handleProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setLoading(true);
    try {
      await updateProfile(form);
      setProfileMsg({ type: 'success', text: 'تم تحديث بياناتك بنجاح ✅' });
      setTimeout(() => setProfileMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'خطأ في التحديث' });
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });

    if (passForm.newPassword !== passForm.confirmPassword)
      return setPassMsg({ type: 'error', text: 'كلمتا المرور غير متطابقتين' });

    setLoading(true);
    try {
      await axios.put(`${API}/api/auth/password`, {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      setPassMsg({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح ✅' });
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassMsg({ type: 'error', text: err.response?.data?.message || 'خطأ في التغيير' });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'الاسم الكامل', icon: User, type: 'text' },
    { name: 'universityId', label: 'الرقم الجامعي', icon: Hash, type: 'text' },
    { name: 'department', label: 'القسم', icon: Building2, type: 'text' },
    { name: 'level', label: 'المستوى الدراسي', icon: Layers, type: 'text' },
  ];

  return (
    <Layout title="👤 الملف الشخصي" subtitle="إدارة بياناتك وكلمة المرور">
      <div className="glass rounded-3xl p-6 mb-6 animate-slide-up">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-indigo-500/40">
            {user?.name?.charAt(0) || '؟'}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <div className="flex items-center gap-2 opacity-60 mt-1 text-sm">
              <Mail size={14} />
              <span>{user?.email}</span>
            </div>
            {user?.universityId && (
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                🎓 {user.universityId}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass rounded-3xl p-6 animate-slide-up">
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
            <User size={20} className="text-indigo-400" />
            البيانات الشخصية
          </h3>

          {profileMsg.text && (
            <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2
              ${profileMsg.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
              {profileMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfile} className="space-y-4">
            {fields.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.name}>
                  <label className="block text-sm mb-2 opacity-70">{f.label}</label>
                  <div className="relative">
                    <Icon className="absolute top-3.5 left-4 opacity-40" size={18} />
                    <input
                      name={f.name}
                      type={f.type}
                      value={form[f.name]}
                      onChange={handleChange}
                      className="w-full p-3 pl-12 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition text-sm"
                    />
                  </div>
                </div>
              );
            })}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </form>
        </div>

        <div className="glass rounded-3xl p-6 animate-slide-up">
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
            <Lock size={20} className="text-purple-400" />
            تغيير كلمة المرور
          </h3>

          {passMsg.text && (
            <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2
              ${passMsg.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
              {passMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {passMsg.text}
            </div>
          )}

          <form onSubmit={handlePassword} className="space-y-4">
            <div>
              <label className="block text-sm mb-2 opacity-70">كلمة المرور الحالية</label>
              <input
                name="currentPassword"
                type="password"
                value={passForm.currentPassword}
                onChange={handlePassChange}
                required
                className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 opacity-70">كلمة المرور الجديدة</label>
              <input
                name="newPassword"
                type="password"
                value={passForm.newPassword}
                onChange={handlePassChange}
                required
                minLength={6}
                className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 opacity-70">تأكيد كلمة المرور الجديدة</label>
              <input
                name="confirmPassword"
                type="password"
                value={passForm.confirmPassword}
                onChange={handlePassChange}
                required
                minLength={6}
                className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-l from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-lg shadow-purple-500/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Lock size={18} />
              {loading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}