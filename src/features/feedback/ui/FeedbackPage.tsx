import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { auth } from "@/app/providers/firebase";
import { useFeedback } from "../model/useFeedback";
import { FeedbackForm } from "./FeedbackForm";

export const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid || "";

  const {
    completedAppointments,
    feedbacks,
    isLoading,
    formState,
    setFormState,
    errorMessage,
    handleSaveFeedback,
  } = useFeedback(userId);

  const handleSubmit = async () => {
    const success = await handleSaveFeedback();
    if (success) {
      void navigate({ to: "/profile" });
    }
  };

  const handleCancel = () => {
    void navigate({ to: "/profile" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] font-manrope">
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    );
  }

  const reviewedIds = feedbacks.map((f) => f.appointmentId);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 font-manrope">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Leave Feedback
        </h1>
      </div>

      <FeedbackForm
        formState={formState}
        setFormState={setFormState}
        completedAppointments={completedAppointments}
        alreadyReviewedAppointmentIds={reviewedIds}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};
