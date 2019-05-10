import { Loop } from 'terminaltxt';
import io from 'socket.io-client';

const loop: Loop = new Loop(init, update);
let socket: SocketIOClient.Socket;

function init(): void {
  socket = io.connect('http://localhost:3000');
}

function update(): void {

}