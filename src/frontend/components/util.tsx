import { Kbd } from "@nextui-org/react";
import { buttonMapping, pokeRogueButtonMapping } from "../../shared/constants";

type ButtonForInputProps = {
  input: string;
};

const ButtonForInput = (props: ButtonForInputProps) => {
  const mapping =
    buttonMapping.find((x) => x.input == props.input) ??
    pokeRogueButtonMapping.find((x) => x.input == props.input);
  if (!mapping) return <Kbd></Kbd>;
  return <Kbd keys={mapping.display.key}>{mapping.display.str}</Kbd>;
};

export { ButtonForInput };
