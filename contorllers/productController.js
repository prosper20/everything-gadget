const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.aliasFeatured = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-averageRating,price';
  req.query.priceDiscount = { gte: 25 };
  req.query.fields = 'name,price,averageRating,summary,';
  next();
};

exports.getAllProducts = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Product.find(), req.query).filter().search().sort().limitFields().paginate();
  const products = await features.query;

  //const products = await Product.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.findById(req.params.id), req.query).limitFields();
  const product = await features.query;
  //const product = await Product.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getProductStats = catchAsync(async (req, res, next) => {
  let rating = 0;
  //if a value was supplied for averageRating in the query
  if (req.query.averageRating) {
    rating = req.query.averageRating * 1;
  }

  const features = new APIFeatures(
    Product.aggregate([
      {
        $match: { averageRating: { $gte: rating } },
      },
      {
        $group: {
          _id: { $toUpper: '$brand' },
          numProducts: { $sum: 1 },
          numReviews: { $sum: '$reviewsQuantity' },
          avgRating: { $avg: '$averageRating' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]),
    req.query
  ).paginate();
  const products = await features.query;

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});
