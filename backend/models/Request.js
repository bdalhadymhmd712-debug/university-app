const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  student:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:     { type: String, enum: ['تأجيل فصل', 'إعادة قيد', 'شهادة تخرج', 'تعديل بيانات', 'نقل قسم', 'أخرى'], required: true },
  reason:   { type: String, required: true },
  details:  { type: String, default: '' },
  status:   { type: String, enum: ['قيد المراجعة', 'مقبول', 'مرفوض'], default: 'قيد المراجعة' },
  adminNote:{ type: String, default: '' },
  attachments: [{ type: String }],  // روابط ملفات مرفقة
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);