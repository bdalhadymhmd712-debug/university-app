const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
  type: { type: String, enum: ['مدرسة', 'روضة'], required: true },
  area: { type: String, required: true },
  driverName: { type: String, default: '' },
  driverPhone: { type: String, default: '' },
  driverAddress: { type: String, default: '' },
  supervisorName: { type: String, default: '' },
  supervisorPhone: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Transport', transportSchema);