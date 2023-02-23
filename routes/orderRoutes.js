const express = require('express');
const { checkout } = require('../contorllers/orderController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/checkout', checkout);

module.exports = router;
