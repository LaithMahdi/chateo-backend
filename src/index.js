const express = require('express');
const mongose = require('mongoose');
const userRouter = require('../routes/userRouter');
const app = express();
const bodyParser = require("body-parser");
const http = require('http');
const multer= require('multer');
const path = require('path');
const { Server } = require('socket.io');
const socketController = require('../controller/socketController');
app.use(bodyParser.json());
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome');
});

app.use(express.json());

app.use('/users',userRouter);
//app.use('/message',messageRouter);


const port=5000;
mongose.connect("mongodb://127.0.0.1:27017/chatBD")
.then(()=>{
    app.listen(port,()=>{
        console.log(`listening on port ${port}`);
    })
}).catch((err)=>{
    console.error(err);
});


// Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

socketController(io);