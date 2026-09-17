import React from "react";
import { Edit2 } from "lucide-react";
import { ActionButton } from "../../../shared/ui/ActionButton";

interface ContactInfoProps {
  data: {
    phone: string;
    homePhone: string;
    address: string;
    email: string;
  };
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative font-manrope">
      <div className="flex items-center justify-between mb-6">
        <p className="text-lg font-semibold text-gray-800">Contact info</p>
        <ActionButton icon={Edit2} />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-400 font-medium">Full Name</p>
          <p className="text-sm font-semibold text-gray-800">James Brown</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium">Phone</p>
          <p className="text-sm font-semibold text-gray-800">{data.phone}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium">Home Phone</p>
          <p className="text-sm font-semibold text-gray-800">
            {data.homePhone}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium">Address</p>
          <p className="text-sm font-semibold text-gray-800">{data.address}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium">Email</p>
          <a
            href={`mailto:${data.email}`}
            className="text-sm font-semibold text-emerald-600 hover:underline inline-block"
          >
            {data.email}
          </a>
        </div>
      </div>
    </div>
  );
};
