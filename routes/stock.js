const express = require('express');
const Stocks = require('../models/Stocks');
const fetchUser = require('../middleware/fetchuser');
const router = express.Router();

router.post('/addnew', fetchUser, async (req, res) => {
    const {ticker, price, quantity} = req.body;
    let success = false;
    try {

        const stock = await Stocks.findOne({ticker: ticker.toUpperCase()+".NS"});

        if(stock){
            return res.status(400).json({success, error:"Stock Already Added"});
        }

        stocks = await Stocks.create({
            user: req.user.id,
            ticker: ticker.toUpperCase()+".NS",
            price: price,
            quantity: quantity
        })
        success = true;
        res.status(200).json({success,stocks});
    } catch (error) {
        return res.status(500).json({success,msg:"Internal Server Error"});
    }
})

router.get('/fetchstocks', fetchUser, async (req,res)=>{
    const user = req.user.id;
    try {
        const stocks = await Stocks.find({user:user})
        res.status(200).json(stocks);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
})

module.exports = router;