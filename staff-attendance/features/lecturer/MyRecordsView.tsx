import { MyRecordsHeader } from "@/components/lecturer/records/MyRecordsHeader";
import { AttendanceRecordsList } from "@/components/lecturer/records/AttendanceRecordsList";

/**
 * Page-level composition for the Lecturer "My Records" page: header plus
 * the chronological attendance/lesson-summary log with the flag/dispute
 * workflow (FR-4/FR-5).
 */
export function MyRecordsView() {
  return (
    <div className="space-y-6 pb-10">
      <MyRecordsHeader />
      <AttendanceRecordsList />
    </div>
  );
}
