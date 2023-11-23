const express = require('express');
const mongose = require('mongoose');
const userRouter = require('../routes/userRouter');
const bodyParser = require("body-parser");
const http = require('http');
const messageModel = require('../model/message');


const app = express();

const port=5000;
const server = http.createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.send('Welcome');
});

app.use(express.json());

app.use('/users',userRouter);

app.use('/upload/images', express.static('upload/images'));

mongose.connect("mongodb://127.0.0.1:27017/chatBD")
.then(()=>{
    server.listen(port,()=>{
        console.log(`listening on port ${port}`);
    })
}).catch((err)=>{
    console.error(err);
});


// io.on("connection",(client)=>{
//   console.log("user connected "+client.id);
//   client.on("message",(data)=>{
//     io.to(client.id).emit('res',data);
//     //io.emit('res',data);
//     console.log("message : "+data);
//   });
// })

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('message', async (data) => {
      const message = new messageModel({
          senderId: data.senderId,
          receiverId: data.receiverId,
          content: data.content,
      });

      try {
          const savedMessage = await message.save();
          console.log('Message saved to the database:', savedMessage);
          io.to(socket.id).emit('res', savedMessage);
      } catch (error) {
          console.error('Error saving message to the database:', error);
      }
  });
});

