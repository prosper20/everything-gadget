const Blog = require('../models/blogModel');
const catchAsync = require('../utils/catchAsync');

exports.addBlog = catchAsync(async (req, res) => {
  const blog = await Blog({ ...req.body, author: req.user });
  await blog.save();

  res.status(201).json({
    status: 'success',
    message: 'Successfully created blog',
    data: {
      blog,
    },
  });
});

exports.getBlogs = catchAsync(async (req, res) => {
  const blogs = await Blog.find();

  res.status(200).json({
    status: 'success',
    data: {
      blogs,
    },
  });
});

exports.getBlog = catchAsync(async (req, res) => {
  const blog = await Blog.findOne({ id: req.params.id });
  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res) => {
  const blog = await Blog.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
  await blog.save();
  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

exports.deleteBlog = catchAsync(async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id }, req.body);
  await blog.delete();
  res.status(200).json({
    status: 'success',
    message: 'Succesfully deleted blog',
  });
});
