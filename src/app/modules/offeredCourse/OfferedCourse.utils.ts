import { TSchedule } from "./offeredCourse.interface";

export const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignedSchedules) {
    const existingStartTime = new Date(`2005-11-07T${schedule.startTime}`);
    const existingEndTime = new Date(`2005-11-07T${schedule.endTime}`);
    const newStartTime = new Date(`2005-11-07T${newSchedule.startTime}`);
    const newEndTime = new Date(`2005-11-07T${newSchedule.endTime}`);

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }
  return false;
};
