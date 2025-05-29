require('@dotenvx/dotenvx').config();
const express = require('express');
const app = express();

PORT = process.env.PORT;
MONGO_URI = process.env.MONGO_URI;

const start = (MONGO_URI) => {
  try {
    app.listen(PORT, () =>
      console.log(`[system] listening on localhost:${PORT}...`),
    );
  } catch (error) {
    console.error('[ERROR] something went wrong... ');
    console.error(`[ERROR] ${error.message} `);
  }
};

start();
