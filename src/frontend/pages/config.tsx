import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/storeHooks";
import { Mode } from "../../shared/types";
import { FormikErrors, useFormik } from "formik";
import { useEffect } from "react";

const ConfigPage = () => {
  const navigate = useNavigate();
  const config = useAppSelector((state) => state.config);
  const form = useFormik({
    initialValues: {
      videoId: config.videoId,
      mode: config.mode,
      democracyCountdown: config.democracyCountdown,
      monarchyCooldown: config.monarchyCooldown,
      normalInterval: config.normalInterval,
    },
    validate: (values) => {
      const errors: FormikErrors<typeof values> = {};
      if (!values.videoId) errors.videoId = "Required";
      if (!values.mode) errors.mode = "Required";
      if (!values.democracyCountdown) errors.democracyCountdown = "Required";
      if (!values.monarchyCooldown) errors.monarchyCooldown = "Required";
      if (!values.normalInterval) errors.normalInterval = "Required";

      return errors;
    },
    onSubmit: (values, { setSubmitting }) => {
      setConfig(values);
      setSubmitting(false);
      startAndForward();
    },
  });

  const setConfig = ({
    videoId,
    mode,
    democracyCountdown,
    monarchyCooldown,
    normalInterval,
  }: {
    videoId: string;
    mode: Mode;
    democracyCountdown: number;
    monarchyCooldown: number;
    normalInterval: number;
  }) => {
    window.mainAPI.setVideoId(videoId);
    window.mainAPI.setMode(mode);
    window.mainAPI.setDemocracyCountdown(democracyCountdown);
    window.mainAPI.setMonarchyCooldown(monarchyCooldown);
    window.mainAPI.setNormalInterval(normalInterval);
  };

  useEffect(() => {
    form.setValues(config);
  }, [config]);

  const startAndForward = () => {
    window.mainAPI.startRun();
    navigate("/run");
  };

  return (
    <form className="max-w-sm mx-auto" onSubmit={form.handleSubmit}>
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
        <input
          type="text"
          name="videoId"
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          value={form.values.videoId}
          className={
            form.errors.videoId && form.touched.videoId
              ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
              : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          }
        />
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
        {form.errors.mode && form.touched.mode && <div>{form.errors.mode}</div>}
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
          Democracy Countdown (in Milliseconds)
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
          <div>{form.errors.democracyCountdown}</div>
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
          Monarchy Cooldown (in Milliseconds)
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
          <div>{form.errors.monarchyCooldown}</div>
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
          Normal Interval (in Milliseconds)
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
          <div>{form.errors.normalInterval}</div>
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
