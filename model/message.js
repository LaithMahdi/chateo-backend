const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    dateTime: { type: Date, default: Date.now },
    content: String,
});

const messageModel = mongoose.model('Message', messageSchema);

module.exports = messageModel;
