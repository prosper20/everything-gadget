const express = require('express');
const productController = require('../contorllers/productController');

const router = express.Router();
const validateId = require('../utils/validateId');

router.param('id', validateId);

router.route('/featured').get(productController.aliasFeatured, productController.getAllProducts);
router.route('/product-stats').get(productController.getProductStats);

router.route('/').get(productController.getAllProducts).post(productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
