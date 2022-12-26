const mongoose = require('mongoose');

// connect mongoose with mongoDB database
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
});
