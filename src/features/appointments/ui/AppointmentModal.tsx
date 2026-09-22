import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { db } from "@/app/providers/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { StaffMember } from "@/entities/staff/model/types";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  patientName: string;
  patientDob: string;
  initialDoctorId?: string;
  onAppointmentCreated: (newAppointment: any) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  userId,
  patientName,
  patientDob,
  initialDoctorId,
  onAppointmentCreated,
}) => {
  const [doctors, setDoctors] = useState<StaffMember[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [anamnesis, setAnamnesis] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchStaff = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "medical-staff"));
        const staffList: StaffMember[] = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          return {
            id: docSnap.id,
            name: data.name || "",
            role: data.role || "",
            hospital: data.hospital || "",
            location: data.location || "",
            availableHours: data.availableHours || "",
            confirmation: data.confirmation || "",
            avatarUrl: data.avatarUrl || "",
          };
        });
        setDoctors(staffList);
      } catch (error) {
        console.error("Error fetching medical staff:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialDoctorId) {
      setSelectedDoctorId(initialDoctorId);
    } else if (isOpen && !initialDoctorId) {
      setSelectedDoctorId("");
    }
  }, [isOpen, initialDoctorId]);

  const selectedDoctor = doctors.find((doc) => doc.id === selectedDoctorId);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDoctor || !selectedDate) {
        setBookedSlots([]);
        return;
      }

      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const booked: string[] = [];

        usersSnapshot.docs.forEach((userDoc) => {
          const userData = userDoc.data();
          const userAppointments = userData.appointments || [];

          if (Array.isArray(userAppointments)) {
            userAppointments.forEach((app: any) => {
              if (app.doctorName === selectedDoctor.name && app.startTime) {
                const [datePart, timePart] = app.startTime.split(" ");
                if (datePart === selectedDate && timePart) {
                  booked.push(timePart);
                }
              }
            });
          }
        });

        setBookedSlots(booked);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
        setBookedSlots([]);
      }
    };

    fetchBookedSlots();
  }, [selectedDoctor, selectedDate]);

  const generateSlots = (hoursStr: string) => {
    if (!hoursStr.includes("-"))
      return ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
    const [start, end] = hoursStr.split("-").map((s) => s.trim());
    const startHour = parseInt(start.split(":")[0], 10);
    const endHour = parseInt(end.split(":")[0], 10);

    const slots: string[] = [];
    for (let h = startHour; h < endHour; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
      slots.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const rawSlots = selectedDoctor
    ? generateSlots(selectedDoctor.availableHours)
    : [];
  const availableSlots = rawSlots.filter((slot) => !bookedSlots.includes(slot));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedDoctor || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    try {
      const fullStartTime = `${selectedDate} ${selectedTime}`;

      const newAppointment = {
        id: `app-${Date.now()}`,
        startTime: fullStartTime,
        speciality: selectedDoctor.role,
        doctorName: selectedDoctor.name,
        patientName,
        patientDob,
        anamnesis,
        status: "Pending" as const,
        createdAt: new Date().toISOString(),
      };

      await onAppointmentCreated(newAppointment);
      onClose();

      setSelectedDoctorId("");
      setSelectedDate("");
      setSelectedTime("");
      setAnamnesis("");
      setBookedSlots([]);
    } catch (error) {
      console.error("Error saving appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden p-6 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Book an Appointment
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs">
            <div>
              <span className="text-gray-400 block mb-0.5">Patient:</span>
              <span className="font-semibold text-gray-800">
                {patientName || "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">Date of Birth:</span>
              <span className="font-semibold text-gray-800">
                {patientDob || "Not specified"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Doctor / Role
            </label>
            {isLoading ? (
              <p className="text-xs text-gray-400 py-2">Loading doctors...</p>
            ) : (
              <select
                value={selectedDoctorId}
                onChange={(e) => {
                  setSelectedDoctorId(e.target.value);
                  setSelectedTime("");
                }}
                required
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Select a doctor --</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.role} [Hours: {doc.availableHours}]
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Appointment Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime("");
              }}
              required
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {selectedDoctor && selectedDate && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Available Time Slots
              </label>
              {availableSlots.length === 0 ? (
                <p className="text-xs text-red-500 py-2">
                  No available slots for this date.
                </p>
              ) : (
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Select time --</option>
                  {availableSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Anamnesis / Symptoms
            </label>
            <textarea
              value={anamnesis}
              onChange={(e) => setAnamnesis(e.target.value)}
              rows={3}
              placeholder="Describe symptoms or reason for visit..."
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || availableSlots.length === 0}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
