const mongoose = require('mongoose');
const {MONGO_URI} = require('./config/keys');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URI);
}

module.exports = main;