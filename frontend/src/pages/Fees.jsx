import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import {
  Wallet, Calendar, CheckCircle, AlertCircle, TrendingUp,
  Send, Upload, X, FileText, Banknote, Trash2
} from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      axios.get(`${API}/api/fees/my`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/payments/my`).catch(() => ({ data: [] })),
    ]).then(([feesRes, notifRes]) => {
      setFees(feesRes.data);
      setNotifications(notifRes.data);
    }).finally(() => setLoading(false));
  };

  const handleDeleteNotification = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الإشعار؟')) return;
    try {
      await axios.delete(`${API}/api/payments/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'خطأ في الحذف');
    }
  };

  const statusColor = (s) => {
    if (s === 'مدفوع' || s === 'مقبول') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (s === 'جزئي' || s === 'قيد المراجعة') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const totalAll = fees.reduce((s, f) => s + f.totalAmount, 0);
  const paidAll = fees.reduce((s, f) => s + f.paidAmount, 0);
  const remainAll = totalAll - paidAll;
  const progressAll = totalAll > 0 ? Math.round((paidAll / totalAll) * 100) : 0;

  return (
    <Layout title="💰 الرسوم الدراسية" subtitle="حالة دفعك للرسوم والمتبقي">
      {loading ? (
        <div className="text-center text-xl p-10 animate-pulse">جاري التحميل...</div>
      ) : (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="w-full mb-6 p-5 rounded-2xl bg-gradient-to-l from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.01] flex items-center justify-between group animate-slide-up"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Send size={26} />
              </div>
              <div className="text-right">
                <h3 className="text-xl font-bold">رفع إشعار تحويل بنكي</h3>
                <p className="text-sm opacity-90">أرسل صورة الإشعار إلى مكتب المسجل</p>
              </div>
            </div>
            <div className="text-3xl group-hover:translate-x-1 transition-transform">←</div>
          </button>

          {fees.length > 0 && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard icon={<Wallet size={22} />} label="إجمالي الرسوم" value={`${totalAll.toLocaleString()} ج.س`} gradient="from-indigo-500 to-purple-600" />
                <StatCard icon={<CheckCircle size={22} />} label="المدفوع" value={`${paidAll.toLocaleString()} ج.س`} gradient="from-emerald-500 to-green-600" />
                <StatCard icon={<AlertCircle size={22} />} label="المتبقي" value={`${remainAll.toLocaleString()} ج.س`} gradient="from-red-500 to-orange-600" />
                <StatCard icon={<TrendingUp size={22} />} label="نسبة السداد" value={`${progressAll}%`} gradient="from-cyan-500 to-blue-600" />
              </div>

              <div className="glass rounded-2xl p-6 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold">نسبة السداد الإجمالية</span>
                  <span className="text-2xl font-bold text-indigo-400">{progressAll}%</span>
                </div>
                <div className="w-full h-4 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000" style={{ width: `${progressAll}%` }} />
                </div>
              </div>
            </>
          )}

          {fees.length > 0 && (
            <>
              <h3 className="text-lg font-bold mb-4">تفاصيل الرسوم</h3>
              <div className="space-y-4 mb-6">
                {fees.map((fee) => {
                  const remain = fee.totalAmount - fee.paidAmount;
                  const progress = Math.round((fee.paidAmount / fee.totalAmount) * 100);
                  return (
                    <div key={fee._id} className="glass rounded-2xl p-6 animate-slide-up">
                      <div className="flex justify-between items-start flex-wrap gap-3 mb-4">
                        <div>
                          <h4 className="text-lg font-bold">{fee.semester}</h4>
                          {fee.dueDate && (
                            <div className="flex items-center gap-2 text-sm opacity-60 mt-1">
                              <Calendar size={14} />
                              <span>تاريخ الاستحقاق: {new Date(fee.dueDate).toLocaleDateString('ar-EG')}</span>
                            </div>
                          )}
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${statusColor(fee.status)}`}>
                          {fee.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div><div className="text-xs opacity-60 mb-1">الكلي</div><div className="font-bold">{fee.totalAmount.toLocaleString()}</div></div>
                        <div><div className="text-xs opacity-60 mb-1">المدفوع</div><div className="font-bold text-green-400">{fee.paidAmount.toLocaleString()}</div></div>
                        <div><div className="text-xs opacity-60 mb-1">المتبقي</div><div className="font-bold text-red-400">{remain.toLocaleString()}</div></div>
                      </div>

                      <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-l from-emerald-500 to-green-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText size={20} className="text-indigo-400" /> إشعاراتك السابقة
          </h3>
          {notifications.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="opacity-60">لم تُرسل أي إشعار بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n._id} className="glass rounded-2xl p-5 animate-slide-up">
                  <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Banknote size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="font-bold">{n.amount.toLocaleString()} ج.س</div>
                        <div className="text-xs opacity-60">رقم العملية: {n.receiptNo}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor(n.status)}`}>
                        {n.status}
                      </span>
                      {n.status === 'قيد المراجعة' && (
                        <button
                          onClick={() => handleDeleteNotification(n._id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 transition"
                          title="حذف الإشعار"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs opacity-60">
                    <span>📅 تاريخ التحويل: {new Date(n.transferDate).toLocaleDateString('ar-EG')}</span>
                    {n.bankName && <span>🏦 {n.bankName}</span>}
                    <span>📤 أُرسل: {new Date(n.createdAt).toLocaleDateString('ar-EG')}</span>
                  </div>
                  {n.adminNote && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                      ملاحظة الإدارة: {n.adminNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showModal && (
        <PaymentModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadData();
          }}
          fees={fees}
        />
      )}
    </Layout>
  );
}

function PaymentModal({ onClose, onSuccess, fees }) {
  const [form, setForm] = useState({
    amount: '',
    transferDate: new Date().toISOString().split('T')[0],
    receiptNo: '',
    bankName: '',
    notes: '',
    fee: fees.length > 0 ? fees[0]._id : '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة كبير جدًا (الحد الأقصى 5MB)');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API}/api/payments`, {
        ...form,
        amount: Number(form.amount),
        imageUrl: imagePreview,
      });
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
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Send size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">رفع إشعار تحويل</h3>
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

          {fees.length > 0 && (
            <div>
              <label className="block text-sm mb-2 opacity-80">الفصل الدراسي</label>
              <select
                name="fee"
                value={form.fee}
                onChange={handleChange}
                className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
              >
                {fees.map(f => (
                  <option key={f._id} value={f._id}>{f.semester}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm mb-2 opacity-80">المبلغ المحوّل (ج.س)</label>
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              required
              placeholder="مثال: 100000"
              className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-2 opacity-80">تاريخ التحويل</label>
              <input
                name="transferDate"
                type="date"
                value={form.transferDate}
                onChange={handleChange}
                required
                className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 opacity-80">رقم العملية</label>
              <input
                name="receiptNo"
                value={form.receiptNo}
                onChange={handleChange}
                required
                placeholder="123456789"
                className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 opacity-80">اسم البنك (اختياري)</label>
            <input
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              placeholder="مثال: بنك الخرطوم"
              className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 opacity-80">صورة الإشعار (اختياري)</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-emerald-500 transition bg-slate-800/30">
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="h-full object-contain rounded-xl" />
              ) : (
                <>
                  <Upload size={28} className="opacity-40 mb-2" />
                  <span className="text-sm opacity-60">اضغط لاختيار صورة</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-sm mb-2 opacity-80">ملاحظات (اختياري)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="2"
              placeholder="أي ملاحظة إضافية..."
              className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition font-medium">
              إلغاء
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-gradient-to-l from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 font-bold text-white shadow-lg shadow-emerald-500/30 transition disabled:opacity-50">
              {loading ? 'جاري الإرسال...' : 'إرسال الإشعار'}
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
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs opacity-60 mt-1">{label}</div>
    </div>
  );
}