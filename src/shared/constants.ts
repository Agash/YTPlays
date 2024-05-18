import { KbdKey } from "@nextui-org/react";

type ButtonMapping = {
  button: string;
  display: {
    key?: KbdKey;
    str?: string;
  };
  input: string;
};

const buttonMapping: ButtonMapping[] = [
  {
    button: "a",
    display: {
      str: "A",
    },
    input: "a",
  },
  {
    button: "b",
    display: {
      str: "B",
    },
    input: "b",
  },
  {
    button: "x",
    display: {
      str: "X",
    },
    input: "x",
  },
  {
    button: "y",
    display: {
      str: "Y",
    },
    input: "y",
  },
  {
    button: "r",
    display: {
      str: "RS",
    },
    input: "r",
  },
  {
    button: "l",
    display: {
      str: "LS",
    },
    input: "l",
  },
  {
    button: "s",
    display: {
      str: "START",
    },
    input: "start",
  },
  {
    button: "q",
    display: {
      str: "SELECT",
    },
    input: "select",
  },
  {
    button: "up",
    display: {
      key: "up",
    },
    input: "up",
  },
  {
    button: "down",
    display: {
      key: "down",
    },
    input: "down",
  },
  {
    button: "left",
    display: {
      key: "left",
    },
    input: "left",
  },
  {
    button: "right",
    display: {
      key: "right",
    },
    input: "right",
  },
];

const pokeRogueButtonMapping: ButtonMapping[] = [
  {
    button: "z",
    display: {
      str: "Z",
    },
    input: "z",
  },
  {
    button: "x",
    display: {
      str: "X",
    },
    input: "x",
  },
  {
    button: "z",
    display: {
      str: "Z",
    },
    input: "a",
  },
  {
    button: "x",
    display: {
      str: "X",
    },
    input: "b",
  },
  {
    button: "up",
    display: {
      key: "up",
    },
    input: "up",
  },
  {
    button: "down",
    display: {
      key: "down",
    },
    input: "down",
  },
  {
    button: "left",
    display: {
      key: "left",
    },
    input: "left",
  },
  {
    button: "right",
    display: {
      key: "right",
    },
    input: "right",
  },
];

const modCommands = {
  setMode: "!setmode",
  setStreamDelay: "!setstreamdelay",
  setMonarch: "!setmonarch",
  setTimeout: "!settimeout",
  press: "!press",
};

export { ButtonMapping, buttonMapping, pokeRogueButtonMapping, modCommands };
