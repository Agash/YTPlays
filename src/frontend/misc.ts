import { useAppDispatch } from "./hooks/storeHooks";
import { setConfig } from "./slices/configSlice";
import {
  commandExecuted,
  eligibleUsersUpdated,
  monarchChanged,
} from "./slices/handlerSlice";
import { updateStats } from "./slices/queueSlice";

function initializeStore() {
  const dispatch = useAppDispatch();

  window.queueAPI.onUpdateStats((stats) => {
    dispatch(updateStats(stats));
  });

  window.handlerAPI.onExecutedCommand((chat) => {
    dispatch(commandExecuted(chat));
  });
  window.handlerAPI.onMonarchChanged((username) => {
    dispatch(monarchChanged(username));
  });
  window.handlerAPI.onEligibleUsersUpdated((usernames) => {
    dispatch(eligibleUsersUpdated(usernames));
  });
  window.mainAPI.onConfig((config) => {
    console.log("[YTPlays] Received message, setting config", config);
    dispatch(setConfig(config));
  });
  window.mainAPI.getConfig();
}

export { initializeStore };
