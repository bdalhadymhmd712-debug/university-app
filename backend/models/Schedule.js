const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  course:  { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  day:     { type: String, required: true },   // الأحد، الاثنين...
  time:    { type: String, required: true },   // 8:00 - 9:30
  hall:    { type: String, required: true },   // القاعة
  level:   { type: String, required: true },   // المستوى
  department: { type: String },                // القسم
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);