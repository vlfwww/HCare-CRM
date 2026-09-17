import React from "react";
import { Plus } from "lucide-react";
import { ActionButton } from "../../../shared/ui/ActionButton";

interface AppointmentsCardProps {
  appointments: Array<{
    id: string;
    startTime: string;
    speciality: string;
    status: "Cancelled" | "Confirmed" | "Pending";
  }>;
}

export const AppointmentsCard: React.FC<AppointmentsCardProps> = ({
  appointments,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm font-manrope overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5">
        <p className="text-lg font-semibold text-gray-800">Appointments</p>
        <ActionButton icon={Plus} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-gray-50/70 text-gray-400 border-y border-gray-100">
              <th className="py-3 px-6 font-medium">Start Time</th>
              <th className="py-3 px-4 font-medium">Speciality</th>
              <th className="py-3 px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.map((app) => {
              const [date, time] = app.startTime.split(" ");

              return (
                <tr key={app.id}>
                  <td className="py-4 px-6 text-gray-800 font-medium">
                    <div>{date}</div>
                    {time && <div className="text-gray-500 mt-0.5">{time}</div>}
                  </td>
                  <td className="py-4 px-4 text-gray-600 font-medium">
                    {app.speciality}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`font-semibold ${
                        app.status === "Confirmed"
                          ? "text-emerald-500"
                          : "text-amber-500"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
