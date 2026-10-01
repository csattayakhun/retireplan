/*
  Warnings:

  - You are about to drop the `TaxPlan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `TaxPlan` DROP FOREIGN KEY `TaxPlan_userId_fkey`;

-- DropTable
DROP TABLE `TaxPlan`;
