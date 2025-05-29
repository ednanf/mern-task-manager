// Imports
require('@dotenvx/dotenvx').config();
const express = require('express');
const app = express();

const dbConnect = require('./utils/dbConnect');

// Constants
PORT = process.env.PORT;
MONGO_URI = process.env.MONGO_URI;

// Server start
const start = async (uri) => {
  try {
    await dbConnect(MONGO_URI);
    app.listen(PORT, () =>
      console.log(`[system] listening on localhost:${PORT}...`),
    );
  } catch (error) {
    console.error('[ERROR] something went wrong... ');
    console.error(`[ERROR] ${error.message} `);
  }
};

start();
