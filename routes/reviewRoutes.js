const express = require('express');
const reviewController = require('../contorllers/reviewController');
const protect = require('../middleware/auth');
//const restrictTo = require('../middleware/adminPerm');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(/*restrictTo('user'),*/ reviewController.setProductUserIds, reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(/*restrictTo('user', 'admin'),*/ reviewController.updateReview)
  .delete(/*restrictTo('user', 'admin'),*/ reviewController.deleteReview);

module.exports = router;
