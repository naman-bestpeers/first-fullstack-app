/*
  Warnings:

  - You are about to drop the column `quantity` on the `order_events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_events" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "status" "OrderEventStatus" NOT NULL DEFAULT 'PENDING';
