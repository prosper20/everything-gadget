const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const Problem = require('../utils/problem');

exports.setProductUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
//exports.updateReview = factory.updateOne(Review);
//exports.deleteReview = factory.deleteOne(Review);

exports.deleteReview = catchAsync(async (req, res, next) => {
  const doc = await Review.findById(req.params.id);

  if (!doc) {
    return next(new Problem('No document found with that ID', 404));
  }

  const { product } = doc;

  await Review.deleteOne({ _id: req.params.id });
  await Review.calcAverageRatings(product);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  let doc = await Review.findById(req.params.id);

  if (!doc) {
    return next(new Problem('No document found with that ID', 404));
  }
  const { product } = doc;
  doc = await Review.updateOne({ _id: req.params.id }, req.body);
  await Review.calcAverageRatings(product);

  res.status(200).json({
    status: 'success',
    message: 'Review updated successfully!',
  });
});
