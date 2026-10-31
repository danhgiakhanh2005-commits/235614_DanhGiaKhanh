require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const devicesRouter = require('./routes/devices');

const app = express();

const origins =
  process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*'
    ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
    : '*';
app.use(cors({ origin: origins }));
app.use(express.json());

app.get('/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'degraded',
    database: connected ? 'connected' : 'disconnected',
    time: new Date().toISOString(),
  });
});

app.use('/api/devices', devicesRouter);

app.use((req, res) => res.status(404).json({ message: 'Không tìm thấy đường dẫn' }));

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON không hợp lệ' });
  }
  console.error(err);
  res.status(500).json({ message: 'Lỗi máy chủ' });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Đã kết nối MongoDB Atlas');
    app.listen(PORT, () => console.log(`Backend chạy ở cổng ${PORT}`));
  })
  .catch((err) => {
    console.error('Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  });