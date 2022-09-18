const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema(
  {
    desc: {
      type: String,
      required: true,
      minLength: 7,
    },
    priority: {
      type: String,
      required: true,
      default: 'Normal',
    },
    status: {
      type: String,
      required: true,
      default: 'Open',
    },
    assignTo: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId, // relationship set up with reference to User model in user.js
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Bug = mongoose.model('Bug', bugSchema);

module.exports = Bug;
