const mongoose = require('mongoose');

const transportStudentSchema = new mongoose.Schema({
  transport: { type: mongoose.Schema.Types.ObjectId, ref: 'Transport', required: true },
  studentName: { type: String, required: true },
  address: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  paidMonths: [{ type: Number }],
}, { timestamps: true });

module.exports = mongoose.model('TransportStudent', transportStudentSchema);