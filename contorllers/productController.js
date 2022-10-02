const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasFeatured = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-averageRating,price';
  req.query.priceDiscount = { gte: 25 };
  req.query.fields = 'name,price,averageRating,summary,';
  next();
};

exports.getAllProducts = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const features = new APIFeatures(Product.findById(req.params.id), req.query).limitFields();
    const product = await features.query;
    //const product = await Product.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        product: newProduct,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductStats = async (req, res, next) => {
  let rating = 0;
  //if a value was supplied for averageRating in the query
  if (req.query.averageRating) {
    rating = req.query.averageRating * 1;
  }
  try {
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
  } catch (err) {
    next(err);
  }
};
