const express = require('express');

const userController = require('../contorllers/userController');
const authController = require('../contorllers/authController');

const auth = require('../middleware/auth');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch('/update/password', auth, authController.updatePassword);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.route('/').get(userController.getAllUsers).post(userController.createUser);

router.get('/saved/products/', auth, userController.getSavedProducts);

router
  .route('/saved/products/:id')
  .patch(auth, userController.addSavedProducts)
  .delete(auth, userController.removeSavedProducts);

router
  .route('/profile')
  .get(auth, userController.getUserProfile)
  .patch(auth, userController.patchUserProfle)
  .delete(auth, userController.setUserId, userController.deleteUserProfle);

router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
