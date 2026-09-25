const router = require('express').Router();
const Fee = require('../models/Fee');
const auth = require('../middleware/auth');

// جلب رسوم الطالب
router.get('/my', auth, async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إضافة رسوم (للأدمن)
router.post('/', async (req, res) => {
  try {
    const { totalAmount, paidAmount } = req.body;
    let status = 'غير مدفوع';
    if (paidAmount >= totalAmount) status = 'مدفوع';
    else if (paidAmount > 0) status = 'جزئي';

    const fee = await Fee.create({ ...req.body, status });
    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;