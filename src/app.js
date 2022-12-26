const express = require('express');
const path = require('path');
require('./db/mongoose');
const userRouter = require('./routers/user');
const bugRouter = require('./routers/bug');

// express boilerplate

const app = express();

// path to output
const publicDirectoryPath = path.join(__dirname, '../public');

// app setup
app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(userRouter);
app.use(bugRouter);

module.exports = app;
