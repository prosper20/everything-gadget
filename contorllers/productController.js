const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const Problem = require('../utils/problem');
const factory = require('./handlerFactory');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SEC,
});

const uploadFromBuffer = (file) =>
  new Promise((resolve, reject) => {
    const cldUploadStream = cloudinary.uploader.upload_stream(
      /*{
        folder: "foo"
      },*/
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(cldUploadStream);
  });

/*const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/products');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `product-${req.params.id}-${Date.now()}.${ext}`);
  },
});*/
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Problem('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.stageImages = upload.fields([{ name: 'images', maxCount: 5 }]);

exports.uploadProductImages = catchAsync(async (req, res, next) => {
  if (!req.files.images) return next();

  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      let filename;
      if (req.method === 'POST') {
        filename = `product-${req.body.name.split(' ').join('-')}-${Date.now()}-${i + 1}.jpeg`;
      } else if (req.method === 'PUT') {
        const product = await Product.findById(req.params.id).select({ name: 1, _id: 0 });
        filename = `product-${product.name.split(' ').join('-')}-${Date.now()}-${i + 1}.jpeg`;
      }

      //const image = await cloudinary.uploader.upload(file.path);
      const result = await uploadFromBuffer(file);
      const secureUrl = result.secure_url;

      req.body.images.push({ filename, secureUrl });
    })
  );

  next();
});

exports.aliasFeatured = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-averageRating,price';
  req.query.priceDiscount = { gte: 25 };
  req.query.fields = 'name,price,averageRating,summary,';
  next();
};
//factory functions to avoid repeating  similar code on all resources
exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product, { path: 'reviews' });
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

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
