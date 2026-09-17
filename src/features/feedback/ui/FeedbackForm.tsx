import React, { useState } from "react";
import { RatingScale } from "./RatingScale";
import type { FeedbackFormState } from "../model/types";
import feedbackBGR from "../../../assets/icons/feedbackBGR.svg";

export const FeedbackForm: React.FC = () => {
  const [formState, setFormState] = useState<FeedbackFormState>({
    appointmentSatisfaction: null,
    doctorSatisfaction: null,
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
      <div className="w-full h-48 sm:h-64 bg-gray-100 overflow-hidden relative">
        <img
          src={feedbackBGR}
          alt="Feedback banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-8 sm:p-12 max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1 text-center">
          We value your feedback!
        </h2>
        <p className="text-sm text-gray-400 mb-8 text-center">
          Share your opinion on the quality of our services
        </p>

        <div className="w-full space-y-6">
          <RatingScale
            question="How satisfied are you with making an appointment?"
            selectedValue={formState.appointmentSatisfaction}
            onSelect={(val) =>
              setFormState((prev) => ({
                ...prev,
                appointmentSatisfaction: val,
              }))
            }
          />

          <RatingScale
            question="How satisfied are you with the doctor?"
            selectedValue={formState.doctorSatisfaction}
            onSelect={(val) =>
              setFormState((prev) => ({ ...prev, doctorSatisfaction: val }))
            }
          />
        </div>
      </div>
    </div>
  );
};
