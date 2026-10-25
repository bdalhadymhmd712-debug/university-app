const router = require('express').Router();
const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');

// جلب كل الإعلانات
router.get('/', auth, async (req, res) => {
  try {
    const list = await Announcement.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إضافة إعلان (سنستخدمها للأدمن لاحقًا)
router.post('/', async (req, res) => {
  try {
    const ann = await Announcement.create(req.body);
    res.json(ann);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;