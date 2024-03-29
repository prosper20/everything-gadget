const User = require('../models/userModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const Problem = require('../utils/problem');
const factory = require('./handlerFactory');

const filterObj = (obj) => {
  const newObj = obj;
  const excludedFields = ['role', 'password', 'passwordConfirm', 'passwordChangedAt', 'savedProducts'];
  excludedFields.forEach((el) => delete newObj[el]);

  return newObj;
};

exports.getUserProfile = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id.toString() });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.patchUserProfle = catchAsync(async (req, res, next) => {
  //Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new Problem('This route is not for password updates. Please use /update/password', 400));
  }

  //Filtered out unwanted fields eg updating user role to admin
  const filteredBody = filterObj(req.body);

  const user = await User.findOneAndUpdate({ _id: req.user._id.toString() }, filteredBody, {
    new: true,
    runValidators: true,
  });

  //await user.save();
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.setUserId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteUserProfle = factory.deleteOne(User);

/*catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
}); */

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
  const savedProdIds = user.savedProducts.map((el) => el.id);

  if (!savedProdIds.includes(product._id.toString())) {
    user.savedProducts.push(product._id);
    user.save({ validateBeforeSave: false });
  }
  //const { savedProducts } = await User.findById(req.user._id).select('savedProducts');

  res.status(200).json({
    status: 'success',
    message: 'product succesfully added',
    data: {
      savedProducts: user.savedProducts,
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
  user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'product succesfully removed',
    data: {
      savedproducts: user.savedProducts,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
