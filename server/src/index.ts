import {
  Application
} from 'express';
import {
  Server
} from 'http';

const express: any = require('express');

const app: Application = express();
const server: Server = app.listen(process.env.PORT || 3000, () => {
  const information: any = server.address();
  if (information.address && information.port) {
    console.log(`Server Started at http://${information.address}:${information.port}`)
  } else {
    console.log(`WARN: Server Started at unknown location!`);
  }
});

app.use(express.static('client/build'));

const io = require('socket.io')(server);

let roomCounter: number = 0; // TODO recycle
const roomMatcher: RegExp = new RegExp(/^[0-9]{1,19}$/);
const TARGET_ROOM_SIZE: number = 2;

io.sockets.on('connection', (socket: SocketIO.Socket) => {
  console.log(`${socket.id} is connected`);

  let room: string = joinRoom(socket);
  socket.emit('established');

  socket.on('move', (message) => {
    io.to(room).emit('player-move', message);
  });

  socket.on('destroyed', (message) => {
    io.to(room).emit('player-destroyed', message);
  });

  socket.on('disconnect', () => {
    console.log(room + ' had a lost connection');
    io.to(room).emit('connection-lost');
    console.log(`${socket.id} was disconnected`);
  });
});

function getRoomList(): any {
  let allRooms = io.sockets.adapter.rooms;
  let keys = Object.keys(allRooms).filter(key => key.match(roomMatcher));
  let rooms: any = {};
  for (let i: number = 0; i < keys.length; i++) {
    rooms[keys[i]] = allRooms[keys[i]];
  }
  return rooms;
}

function roomToJoin(): string | null {
  let roomList = getRoomList();
  let keys: string[] = Object.keys(roomList);
  for (let i: number = 0; i < keys.length; i++) {
    if (roomList[keys[i]].length < TARGET_ROOM_SIZE) {
      return keys[i];
    }
  }
  return null;
}

function joinRoom(socket: SocketIO.Socket): string {
  let room: string | null = roomToJoin();
  if (room === null) {
    room = roomCounter.toString();
    roomCounter++;
  }
  socket.join(room);
  checkRoomSize(room);
  return room;
}

function checkRoomSize(room: string): void {
  if (io.sockets.adapter.rooms[room].length === TARGET_ROOM_SIZE) {
    let socketsInRoom = Object.keys(io.sockets.adapter.rooms[room].sockets);
    for (let i: number = 0; i < socketsInRoom.length; i++) {
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
