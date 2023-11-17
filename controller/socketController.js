const messageModel = require('../model/message');

module.exports = (io) => {
    const clients = {};

    io.on("connection", (socket) => {
        socket.on("login", (id) => {
            console.log("sender ID: " + id);
            clients[id] = socket;
            // Update user's socketId in the database
            userModel.findByIdAndUpdate(id, { socketId: socket.id }, (err, user) => {
                if (err) {
                    console.error(err);
                }
            });
        });

        socket.on("msg", async (msg) => {
            console.log(msg);

            const { senderId, receiverId, content } = msg;

            // Save the message to the database
            const newMessage = await messageModel.create({
                senderId,
                receiverId,
                content,
            });

            // Emit the message to the receiver
            if (clients[receiverId]) {
                clients[receiverId].emit("msg", newMessage);
            }
        });
    });
};
