/*
  Warnings:

  - You are about to drop the column `pairId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `taskProgressId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "pairId",
DROP COLUMN "taskProgressId",
DROP COLUMN "teamId";
