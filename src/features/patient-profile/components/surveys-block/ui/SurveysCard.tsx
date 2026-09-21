import React, { useState } from "react";
import { Plus } from "lucide-react";
import { ActionButton } from "../../../../../shared/ui/ActionButton";
import { SurveyBookingModal } from "./SurveyBookingModal";
import type { SurveyItem } from "../../../model/types";

interface SurveysCardProps {
  userId: string;
  surveys: SurveyItem[];
  availableSurveys: string[];
  onSurveyCreated: (newSurvey: Omit<SurveyItem, "id">) => void;
}

export const SurveysCard: React.FC<SurveysCardProps> = ({
  surveys,
  availableSurveys,
  onSurveyCreated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm font-manrope overflow-hidden relative">
      <div className="flex items-center justify-between px-6 py-5">
        <p className="text-lg font-semibold text-gray-800">Surveys</p>
        <div
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer focus:outline-none bg-transparent border-none p-0"
        >
          <ActionButton icon={Plus} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-gray-50/70 text-gray-400 border-y border-gray-100">
              <th className="py-3 px-6 font-medium">Title</th>
              <th className="py-3 px-4 font-medium">Completed on</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {surveys.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-6 text-center text-gray-400">
                  No surveys found
                </td>
              </tr>
            ) : (
              surveys.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-6 text-gray-800 font-medium">
                    {item.title}
                  </td>
                  <td className="py-4 px-4 text-gray-600 font-medium">
                    {item.completedDate}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <SurveyBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableSurveys={availableSurveys}
        onSurveyCreated={onSurveyCreated}
      />
    </div>
  );
};
