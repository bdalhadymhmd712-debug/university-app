const router = require('express').Router();
const Student = require('../models/Student');
const TransportStudent = require('../models/TransportStudent'); // استيراد جدول التراحيل
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

// البحث الشامل (في الطلاب وطلاب التراحيل)
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    // البحث في جدول الطلاب
    const students = await Student.find({ fullName: { $regex: q, $options: 'i' } }).limit(5);
    
    // البحث في جدول طلاب التراحيل
    const transportStudents = await TransportStudent.find({ studentName: { $regex: q, $options: 'i' } }).limit(5);

    // دمج النتائج وإضافة حقل النوع لتمييزهم في الواجهة
    const combined = [
      ...students.map(s => ({ ...s._doc, type: 'طالب' })),
      ...transportStudents.map(ts => ({ 
        ...ts._doc, 
        fullName: ts.studentName, // توحيد اسم الحقل للواجهة
        type: 'ترحيل',
        grade: 'ترحيل' // لأن طلاب التراحيل ليس لهم صف
      }))
    ];

    res.json(combined);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// تعديل بيانات طالب
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