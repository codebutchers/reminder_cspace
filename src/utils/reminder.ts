import cron from "node-cron";

export default class Reminder {
  static _task: cron.ScheduledTask;

  static init = (task: Function) => {
    // Reminder._task = cron.schedule("1 * * * * *", async () => {
    // run at 1st seconds every minute
    // run every day at 9AM+7
    Reminder._task = cron.schedule("0 0 2 * * *", async () => {
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
