const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course:    { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  midterm:   { type: Number, default: 0 },
  final:     { type: Number, default: 0 },
  practical: { type: Number, default: 0 },
  total:     { type: Number, default: 0 },
  grade:     { type: String, default: '' },
  semester:  { type: String, default: 'الفصل الأول' },
}, { timestamps: true });

module.exports = mongoose.model('Grade', gradeSchema);