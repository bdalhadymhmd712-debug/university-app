const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

// جلب كل المنشورات
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إنشاء منشور جديد
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const post = await Post.create({
      author: user._id,
      authorName: user.name,
      authorLevel: user.level || '',
      text: req.body.text,
      category: req.body.category || 'عام',
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إعجاب/إلغاء إعجاب
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'المنشور غير موجود' });

    const userId = req.user.id;
    const idx = post.likes.findIndex(id => id.toString() === userId);

    if (idx === -1) post.likes.push(userId);
    else post.likes.splice(idx, 1);

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إضافة تعليق
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'المنشور غير موجود' });

    post.comments.push({
      author: user._id,
      authorName: user.name,
      text: req.body.text,
    });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// حذف منشور (فقط لصاحبه)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'غير موجود' });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'غير مصرح' });

    await post.deleteOne();
    res.json({ message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;