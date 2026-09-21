import React from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { ActionButton } from "@/shared/ui/ActionButton";
import type { FeedbackItem } from "../model/types";

interface FeedbackCardProps {
  feedbacks: FeedbackItem[];
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedbacks }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm font-manrope overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5">
        <p className="text-lg font-semibold text-gray-800">Feedback</p>
        <div
          onClick={() => void navigate({ to: "/feedback" })}
          className="cursor-pointer"
          title="Leave feedback"
        >
          <ActionButton icon={Plus} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-gray-50/70 text-gray-400 border-y border-gray-100">
              <th className="py-3 px-6 font-medium">Case Title</th>
              <th className="py-3 px-4 font-medium">Date</th>
              <th className="py-3 px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {feedbacks.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-400">
                  No feedback given yet.
                </td>
              </tr>
            ) : (
              feedbacks.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 px-6 text-gray-800 font-medium">
                    {item.doctorName}
                  </td>
                  <td className="py-4 px-4 text-gray-600 font-medium">
                    {item.date}
                  </td>
                  <td className="py-4 px-4 text-amber-400 tracking-wider">
                    {item.ratingStars}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
