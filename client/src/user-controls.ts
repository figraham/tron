import {
  InputTracker,
  KeyEventType,
  KeyAction
} from "terminaltxt";
import { LightCycle } from "./LightCycle";

export function userControls(cycle: LightCycle): InputTracker {

  const input: InputTracker = new InputTracker();

  input.addAction({
    keys: ['ArrowUp'],
    keyEventType: KeyEventType.KEYDOWN,
    action: cycle.goUp,
  } as KeyAction);

  input.addAction({
    keys: ['ArrowDown'],
    keyEventType: KeyEventType.KEYDOWN,
    action: cycle.goDown,
  } as KeyAction);

  input.addAction({
    keys: ['ArrowLeft'],
    keyEventType: KeyEventType.KEYDOWN,
    action: cycle.goLeft,
  } as KeyAction);

  input.addAction({
    keys: ['ArrowRight'],
    keyEventType: KeyEventType.KEYDOWN,
    action: cycle.goRight,
  } as KeyAction);

  return input;

}