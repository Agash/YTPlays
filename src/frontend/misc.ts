import { useAppDispatch } from "./hooks/storeHooks";
import { setConfig } from "./slices/configSlice";
import {
  commandExecuted,
  eligibleUsersUpdated,
  monarchChanged,
} from "./slices/handlerSlice";
import { updateCommandStats, updateUserStats } from "./slices/queueSlice";

function initializeStore() {
  const dispatch = useAppDispatch();

  window.queueAPI.onUpdateCommandStats((stats) => {
    dispatch(updateCommandStats(stats));
  });
  window.queueAPI.onUpdateUserStats((stats) => {
    dispatch(updateUserStats(stats));
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
    dispatch(setConfig(config));
  });
  window.mainAPI.getConfig();
}

export { initializeStore };
