import { z } from "zod";

export enum orderStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
}

export const OrderStatusUpdateSchema = z.object({
  status: z.enum([
    orderStatus.ACCEPTED,
    orderStatus.CANCELED,
    orderStatus.DELIVERED,
    orderStatus.OUT_FOR_DELIVERY,
    orderStatus.PENDING,
  ]).optional()
});
