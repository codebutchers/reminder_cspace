import { Reservation } from "./entities";
import { Between, LessThan } from "typeorm";
import { RESERVATION_STATUS } from "./constants";
import NotificationHelper from "./utils/notification";

export default async function task() {
  const now = new Date();
  console.log(`>>> Task run at ${now}`);
  const tomorrow = new Date(+now + 24 * 60 * 60 * 1000);
  // Upcoming reservations
  const upcomingReservations = await Reservation.find({
    where: {
      fromDate: Between(now, tomorrow),
    },
    relations: ["user"],
  });
  upcomingReservations.forEach((r) => {
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
      } else if (r.status === RESERVATION_STATUS.Unpaid) {
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

  // Not reviewed reservations
  const notReviewedReservations = await Reservation.find({
    where: {
      toDate: LessThan(now),
      status: RESERVATION_STATUS.Paid,
      hasReviewed: false,
    },
    relations: ["user"],
  });
  notReviewedReservations.forEach((r) => {
    if (r.user?.firebaseToken) {
      NotificationHelper.sendToDevice(r.user.firebaseToken, {
        notification: {
          title: "CBS Reminder",
          body: "What do you think about our service? Please leave a review!",
        },
        data: {
          reservationId: `${r.id}`,
        },
      });
    }
  });
}
