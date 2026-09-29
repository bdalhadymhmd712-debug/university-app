const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { messaging } = require('../config/firebase');

// حفظ FCM Token للمستخدم
router.post('/register-token', auth, async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token مطلوب' });

    await User.findByIdAndUpdate(req.user.id, { fcmToken: token });
    res.json({ message: 'تم حفظ التوكن' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إرسال إشعار لمستخدم محدد
router.post('/send-to-me', auth, async (req, res) => {
  try {
    const { title, body } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.fcmToken) {
      return res.status(400).json({ message: 'لا يوجد FCM Token لهذا المستخدم' });
    }

    const message = {
      token: user.fcmToken,
      notification: { title, body },
      webpush: {
        notification: {
          title,
          body,
          icon: '/logo192.png',
        },
      },
    };

    const response = await messaging.send(message);
    res.json({ success: true, response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إرسال إشعار لكل المستخدمين
router.post('/send-to-all', auth, async (req, res) => {
  try {
    const { title, body } = req.body;
    const users = await User.find({ fcmToken: { $ne: '' } });
    const tokens = users.map(u => u.fcmToken).filter(t => t);

    if (tokens.length === 0) {
      return res.status(400).json({ message: 'لا يوجد مستخدمون لديهم توكن' });
    }

    const message = {
      notification: { title, body },
      webpush: {
        notification: {
          title,
          body,
          icon: '/logo192.png',
        },
      },
      tokens,
    };

    const response = await messaging.sendEachForMulticast(message);
    res.json({ success: true, sent: response.successCount, failed: response.failureCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;