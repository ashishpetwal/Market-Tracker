const extractStockData = require('./extract_data');

async function fetchStockData(ticker) {
    try {
        const response = await fetch(`https://finance.yahoo.com/quote/${ticker}`);
        const html = await response.text();
        // Process the HTML content to extract stock data
        const stockData = extractStockData(html,ticker);
        return stockData;
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return null;
    }
}

module.exports = fetchStockData;