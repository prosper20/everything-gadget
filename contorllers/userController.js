const User = require('../models/userModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUserProfile = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id.toString() });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.patchUserProfle = catchAsync(async (req, res) => {
  const user = await User.findOneAndUpdate({ _id: req.user._id.toString() }, req.body, { new: true });
  await user.save();
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getSavedProducts = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id.toString() });
  res.status(200).json({
    status: 'success',
    data: {
      savedproducts: user.savedProducts,
    },
  });
});

exports.addSavedProducts = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id.toString() });
  const product = await Product.findOne({ _id: req.params.id });

  if (!product) {
    return res.status(400).json({ error: 'Product not found' });
  }

  user.savedProducts.push(product._id);
  user.save();

  res.status(200).json({
    status: 'success',
    message: 'product succesfully added',
    data: {
      savedproducts: user.savedProducts,
    },
  });
});

exports.removeSavedProducts = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id.toString() });
  const product = await Product.findOne({ _id: req.params.id });

  if (!product) {
    return res.status(400).json({ error: 'Product not found' });
  }

  user.savedProducts.pull(product._id);
  user.save();

  res.status(200).json({
    status: 'success',
    message: 'product succesfully removed',
    data: {
      savedproducts: user.savedProducts,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
