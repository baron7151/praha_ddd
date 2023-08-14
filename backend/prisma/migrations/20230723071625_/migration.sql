/*
  Warnings:

  - A unique constraint covering the columns `[taskId,userId]` on the table `TaskProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TaskProgress_taskId_userId_key" ON "TaskProgress"("taskId", "userId");
