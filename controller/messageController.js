const messageModel = require("../model/message");

const getMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        console.log('Sender ID:', senderId);
        console.log('Receiver ID:', receiverId);

        const messages = await messageModel.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        })
        .sort({ createdAt: -1 }); 

        console.log('Query Result:', messages);

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const getHistory = async (req, res) => {
  try {
      const { userId } = req.params;

      // Fetch the user
      const user = await userModel.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Fetch messages where the user is the sender or receiver
      const messages = await messageModel.find({
          $or: [
              { senderId: userId },
              { receiverId: userId },
          ],
      }).sort({ createdAt: 1 });

      // Separate messages into sent and received
      const sentMessages = messages.filter(message => message.senderId.toString() === userId);
      const receivedMessages = messages.filter(message => message.receiverId.toString() === userId);

      // Group messages by receiver and get the latest message for each
      const history = [];
      const receivers = new Set(receivedMessages.map(message => message.senderId.toString()));
      for (const receiverId of receivers) {
          const receiver = await userModel.findById(receiverId).select('username');
          const receiverMessages = receivedMessages.filter(message => message.senderId.toString() === receiverId);
          const latestMessage = receiverMessages[receiverMessages.length - 1];

          history.push({
              receiver: receiver.username,
              latestMessage: latestMessage ? latestMessage.content : '',
              latestMessageDate: latestMessage ? latestMessage.createdAt : null,
          });
      }

      res.json(history);
  } catch (error) {
      console.error('Error fetching message history:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getMessages,getHistory };
