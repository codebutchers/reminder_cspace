export const __prod__ = process.env.NODE_ENV === "production";

export enum RESERVATION_STATUS {
  Paid = "Paid",
  Unpaid = "Unpaid",
  Canceled = "Canceled",
}
