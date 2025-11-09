const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});