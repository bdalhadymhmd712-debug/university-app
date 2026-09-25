const router = require('express').Router();
const Grade = require('../models/Grade');
const auth = require('../middleware/auth');

// جلب نتائج الطالب
router.get('/my', auth, async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.user.id }).populate('course');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إضافة نتيجة
router.post('/', async (req, res) => {
  try {
    const { midterm, final, practical } = req.body;
    const total = (midterm || 0) + (final || 0) + (practical || 0);

    let grade = 'F';
    if (total >= 90) grade = 'A+';
    else if (total >= 85) grade = 'A';
    else if (total >= 80) grade = 'B+';
    else if (total >= 75) grade = 'B';
    else if (total >= 70) grade = 'C+';
    else if (total >= 65) grade = 'C';
    else if (total >= 60) grade = 'D';

    const newGrade = await Grade.create({ ...req.body, total, grade });
    res.json(newGrade);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;