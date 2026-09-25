require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/grades', require('./routes/grades'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/files', require('./routes/files'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/library', require('./routes/library'));
app.use('/api/requests', require('./routes/requests'));

app.get('/', (req, res) => res.json({ status: 'API يعمل ✅' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ متصل بـ MongoDB'))
  .catch(err => console.log('❌ خطأ في الاتصال:', err.message));

app.listen(process.env.PORT, () =>
  console.log(`🚀 السيرفر على http://localhost:${process.env.PORT}`)
);