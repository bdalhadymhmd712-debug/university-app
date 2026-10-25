const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title:     { type: String, required: true },     // العنوان
  body:      { type: String, required: true },     // المحتوى
  category:  { type: String, default: 'عام' },     // التصنيف (عام، امتحانات، أنشطة...)
  priority:  { type: String, enum: ['عادي', 'مهم', 'عاجل'], default: 'عادي' },
  author:    { type: String, default: 'الإدارة' },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);