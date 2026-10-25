const router = require('express').Router();
const PaymentNotification = require('../models/PaymentNotification');
const Fee = require('../models/Fee');
const auth = require('../middleware/auth');

// جلب إشعارات الطالب
router.get('/my', auth, async (req, res) => {
  try {
    const list = await PaymentNotification
      .find({ student: req.user.id })
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إرسال إشعار جديد
router.post('/', auth, async (req, res) => {
  try {
    const notification = await PaymentNotification.create({
      ...req.body,
      student: req.user.id,
    });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// موافقة الإدارة
router.put('/:id/approve', async (req, res) => {
  try {
    const notif = await PaymentNotification.findById(req.params.id);
    if (!notif) return res.status(404).json({ message: 'غير موجود' });

    notif.status = 'مقبول';
    await notif.save();

    if (notif.fee) {
      const fee = await Fee.findById(notif.fee);
      if (fee) {
        fee.paidAmount += notif.amount;
        fee.status = fee.paidAmount >= fee.totalAmount ? 'مدفوع' : 'جزئي';
        fee.payments.push({
          amount: notif.amount,
          method: 'تحويل بنكي',
          receiptNo: notif.receiptNo,
        });
        await fee.save();
      }
    }

    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// رفض الإدارة
router.put('/:id/reject', async (req, res) => {
  try {
    const notif = await PaymentNotification.findByIdAndUpdate(
      req.params.id,
      { status: 'مرفوض', adminNote: req.body.adminNote || '' },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// حذف إشعار (فقط لصاحبه وحالته قيد المراجعة)
router.delete('/:id', auth, async (req, res) => {
  try {
    const notif = await PaymentNotification.findById(req.params.id);
    if (!notif) return res.status(404).json({ message: 'الإشعار غير موجود' });

    if (notif.student.toString() !== req.user.id)
      return res.status(403).json({ message: 'غير مصرح بحذف هذا الإشعار' });

    if (notif.status !== 'قيد المراجعة')
      return res.status(400).json({ message: 'لا يمكن حذف إشعار تمت مراجعته' });

    await notif.deleteOne();
    res.json({ message: 'تم حذف الإشعار بنجاح' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;