// Imports
require('@dotenvx/dotenvx').config();
const express = require('express');
const app = express();

const dbConnect = require('./utils/dbConnect');
const tasksRouter = require('./routes/tasks');
const routeNotFound = require('./middleware/routeNotFound');
const errorHandler = require('./middleware/errorHandler');

// Constants
PORT = process.env.PORT;
MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());

// Routers
app.use('/api/v1/tasks', tasksRouter);

// Error handling
app.use(routeNotFound);
app.use(errorHandler);

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
