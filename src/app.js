const express = require('express');
const path = require('path');
require('./db/mongoose');
const userRouter = require('./routers/user');
const bugRouter = require('./routers/bug');

const app = express();

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(userRouter);
app.use(bugRouter);

module.exports = app;
