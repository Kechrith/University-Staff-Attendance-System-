// database/ has no node_modules of its own — seed.ts is run via `prisma db
// seed` from backend/, so its dependencies (installed there) are resolved
// with explicit relative paths instead of bare package names.
import { PrismaClient } from "../backend/node_modules/@prisma/client/default.js";
import bcrypt from "../backend/node_modules/bcryptjs/index.js";

const prisma = new PrismaClient();

async function hash(password: string) {
  return bcrypt.hash(password, 10);
}

const DAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

/** Most recent calendar date matching `dayOfWeek`, `weeksAgo` weeks further back, relative to "today". */
function recentDateFor(dayOfWeek: string, weeksAgo: number, baseDate = new Date("2026-07-17T00:00:00Z")): Date {
  const target = DAY_INDEX[dayOfWeek];
  const base = new Date(baseDate);
  const diff = (base.getUTCDay() - target + 7) % 7;
  base.setUTCDate(base.getUTCDate() - diff - weeksAgo * 7);
  base.setUTCHours(3, 0, 0, 0);
  return base;
}

function daysFromToday(offset: number, baseDate = new Date("2026-07-17T00:00:00Z")): Date {
  const base = new Date(baseDate);
  base.setUTCDate(base.getUTCDate() + offset);
  return base;
}

async function main() {
  console.log("Seeding the Data Science and Engineering world...");

  // Kept to a single faculty/department, matching the frontend's simplified
  // single-department sample world across every role's service file.
  const facultyOfEngineering = await prisma.faculty.create({ data: { name: "Faculty of Engineering" } });

  const dse = await prisma.department.create({
    data: { name: "Department of Data Science and Engineering", facultyId: facultyOfEngineering.id },
  });

  const classes = await Promise.all([
    prisma.class.create({ data: { code: "DSE-101", name: "DSE-101 Intro to Data Science", departmentId: dse.id, studentCount: 34 } }),
    prisma.class.create({ data: { code: "DSE-204", name: "DSE-204 Data Structures", departmentId: dse.id, studentCount: 30 } }),
    prisma.class.create({ data: { code: "DSE-205", name: "DSE-205 Machine Learning Basics", departmentId: dse.id, studentCount: 28 } }),
    prisma.class.create({
      data: { code: "DSE-301", name: "DSE-301 Software Engineering for Data Systems", departmentId: dse.id, studentCount: 26 },
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
      employeeId: "EMP-1099",
      phone: "016 554 332",
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
      employeeId: "RUPP-PC-0031",
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
      employeeId: "EMP-1010",
      phone: "012 345 678",
      position: "Lecturer",
      avatarUrl: "https://i.pravatar.cc/150?u=ly.sochea",
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
      employeeId: "EMP-1042",
      phone: "017 223 344",
      position: "Lecturer",
      avatarUrl: "https://i.pravatar.cc/150?u=vann.kimheng",
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
      employeeId: "EMP-1091",
      phone: "011 998 776",
      position: "Class Monitor",
      avatarUrl: "https://i.pravatar.cc/150?u=prum.sophea",
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
      employeeId: "EMP-1077",
      position: "Class Monitor",
      avatarUrl: "https://i.pravatar.cc/150?u=meas.ratana",
    },
  });

  await prisma.class.update({ where: { id: dse101.id }, data: { monitorId: measRatana.id } });
  await prisma.class.update({ where: { id: dse204.id }, data: { monitorId: measRatana.id } });
  await prisma.class.update({ where: { id: dse205.id }, data: { monitorId: prumSophea.id } });
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
  const session4 = await prisma.classSession.create({
    data: { classId: dse205.id, lecturerId: vannKimheng.id, dayOfWeek: "Wednesday", startTime: "13:00", endTime: "14:30", room: "Room A201", semesterLabel },
  });
  const session5 = await prisma.classSession.create({
    data: { classId: dse301.id, lecturerId: lySochea.id, dayOfWeek: "Thursday", startTime: "07:00", endTime: "08:30", room: "Room A201", semesterLabel },
  });
  const session6 = await prisma.classSession.create({
    data: { classId: dse204.id, lecturerId: vannKimheng.id, dayOfWeek: "Friday", startTime: "08:30", endTime: "10:00", room: "Room A105", semesterLabel },
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

  // Rolling ~4-week attendance history for the recurring weekday sessions, anchored to "today"
  // (2026-07-17) so weekly/monthly trend charts across every role have real variety to show.
  const lessonSummaries = [
    "Reviewed core concepts with a worked example and Q&A.",
    "Introduced a new topic with a hands-on lab exercise.",
    "Covered assigned readings and discussed case studies.",
    "Continued from last session; assigned a follow-up problem set.",
  ];
  const recurringSessions: { session: typeof session1; monitor: typeof measRatana }[] = [
    { session: session1, monitor: measRatana },
    { session: session3, monitor: measRatana },
    { session: session4, monitor: prumSophea },
    { session: session5, monitor: prumSophea },
    { session: session6, monitor: measRatana },
  ];

  let counter = 0;
  for (const { session, monitor } of recurringSessions) {
    for (let weeksAgo = 1; weeksAgo <= 4; weeksAgo++) {
      counter++;
      const roll = counter % 7;
      const status = roll === 0 ? "ABSENT" : roll === 1 || roll === 2 ? "LATE" : "PRESENT";
      await prisma.attendanceRecord.create({
        data: {
          sessionId: session.id,
          date: recentDateFor(session.dayOfWeek, weeksAgo),
          status,
          lessonSummary: status === "ABSENT" ? null : lessonSummaries[counter % lessonSummaries.length],
          loggedById: monitor.id,
        },
      });
    }
  }

  await prisma.leaveRequest.createMany({
    data: [
      { userId: vannKimheng.id, leaveType: "Sick Leave", startDate: new Date("2026-07-20"), endDate: new Date("2026-07-21"), reason: "Flu and fever, doctor advised rest.", status: "PENDING" },
      { userId: coordinator.id, leaveType: "Annual Leave", startDate: new Date("2026-08-01"), endDate: new Date("2026-08-03"), reason: "Family trip planned in advance.", status: "APPROVED", decidedAt: daysFromToday(-2), decidedBy: departmentHead.id },
      { userId: lySochea.id, leaveType: "Research", startDate: new Date("2026-07-10"), endDate: new Date("2026-07-12"), reason: "Presenting a paper at a regional conference.", status: "APPROVED", decidedAt: daysFromToday(-8), decidedBy: departmentHead.id },
      { userId: prumSophea.id, leaveType: "Unpaid Leave", startDate: new Date("2026-06-28"), endDate: new Date("2026-06-29"), reason: "Personal matters requiring time off.", status: "REJECTED", decidedAt: daysFromToday(-20), decidedBy: departmentHead.id },
      { userId: measRatana.id, leaveType: "Annual Leave", startDate: new Date("2026-07-22"), endDate: new Date("2026-07-24"), reason: "Family trip planned in advance.", status: "PENDING" },
      { userId: lySochea.id, leaveType: "Emergency Leave", startDate: new Date("2026-08-05"), endDate: new Date("2026-08-05"), reason: "Family emergency requiring immediate travel.", status: "REJECTED", decidedAt: daysFromToday(-1), decidedBy: departmentHead.id },
      { userId: prumSophea.id, leaveType: "Annual Leave", startDate: new Date("2026-07-24"), endDate: new Date("2026-07-24"), reason: "Family event.", status: "APPROVED", decidedAt: daysFromToday(-3), decidedBy: departmentHead.id },
      { userId: measRatana.id, leaveType: "Sick Leave", startDate: new Date("2026-06-15"), endDate: new Date("2026-06-16"), reason: "Flu recovery.", status: "APPROVED", decidedAt: daysFromToday(-30), decidedBy: departmentHead.id },
    ],
  });

  await prisma.room.createMany({
    data: [
      { name: "Room A201 (Engineering Block)", capacity: 45, departmentId: dse.id },
      { name: "Room A105 (Engineering Block)", capacity: 40, departmentId: dse.id },
      { name: "Room C302 (Engineering Block)", capacity: 50, departmentId: dse.id },
    ],
  });

  await prisma.calendarEvent.createMany({
    data: [
      { title: "Department Staff Meeting", type: "meeting", date: daysFromToday(0), time: "02:00 PM - 03:00 PM", location: "Room A105", priority: "high", departmentId: dse.id },
      { title: "Mid-term Grade Submission Deadline", type: "deadline", date: daysFromToday(3), time: "05:00 PM", location: "Online", priority: "high", departmentId: dse.id },
    ],
  });

  await prisma.generatedReport.createMany({
    data: [
      { name: "June Attendance Report — Data Science and Engineering", format: "PDF", generatedAt: daysFromToday(-16), departmentId: dse.id },
      { name: "Q2 Leave Distribution Summary", format: "Excel", generatedAt: daysFromToday(-19), departmentId: dse.id },
      { name: "Staff Workload Intensity Report", format: "PDF", generatedAt: daysFromToday(-32), departmentId: dse.id },
    ],
  });

  await prisma.notificationPreference.createMany({
    data: [
      { userId: prumSophea.id, key: "session-reminders", title: "Session start reminders", description: "Notify me 15 minutes before each scheduled session.", enabled: true },
      { userId: prumSophea.id, key: "leave-updates", title: "Leave request updates", description: "Notify me when a leave request is approved or rejected.", enabled: true },
      { userId: prumSophea.id, key: "discrepancy-alerts", title: "Attendance discrepancy alerts", description: "Notify me if a submitted attendance log is flagged for review.", enabled: true },
      { userId: prumSophea.id, key: "weekly-summary", title: "Weekly summary email", description: "Send a weekly summary of my attendance-logging accuracy.", enabled: false },
      { userId: measRatana.id, key: "session-reminders", title: "Session start reminders", description: "Notify me 15 minutes before each scheduled session.", enabled: true },
      { userId: measRatana.id, key: "leave-updates", title: "Leave request updates", description: "Notify me when a leave request is approved or rejected.", enabled: true },
      { userId: measRatana.id, key: "discrepancy-alerts", title: "Attendance discrepancy alerts", description: "Notify me if a submitted attendance log is flagged for review.", enabled: true },
      { userId: measRatana.id, key: "weekly-summary", title: "Weekly summary email", description: "Send a weekly summary of my attendance-logging accuracy.", enabled: true },
    ],
  });

  await prisma.auditLogEntry.createMany({
    data: [
      { actorId: superAdmin.id, action: "UPDATE", target: "Suspended account: Vann Kimheng" },
      { actorId: superAdmin.id, action: "CREATE", target: `${classes.length} sessions for ${semesterLabel}` },
      { actorId: coordinator.id, action: "UPDATE", target: "Escalated dispute: Ly Sochea, DSE-301" },
      { actorId: prumSophea.id, action: "CREATE", target: "Attendance entry: DSE-301, Nov 4" },
      { actorId: superAdmin.id, action: "LOGIN", target: "Sok Dara signed in", timestamp: daysFromToday(0) },
      { actorId: departmentHead.id, action: "LOGIN", target: "Hout Bunthoeun signed in", timestamp: daysFromToday(0) },
      { actorId: coordinator.id, action: "LOGIN", target: "Chan Pisey signed in", timestamp: daysFromToday(0) },
      { actorId: lySochea.id, action: "LOGIN", target: "Ly Sochea signed in", timestamp: daysFromToday(0) },
      { actorId: prumSophea.id, action: "LOGIN", target: "Prum Sophea signed in", timestamp: daysFromToday(0) },
    ],
  });

  await prisma.notification.createMany({
    data: [
      { userId: superAdmin.id, title: "Dispute escalated to you", description: "Ly Sochea's Nov 4 attendance dispute needs a final decision." },
      { userId: superAdmin.id, title: "New account pending approval", description: "Meas Ratana requested Class Monitor access for DSE-101." },
      { userId: departmentHead.id, title: "New leave request", description: "Vann Kimheng requested 2 days of Sick Leave.", read: false },
      { userId: departmentHead.id, title: "Late arrival flagged", description: "Meas Ratana checked in late today.", read: false },
      { userId: coordinator.id, title: "New leave request", description: "Vann Kimheng requested Sick Leave for Jul 20 – Jul 21, covering DSE-101.", read: false },
      { userId: coordinator.id, title: "Lecturer checked in late", description: "Ly Sochea checked in late for DSE-204 Data Structures.", read: true },
      { userId: lySochea.id, title: "Dispute under review", description: "Your dispute for the Nov 4 DSE-301 session has been escalated to the Program Coordinator.", read: false },
      { userId: lySochea.id, title: "Leave request approved", description: "Your Research leave request was approved by Hout Bunthoeun.", read: false },
      { userId: prumSophea.id, title: "Session starting soon", description: "DSE-301 Software Engineering for Data Systems starts soon in Room A201.", read: false },
      { userId: prumSophea.id, title: "Leave request approved", description: "Your Annual Leave request for Jul 24 was approved by Hout Bunthoeun.", read: true },
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
