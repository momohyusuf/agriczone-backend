const mongoose = require('mongoose');

const connectToDB = async (connectString) => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(connectString);
};

module.exports = connectToDB;
