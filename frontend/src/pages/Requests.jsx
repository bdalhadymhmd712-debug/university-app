import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import {
  FileText, Plus, X, Send, Calendar, Trash2, AlertCircle,
  CheckCircle, Clock, ClipboardList
} from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    setLoading(true);
    axios.get(`${API}/api/requests/my`)
      .then(res => setRequests(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    try {
      await axios.delete(`${API}/api/requests/${id}`);
      setRequests(requests.filter(r => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'خطأ في الحذف');
    }
  };

  const statusColor = (s) => {
    if (s === 'مقبول') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (s === 'مرفوض') return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  const statusIcon = (s) => {
    if (s === 'مقبول') return <CheckCircle size={16} />;
    if (s === 'مرفوض') return <AlertCircle size={16} />;
    return <Clock size={16} />;
  };

  const typeColor = (t) => {
    const colors = {
      'تأجيل فصل': 'from-amber-500 to-orange-500',
      'إعادة قيد': 'from-blue-500 to-cyan-500',
      'شهادة تخرج': 'from-purple-500 to-pink-500',
      'تعديل بيانات': 'from-emerald-500 to-green-500',
      'نقل قسم': 'from-indigo-500 to-purple-500',
      'أخرى': 'from-slate-500 to-gray-600',
    };
    return colors[t] || 'from-slate-500 to-gray-600';
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'قيد المراجعة').length,
    approved: requests.filter(r => r.status === 'مقبول').length,
    rejected: requests.filter(r => r.status === 'مرفوض').length,
  };

  return (
    <Layout title="📝 الطلبات الإدارية" subtitle="تقديم ومتابعة طلباتك الإدارية">
      <button
        onClick={() => setShowModal(true)}
        className="w-full mb-6 p-5 rounded-2xl bg-gradient-to-l from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.01] flex items-center justify-between group animate-slide-up"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Plus size={26} />
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold">تقديم طلب جديد</h3>
            <p className="text-sm opacity-90">تأجيل، إعادة قيد، شهادة، وغيرها</p>
          </div>
        </div>
        <div className="text-3xl group-hover:translate-x-1 transition-transform">←</div>
      </button>

      {loading ? (
        <div className="text-center text-xl p-10 animate-pulse">جاري التحميل...</div>
      ) : requests.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <ClipboardList size={48} className="mx-auto opacity-30 mb-3" />
          <p className="text-xl mb-2">📭 لا توجد طلبات</p>
          <p className="opacity-60 text-sm">اضغط "تقديم طلب جديد" للبدء</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={<FileText size={22} />} label="إجمالي الطلبات" value={stats.total} gradient="from-indigo-500 to-purple-600" />
            <StatCard icon={<Clock size={22} />} label="قيد المراجعة" value={stats.pending} gradient="from-yellow-500 to-amber-600" />
            <StatCard icon={<CheckCircle size={22} />} label="مقبولة" value={stats.approved} gradient="from-emerald-500 to-green-600" />
            <StatCard icon={<AlertCircle size={22} />} label="مرفوضة" value={stats.rejected} gradient="from-red-500 to-orange-600" />
          </div>

          <h3 className="text-lg font-bold mb-4">طلباتك السابقة</h3>
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req._id} className="glass rounded-2xl p-5 animate-slide-up">
                <div className="flex justify-between items-start flex-wrap gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeColor(req.type)} flex items-center justify-center shadow-lg`}>
                      <FileText size={22} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold">{req.type}</h4>
                      <div className="text-xs opacity-60 flex items-center gap-1 mt-0.5">
                        <Calendar size={12} />
                        {new Date(req.createdAt).toLocaleDateString('ar-EG')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${statusColor(req.status)}`}>
                      {statusIcon(req.status)}
                      {req.status}
                    </span>
                    {req.status === 'قيد المراجعة' && (
                      <button
                        onClick={() => handleDelete(req._id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 transition"
                        title="حذف الطلب"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-slate-800/40 rounded-xl p-3 text-sm mb-2">
                  <span className="opacity-60">السبب: </span>
                  {req.reason}
                </div>

                {req.details && (
                  <div className="bg-slate-800/40 rounded-xl p-3 text-sm">
                    <span className="opacity-60">تفاصيل: </span>
                    {req.details}
                  </div>
                )}

                {req.adminNote && (
                  <div className={`mt-3 p-3 rounded-lg text-sm border ${
                    req.status === 'مقبول'
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    <span className="font-bold">ملاحظة الإدارة: </span>
                    {req.adminNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <RequestModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadRequests();
          }}
        />
      )}
    </Layout>
  );
}

function RequestModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    type: 'تأجيل فصل',
    reason: '',
    details: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const types = ['تأجيل فصل', 'إعادة قيد', 'شهادة تخرج', 'تعديل بيانات', 'نقل قسم', 'أخرى'];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API}/api/requests`, form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'خطأ في الإرسال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50 sticky top-0 bg-slate-900/90 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">تقديم طلب جديد</h3>
              <p className="text-xs opacity-60">املأ البيانات بدقة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-700/50 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm mb-2 opacity-80">نوع الطلب</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
            >
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2 opacity-80">السبب</label>
            <input
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              placeholder="اكتب سبب الطلب باختصار"
              className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 opacity-80">تفاصيل إضافية (اختياري)</label>
            <textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              rows="4"
              placeholder="اشرح طلبك بتفصيل..."
              className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition font-medium">
              إلغاء
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-white shadow-lg shadow-indigo-500/30 transition disabled:opacity-50 flex items-center justify-center gap-2">
              <Send size={16} />
              {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, gradient }) {
  return (
    <div className="glass rounded-2xl p-5 animate-fade-in">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg`}>
        <div className="text-white">{icon}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs opacity-60 mt-1">{label}</div>
    </div>
  );
}