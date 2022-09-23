const express = require('express');
const Bug = require('../models/bug');
const auth = require('../middleware/auth');
const router = new express.Router();

// posts new bug to database. sends bug back backt to client if successful
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

// gets all bugs from database. sends all bugs back to client
router.get('/bugs', async (req, res) => {
  try {
    const bugs = await Bug.find();
    res.send(bugs);
  } catch (err) {
    res.status(500).send();
  }
});

// deletes bug if owner ID of bug matches id of user who requests delete. sends back deleted bug data.
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

// router to change status of bug to 'closed'. Checks to see if assign to value of bug matches user requesting change.
// if so returns updated bug to client.
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
