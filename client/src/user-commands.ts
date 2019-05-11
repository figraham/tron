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
  let counter: number = 0;
  this.on('room-created', (message) => {
    out.writeln(`\'${args[argIndexes[0]].parameters[0]}\' was created.`);
    counter = -1;
  });
  this.emit('mkroom', {
    id: this.id,
    roomName: args[argIndexes[0]].parameters[0],
  });
}

export function userCommands(out: OutputTerminal, socket: SocketIOClient.Socket): CommandTracker {

  // binding
  id = id.bind(socket);
  mkroom = mkroom.bind(socket);

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

  return commands;
}