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
