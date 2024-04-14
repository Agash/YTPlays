import { useAppDispatch } from "./hooks/storeHooks";
import {
  loadConfig,
  setDemocracyCountdown,
  setMode,
  setMonarchyCooldown,
  setNormalInterval,
  setVideoId,
} from "./slices/configSlice";
import {
  commandExecuted,
  eligibleUsersUpdated,
  monarchChanged,
} from "./slices/handlerSlice";
import { updateStats } from "./slices/queueSlice";

async function initializeStore() {
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

  window.mainAPI.onVideoIdSet((id) => {
    dispatch(setVideoId(id));
  });

  window.mainAPI.onModeSet((mode) => {
    dispatch(setMode(mode));
  });

  window.mainAPI.onDemocracyCountdownSet((value) => {
    dispatch(setDemocracyCountdown(value));
  });

  window.mainAPI.onMonarchyCooldownSet((value) => {
    dispatch(setMonarchyCooldown(value));
  });

  window.mainAPI.onNormalIntervalSet((value) => {
    dispatch(setNormalInterval(value));
  });

  const initialConfig = await window.mainAPI.requestInitialData();
  dispatch(loadConfig(initialConfig));
}

export { initializeStore };
