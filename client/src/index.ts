import {
  Loop,
  InputTracker,
  GraphicsTerminal,
  TerminalConfig,
  CharacterSet,
  Vector2,
  CommandTracker,
  OutputTerminal
} from 'terminaltxt';
import io from 'socket.io-client';
import { LightCycle } from './LightCycle';
import { userControls } from './user-controls';
import { userCommands } from './user-commands';

const LOOP: Loop = new Loop(init, update);
const WIDTH = 100;
const HEIGHT = 50;
let socket: SocketIOClient.Socket;

let commands: CommandTracker;
let commandOut: OutputTerminal;

let input: InputTracker;
let cycle: LightCycle;
let term: GraphicsTerminal;

function init(): void {
  socket = io.connect('http://localhost:3000');
  socket.on('established', setupConnectionPanel);
  LOOP.running(false);
}

function setupConnectionPanel(message) {
  commandOut = new OutputTerminal();
  commandOut.write(`Connection ID: ${message.id}`);
  commandOut.writeln('Type \'help\' for more info');
  commands = userCommands(commandOut, socket);
}

function setupGame(): void {
  term = new GraphicsTerminal(
    {
      width: WIDTH,
      height: HEIGHT,
    } as TerminalConfig,
    new CharacterSet(' 0─│┌┐└┘╴╵╶╷')
  );
  cycle = new LightCycle(new Vector2(WIDTH / 2, HEIGHT / 2));
  input = userControls(cycle);
  LOOP.frameRate(10);
  LOOP.running(true);
}

function update(): void {
  cycle.checkBoundaries(0, 0, WIDTH, HEIGHT);
  cycle.render(term);
  console.log(cycle.position);
}