export const IPC = {
  MAIN: {
    CONFIG: "config",
    SET_CONFIG: "set-config",
    GET_CONFIG: "get-config",
    START: "start-run",
    STOP: "stop-run",
  },
  QUEUE: {
    COMMAND_STATISTICS: {
      UPDATE: "update-command-stats",
    },
    USER_STATISTICS: {
      UPDATE: "update-user-stats",
    },
  },
  HANDLER: {
    EXECUTED_COMMAND: "executed-command",
    DEMOCRACY: {},
    MONARCHY: {
      CHANGED_MONARCH: "changed-monarch",
      UPDATE_ELIGIBLE_USERS: "update-eligible-users",
    },
    ANARCHY: {},
  },
};
