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

const roomMatcher: RegExp = new RegExp(/^.{1,19}$/);

io.sockets.on('connection', (socket: SocketIO.Socket) => {
  console.log(`${socket.id} is connected`);
  socket.emit('established', {id: socket.id});

  socket.on('mkroom', (message) => {
    let created = false;
    if (message.roomName.match(roomMatcher) && Object.keys(getRoomList()).indexOf(message.roomName) === -1) {
      socket.join(message.roomName);
      created = true;
    }
    io.to(message.roomName).emit('mkroom-reply', {created: created});
  });

  socket.on('lsrooms', (message) => {
    socket.emit('lsrooms-reply', getRoomList());
  });

  socket.on('disconnect', () => {
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
