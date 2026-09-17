import React from "react";
import { FeedbackForm } from "./FeedbackForm";

export const FeedbackPage: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 font-manrope">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Feedback
        </h1>
      </div>

      <FeedbackForm />
    </div>
  );
};
