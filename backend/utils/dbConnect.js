const mongoose = require('mongoose');

const dbConnect = async (uri) => {
  return await mongoose
    .connect(uri)
    .then(() => console.log('[system] connected to MongoDB...'));
};

module.exports = dbConnect;
