import React from "react";
import { Plus } from "lucide-react";
import { ActionButton } from "../../../shared/ui/ActionButton";

export const FeedbackCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm font-manrope overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5">
        <p className="text-lg font-semibold text-gray-800">Feedback</p>
        <ActionButton icon={Plus} />
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
            <tr>
              <td className="py-4 px-6 text-gray-800 font-medium">Dr.Johnes</td>
              <td className="py-4 px-4 text-gray-600 font-medium">
                15-12-2021
              </td>
              <td className="py-4 px-4 text-amber-400 tracking-wider">★★★★★</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
