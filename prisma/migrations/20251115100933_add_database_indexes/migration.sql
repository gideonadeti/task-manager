-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Group_userId_idx" ON "Group"("userId");

-- CreateIndex
CREATE INDEX "Task_userId_idx" ON "Task"("userId");

-- CreateIndex
CREATE INDEX "Task_groupId_idx" ON "Task"("groupId");

-- CreateIndex
CREATE INDEX "Task_completed_idx" ON "Task"("completed");

-- CreateIndex
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");

-- CreateIndex
CREATE INDEX "Task_userId_completed_idx" ON "Task"("userId", "completed");
