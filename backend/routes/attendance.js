const router = require('express').Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

// جلب غياب اليوم الحالي مع أسماء الطلاب
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const records = await Attendance.find({ date: today }).populate('student');
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// تسجيل حضور/غياب طالب
router.post('/', auth, async (req, res) => {
  try {
    const { studentId, status } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // تحديث إذا كان مسجلاً مسبقاً، أو إنشاء سجل جديد
    const record = await Attendance.findOneAndUpdate(
      { student: studentId, date: today },
      { status },
      { upsert: true, new: true }
    );
    res.json(record);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;