require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000 ;


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});

const Location = mongoose.model('Location', locationSchema);

app.get('/',(req,res) =>{
  res.send("Hello Nazmul Hasan");
 
});

app.post('/location', async (req, res) => {
  const { latitude, longitude } = req.body;
  const location = new Location({ latitude, longitude });
  await location.save();
  console.log('Saved location:', latitude, longitude);
  res.json({ message: 'Location saved in database!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
