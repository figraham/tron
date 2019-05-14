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
var roomCounter = 0; // TODO recycle
var roomMatcher = new RegExp(/^[0-9]{1,19}$/);
var TARGET_ROOM_SIZE = 2;
io.sockets.on('connection', function (socket) {
    console.log(socket.id + " is connected");
    var room = joinRoom(socket);
    socket.emit('established');
    socket.on('move', function (message) {
        io.to(room).emit('player-move', message);
    });
    socket.on('destroyed', function (message) {
        io.to(room).emit('player-destroyed', message);
    });
    socket.on('disconnect', function () {
        console.log(room + ' had a lost connection');
        io.to(room).emit('connection-lost');
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
function roomToJoin() {
    var roomList = getRoomList();
    var keys = Object.keys(roomList);
    for (var i = 0; i < keys.length; i++) {
        if (roomList[keys[i]].length < TARGET_ROOM_SIZE) {
            return keys[i];
        }
    }
    return null;
}
function joinRoom(socket) {
    var room = roomToJoin();
    if (room === null) {
        room = roomCounter.toString();
        roomCounter++;
    }
    socket.join(room);
    checkRoomSize(room);
    return room;
}
function checkRoomSize(room) {
    if (io.sockets.adapter.rooms[room].length === TARGET_ROOM_SIZE) {
        var socketsInRoom = Object.keys(io.sockets.adapter.rooms[room].sockets);
        for (var i = 0; i < socketsInRoom.length; i++) {
            io.sockets.connected[socketsInRoom[i]].emit('room-ready', {
                socketIDs: socketsInRoom,
                idInRoom: i,
                gameStartTime: Date.now() + 10000,
            });
        }
        console.log(room + ' is full');
        console.log(io.sockets.adapter.rooms[room]);
    }
}
//# sourceMappingURL=index.js.map