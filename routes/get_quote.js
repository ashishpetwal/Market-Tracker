const express = require('express');
const router = express.Router();
const fetchStockData = require('../lib/fetch_data');

router.get('/stock-api', async (req, res) => {
  const ticker = req.query.ticker;
  const stockData = await fetchStockData(ticker);
  if (stockData) {
    res.json(stockData);
  } else {
    res.status(500).json({ error: 'Error fetching stock data' });
  }
})

module.exports = router;