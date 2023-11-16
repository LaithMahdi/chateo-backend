const express = require('express');
const { signin, signup, logout } = require('../controller/userController');
const userRouter = express.Router();

userRouter.post('/signup',signup);

userRouter.post('/signin',signin);
userRouter.post('/logout',logout);

module.exports = userRouter;