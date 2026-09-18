import React from "react";
import { Edit2 } from "lucide-react";
import { ActionButton } from "../../../shared/ui/ActionButton";
import { MissingFieldBadge } from "./MissingFieldBadge";

interface InsuranceInfoProps {
  memberId: string;
  provider: string;
  onEdit: () => void;
}

export const InsuranceInfo: React.FC<InsuranceInfoProps> = ({
  memberId,
  provider,
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6 font-manrope">
      <div className="flex items-center justify-between mb-6">
        <p className="text-lg font-semibold text-gray-800">Insurance Info</p>
        <div onClick={onEdit} className="cursor-pointer">
          <ActionButton icon={Edit2} />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-400 font-medium flex items-center">
            Member ID{" "}
            {!memberId && (
              <MissingFieldBadge
                fieldName="Insurance Member ID"
                onOpenModal={onEdit}
              />
            )}
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {memberId || (
              <span className="text-red-500 text-xs">Missing data</span>
            )}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium flex items-center">
            Insurance Provider{" "}
            {!provider && (
              <MissingFieldBadge
                fieldName="Insurance Provider"
                onOpenModal={onEdit}
              />
            )}
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {provider || (
              <span className="text-red-500 text-xs">Missing data</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
