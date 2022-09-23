const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

// login users after checking if username and password match. returns user object and current auth token
router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.user.username,
      req.body.user.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

// attempts to create new user based off of user object sent from client
// creates auth token for new user and returns user object and auth token to client
router.post('/user', async (req, res) => {
  try {
    const user = new User(req.body.user);

    await user.save();

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

// attempts to logout user. finds and deletes matches auth token. saves updated user object and returns
router.post('/user/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send('Logout Successful');
  } catch (err) {
    res.status(500).send(err);
  }
});

// attempts to find all users created in database. returns users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
