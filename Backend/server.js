const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const Stock = require('./models/Stock');

const app = express();
const port = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_ORIGIN }));

app.use(express.json());

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.get('/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/stocks', async (req, res) => {
  const { name } = req.body;

  if (!name || !/^[A-Z]{1,5}$/.test(name)) {
    return res.status(400).json({ msg: 'Stock name must be between 1 to 5 uppercase letters.' });
  }

  try {
    const newStock = new Stock({ name });
    await newStock.save();
    res.status(201).json({ msg: 'Stock added to watchlist!' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'This stock is already in your watchlist.' });
    }
    res.status(500).send('Server error');
  }
});

app.delete('/stocks/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const removed = await Stock.findOneAndDelete({ name: name.toUpperCase() });
    if (!removed) return res.status(404).json({ msg: 'Stock not found' });
    res.json({ msg: 'Stock removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
