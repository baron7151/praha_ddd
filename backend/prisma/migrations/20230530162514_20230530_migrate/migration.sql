/*
  Warnings:

  - You are about to drop the column `pair_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `task_progress_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_user_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pair_id",
DROP COLUMN "task_progress_id",
DROP COLUMN "team_id",
DROP COLUMN "user_id",
ADD COLUMN     "pairId" TEXT,
ADD COLUMN     "taskProgressId" TEXT,
ADD COLUMN     "teamId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");
