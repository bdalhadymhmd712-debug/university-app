const router = require('express').Router();
const Student = require('../models/Student');
const auth = require('../middleware/auth');

// جلب الطلاب (مع إمكانية الفلترة بالصف)
router.get('/', auth, async (req, res) => {
  try {
    const query = req.query.grade ? { grade: req.query.grade } : {};
    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// إضافة طالب جديد
router.post('/', auth, async (req, res) => {
  try {
    const student = await Student.create({ ...req.body, createdBy: req.user.id });
    res.json(student);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// البحث بالاسم
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const students = await Student.find({ fullName: { $regex: q, $options: 'i' } }).limit(5);
    res.json(students);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// تعديل بيانات طالب (جديد)
router.put('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// حذف طالب
router.delete('/:id', auth, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم الحذف' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;