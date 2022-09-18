const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

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

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
