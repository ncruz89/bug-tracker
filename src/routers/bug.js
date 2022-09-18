const express = require('express');
const Bug = require('../models/bug');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('', auth, async (req, res) => {
  const bug = new Bug({
    ...req.body.bug,
    owner: req.user._id,
  });
  try {
    await bug.save();
    res.status(201).send(bug);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/bugs', async (req, res) => {
  try {
    const bugs = await Bug.find();
    res.send(bugs);
  } catch (err) {
    res.status(500).send();
  }
});

router.delete('/bugs/:id', auth, async (req, res) => {
  try {
    const bug = await Bug.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!bug)
      return res
        .status(400)
        .send({ error: 'Sorry... only the bug creator can delete this bug.' });
    res.send(bug);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch('/bugs/:id', auth, async (req, res) => {
  try {
    const bug = await Bug.findById({
      _id: req.params.id,
    });
    if (!(req.user.username === bug.assignTo)) {
      return res.status(400).send({
        error: 'Sorry...only the user assigned to the bug can close it.',
      });
    }
    const updatedBug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(updatedBug);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
