const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  role:         { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  universityId: { type: String, sparse: true },
  department:   { type: String },
  level:        { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);