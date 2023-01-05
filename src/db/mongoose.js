const mongoose = require('mongoose');

// connect mongoose with mongoDB database
mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
  },
  (error, client) => {
    if (error) return console.log('unable to connect to database!');

    console.log('connected');
  }
);
