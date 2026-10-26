const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName:      { type: String, required: true },
  guardianName:  { type: String, required: true },
  address:       { type: String, default: '' },
  guardianPhone: { type: String, required: true },
  grade:         { type: String, required: true, default: 'الصف الأول' }, // ← حقل جديد
  createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);