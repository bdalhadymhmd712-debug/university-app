const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semester:     { type: String, required: true },       // الفصل الدراسي
  totalAmount:  { type: Number, required: true },       // المبلغ الكلي
  paidAmount:   { type: Number, default: 0 },           // المدفوع
  dueDate:      { type: Date },                          // تاريخ الاستحقاق
  status:       { type: String, enum: ['مدفوع', 'جزئي', 'غير مدفوع'], default: 'غير مدفوع' },
  payments: [{
    amount:    { type: Number },
    date:      { type: Date, default: Date.now },
    method:    { type: String, default: 'نقدي' },
    receiptNo: { type: String },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);