const connectToMongo = require('./db');

connectToMongo();

const express = require('express');
const get_quote = require('./routes/get_quote'); 
const auth = require('./routes/auth'); 
const stock = require('./routes/stock');
const cors = require('cors');

const app = express();

app.use(cors())
app.use(express.json());

app.use('/api',get_quote);
app.use('/api',stock);
app.use(auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});