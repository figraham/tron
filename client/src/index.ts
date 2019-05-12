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

const LOOP: Loop = new Loop(init, update);
const WIDTH = 100;
const HEIGHT = 50;
let socket: SocketIOClient.Socket;

let input: InputTracker;
let cycle: LightCycle;
let cycle2: LightCycle;
let term: GraphicsTerminal;

function init(): void {
  socket = io.connect('http://localhost:3000');
  setupGame();
}

function setupGame(): void {
  term = new GraphicsTerminal(
    {
      width: WIDTH,
      height: HEIGHT,
    } as TerminalConfig,
    new CharacterSet(' 0─│┌┐└┘╴╵╶╷')
  );
  cycle = new LightCycle(new Vector2(WIDTH / 4, HEIGHT / 2));
  cycle2 = new LightCycle(new Vector2(3* WIDTH / 4, HEIGHT / 2));
  input = userControls(cycle, cycle2);
  LOOP.frameRate(10);
  LOOP.running(true);
}

function update(): void {
  cycle.checkBoundaries(0, 0, WIDTH, HEIGHT);
  cycle.render(term);
  cycle2.checkBoundaries(0, 0, WIDTH, HEIGHT);
  cycle2.render(term);
  console.log(cycle.position);
}