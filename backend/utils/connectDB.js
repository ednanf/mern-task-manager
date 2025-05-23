const mongoose = require('mongoose');

const connectDB = async (uri) => {
  await mongoose
    .connect(uri)
    .then(() => console.log('[system] Connected to MongoDB Atlas...'));
};

module.exports = connectDB;
