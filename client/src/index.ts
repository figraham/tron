import {
  Loop,
  InputTracker
} from 'terminaltxt';
import io from 'socket.io-client';
import { LightCycle } from './LightCycle';
import { userControls } from './user-controls';

const loop: Loop = new Loop(init, update);
let input: InputTracker;
let socket: SocketIOClient.Socket;

let cycle: LightCycle;

function init(): void {
  socket = io.connect('http://localhost:3000');
  cycle = new LightCycle();
  input = userControls(cycle);
  loop.frameRate(10);
}

function update(): void {
  cycle.move();
  console.log(cycle.path[cycle.path.length -1]);
}