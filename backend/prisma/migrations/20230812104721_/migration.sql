-- AlterTable
ALTER TABLE "User" ADD COLUMN     "teamId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("teamId") ON DELETE SET NULL ON UPDATE SET NULL;
