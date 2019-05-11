import {
  Loop,
  InputTracker,
  GraphicsTerminal,
  TerminalConfig,
  CharacterSet,
  Vector2
} from 'terminaltxt';
import io from 'socket.io-client';
import { LightCycle } from './LightCycle';
import { userControls } from './user-controls';

const loop: Loop = new Loop(init, update);
let input: InputTracker;
let socket: SocketIOClient.Socket;

let cycle: LightCycle;

let term: GraphicsTerminal;

const WIDTH = 100;
const HEIGHT = 50;

function init(): void {
  socket = io.connect('http://localhost:3000');
  term = new GraphicsTerminal(
    {
      width: WIDTH,
      height: HEIGHT,
    } as TerminalConfig,
    new CharacterSet(' 0─│┌┐└┘╴╵╶╷')
  );
  cycle = new LightCycle(new Vector2(WIDTH / 2, HEIGHT / 2));
  input = userControls(cycle);
  loop.frameRate(10);
}

function update(): void {
  cycle.checkBoundaries(0, 0, WIDTH, HEIGHT);
  cycle.render(term);
  console.log(cycle.path[cycle.path.length -1]);
}