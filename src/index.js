const express = require('express');
const mongose = require('mongoose');
const userRouter = require('../routes/userRouter');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const multer = require('multer');
app.get('/', (req, res) => {
    res.send('Welcome');
});

app.use(express.json());
let filename = "";
const mystorage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, redirect) => {
    let date = Date.now();
    let f1 = date + "." + file.mimetype.split("/")[1];
    redirect(null, f1);
    filename = f1;
  },
});
app.use('/users',userRouter);
app.use("/uploads", express.static(__dirname + "/uploads"));// Body parsing middleware
app.use(express.urlencoded({ extended: true })); // Body parsing middleware
app.use(multer({ storage: mystorage }).single('avatar')); 
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