const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  text: { type: String, required: true },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName:  { type: String, required: true },
  authorLevel: { type: String, default: '' },
  text:        { type: String, required: true },
  category:    { type: String, enum: ['عام', 'دراسي', 'أنشطة', 'سؤال', 'إعلان'], default: 'عام' },
  likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments:    [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);