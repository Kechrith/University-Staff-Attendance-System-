import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hash(password: string) {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log("Seeding the Data Science and Engineering world...");

  // Kept to a single faculty/department, matching the frontend's simplified
  // single-department sample world in `services/superAdminService.ts`.
  const facultyOfEngineering = await prisma.faculty.create({ data: { name: "Faculty of Engineering" } });

  const dse = await prisma.department.create({
    data: { name: "Department of Data Science and Engineering", facultyId: facultyOfEngineering.id },
  });

  const classes = await Promise.all([
    prisma.class.create({ data: { code: "DSE-101", name: "DSE-101 Intro to Data Science", departmentId: dse.id } }),
    prisma.class.create({ data: { code: "DSE-204", name: "DSE-204 Data Structures", departmentId: dse.id } }),
    prisma.class.create({ data: { code: "DSE-205", name: "DSE-205 Machine Learning Basics", departmentId: dse.id } }),
    prisma.class.create({
      data: { code: "DSE-301", name: "DSE-301 Software Engineering for Data Systems", departmentId: dse.id },
    }),
  ]);
  const [dse101, dse204, dse205, dse301] = classes;

  const superAdmin = await prisma.user.create({
    data: {
      name: "Sok Dara",
      email: "superadmin@rupp.edu.kh",
      passwordHash: await hash("SuperAdmin123!"),
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      employeeId: "RUPP-ADM-0007",
      position: "Super Administrator",
      bio: "System administrator overseeing university-wide attendance operations, account management, and academic timetables.",
    },
  });

  const departmentHead = await prisma.user.create({
    data: {
      name: "Hout Bunthoeun",
      email: "dept.head@rupp.edu.kh",
      passwordHash: await hash("DeptHead123!"),
      role: "DEPARTMENT_HEAD",
      status: "ACTIVE",
      departmentId: dse.id,
      position: "Department Head, Data Science and Engineering",
      avatarUrl: "https://i.pravatar.cc/150?u=hout.bunthoeun",
    },
  });

  const coordinator = await prisma.user.create({
    data: {
      name: "Chan Pisey",
      email: "coordinator@rupp.edu.kh",
      passwordHash: await hash("Coord123!"),
      role: "PROGRAM_COORDINATOR",
      status: "ACTIVE",
      departmentId: dse.id,
      position: "Program Coordinator",
    },
  });

  const lySochea = await prisma.user.create({
    data: {
      name: "Ly Sochea",
      email: "lecturer@rupp.edu.kh",
      passwordHash: await hash("Lecturer123!"),
      role: "LECTURER",
      status: "ACTIVE",
      departmentId: dse.id,
      position: "Lecturer",
    },
  });

  const vannKimheng = await prisma.user.create({
    data: {
      name: "Vann Kimheng",
      email: "kimheng.vann@rupp.edu.kh",
      passwordHash: await hash("Lecturer123!"),
      role: "LECTURER",
      status: "SUSPENDED",
      departmentId: dse.id,
      position: "Lecturer",
    },
  });

  const prumSophea = await prisma.user.create({
    data: {
      name: "Prum Sophea",
      email: "monitor@rupp.edu.kh",
      passwordHash: await hash("Monitor123!"),
      role: "CLASS_MONITOR",
      status: "ACTIVE",
      departmentId: dse.id,
      position: "Class Monitor",
    },
  });

  const measRatana = await prisma.user.create({
    data: {
      name: "Meas Ratana",
      email: "ratana.meas@rupp.edu.kh",
      passwordHash: await hash("Monitor123!"),
      role: "CLASS_MONITOR",
      status: "ACTIVE",
      departmentId: dse.id,
      position: "Class Monitor",
    },
  });

  await prisma.class.update({ where: { id: dse101.id }, data: { monitorId: measRatana.id } });
  await prisma.class.update({ where: { id: dse301.id }, data: { monitorId: prumSophea.id } });

  const semesterLabel = "Semester 1, 2026–2027";
  const session1 = await prisma.classSession.create({
    data: { classId: dse101.id, lecturerId: lySochea.id, dayOfWeek: "Monday", startTime: "07:00", endTime: "08:30", room: "Room A201", semesterLabel },
  });
  const session2 = await prisma.classSession.create({
    data: { classId: dse301.id, lecturerId: vannKimheng.id, dayOfWeek: "Monday", startTime: "10:00", endTime: "11:30", room: "Room C302", semesterLabel },
  });
  const session3 = await prisma.classSession.create({
    data: { classId: dse204.id, lecturerId: lySochea.id, dayOfWeek: "Tuesday", startTime: "08:30", endTime: "10:00", room: "Room A105", semesterLabel },
  });
  await prisma.classSession.create({
    data: { classId: dse205.id, lecturerId: vannKimheng.id, dayOfWeek: "Wednesday", startTime: "13:00", endTime: "14:30", room: "Room A201", semesterLabel },
  });

  // The Nov 4, 2026 DSE-301 dispute story, referenced across Lecturer / Class Monitor / Super Admin views.
  const disputedRecord = await prisma.attendanceRecord.create({
    data: {
      sessionId: session2.id,
      date: new Date("2026-11-04T10:00:00Z"),
      status: "ABSENT",
      loggedById: prumSophea.id,
    },
  });
  await prisma.dispute.create({
    data: {
      attendanceRecordId: disputedRecord.id,
      raisedById: lySochea.id,
      reason:
        "I was in class and taught the full session — Chapter 4: Design Patterns (Singleton and Factory). The Class Monitor's log for this session appears to be a mistake.",
      status: "ESCALATED",
    },
  });

  await prisma.attendanceRecord.createMany({
    data: [
      { sessionId: session1.id, date: new Date("2026-11-06T07:00:00Z"), status: "PRESENT", lessonSummary: "Introduced SOLID principles with a refactoring exercise on the Lab 2 codebase.", loggedById: measRatana.id },
      { sessionId: session3.id, date: new Date("2026-11-10T08:30:00Z"), status: "PRESENT", lessonSummary: "Covered balanced binary search trees (AVL rotations) with worked examples. Assigned Problem Set 6.", loggedById: measRatana.id },
      { sessionId: session2.id, date: new Date("2026-11-11T10:00:00Z"), status: "PRESENT", lessonSummary: "Covered Chapter 5: Design Patterns — Observer and Strategy. Reviewed Lab 3 submissions.", loggedById: prumSophea.id },
    ],
  });

  await prisma.leaveRequest.createMany({
    data: [
      { userId: vannKimheng.id, leaveType: "Sick Leave", startDate: new Date("2026-07-20"), endDate: new Date("2026-07-21"), reason: "Flu and fever, doctor advised rest.", status: "PENDING" },
      { userId: coordinator.id, leaveType: "Annual Leave", startDate: new Date("2026-08-01"), endDate: new Date("2026-08-03"), reason: "Family trip planned in advance.", status: "APPROVED", decidedAt: new Date(), decidedBy: departmentHead.id },
    ],
  });

  await prisma.auditLogEntry.createMany({
    data: [
      { actorId: superAdmin.id, action: "UPDATE", target: "Suspended account: Vann Kimheng" },
      { actorId: superAdmin.id, action: "CREATE", target: `${classes.length} sessions for ${semesterLabel}` },
      { actorId: coordinator.id, action: "UPDATE", target: "Escalated dispute: Ly Sochea, DSE-301" },
      { actorId: prumSophea.id, action: "CREATE", target: "Attendance entry: DSE-301, Nov 4" },
    ],
  });

  await prisma.notification.createMany({
    data: [
      { userId: superAdmin.id, title: "Dispute escalated to you", description: "Ly Sochea's Nov 4 attendance dispute needs a final decision." },
      { userId: superAdmin.id, title: "New account pending approval", description: "Meas Ratana requested Class Monitor access for DSE-101." },
    ],
  });

  await prisma.systemConfiguration.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, attendanceWindowMinutes: 60, disputeWindowDays: 7, digestScheduleLabel: "Every Monday at 9:00 AM", digestEnabled: true },
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
