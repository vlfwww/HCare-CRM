export interface FeedbackItem {
  id: string;
  appointmentId: string;
  doctorName: string;
  date: string;
  appointmentSatisfaction: number | null;
  doctorSatisfaction: number | null;
  ratingStars: string;
}

export interface FeedbackFormState {
  appointmentId: string;
  appointmentSatisfaction: number | null;
  doctorSatisfaction: number | null;
}
