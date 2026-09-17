import React from "react";
import { Edit2 } from "lucide-react";
import { ActionButton } from "../../../shared/ui/ActionButton";

interface InsuranceInfoProps {
  memberId: string;
  provider: string;
}

export const InsuranceInfo: React.FC<InsuranceInfoProps> = ({
  memberId,
  provider,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6 font-manrope">
      <div className="flex items-center justify-between mb-6">
        <p className="text-lg font-semibold text-gray-800">Insurance Info</p>
        <ActionButton icon={Edit2} />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-400 font-medium">Member ID</p>
          <p className="text-sm font-semibold text-gray-800">{memberId}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium">
            Insurance Provider
          </p>
          <p className="text-sm font-semibold text-gray-800">{provider}</p>
        </div>
      </div>
    </div>
  );
};
