require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Reservation, User } from "./entities";
import task from "./task";

const main = async () => {
  //SECTION: CONNECT POSTGRESQL
  console.log(">>> Connecting postgreSQL");
  await createConnection({
    type: "postgres",
    ssl: true,
    url: process.env.DB_URL_PROD,
    logging: false,
    synchronize: false,
    entities: [Reservation, User],
  });

  await task();
};

main().catch((err) => console.error(err));
