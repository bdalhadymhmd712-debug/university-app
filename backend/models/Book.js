const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  author:      { type: String, required: true },
  description: { type: String, default: '' },
  category:    { type: String, enum: ['برمجة', 'رياضيات', 'فيزياء', 'كيمياء', 'أحياء', 'أدب', 'تاريخ', 'دين', 'أخرى'], default: 'أخرى' },
  fileUrl:     { type: String, required: true },
  coverUrl:    { type: String, default: '' },
  fileSize:    { type: String, default: '' },
  downloads:   { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);