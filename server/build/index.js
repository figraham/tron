var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000, function () {
    var information = server.address();
    if (information.address && information.port) {
        console.log("Server Started at http://" + information.address + ":" + information.port);
    }
    else {
        console.log("WARN: Server Started at unknown location!");
    }
});
app.use(express.static('client/build'));
var io = require('socket.io')(server);
io.sockets.on('connection', function (socket) {
    console.log(socket.id + " is connected");
    socket.emit('established', { id: socket.id });
    socket.on('mkroom', function (message) {
        console.log(message);
        socket.join(message.roomName);
        io.to(message.roomName).emit('room-created', { created: true });
    });
    socket.on('disconnect', function () {
        console.log(socket.id + " was disconnected");
    });
});
//# sourceMappingURL=index.js.map