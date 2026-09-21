import React from "react";
import { RatingScale } from "./RatingScale";
import type { FeedbackFormState } from "../model/types";
import feedbackBGR from "../../../assets/icons/feedbackBGR.svg";
import type { AppointmentItem } from "@/features/patient-profile/model/types";

interface FeedbackFormProps {
  formState: FeedbackFormState;
  setFormState: React.Dispatch<React.SetStateAction<FeedbackFormState>>;
  completedAppointments: AppointmentItem[];
  alreadyReviewedAppointmentIds: string[];
  errorMessage: string | null;
  onSubmit: () => void;
  onCancel: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  formState,
  setFormState,
  completedAppointments,
  alreadyReviewedAppointmentIds,
  errorMessage,
  onSubmit,
  onCancel,
}) => {
  const availableAppointments = completedAppointments.filter(
    (app) =>
      app.status === "Completed" &&
      !alreadyReviewedAppointmentIds.includes(app.id),
  );

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

        {availableAppointments.length === 0 ? (
          <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-amber-800 mb-6">
            <p className="font-semibold mb-1">
              No appointments available for feedback.
            </p>
            <p className="text-xs text-amber-600">
              You have already reviewed all your completed appointments or have
              no completed visits yet.
            </p>
          </div>
        ) : (
          <div className="w-full space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select completed appointment
              </label>
              <select
                value={formState.appointmentId}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    appointmentId: e.target.value,
                  }))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-emerald-500 bg-gray-50/50"
              >
                {availableAppointments.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.doctorName} — {item.date || item.startTime} (
                    {item.status})
                  </option>
                ))}
              </select>
            </div>

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
        )}

        {errorMessage && (
          <div className="w-full mt-4 text-red-500 text-xs font-semibold text-center bg-red-50 py-2 rounded-lg border border-red-100">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6 w-full">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            {availableAppointments.length === 0 ? "Back" : "Cancel"}
          </button>

          {availableAppointments.length > 0 && (
            <button
              type="button"
              onClick={onSubmit}
              className="px-6 py-3 rounded-xl bg-emerald-500 text-sm font-semibold text-white hover:bg-emerald-600 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              Submit Feedback
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
