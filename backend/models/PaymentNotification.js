const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fee:         { type: mongoose.Schema.Types.ObjectId, ref: 'Fee' },  // اختياري
  amount:      { type: Number, required: true },
  transferDate:{ type: Date, required: true },
  receiptNo:   { type: String, required: true },   // رقم العملية
  bankName:    { type: String, default: '' },      // اسم البنك
  notes:       { type: String, default: '' },      // ملاحظات
  imageUrl:    { type: String, default: '' },      // صورة الإشعار (اختياري)
  status:      { type: String, enum: ['قيد المراجعة', 'مقبول', 'مرفوض'], default: 'قيد المراجعة' },
  adminNote:   { type: String, default: '' },      // ملاحظة الإدارة عند الرفض
}, { timestamps: true });

module.exports = mongoose.model('PaymentNotification', notificationSchema);