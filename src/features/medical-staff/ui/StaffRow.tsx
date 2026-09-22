import React from "react";
import { CalendarPlus } from "lucide-react";
import type { StaffMember } from "@/entities/staff/model/types";

interface StaffRowProps {
  person: StaffMember;
  onBook: () => void;
}

export const StaffRow: React.FC<StaffRowProps> = ({ person, onBook }) => {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          {person.avatarUrl ? (
            <img
              src={person.avatarUrl}
              alt={person.name}
              className="w-9 h-9 rounded-full object-cover border border-gray-100"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              {person.name?.[0] || "D"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-800">{person.name}</p>
            <p className="text-xs text-gray-400">{person.role}</p>
          </div>
        </div>
      </td>

      <td className="py-4 px-4 text-xs text-gray-600">
        <div>{person.hospital || "—"}</div>
        <div className="text-gray-400 text-[11px] mt-0.5">
          {person.location || ""}
        </div>
      </td>

      <td className="py-4 px-4 text-xs text-gray-600 font-medium">
        {person.availableHours || "—"}
      </td>

      <td className="py-4 px-4">
        <button
          onClick={onBook}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-xs font-medium transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          <CalendarPlus className="w-4 h-4 text-emerald-500" />
          <span>Book date</span>
        </button>
      </td>

      <td className="py-4 px-4 text-xs">
        <span
          className={`font-semibold ${
            person.confirmation === "Confirmed" ||
            person.confirmation === "Active"
              ? "text-emerald-500"
              : "text-amber-500"
          }`}
        >
          {person.confirmation || "Active"}
        </span>
      </td>
    </tr>
  );
};
