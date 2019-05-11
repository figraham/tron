import {
  CommandTracker,
  OutputTerminal,
  Command
} from "terminaltxt";
import { CommandArguments } from "terminaltxt/dist/input/CommandArguments";

let id = function(out: OutputTerminal, args: CommandArguments[]) {
  out.writeln(`Connection ID: ${this.id}`);
}

export function userCommands(out: OutputTerminal, socket: SocketIOClient.Socket): CommandTracker {

  // binding
  id = id.bind(socket);

  // commands
  const commands: CommandTracker = new CommandTracker(out);

  commands.registerCommand(
    {
      name: 'id',
      description: 'Show Connection ID.',
      command: id
    } as Command
  );

  return commands;
}