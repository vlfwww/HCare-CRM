import React from "react";
import { SlidersHorizontal, Loader2, AlertCircle } from "lucide-react";
import { StaffRow } from "@/features/medical-staff/ui/StaffRow";
import { AppointmentModal } from "@/features/appointments/ui/AppointmentModal";
import { FilterModal } from "@/features/medical-staff/ui/FilterModal";
import { useMedicalStaff } from "../model/useMedicalStaff";

export const MedicalStaffPage: React.FC = () => {
  const {
    staffList,
    isLoading,
    isError,
    isModalOpen,
    selectedDoctorId,
    userId,
    patientName,
    patientDob,
    isFilterModalOpen,
    setIsFilterModalOpen,
    selectedRole,
    setSelectedRole,
    selectedCity,
    setSelectedCity,
    availableRoles,
    handleOpenModalWithDoctor,
    handleCloseModal,
    handleAppointmentCreated,
    handleResetFilters,
  } = useMedicalStaff();

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-4 sm:py-6 font-manrope">
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-8 shadow-xs">
        <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Medical Staff
          </h1>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors bg-white cursor-pointer shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
            <span>Filter</span>
            {(selectedRole || selectedCity) && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-hidden">
            <table className="w-full table-fixed text-left">
              <thead>
                <tr className="bg-gray-50/70 text-gray-600 text-xs font-semibold border-b border-gray-100">
                  <th className="py-3.5 px-3 sm:px-6">Name</th>
                  <th className="py-3.5 px-3 sm:px-4">City/Country</th>
                  <th className="py-3.5 px-4">Available hours</th>
                  <th className="py-3.5 px-4">Schedule an appointment</th>
                  <th className="py-3.5 px-4">Confirmation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                        <span>Loading staff from Firebase...</span>
                      </div>
                    </td>
                  </tr>
                )}

                {isError && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-red-500">
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>Failed to load medical staff data.</span>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isError &&
                  staffList &&
                  staffList.length > 0 &&
                  staffList.map((person) => (
                    <StaffRow
                      key={person.id}
                      person={person}
                      onBook={() => handleOpenModalWithDoctor(person.id)}
                    />
                  ))}

                {!isLoading &&
                  !isError &&
                  (!staffList || staffList.length === 0) && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-gray-400 text-sm"
                      >
                        No medical staff found matching your criteria.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userId={userId}
        patientName={patientName}
        patientDob={patientDob}
        initialDoctorId={selectedDoctorId}
        onAppointmentCreated={handleAppointmentCreated}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        availableRoles={availableRoles}
        onReset={handleResetFilters}
      />
    </div>
  );
};
