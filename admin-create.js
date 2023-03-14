const readline = require('readline');
const { promisify } = require('util');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');

dotenv.config();

// Use readline module to prompt user for input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a promisified version of rl.question for easier use
const question = promisify(rl.question).bind(rl);

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    dbname: process.env.MONGO_DB,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to DB');

    // Prompt user for superuser details
    question('Enter superuser name: ')
      .then((name) =>
        question('Enter superuser email: ').then((email) =>
          question('Enter superuser password: ').then((password) =>
            question('Enter superuser phone number: ').then((phoneNumber) => {
              // Hash password using bcrypt module
              // Create superuser in DB
              User.create({
                name,
                email,
                password: password,
                phoneNumber,
                role: 'admin',
                active: true,
              })
                .then(() => {
                  console.log('Superuser created successfully');
                  rl.close();
                })
                .catch((err) => {
                  console.error('Error creating superuser:', err.message);
                  rl.close();
                });
            })
          )
        )
      )
      .catch((err) => console.error('Error getting superuser details:', err.message));
  })
  .catch((err) => console.error('Error connecting to DB:', err.message));
