import React, { useState } from "react";
import { Plus } from "lucide-react";
import { ActionButton } from "@/shared/ui/ActionButton";
import { AppointmentModal } from "./AppointmentModal";
import type { AppointmentItem } from "@/features/patient-profile/model/types";

interface AppointmentsCardProps {
  userId: string;
  patientName: string;
  patientDob: string;
  appointments: AppointmentItem[];
  onAppointmentCreated?: (newAppointment: AppointmentItem) => void;
}

export const AppointmentsCard: React.FC<AppointmentsCardProps> = ({
  userId,
  patientName,
  patientDob,
  appointments = [],
  onAppointmentCreated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canCreate = Boolean(onAppointmentCreated);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm font-manrope overflow-hidden relative">
      <div className="flex items-center justify-between px-6 py-5">
        <p className="text-lg font-semibold text-gray-800">Appointments</p>

        {canCreate && (
          <div
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer focus:outline-none bg-transparent border-none p-0"
          >
            <ActionButton icon={Plus} />
          </div>
        )}
      </div>

      <div className="overflow-x-auto pb-4">
        {!appointments || appointments.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-xs text-gray-400">
              No appointments found for this patient
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 text-gray-400 border-y border-gray-100">
                <th className="py-3 px-6 font-medium">Start Time</th>
                <th className="py-3 px-4 font-medium">Speciality & Doctor</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((app) => {
                const rawTime =
                  app.startTime || `${app.date || ""} ${app.time || ""}`.trim();
                const [datePart, timePart] = rawTime.split(" ");
                const spec = app.speciality || app.specialty || "General";
                const status = app.status || "Pending";

                return (
                  <tr key={app.id || Math.random()}>
                    <td className="py-4 px-6 text-gray-800 font-medium">
                      <div>{datePart || rawTime}</div>
                      {timePart && (
                        <div className="text-gray-500 mt-0.5">{timePart}</div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-600 font-medium">
                      <div>{spec}</div>
                      {app.doctorName && (
                        <div className="text-gray-400 text-[10px] mt-0.5">
                          {app.doctorName}
                        </div>
                      )}
                      {app.anamnesis && (
                        <div className="text-gray-500 text-[10px] mt-1 italic">
                          Anamnesis: {app.anamnesis}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`font-semibold ${
                          status === "Confirmed" || status === "Completed"
                            ? "text-emerald-500"
                            : status === "Cancelled"
                              ? "text-red-500"
                              : "text-amber-500"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {canCreate && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={userId}
          patientName={patientName}
          patientDob={patientDob}
          onAppointmentCreated={(newApp) => {
            if (onAppointmentCreated) {
              onAppointmentCreated(newApp);
            }
          }}
        />
      )}
    </div>
  );
};
