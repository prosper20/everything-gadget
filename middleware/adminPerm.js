const restrictToAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'fail',
      message: 'Access denied. You do not have permission to perform this action.',
    });
  }
  next();
};

module.exports = restrictToAdmin;
