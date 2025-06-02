// Imports
require('@dotenvx/dotenvx').config();
const express = require('express');
const app = express();

const dbConnect = require('./utils/dbConnect');
const authRouter = require('./routes/auth');
const tasksRouter = require('./routes/tasks');
const authentication = require('./middleware/authentication');
const routeNotFound = require('./middleware/routeNotFound');
const errorHandler = require('./middleware/errorHandler');

// Constants
PORT = process.env.PORT;
MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());

// Routers
app.use('/api/v1/tasks', authentication, tasksRouter);
app.use('/api/v1/auth', authRouter);

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
