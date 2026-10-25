const router = require('express').Router();
const Schedule = require('../models/Schedule');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// جلب جدول الطالب حسب قسمه ومستواه
router.get('/my', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    
    const schedule = await Schedule.find({
      department: user.department,
      level: user.level
    }).populate('course');

    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إضافة مقرر (للأدمن مؤقتًا)
router.post('/course', async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إضافة محاضرة في الجدول
router.post('/', async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;