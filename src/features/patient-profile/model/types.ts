export type ActivityType = "timeline" | "tasks" | "notes";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  prefix: string;
  actor: string;
  date: string;
  iconName?: string;
  completed?: boolean;
}

export interface AppointmentItem {
  id: string;
  startTime?: string;
  date?: string;
  time?: string;
  speciality?: string;
  specialty?: string;
  status?: "Cancelled" | "Completed" | "Pending" | string;
  doctorName?: string;
  anamnesis?: string;
}

export interface SurveyItem {
  id: string;
  title: string;
  completedDate: string;
  details?: string;
  status?: "Completed" | "Reviewed" | "Pending" | string;
}
