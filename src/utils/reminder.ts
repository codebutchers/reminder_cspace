import cron from "node-cron";

export default class Reminder {
  static _task: cron.ScheduledTask;

  static init = (task: Function) => {
    // Reminder._task = cron.schedule("1 * * * * *", async () => { // run every first second
    // run at 1h every day
    Reminder._task = cron.schedule("* * 1 * * *", async () => {
      await task();
    });
  };
  static start = () => {
    Reminder._task.start();
  };

  static stop = () => {
    Reminder._task.stop();
  };
}
