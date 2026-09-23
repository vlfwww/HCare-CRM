import React, { useRef, useState } from "react";
import { useDoctorDashboard } from "../model/useDoctorDashboard";
import { EditDoctorProfileModal } from "./EditDoctorProfileModal";
import { MapPin, Building2, Clock, Calendar, Camera, UserRound } from "lucide-react";

export const DoctorDashboardPage: React.FC = () => {
  const {
    userId,
    data,
    isLoading,
    error,
    refreshData,
    updateAppointmentStatus,
    updateAvatar,
  } = useDoctorDashboard();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || file.size > 700 * 1024) {
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        void updateAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 font-medium">Loading doctor dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500 font-medium">
          {error || "Failed to load profile."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 font-manrope">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer group"
              title="Change profile photo"
            >
              {data.avatarUrl ? (
                <img
                  src={data.avatarUrl}
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserRound className="w-8 h-8" />
              )}
              <span className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/45 text-white">
                <Camera className="w-5 h-5" />
              </span>
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{data.name}</h1>
              <p className="text-sm text-emerald-600 font-medium">
                Doctor Dashboard
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  {data.hospital}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {data.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {data.availableHours}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Edit Profile
          </button>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Appointments Booked With Me
          </h2>
          {data.appointments && data.appointments.length > 0 ? (
            <div className="space-y-3">
              {data.appointments.map((app) => (
                <div
                  key={app.id}
                  className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800 text-sm">
                        {app.speciality}
                      </span>
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium">
                        Patient: {app.patientName || "Unknown"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      Time: {app.startTime}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">
                      Status:
                    </span>
                    <select
                      value={app.status || "Scheduled"}
                      onChange={(e) => {
                        if (app.patientId) {
                          void updateAppointmentStatus(
                            app.patientId,
                            app.id,
                            e.target.value,
                          );
                        }
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-sm">No appointments booked with you yet.</p>
            </div>
          )}
        </div>
      </div>

      <EditDoctorProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        doctorId={userId}
        initialData={{
          name: data.name,
          avatarUrl: data.avatarUrl,
          hospital: data.hospital,
          location: data.location,
          availableHours: data.availableHours,
        }}
        onSuccess={() => {
          void refreshData();
        }}
      />
    </div>
  );
};
