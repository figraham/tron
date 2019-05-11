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

io.sockets.on('connection', (socket: SocketIO.Socket) => {
  console.log(`${socket.id} is connected`);
  socket.emit('established', {id: socket.id});

  socket.on('mkroom', (message) => {
    console.log(message);
    socket.join(message.roomName);
    io.to(message.roomName).emit('room-created', {created: true});
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} was disconnected`);
  });
});