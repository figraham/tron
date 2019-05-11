import {
  CommandTracker,
  OutputTerminal,
  Command
} from "terminaltxt";
import { CommandArguments } from "terminaltxt/dist/input/CommandArguments";

let id = function(out: OutputTerminal, args: CommandArguments[]): void {
  out.writeln(`Connection ID: ${this.id}`);
}

let mkroom = function(out: OutputTerminal, args: CommandArguments[]): void {
  let validArgs: boolean = false;
  let argIndexes: number[];
  if (args.length > 0) {
    argIndexes = CommandTracker.indexOfCommandArguments(['name'], args);
    validArgs = argIndexes[0] !== -1;
  }
  if (!validArgs) {
    out.writeln('Please specify room name. Example \'mkroom --name RoomName\'');
    return;
  }
  out.writeln(`Making room \'${args[argIndexes[0]].parameters[0]}\' ...`);
  this.emit('mkroom', {
    id: this.id,
    roomName: args[argIndexes[0]].parameters[0],
  });
}

let mkroomHandleReply = function(message) {
  if (message.created) {
    this.writeln(`Room was created.`);
  } else {
    this.writeln('Invalid room name, please specify a name not in use and between 1 and 19 characters long.');
  }
}

let lsrooms = function(out: OutputTerminal, args: CommandArguments[]): void {
  this.emit('lsrooms', {});
}

let lsroomsHandleReply = function(message) {
  console.log(message);
  let keys = Object.keys(message);
  for (let i: number = 0; i < keys.length; i++) {
    this.writeln(`${keys[i]} with ${message[keys[i]].length} user(s)`);
  }
}

export function userCommands(out: OutputTerminal, socket: SocketIOClient.Socket): CommandTracker {

  // binding
  id = id.bind(socket);
  mkroom = mkroom.bind(socket);
  lsrooms = lsrooms.bind(socket);

  mkroomHandleReply = mkroomHandleReply.bind(out);
  lsroomsHandleReply = lsroomsHandleReply.bind(out);

  // add listeners to socket
  socket.on('mkroom-reply', mkroomHandleReply);
  socket.on('lsrooms-reply', lsroomsHandleReply);

  // commands
  const commands: CommandTracker = new CommandTracker(out);

  commands.registerCommand(
    {
      name: 'id',
      description: 'Show Connection ID.',
      command: id
    } as Command
  );

  commands.registerCommand(
    {
      name: 'mkroom',
      description: 'Make a new room and join it.',
      command: mkroom
    } as Command
  );

  commands.registerCommand(
    {
      name: 'lsrooms',
      description: 'List rooms available on server.',
      command: lsrooms
    } as Command
  );

  return commands;
}