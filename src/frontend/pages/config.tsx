import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/storeHooks";
import { Mode } from "../../shared/types";

const ConfigPage = () => {
  const navigate = useNavigate();
  const config = useAppSelector((state) => state.config);

  const startAndForward = () => {
    window.mainAPI.startRun();
    navigate("/run");
  };

  const videoIdChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    window.mainAPI.setVideoId(event.target.value);
  };

  const modeChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    window.mainAPI.setMode(event.target.value as Mode);
  };

  const democracyCountdownChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    window.mainAPI.setDemocracyCountdown(parseInt(event.target.value));
  };

  const monarchyCooldownChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    window.mainAPI.setMonarchyCooldown(parseInt(event.target.value));
  };

  const normalIntervalChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    window.mainAPI.setNormalInterval(parseInt(event.target.value));
  };

  // w-[340px] h-[240px] px-8
  return (
    <div className="flex flex-col gap-4 py-4 px-4">
      <h1>Pre-Flight Check (Config)</h1>
      <div className="px-3">
        <label
          htmlFor="videoId"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Video ID
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-600 sm:max-w-md">
            <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
              https://youtube.com/watch?v=
            </span>
            <input
              type="text"
              name="videoId"
              id="videoId"
              value={config.videoId}
              onChange={videoIdChanged}
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="kIOuXi5PtGg"
            />
          </div>
        </div>
      </div>
      <div className="mt-10 space-y-10 px-3">
        <fieldset>
          <legend className="text-sm font-semibold leading-6 text-gray-900">
            Mode
          </legend>
          <div className="flex flex-col mt-6 space-y-6 gap-2">
            <div className="flex items-center gap-3">
              <input
                id="democracy"
                value="democracy"
                checked={config.mode == "democracy"}
                onChange={modeChanged}
                name="mode"
                type="radio"
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="democracy"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Democracy: Votes will be collected for a set amount of time and
                the highest voted command will be executed.
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="monarchy"
                value="monarchy"
                checked={config.mode == "monarchy"}
                onChange={modeChanged}
                name="mode"
                type="radio"
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="monarchy"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Monarchy: A randomly chosen (active) user will have control for
                a set amount of time.
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="anarchy"
                value="anarchy"
                checked={config.mode == "anarchy"}
                onChange={modeChanged}
                name="mode"
                type="radio"
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="anarchy"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Anarchy: Chaos, more or less first come first serve (in
                batches).
              </label>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="px-3">
        <label
          htmlFor="democracyCountdown"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Democracy Vote Timer (for how many Milliseconds the votes will be
          collected)
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-600 sm:max-w-md">
            <input
              type="number"
              name="democracyCountdown"
              value={config.democracyCountdown}
              onChange={democracyCountdownChanged}
              id="democracyCountdown"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="5000"
            />
          </div>
        </div>
      </div>
      <div className="px-3">
        <label
          htmlFor="monarchyCooldown"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Monarchy Cooldown (for how many Milliseconds will one be King; mind
          the delay)
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-600 sm:max-w-md">
            <input
              type="number"
              name="monarchyCooldown"
              value={config.monarchyCooldown}
              onChange={monarchyCooldownChanged}
              id="monarchyCooldown"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="15000"
            />
          </div>
        </div>
      </div>
      <div className="px-3">
        <label
          htmlFor="normalInterval"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Polling Interval (when commands will be evaluated in Milliseconds,
          relevant for Anarchy and Monarchy modes)
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-600 sm:max-w-md">
            <input
              type="number"
              name="normalInterval"
              value={config.normalInterval}
              onChange={normalIntervalChanged}
              id="normalInterval"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="500"
            />
          </div>
        </div>
      </div>
      <div className="px-3 flex-grow">
        <Button onClick={startAndForward}>Take Off</Button>
      </div>
    </div>
  );
};

export default ConfigPage;
