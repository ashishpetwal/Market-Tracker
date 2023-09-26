const cheerio = require('cheerio');

function extractStockData(html,ticker) {
    const $ = cheerio.load(html);
    const stockPrice = $(`fin-streamer[data-symbol=${ticker}]`).attr('value');
    return { stockPrice };
}

module.exports = extractStockData;