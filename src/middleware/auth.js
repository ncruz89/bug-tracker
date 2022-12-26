const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 *
 * authorization function that compares decoded activeUser token with user.token in database using json web tokens
 * if auth req goes well - proceeds middleware with next() to return to function that called the auth function
 */

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
