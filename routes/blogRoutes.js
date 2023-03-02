const express = require('express');
const blogController = require('../contorllers/blogController');
const auth = require('../middleware/auth');
const admin = require('../middleware/adminPerm');

const router = express.Router();

router.get('/', blogController.getBlogs);
router.post('/', auth, admin, blogController.addBlog);

router.get('/:id', blogController.getBlog);
router.patch('/:id', auth, admin, blogController.updateBlog);

router.delete('/:id', auth, admin, blogController.deleteBlog);

module.exports = router;
