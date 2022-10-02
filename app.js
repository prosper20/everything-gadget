const express = require('express');
const createError = require('http-errors');
//const morgan = require('morgan');

const productRouter = require('./routes/productRoutes');
//const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  //app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3) ROUTES
app.use('/api/v1/products', productRouter);
//app.use('/api/v1/users', userRouter);

app.get('*', (req, res) => {
  throw createError(404, 'PAGE NOT FOUND');
});

//error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
      path: err.path,
    },
  });
});

module.exports = app;
