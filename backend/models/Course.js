const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name:        { type: String, required: true },     // اسم المقرر
  code:        { type: String, required: true },     // رمز المقرر
  doctor:      { type: String, required: true },     // اسم الدكتور
  creditHours: { type: Number, default: 3 },         // الساعات المعتمدة
  department:  { type: String },                     // القسم
  level:       { type: String },                     // المستوى
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);