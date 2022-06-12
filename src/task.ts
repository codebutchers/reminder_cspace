import { Reservation } from "./entities";
import { Between } from "typeorm";
import { PAYMENT_METHOD, RESERVATION_STATUS } from "./constants";
import NotificationHelper from "./utils/notification";

export default async function task() {
  const now = new Date();
  const tomorrow = new Date(+now + 24 * 60 * 60 * 1000);
  const reservations = await Reservation.find({
    where: {
      fromDate: Between(now, tomorrow),
    },
    relations: ["user"],
  });
  reservations.forEach((r) => {
    if (r.user?.firebaseToken) {
      if (r.status === RESERVATION_STATUS.Paid) {
        NotificationHelper.sendToDevice(r.user.firebaseToken, {
          notification: {
            title: "CBS Reminder",
            body: "You have a reservation that will start tomorrow",
          },
          data: {
            reservationId: `${r.id}`,
          },
        });
      } else if (
        r.status === RESERVATION_STATUS.Unpaid &&
        r.paymentMethod === PAYMENT_METHOD.Paypal
      ) {
        NotificationHelper.sendToDevice(r.user.firebaseToken, {
          notification: {
            title: "CBS Reminder",
            body: "You have a reservation that wasn't been paid yet",
          },
          data: {
            reservationId: `${r.id}`,
          },
        });
      }
    }
  });
}
