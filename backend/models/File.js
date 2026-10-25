const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  title:       { type: String, required: true },   // عنوان الملف
  description: { type: String, default: '' },       // وصف
  course:      { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  type:        { type: String, enum: ['محاضرة', 'واجب', 'مرجع', 'امتحان سابق', 'أخرى'], default: 'محاضرة' },
  fileUrl:     { type: String, required: true },   // رابط الملف
  fileSize:    { type: String, default: '' },       // حجم الملف (نص)
  uploadedBy:  { type: String, default: 'الإدارة' },
  downloads:   { type: Number, default: 0 },        // عدد التحميلات
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);