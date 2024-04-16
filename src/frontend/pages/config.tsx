import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/storeHooks";
import { Mode } from "../../shared/types";
import { Form, Formik, FormikErrors, useFormik } from "formik";

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

  const startAndForward = () => {
    window.mainAPI.startRun();
    navigate("/run");
  };

  return (
    <form className="flex flex-col" onSubmit={form.handleSubmit}>
      <label htmlFor="videoId">YouTube Video ID</label>
      <input
        type="text"
        name="videoId"
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        value={form.values.videoId}
      />
      {form.errors.videoId && form.touched.videoId && (
        <div>{form.errors.videoId}</div>
      )}

      <label htmlFor="mode">Mode</label>
      <select
        name="mode"
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        value={form.values.mode}
      >
        <option>Democracy</option>
        <option>Monarchy</option>
        <option>Anarchy</option>
      </select>
      {form.errors.mode && form.touched.mode && <div>{form.errors.mode}</div>}

      <label htmlFor="democracyCountdown">
        Democracy Countdown (in Milliseconds)
      </label>
      <input
        type="number"
        name="democracyCountdown"
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        value={form.values.democracyCountdown}
      />
      {form.errors.democracyCountdown && form.touched.democracyCountdown && (
        <div>{form.errors.democracyCountdown}</div>
      )}

      <label htmlFor="monarchyCooldown">
        Monarchy Cooldown (in Milliseconds)
      </label>
      <input
        type="number"
        name="monarchyCooldown"
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        value={form.values.monarchyCooldown}
      />
      {form.errors.monarchyCooldown && form.touched.monarchyCooldown && (
        <div>{form.errors.monarchyCooldown}</div>
      )}

      <label htmlFor="normalInterval">Normal Interval (in Milliseconds)</label>
      <input
        type="number"
        name="normalInterval"
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        value={form.values.normalInterval}
      />
      {form.errors.normalInterval && form.touched.normalInterval && (
        <div>{form.errors.normalInterval}</div>
      )}
      <button type="submit" disabled={form.isSubmitting}>
        Take Off!
      </button>
    </form>
  );
};

export default ConfigPage;
