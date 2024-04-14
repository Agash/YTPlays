import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { ButtonForInput } from "./util";
import { useAppSelector } from "../hooks/storeHooks";

const DemocracyOverlay = () => {
  const stats = useAppSelector((state) => state.queue.stats) || new Map();
  const lastExecutedCommand = useAppSelector(
    (state) => state.handler.lastExecutedMessage
  );

  const sorted = [...stats].sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="flex flex-col space-y-4">
      <h1>Democracy Mode</h1>
      <small>
        Command with most users within a set time frame will be executed.
      </small>
      <div className="flex flex-row justify-between">
        <b>Last Executed: </b>
        <span>
          <ButtonForInput input={lastExecutedCommand?.message} />
        </span>
      </div>
      <Table aria-label="Sorted list of commands with votes">
        <TableHeader>
          <TableColumn key="command">Command</TableColumn>
          <TableColumn key="votes">Votes</TableColumn>
        </TableHeader>
        <TableBody>
          {sorted.map((s, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <ButtonForInput input={s[0]} />
              </TableCell>
              <TableCell>{s[1]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const MonarchyOverlay = () => {
  const lastExecutedCommand = useAppSelector(
    (state) => state.handler.lastExecutedMessage
  );

  const currentMonarch = useAppSelector(
    (state) => state.handler.currentMonarch
  );

  const eligibleUsers = useAppSelector((state) => state.handler.eligibleUsers);

  return (
    <div className="flex flex-col space-y-4">
      <h1>Monarchy Mode</h1>
      <small>
        A ruler will be selected and within a set time all commands of said
        ruler will be executed. The next ruler will be selected of all active
        users still typing commands, since the selection of the last ruler.
      </small>
      <div className="flex flex-row justify-between">
        <b>Current Monarch:</b>
        <h2>{currentMonarch}</h2>
      </div>
      <div className="flex flex-row justify-between">
        <b>Last Executed: </b>
        <span>
          {lastExecutedCommand?.username} pressed&nbsp;
          <ButtonForInput input={lastExecutedCommand?.message} />
        </span>
      </div>
      <Table aria-label="List of currently eligible users">
        <TableHeader>
          <TableColumn key="users">Currently eligible users</TableColumn>
        </TableHeader>
        <TableBody>
          {eligibleUsers?.map((user, idx) => (
            <TableRow key={idx}>
              <TableCell>{user}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const AnarchyOverlay = () => {
  const stats = useAppSelector((state) => state.queue.stats) || new Map();
  const lastExecutedCommand = useAppSelector(
    (state) => state.handler.lastExecutedMessage
  );

  const queue = [...stats].slice(stats.size - 5, stats.size);

  return (
    <div className="flex flex-col space-y-4">
      <h1>Anarchy Mode</h1>
      <small>
        Let there be chaos. First come first serve, but randomly chosen on
        timing. Stats are only to see that having the majority doesn&apos;t mean
        anything anymore.
      </small>
      <div className="flex flex-row justify-between">
        <b>Last Executed: </b>
        <span>
          {lastExecutedCommand?.username} pressed&nbsp;
          <ButtonForInput input={lastExecutedCommand?.message} />
        </span>
      </div>
      <small>Current batch:</small>
      <Table aria-label="Current batch and the count of commands">
        <TableHeader>
          <TableColumn key="command">Command</TableColumn>
          <TableColumn key="Amount">Amount</TableColumn>
        </TableHeader>
        <TableBody>
          {queue.map((s, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <ButtonForInput input={s[0]} />
              </TableCell>
              <TableCell>{s[1]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export { DemocracyOverlay, MonarchyOverlay, AnarchyOverlay };
