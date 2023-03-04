const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const catchAsync = require('../utils/catchAsync');
const Problem = require('../utils/problem');
const User = require('../models/userModel');

const requireAuth = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    return next(new Problem('You are not logged in! Please log in to get access.', 401));
  }

  const { id, iat } = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //Check if user still exists
  const currentUser = await User.findOne({ _id: id });
  if (!currentUser) {
    return next(new Problem('The user belonging to this token no longer exist.', 401));
  }

  //Check if user changed password after the token was issued (iat)
  if (currentUser.changedPasswordAfter(iat)) {
    return next(new Problem('User recently changed password! Please log in again.', 401));
  }

  req.user = currentUser;
  next();
  /*catch (error) {
    res.status(401).json({ error: 'Request is not authorized' });
  }*/
});

module.exports = requireAuth;
