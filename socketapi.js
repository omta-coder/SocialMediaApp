const io = require( "socket.io" )();
const messageModel = require("./models/messageModel");
const UserCollection = require("./models/userModel");
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on("connection", function (socket) {
    console.log("A user connected")

    socket.on('join', async username => {
        await UserCollection.findOneAndUpdate({
            username
        }, {
            socketId: socket.id
        })
    })

    socket.on('sony', async messageObject => {

        const receiver = await UserCollection.findOne({
            username: messageObject.receiver
        })

        const socketId = receiver.socketId

        await messageModel.create({
            sender: messageObject.sender,
            receiver: messageObject.receiver,
            text: messageObject.message
        })

        socket.to(socketId).emit('max', messageObject)

    })

    socket.on('openChat', async userObject => {
        const { sender, receiver } = userObject
        const messages = await messageModel.find({
            $or: [
                {
                    sender: sender,
                    receiver: receiver
                },
                {
                    sender: receiver,
                    receiver: sender
                }
            ]
        })

        socket.emit('openChat', messages)

    })



});
// end of socket.io logic

/* 
socket - single user/browser
io- server
emit - send
on - receive
 */

module.exports = socketapi;