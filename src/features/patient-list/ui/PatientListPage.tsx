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
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-4 sm:py-6 font-manrope">
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-8 shadow-sm">
        <div className="flex flex-wrap gap-3 justify-between items-start mb-6">
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
              <thead className="hidden sm:table-header-group">
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Birth Date</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="block divide-y divide-gray-100 text-sm sm:table-row-group">
                {patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="block p-4 hover:bg-gray-50/60 transition-colors sm:table-row sm:p-0"
                  >
                    <td className="block px-0 py-3 font-medium text-gray-800 sm:table-cell sm:px-4 sm:py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-24 shrink-0 text-xs font-semibold text-gray-500 sm:hidden">
                          Patient
                        </span>
                        <div className="w-9 h-9 shrink-0 rounded-full bg-emerald-100 text-emerald-700 flex items-center font-bold justify-center text-xs">
                          {patient.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="min-w-0 break-words">
                          {patient.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="block px-0 py-3 text-gray-600 sm:table-cell sm:px-4 sm:py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-24 shrink-0 text-xs font-semibold text-gray-500 sm:hidden">
                          Gender
                        </span>
                        <span>{patient.personalInfo?.gender || "Not specified"}</span>
                      </div>
                    </td>
                    <td className="block px-0 py-3 text-gray-600 sm:table-cell sm:px-4 sm:py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-24 shrink-0 text-xs font-semibold text-gray-500 sm:hidden">
                          Birth Date
                        </span>
                        <span>{patient.personalInfo?.birthDate || "Not specified"}</span>
                      </div>
                    </td>
                    <td className="block px-0 py-3 sm:table-cell sm:px-4 sm:py-4">
                      <div className="flex items-center gap-3 sm:block">
                        <span className="w-24 shrink-0 text-xs font-semibold text-gray-500 sm:hidden">
                          Actions
                        </span>
                      <button
                        type="button"
                        onClick={() => onSelectPatient(patient.id)}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                      >
                        View Profile & Care Plan
                      </button>
                      </div>
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
