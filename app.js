const express = require('express');
//const createError = require('http-errors');
//const morgan = require('morgan');

const Problem = require('./utils/problem');
const errorHandler = require('./contorllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  //app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3) ROUTES
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

app.get('*', (req, res, next) => {
  //throw createError(404, 'PAGE NOT FOUND');
  next(new Problem(`Can't find ${req.originalUrl} on this server!`, 404));
});

//error handler
app.use(errorHandler);

module.exports = app;
