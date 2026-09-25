const router = require('express').Router();
const File = require('../models/File');
const User = require('../models/User');
const auth = require('../middleware/auth');



  // جلب كل الملفات (مؤقتًا للاختبار)
router.get('/my', auth, async (req, res) => {
  try {
    const files = await File
      .find()
      .populate('course')
      .sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// إضافة ملف (للأستاذ/الإدارة لاحقًا)
router.post('/', async (req, res) => {
  try {
    const file = await File.create(req.body);
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// زيادة عدد التحميلات
router.put('/:id/download', auth, async (req, res) => {
  try {
    const file = await File.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;