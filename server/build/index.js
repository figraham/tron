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
var roomMatcher = new RegExp(/^.{1,19}$/);
io.sockets.on('connection', function (socket) {
    console.log(socket.id + " is connected");
    socket.emit('established', { id: socket.id });
    socket.on('disconnect', function () {
        console.log(socket.id + " was disconnected");
    });
});
function getRoomList() {
    var allRooms = io.sockets.adapter.rooms;
    var keys = Object.keys(allRooms).filter(function (key) { return key.match(roomMatcher); });
    var rooms = {};
    for (var i = 0; i < keys.length; i++) {
        rooms[keys[i]] = allRooms[keys[i]];
    }
    return rooms;
}
//# sourceMappingURL=index.js.map