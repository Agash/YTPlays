import {
  Kbd,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { buttonMapping, pokeRogueButtonMapping } from "../../shared/constants";
import { useAppSelector } from "../hooks/storeHooks";

function KeyMappings() {
  const buttonPreset = useAppSelector((state) => state.config.buttonPreset);
  const mappings =
    buttonPreset == "pokerogue" ? pokeRogueButtonMapping : buttonMapping;

  return (
    <div className="flex flex-col space-y-4">
      <h2>Button mapping</h2>
      <Table isCompact aria-label="Current batch and the count of commands">
        <TableHeader>
          <TableColumn key="button">Button</TableColumn>
          <TableColumn key="input">Input</TableColumn>
        </TableHeader>
        <TableBody>
          {mappings.map((mapping, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Kbd keys={mapping.display.key}>
                  <small>{mapping.display.str}</small>
                </Kbd>
              </TableCell>
              <TableCell>{mapping.input}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function InfoBox() {
  return <KeyMappings />;
}
