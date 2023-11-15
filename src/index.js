const express = require('express');
const mongose = require('mongoose');
const userRouter = require('../routes/userRouter');
const app = express();

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