import { RESERVATION_STATUS } from "../constants";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  roomId: number;

  @Column({
    type: "enum",
    enum: RESERVATION_STATUS,
    default: RESERVATION_STATUS.Unpaid,
  })
  status: RESERVATION_STATUS;

  @Column({ type: "timestamptz" })
  fromDate!: Date;

  @Column({ type: "timestamptz" })
  toDate!: Date;

  @ManyToOne(() => User, (user) => user.reservations)
  user?: User;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
