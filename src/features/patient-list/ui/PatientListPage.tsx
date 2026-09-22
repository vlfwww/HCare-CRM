import React from "react";
import { usePatientList } from "../model/usePatientList";

interface PatientListPageProps {
  onSelectPatient: (patientId: string) => void;
}

export const PatientListPage: React.FC<PatientListPageProps> = ({
  onSelectPatient,
}) => {
  const { patients, isLoading, error } = usePatientList();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 font-medium">Loading patients list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500 font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 font-manrope">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Patients Directory
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a patient to view and manage their medical care plan.
            </p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-200">
            Total Patients: {patients.length}
          </span>
        </div>

        {patients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Birth Date</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-gray-800 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center font-bold justify-center text-xs">
                        {patient.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      {patient.fullName}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {patient.personalInfo?.gender || "Not specified"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {patient.personalInfo?.birthDate || "Not specified"}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => onSelectPatient(patient.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                      >
                        View Profile & Care Plan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm font-medium">
              No patients found in the system.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
