import { Kbd } from "@nextui-org/react";
import { buttonMapping, pokeRogueButtonMapping } from "../../shared/constants";

type ButtonForInputProps = {
  input: string;
};

const ButtonForInput = (props: ButtonForInputProps) => {
  const commands = props.input?.split(" ");
  return (
    <>
      {commands?.map((command, idx) => {
        const mapping =
          buttonMapping.find((x) => x.input == command) ??
          pokeRogueButtonMapping.find((x) => x.input == command);

        if (!mapping) return <Kbd></Kbd>;
        return <Kbd keys={mapping.display.key}>{mapping.display.str}</Kbd>
      })}
    </>
  )

};

export { ButtonForInput };
