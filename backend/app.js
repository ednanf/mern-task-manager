// Imports
const express = require('express');
const app = express();
const {xss} = require('express-xss-sanitizer');
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const dbConnect = require('./utils/dbConnect');
const authRouter = require('./routes/auth');
const tasksRouter = require('./routes/tasks');
const authentication = require('./middleware/authentication');
const routeNotFound = require('./middleware/routeNotFound');
const errorHandler = require('./middleware/errorHandler');

// Constants
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// TODO: add frontend URL to this list
const allowedOrigins = [
    'http://localhost:5173',
    'https://localhost:5173',
    'https://mern-task-manager-eight.vercel.app',
    'https://taskmanager.frizzera.dev/'
];

// Middleware
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 100,
    }),
);
app.use(xss());
app.use(helmet());
app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(cookieParser());
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
        app.listen(PORT, () => console.log(`[system] listening on port ${PORT}...`));
    } catch (error) {
        console.error('[ERROR] something went wrong... ');
        console.error(`[ERROR] ${error.message} `);
    }
};

start();
