const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
//const createError = require('http-errors');
//const morgan = require('morgan');

const AdminJSExpress = require('@adminjs/express');

const { ADMIN, AdminJS, adminOptions } = require('./admin');

const Problem = require('./utils/problem');
const errorHandler = require('./contorllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');
const blogRouter = require('./routes/blogRoutes');

dotenv.config();

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  //app.use(morgan('dev'));
}

async function startApp() {
  await mongoose.connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    dbname: 'everydb',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Database connection successful');

  const admin = new AdminJS(adminOptions);
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email, password) => {
      if (ADMIN.password === password && ADMIN.email === email) {
        return ADMIN;
      }
      return null;
    },
    cookiePassword: 'somasd1nda0asssjsdhb21uy3g',
    maxRetries: {
      count: 3,
      duration: 120,
    },
  });

  // Admin router has to be called first
  app.use(admin.options.rootPath, adminRouter);

  // Set security HTTP headers
  app.use(helmet());

  // Limit requests from same API
  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  });
  app.use('/api', limiter);

  app.use(express.json({ limit: '20kb' }));
  app.use(express.urlencoded({ extended: true }));

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // Data sanitization against XSS
  app.use(xss());

  // Prevent parameter pollution
  app.use(
    hpp({
      whitelist: ['reviewsQuantity', 'averageRating', 'price'],
    })
  );

  // 3) ROUTES
  app.use('/api/v1/products', productRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/orders', orderRouter);
  app.use('/api/v1/blogs', blogRouter);

  app.get('*', (req, res, next) => {
    //throw createError(404, 'PAGE NOT FOUND');
    next(new Problem(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  //error handler
  app.use(errorHandler);
}

startApp();

module.exports = app;
