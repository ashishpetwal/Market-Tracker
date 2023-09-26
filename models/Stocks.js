const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    ticker: String,
    price: Number,
    quantity: Number,
})

const Stocks = mongoose.model('Stocks', stockSchema);

module.exports = Stocks;