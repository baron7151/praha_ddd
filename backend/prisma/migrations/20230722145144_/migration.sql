/*
  Warnings:

  - Added the required column `taskStatus` to the `TaskProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskProgress" ADD COLUMN     "taskStatus" TEXT NOT NULL;
