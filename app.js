require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

const locationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true, min: -90, max: 90 },
  longitude: { type: Number, required: true, min: -180, max: 180 },
  timestamp: { type: Date, default: Date.now },
});

const Location = mongoose.model('Location', locationSchema);

app.get('/', (req, res) => {
  res.send('Hello Nazmul Hasan');
});

app.post('/location', async (req, res) => {
  const { latitude, longitude } = req.body;

  if (
    typeof latitude !== 'number' ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    typeof longitude !== 'number' ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    return res.status(400).json({ message: 'Valid latitude and longitude are required.' });
  }

  try {
    const location = await Location.create({ latitude, longitude });
    console.log('Saved location:', location._id.toString());
    return res.status(201).json({ message: 'Location saved in database!', id: location._id });
  } catch (error) {
    console.error('Error saving location:', error);
    return res.status(500).json({ message: 'Could not save location.' });
  }
});

async function startServer() {
  if (!mongoUri) {
    throw new Error('MONGO_URI must be configured.');
  }

  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected to database "${mongoose.connection.name}"`);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Could not start server:', error);
  process.exit(1);
});
