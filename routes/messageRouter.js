const express = require('express');
const messageRouter = express.Router();

messageRouter.get('/', (req, res)=>{
    res.send('Message get request');
});

messageRouter.post('/', (req, res)=>{
    res.send('Message post request');
});

module.exports = userRouter;