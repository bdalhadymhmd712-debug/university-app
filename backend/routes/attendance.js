const router = require('express').Router();
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');

router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const records = await Attendance.find({ date: today }).populate('student');
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/history', auth, async (req, res) => {
  try {
    const { date, grade } = req.query;
    const records = await Attendance.find({ date }).populate({
      path: 'student',
      match: { grade }
    });
    const filteredRecords = records.filter(r => r.student !== null);
    res.json(filteredRecords);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { studentId, status } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const record = await Attendance.findOneAndUpdate(
      { student: studentId, date: today },
      { status },
      { upsert: true, new: true }
    );
    res.json(record);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;