var express = require('express');
var socket = require('socket.io');

const { addUser, removeUser, getUser, getUsersInChannel } = require('./users');
const { addChannel, removeChannel, getChannel, getChannels } = require('./channels');

var app = express();

server = app.listen(4242, function(){
    console.log('server is running on port 4242')
});

io = socket(server);

io.on('connection', (socket) => {
    
    socket.on('join', ({ username, channel }, callback) => {

        const {error, user} = addUser({ id: socket.id, username, channel });
        addChannel({ channel });

        if(error) return (error);

        socket.emit('RECEIVE_MESSAGE', { username: 'Moobot', message: `Hi ${user.username}, welcome to the channel ${user.channel}`});
        socket.broadcast.to(user.channel).emit('RECEIVE_MESSAGE', { username: 'Moobot', message: `${user.username}, has joined the channel !`});
        
        socket.join(user.channel);

        io.to(user.channel).emit('userData', { channel: user.channel, users: getUsersInChannel(user.channel)});
        io.emit('channelData', { channels: getChannels() });
    });

    socket.on('SEND_MESSAGE', function(data) {
        const user = getUser(socket.id);
        
        io.to(user.channel).emit('RECEIVE_MESSAGE', data);
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        io.to(user.channel).emit('RECEIVE_MESSAGE', { username: 'Moobot', message: `${user.username}, has left the channel !`});
        io.to(user.channel).emit('userData', { channel: user.channel, users: getUsersInChannel(user.channel)});
        io.emit('channelData', { channels: getChannels() });
    })
});
