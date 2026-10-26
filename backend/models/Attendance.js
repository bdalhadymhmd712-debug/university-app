const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date:    { type: String, required: true }, // سنخزن التاريخ كـ نص (YYYY-MM-DD) لسهولة البحث
  status:  { type: String, enum: ['حاضر', 'غائب'], default: 'حاضر' },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);