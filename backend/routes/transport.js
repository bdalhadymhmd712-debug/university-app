const router = require('express').Router();
const Transport = require('../models/Transport');
const TransportStudent = require('../models/TransportStudent');
const auth = require('../middleware/auth');

router.get('/details', auth, async (req, res) => {
  try {
    const { type, area } = req.query;
    let transport = await Transport.findOne({ type, area });
    if (!transport) transport = await Transport.create({ type, area });
    res.json(transport);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/details/:id', auth, async (req, res) => {
  try {
    const transport = await Transport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(transport);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/students', auth, async (req, res) => {
  try {
    const { transportId } = req.query;
    const students = await TransportStudent.find({ transport: transportId }).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/students', auth, async (req, res) => {
  try {
    const student = await TransportStudent.create(req.body);
    res.json(student);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/students/:id/pay', auth, async (req, res) => {
  try {
    const { month } = req.body;
    const student = await TransportStudent.findById(req.params.id);
    if (student.paidMonths.includes(month)) {
      student.paidMonths = student.paidMonths.filter(m => m !== month);
    } else {
      student.paidMonths.push(month);
    }
    await student.save();
    res.json(student);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;