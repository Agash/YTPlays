import {
  Kbd,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { ButtonForInput } from "./util";
import { useAppSelector } from "../hooks/storeHooks";

const truncateString = (string: string, maxLength = 50) =>
  string?.length > maxLength ? `${string.substring(0, maxLength)}…` : string;

const DemocracyOverlay = () => {
  const commandStats =
    useAppSelector((state) => state.queue.commandStats) || new Map();
  const sortedCommandStats = [...commandStats]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const lastExecutedCommand = useAppSelector(
    (state) => state.handler.lastExecutedMessage
  );

  const timeFrame = useAppSelector((state) => state.config.democracyCountdown);
  const timeFrameInSec = timeFrame / 1000;

  return (
    <div className="flex flex-col space-y-4">
      <h1>Democracy Mode</h1>
      <small>
        Command with most users within a set time frame (
        <b>
          current timeframe:&nbsp;
          <span className="text-blue-300">{timeFrameInSec}</span> sec.
        </b>
        ) will be executed.
      </small>
      <div className="flex flex-row justify-between">
        <b>Last Executed: </b>
        <span>
          <ButtonForInput input={lastExecutedCommand?.message} />
        </span>
      </div>
      <small>Current Votes</small>
      <Table isCompact aria-label="Command statistics">
        <TableHeader>
          <TableColumn key="command">Command</TableColumn>
          <TableColumn key="amount">Votes</TableColumn>
        </TableHeader>
        <TableBody>
          {sortedCommandStats.map((s, idx) => (
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
  const commandStats =
    useAppSelector((state) => state.queue.commandStats) || new Map();
  const sortedCommandStats = [...commandStats]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const currentMonarch = useAppSelector(
    (state) => state.handler.currentMonarch
  );

  const eligibleUsers = useAppSelector((state) => state.handler.eligibleUsers);
  const eligibleUsersLimited =
    eligibleUsers.length > 7
      ? [
          ...[...eligibleUsers].slice(
            eligibleUsers.length - 6,
            eligibleUsers.length
          ),
          "...",
        ]
      : [...eligibleUsers];

  const monarchThreshold = useAppSelector(
    (state) => state.config.monarchyThreshold
  );

  const timeFrame = useAppSelector((state) => state.config.monarchyCooldown);
  const timeFrameInSec = timeFrame / 1000;

  const lastExecutedCommand = useAppSelector(
    (state) => state.handler.lastExecutedMessage
  );

  return (
    <div className="flex flex-col space-y-4">
      <h1>Monarchy Mode</h1>
      <small>
        A ruler will be selected and within a set timeframe (
        <b>
          current timeframe:&nbsp;
          <span className="text-blue-300">{timeFrameInSec}</span> sec.
        </b>
        ) all commands of said ruler will be executed. The next ruler will be
        selected out of all active users still typing valid commands (
        <b>
          current threshold:{" "}
          <span className="text-blue-300">{monarchThreshold}</span> valid
          commands
        </b>
        ), since the selection of the last ruler.
      </small>
      <div className="flex flex-row justify-between">
        <b>Current Monarch:</b>
        <h2>{truncateString(currentMonarch, 30)}</h2>
      </div>
      <div className="flex flex-row justify-between">
        <b>Last Executed: </b>
        <span>
          {truncateString(lastExecutedCommand?.username, 20)} pressed&nbsp;
          <ButtonForInput input={lastExecutedCommand?.message} />
        </span>
      </div>
      <small>Current eligible users & Overall Command Statistics</small>
      <div className="flex flex-row">
        <Table isCompact aria-label="List of currently eligible users">
          <TableHeader>
            <TableColumn key="users">Currently Eligible Users</TableColumn>
          </TableHeader>
          <TableBody>
            {eligibleUsersLimited?.map((user, idx) => (
              <TableRow key={idx}>
                <TableCell>{truncateString(user, 30)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        &nbsp;
        <Table aria-label="Command statistics">
          <TableHeader>
            <TableColumn key="command">Command</TableColumn>
            <TableColumn key="amount">Amount</TableColumn>
          </TableHeader>
          <TableBody>
            {sortedCommandStats.map((s, idx) => (
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
    </div>
  );
};

const AnarchyOverlay = () => {
  const commandStats =
    useAppSelector((state) => state.queue.commandStats) || new Map();
  const sortedCommandStats = [...commandStats]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const userStats =
    useAppSelector((state) => state.queue.userStats) || new Map();
  const sortedUserStats = [...userStats]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const lastExecutedCommand = useAppSelector(
    (state) => state.handler.lastExecutedMessage
  );

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
      <small>Overall Command/User Statistics</small>
      <div className="flex flex-row">
        <Table aria-label="Command statistics">
          <TableHeader>
            <TableColumn key="command">Command</TableColumn>
            <TableColumn key="amount">Amount</TableColumn>
          </TableHeader>
          <TableBody>
            {sortedCommandStats.map((s, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <ButtonForInput input={s[0]} />
                </TableCell>
                <TableCell>{s[1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        &nbsp;
        <Table aria-label="User statistics">
          <TableHeader>
            <TableColumn key="user">User</TableColumn>
            <TableColumn key="amount">Amount</TableColumn>
          </TableHeader>
          <TableBody>
            {sortedUserStats.map((s, idx) => (
              <TableRow key={idx}>
                <TableCell>{truncateString(s[0], 20)}</TableCell>
                <TableCell>{s[1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const NamesOverlay = () => {
  const commandStats =
    useAppSelector((state) => state.queue.commandStats) || new Map();
  const sortedCommandStats = [...commandStats]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const userStats =
    useAppSelector((state) => state.queue.userStats) || new Map();
  const sortedUserStats = [...userStats]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const lastNameWritten = useAppSelector(
    (state) => state.handler.lastExecutedMessage
  );

  return (
    <div className="flex flex-col space-y-4">
      <h1>Pokemon Names</h1>
      <small>How fast can chat type all pokemon names</small>
      <div className="flex flex-row justify-between">
        <b>Last Executed: </b>
        <span>
          {lastNameWritten?.username}:&nbsp;
          <Kbd>{lastNameWritten?.message}</Kbd>
        </span>
      </div>
      <small>Overall Pokemon/User Statistics</small>
      <div className="flex flex-row">
        <Table aria-label="Command statistics">
          <TableHeader>
            <TableColumn key="name">Pokemon</TableColumn>
            <TableColumn key="amount">Amount</TableColumn>
          </TableHeader>
          <TableBody>
            {sortedCommandStats.map((s, idx) => (
              <TableRow key={idx}>
                <TableCell>{s[0]}</TableCell>
                <TableCell>{s[1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        &nbsp;
        <Table aria-label="User statistics">
          <TableHeader>
            <TableColumn key="user">User</TableColumn>
            <TableColumn key="amount">Amount</TableColumn>
          </TableHeader>
          <TableBody>
            {sortedUserStats.map((s, idx) => (
              <TableRow key={idx}>
                <TableCell>{truncateString(s[0], 20)}</TableCell>
                <TableCell>{s[1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export { DemocracyOverlay, MonarchyOverlay, AnarchyOverlay, NamesOverlay };
