import React from "react";
import { Edit2 } from "lucide-react";
import { ActionButton } from "../../../shared/ui/ActionButton";
import { MissingFieldBadge } from "./MissingFieldBadge";

interface ContactInfoProps {
  fullName: string;
  data: {
    phone: string;
    homePhone: string;
    address: string;
    email: string;
  };
  onEdit: () => void;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
  fullName,
  data,
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative font-manrope">
      <div className="flex items-center justify-between mb-6">
        <p className="text-lg font-semibold text-gray-800">Contact info</p>
        <div onClick={onEdit} className="cursor-pointer">
          <ActionButton icon={Edit2} />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-400 font-medium">Full Name</p>
          <p className="text-sm font-semibold text-gray-800">
            {fullName || "Not specified"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium flex items-center">
            Phone{" "}
            {!data?.phone && (
              <MissingFieldBadge fieldName="Phone" onOpenModal={onEdit} />
            )}
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {data?.phone || (
              <span className="text-red-500 text-xs font-normal">
                Missing data
              </span>
            )}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium">Home Phone</p>
          <p className="text-sm font-semibold text-gray-800">
            {data?.homePhone || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium flex items-center">
            Address{" "}
            {!data?.address && (
              <MissingFieldBadge fieldName="Address" onOpenModal={onEdit} />
            )}
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {data?.address || (
              <span className="text-red-500 text-xs font-normal">
                Missing data
              </span>
            )}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium flex items-center">
            Email{" "}
            {!data?.email && (
              <MissingFieldBadge fieldName="Email" onOpenModal={onEdit} />
            )}
          </p>
          {data?.email ? (
            <a
              href={`mailto:${data.email}`}
              className="text-sm font-semibold text-emerald-600 hover:underline inline-block"
            >
              {data.email}
            </a>
          ) : (
            <span className="text-red-500 text-xs font-normal">
              Missing data
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
