/*
  Warnings:

  - You are about to drop the column `category` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `taskTitle` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taskProgressId]` on the table `TaskProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `taskCategory` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskName` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskProgressId` to the `TaskProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "category",
DROP COLUMN "taskTitle",
ADD COLUMN     "taskCategory" TEXT NOT NULL,
ADD COLUMN     "taskName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TaskProgress" ADD COLUMN     "taskProgressId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TaskProgress_taskProgressId_key" ON "TaskProgress"("taskProgressId");
