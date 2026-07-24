const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Request parsing
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(compression());

// Logging
app.use(morgan('dev'));

// Routes
const authRouter = require('./routes/auth.routes');
const contentRouter = require('./routes/content.routes');
const trackRouter = require('./routes/track.routes');
const topicRouter = require('./routes/topic.routes');
const bookmarkRouter = require('./routes/bookmark.routes');

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/content', contentRouter);
app.use('/api/v1/tracks', trackRouter);
app.use('/api/v1/topics', topicRouter);
app.use('/api/v1/bookmarks', bookmarkRouter);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
