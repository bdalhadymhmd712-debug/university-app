const router = require('express').Router();
const Book = require('../models/Book');
const auth = require('../middleware/auth');

// جلب كل الكتب
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إضافة كتاب (للإدارة لاحقًا)
router.post('/', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// زيادة عدد التحميلات
router.put('/:id/download', auth, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;