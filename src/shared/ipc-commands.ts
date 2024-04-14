export const IPC = {
  MAIN: {
    REQUEST_INITIAL_DATA: "request-initial-data",
    VIDEO_ID_SET: "video-id-set",
    MODE_SET: "mode-set",
    DEMOCRACY_COUNTDOWN_SET: "democracy-countdown-set",
    MONARCHY_COOLDOWN_SET: "monarchy-cooldown-set",
    NORMAL_INTERVAL_SET: "normal-interval-set",
    SET_VIDEO_ID: "set-video-id",
    SET_MODE: "set-mode",
    SET_DEMOCRACY_COUNTDOWN: "set-democracy-countdown",
    SET_MONARCHY_COOLDOWN: "set-monarchy-cooldown",
    SET_NORMAL_INTERVAL: "set-normal-interval",
    START: "start-run",
    STOP: "stop-run",
  },
  QUEUE: {
    STATISTICS: {
      UPDATE: "update-stats",
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
