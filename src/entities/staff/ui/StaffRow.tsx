import React from "react";
import { Calendar } from "lucide-react";
import type { StaffMember } from "../model/types";

interface StaffRowProps {
  person: StaffMember;
  onBook?: (id: string) => void;
}

export const StaffRow: React.FC<StaffRowProps> = ({ person, onBook }) => (
  <tr className="hover:bg-gray-50/50 transition-colors">
    <td className="py-4 px-6">
      <div className="flex items-center gap-3">
        <img
          src={person.avatarUrl}
          alt={person.name}
          className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">{person.name}</p>
          <p className="text-gray-400 text-xs">
            {person.hospital} <br /> {person.role}
          </p>
        </div>
      </div>
    </td>

    <td className="py-4 px-4 text-gray-700 text-sm font-medium">
      {person.location}
    </td>

    <td className="py-4 px-4 text-gray-700 text-sm font-medium">
      {person.availableHours}
    </td>

    <td className="py-4 px-4">
      <button
        onClick={() => onBook?.(person.id)}
        className="flex items-center gap-2 text-emerald-600 text-sm font-semibold hover:text-emerald-700 transition-colors cursor-pointer"
      >
        <Calendar className="w-4 h-4 text-emerald-500" />
        <span>Book date</span>
      </button>
    </td>

    <td className="py-4 px-4">
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
        {person.confirmation}
      </span>
    </td>
  </tr>
);
