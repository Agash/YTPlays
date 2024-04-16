import { keyTap, setKeyboardDelay, typeString } from "robotjs";
import { buttonMapping } from "../../shared/constants";
import { app } from "electron";

setKeyboardDelay(500);

const isValidCommand = (message: string) => {
  const validCommands = buttonMapping.map((m) => m.input);
  return validCommands.includes(message);
};

const tapKey = (key: string) => {
  const mapping = buttonMapping.find((x) => x.input == key);

  if (!mapping) {
    console.warn("[YTPlays] Trying to press unmapped button: ", key);
    return;
  }

  console.log("[YTPlays] TAPPING KEY: ", mapping.button);
  if (app.isPackaged) keyTap(mapping.button);

  // keyTap(mapping.button);
};

const typeName = (pkmnName: string) => {
  console.log("[YTPlays] WRITING NAME: ", pkmnName);
  if (app.isPackaged) typeString(pkmnName);
  // typeString(pkmnName);
};

const getRandomChatInput = (): string => {
  const randomIndex = Math.floor(Math.random() * buttonMapping.length);
  const randomButton = buttonMapping[randomIndex];
  return randomButton.input;
};

export { buttonMapping, isValidCommand, tapKey, typeName, getRandomChatInput };
