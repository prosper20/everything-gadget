const express = require('express');
const productController = require('../contorllers/productController');
//const auth = require('../middleware/auth');

const router = express.Router();

router.route('/featured').get(productController.aliasFeatured, productController.getAllProducts);
router.route('/product-stats').get(productController.getProductStats);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.stageImages, productController.uploadProductImages, productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  //.patch(productController.stageImages, productController.uploadProductImages, productController.updateProduct)
  .delete(productController.deleteProduct);

router
  .route('/:id')
  .put(productController.stageImages, productController.uploadProductImages, productController.updateProduct);

module.exports = router;
