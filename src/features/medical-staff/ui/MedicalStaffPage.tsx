import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { mockStaff } from "../../../entities/staff/api/mockStaff";
import { StaffRow } from "../../../entities/staff/ui/StaffRow";

export const MedicalStaffPage: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 font-manrope">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Medical Staff
          </h1>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors bg-white cursor-pointer shadow-2xs">
            <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
            <span>Filter</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/70 text-gray-400 text-xs font-semibold border-b border-gray-100">
                  <th className="py-3.5 px-6">Name</th>
                  <th className="py-3.5 px-4">City/Country</th>
                  <th className="py-3.5 px-4">Available hours</th>
                  <th className="py-3.5 px-4">Schedule an appointment</th>
                  <th className="py-3.5 px-4">Confirmation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockStaff.map((person) => (
                  <StaffRow key={person.id} person={person} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
