import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/storeHooks";
import { Mode } from "../../shared/types";
import { FormikErrors, useFormik } from "formik";
import { useEffect } from "react";
import { ConfigState } from "../slices/configSlice";

const ConfigPage = () => {
  const navigate = useNavigate();
  const config = useAppSelector((state) => state.config);
  const form = useFormik({
    enableReinitialize: true,
    initialValues: config,
    validate: (values) => {
      const errors: FormikErrors<typeof values> = {};
      if (!values.videoId) errors.videoId = "Required";
      if (!values.mode) errors.mode = "Required";
      if (!values.democracyCountdown) errors.democracyCountdown = "Required";
      if (!values.monarchyCooldown) errors.monarchyCooldown = "Required";
      if (!values.monarchyThreshold) errors.monarchyThreshold = "Required";
      if (!values.normalInterval) errors.normalInterval = "Required";

      return errors;
    },
    onSubmit: (values, { setSubmitting }) => {
      setConfig(values);
      setSubmitting(false);
      startAndForward();
    },
  });

  const setConfig = (config: {
    videoId: string;
    mode: Mode;
    democracyCountdown: number;
    monarchyCooldown: number;
    monarchyThreshold: number;
    normalInterval: number;
  }) => {
    window.mainAPI.setConfig(config);
  };

  // useEffect(() => {
  //   console.log("setup listener for config");

  //   const removeEventListener = window.mainAPI.onConfig((data: ConfigState) => {
  //     console.log("received config", data);
  //     form.setValues(data);
  //   });

  //   console.log("requesting config");
  //   window.mainAPI.getConfig();

  //   return () => {
  //     removeEventListener();
  //   };
  // }, []);

  const startAndForward = () => {
    window.mainAPI.startRun();
    navigate("/run");
  };

  return (
    <form className="max-w-sm mx-auto" onSubmit={form.handleSubmit}>
      <h1 className="my-5">Pre-flight Check</h1>
      <div className="mb-5">
        <label
          htmlFor="videoId"
          className={
            "block mb-2 text-sm font-medium" +
            (form.errors.videoId && form.touched.videoId
              ? "text-red-700 dark:text-red-500"
              : "text-gray-900 dark:text-white")
          }
        >
          YouTube Video ID
        </label>

        <div className="flex">
          <span
            className={
              form.errors.videoId && form.touched.videoId
                ? "inline-flex items-center px-3 text-sm text-red-900 bg-gray-200 border border-e-0 border-red-500 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-red-500"
                : "inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
            }
          >
            youtube.com/v/
          </span>
          <input
            type="text"
            name="videoId"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.videoId}
            placeholder="lMmToBb2nKg"
            className={
              form.errors.videoId && form.touched.videoId
                ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-none rounded-e-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-700 dark:border-red-500"
                : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-none rounded-e-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            }
          />
        </div>

        {form.errors.videoId && form.touched.videoId && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-500">
            {form.errors.videoId}
          </div>
        )}
      </div>

      <div className="mb-5">
        <label
          htmlFor="mode"
          className={
            "block mb-2 text-sm font-medium" +
            (form.errors.mode && form.touched.mode
              ? "text-red-700 dark:text-red-500"
              : "text-gray-900 dark:text-white")
          }
        >
          Mode
        </label>
        <select
          name="mode"
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          value={form.values.mode}
          className={
            form.errors.mode && form.touched.mode
              ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
              : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          }
        >
          <option value="democracy">Democracy</option>
          <option value="monarchy">Monarchy</option>
          <option value="anarchy">Anarchy</option>
          <option value="names">Names</option>
        </select>
        {form.errors.mode && form.touched.mode && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-500">
            {form.errors.mode}
          </div>
        )}
      </div>

      <div className="mb-5">
        <label
          htmlFor="democracyCountdown"
          className={
            "block mb-2 text-sm font-medium" +
            (form.errors.democracyCountdown && form.touched.democracyCountdown
              ? "text-red-700 dark:text-red-500"
              : "text-gray-900 dark:text-white")
          }
        >
          Democracy Countdown&nbsp;
          <small>(in Milliseconds)</small>
        </label>
        <input
          type="number"
          name="democracyCountdown"
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          value={form.values.democracyCountdown}
          className={
            form.errors.democracyCountdown && form.touched.democracyCountdown
              ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
              : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          }
        />
        {form.errors.democracyCountdown && form.touched.democracyCountdown && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-500">
            {form.errors.democracyCountdown}
          </div>
        )}
      </div>

      <div className="mb-5">
        <label
          htmlFor="monarchyCooldown"
          className={
            "block mb-2 text-sm font-medium" +
            (form.errors.monarchyCooldown && form.touched.monarchyCooldown
              ? "text-red-700 dark:text-red-500"
              : "text-gray-900 dark:text-white")
          }
        >
          Monarchy Cooldown&nbsp;
          <small>(in Milliseconds)</small>
        </label>
        <input
          type="number"
          name="monarchyCooldown"
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          value={form.values.monarchyCooldown}
          className={
            form.errors.monarchyCooldown && form.touched.monarchyCooldown
              ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
              : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          }
        />
        {form.errors.monarchyCooldown && form.touched.monarchyCooldown && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-500">
            {form.errors.monarchyCooldown}
          </div>
        )}
      </div>

      <div className="mb-5">
        <label
          htmlFor="monarchyThreshold"
          className={
            "block mb-2 text-sm font-medium" +
            (form.errors.monarchyThreshold && form.touched.monarchyThreshold
              ? "text-red-700 dark:text-red-500"
              : "text-gray-900 dark:text-white")
          }
        >
          Monarchy Threshold&nbsp;
          <small>
            (# of messages needed for eligible users since last Monarch)
          </small>
        </label>
        <input
          type="number"
          name="monarchyThreshold"
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          value={form.values.monarchyThreshold}
          className={
            form.errors.monarchyThreshold && form.touched.monarchyThreshold
              ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
              : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          }
        />
        {form.errors.monarchyThreshold && form.touched.monarchyThreshold && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-500">
            {form.errors.monarchyThreshold}
          </div>
        )}
      </div>

      <div className="mb-5">
        <label
          htmlFor="normalInterval"
          className={
            "block mb-2 text-sm font-medium" +
            (form.errors.normalInterval && form.touched.normalInterval
              ? "text-red-700 dark:text-red-500"
              : "text-gray-900 dark:text-white")
          }
        >
          Normal Interval&nbsp;
          <small>(in Milliseconds)</small>
        </label>
        <input
          type="number"
          name="normalInterval"
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          value={form.values.normalInterval}
          className={
            form.errors.normalInterval && form.touched.normalInterval
              ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
              : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          }
        />
        {form.errors.normalInterval && form.touched.normalInterval && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-500">
            {form.errors.normalInterval}
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={form.isSubmitting}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Take Off!
      </button>
    </form>
  );
};

export default ConfigPage;
