import { app } from "electron";
import { keyTap, setKeyboardDelay, typeString } from "robotjs";
import { buttonMapping, pokeRogueButtonMapping } from "../../shared/constants";
import pkmnNames from "./pkmn.json";
import { ButtonPreset } from "../../shared/types";

setKeyboardDelay(500);

const isValidCommand = (
  message: string,
  buttonPreset: ButtonPreset = "normal"
) => {
  const mappings =
    buttonPreset == "pokerogue" ? pokeRogueButtonMapping : buttonMapping;
  const validCommands = mappings.map((m) => m.input);
  return validCommands.includes(message);
};

const isValidPkmnName = (message: string) => {
  return pkmnNames.includes(message);
};

const tapKey = (key: string, buttonPreset: ButtonPreset = "normal") => {
  const mappings =
    buttonPreset == "pokerogue" ? pokeRogueButtonMapping : buttonMapping;

  const mapping = mappings.find((x) => x.input == key);

  if (!mapping) {
    console.warn("[YTPlays] Trying to press unmapped button: ", key);
    return;
  }

  if (app.isPackaged) keyTap(mapping.button);
};

const typeName = (pkmnName: string) => {
  if (app.isPackaged) typeString(pkmnName);

  // typeString(pkmnName);
};

const getRandomChatInput = (buttonPreset: ButtonPreset = "normal"): string => {
  const mappings =
    buttonPreset == "pokerogue" ? pokeRogueButtonMapping : buttonMapping;

  const randomIndex = Math.floor(Math.random() * mappings.length);
  const randomButton = mappings[randomIndex];
  return randomButton.input;
};

const getRandomPkmnName = (): string => {
  const randomIndex = Math.floor(Math.random() * pkmnNames.length);
  const randomName = pkmnNames[randomIndex];
  return randomName;
};

export {
  isValidCommand,
  isValidPkmnName,
  tapKey,
  typeName,
  getRandomChatInput,
  getRandomPkmnName,
};
