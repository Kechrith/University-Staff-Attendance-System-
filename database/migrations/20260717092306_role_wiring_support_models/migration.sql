-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "studentCount" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "auditLogVisibility" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "autoApprovePersonalLeave" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "autoScheduleConflictDetection" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "deptCode" TEXT DEFAULT 'DSE-DEPT',
ADD COLUMN     "escalationHierarchy" TEXT NOT NULL DEFAULT 'Direct to Department Head',
ADD COLUMN     "establishedYear" TEXT DEFAULT '1998',
ADD COLUMN     "gracePeriodMode" TEXT NOT NULL DEFAULT 'fixed',
ADD COLUMN     "lateThresholdMinutes" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "leaveRequestEscalationEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mandatoryMedicalDocumentation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "signatureUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notifyOnNewLogin" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedReport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "departmentId" TEXT NOT NULL,

    CONSTRAINT "GeneratedReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key_key" ON "NotificationPreference"("userId", "key");

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedReport" ADD CONSTRAINT "GeneratedReport_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
