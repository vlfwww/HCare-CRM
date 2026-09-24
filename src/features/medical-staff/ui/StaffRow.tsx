import React from "react";
import { CalendarPlus } from "lucide-react";
import type { StaffMember } from "@/entities/staff/model/types";

interface StaffRowProps {
  person: StaffMember;
  onBook: () => void;
}

export const StaffRow: React.FC<StaffRowProps> = ({ person, onBook }) => {
  return (
    <tr className="block p-4 hover:bg-gray-50/50 transition-colors sm:table-row sm:p-0">
      <td className="block px-0 py-3 sm:table-cell sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-xs font-semibold text-gray-500 sm:hidden">
            Name
          </span>
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
          <div className="min-w-0">
            <p className="break-words text-sm font-semibold text-gray-800">
              {person.name}
            </p>
            <p className="break-words text-xs text-gray-400">{person.role}</p>
          </div>
        </div>
      </td>

      <td className="block px-0 py-3 text-xs text-gray-600 sm:table-cell sm:px-4 sm:py-4">
        <div className="flex items-start gap-3 sm:block">
          <span className="w-28 shrink-0 text-xs font-semibold text-gray-500 sm:hidden">
            City/Country
          </span>
          <div>
            <div>{person.hospital || "—"}</div>
            <div className="mt-0.5 text-[11px] text-gray-400">
              {person.location || ""}
            </div>
          </div>
        </div>
      </td>

      <td className="block px-0 py-3 text-xs font-medium text-gray-600 sm:table-cell sm:px-4 sm:py-4">
        <div className="flex items-center gap-3 sm:block">
          <span className="w-28 shrink-0 text-xs font-semibold text-gray-500 sm:hidden">
            Available hours
          </span>
          <span>{person.availableHours || "—"}</span>
        </div>
      </td>

      <td className="block px-0 py-3 sm:table-cell sm:px-4 sm:py-4">
        <div className="flex items-center gap-3 sm:block">
          <span className="w-28 shrink-0 text-xs font-semibold text-gray-500 sm:hidden">
            Appointment
          </span>
          <button
            type="button"
            onClick={onBook}
            className="flex items-center gap-2 border-none bg-transparent p-0 text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700 cursor-pointer"
          >
            <CalendarPlus className="h-4 w-4 text-emerald-500" />
            <span>Book date</span>
          </button>
        </div>
      </td>

      <td className="block px-0 py-3 text-xs sm:table-cell sm:px-4 sm:py-4">
        <div className="flex items-center gap-3 sm:block">
          <span className="w-28 shrink-0 text-xs font-semibold text-gray-500 sm:hidden">
            Confirmation
          </span>
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
        </div>
      </td>
    </tr>
  );
};
