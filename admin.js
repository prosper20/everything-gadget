const AdminJS = require('adminjs');
const AdminJSMongoose = require('@adminjs/mongoose');

const User = require('./models/userModel');
const Product = require('./models/productModel');
const Blog = require('./models/blogModel');

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const ADMIN = {
  email: 'test@example.com',
  password: 'password',
};

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

module.exports = { ADMIN, AdminJS, adminOptions };
