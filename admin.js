const AdminJS = require('adminjs');
const AdminJSMongoose = require('@adminjs/mongoose');

const User = require('./models/userModel');
const Product = require('./models/productModel');
const Blog = require('./models/blogModel');

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const adminOptions = {
  resources: [
    User,
    {
      resource: Blog,
      options: {
        properties: {
          content: {
            type: 'richtext',
          },
        },
      },
    },
    Product,
  ],
};

async function adminAuth(email, password) {
  const user = await User.findOne({ email }).select('+password');

  if ((await user.correctPassword(password, user.password)) && user.role === 'admin') {
    return {
      email: user.email,
      password: user.password,
    };
  }
  return null;
}

module.exports = { AdminJS, adminAuth, adminOptions };
