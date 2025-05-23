require('@dotenvx/dotenvx').config();
const express = require('express');
const app = express();

const connectDB = require('./utils/connectDB');
const tasksRoutes = require('./routes/tasks');

const PORT = 8000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

app.use('/api/v1/tasks', tasksRoutes);

const serverStart = async () => {
  try {
    connectDB(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`[system] Server listening on localhost:${PORT}...`);
    });
  } catch (error) {
    console.error(error.message);
  }
};

serverStart();
