const router = require('express').Router();
const Request = require('../models/Request');
const auth = require('../middleware/auth');

// جلب طلبات الطالب
router.get('/my', auth, async (req, res) => {
  try {
    const requests = await Request
      .find({ student: req.user.id })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// تقديم طلب جديد
router.post('/', auth, async (req, res) => {
  try {
    const request = await Request.create({
      ...req.body,
      student: req.user.id,
    });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// حذف طلب (فقط قيد المراجعة)
router.delete('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'الطلب غير موجود' });

    if (request.student.toString() !== req.user.id)
      return res.status(403).json({ message: 'غير مصرح' });

    if (request.status !== 'قيد المراجعة')
      return res.status(400).json({ message: 'لا يمكن حذف طلب تمت مراجعته' });

    await request.deleteOne();
    res.json({ message: 'تم حذف الطلب' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;