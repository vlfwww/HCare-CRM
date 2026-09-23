import React, { useState } from "react";

export interface PrescriptionItem {
  id: string;
  medicationName: string;
  startDate: string;
  duration: string;
  dosage: string;
  doctorName?: string;
  createdAt?: string;
}

interface PrescriptionsTabProps {
  userId: string;
  prescriptions: PrescriptionItem[];
  isDoctor?: boolean;
  onAddPrescription: (
    prescriptionData: Omit<PrescriptionItem, "id" | "createdAt">,
  ) => Promise<void>;
}

export const PrescriptionsTab: React.FC<PrescriptionsTabProps> = ({
  prescriptions = [],
  isDoctor = false,
  onAddPrescription,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [medicationName, setMedicationName] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [duration, setDuration] = useState("7 days");
  const [dosage, setDosage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicationName.trim() || !dosage.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddPrescription({
        medicationName,
        startDate,
        duration,
        dosage,
        doctorName: "Dr. Medical Specialist",
      });

      setMedicationName("");
      setDosage("");
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-manrope">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-gray-800">
            Active Prescriptions
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Prescribed medications, dosages, and administration guidelines.
          </p>
        </div>
        {isDoctor && (
          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            {isFormOpen ? "✕ Cancel" : "+ Prescribe Medication"}
          </button>
        )}
      </div>

      {isDoctor && isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 animate-fadeIn"
        >
          <h4 className="font-bold text-gray-800 text-sm pb-2 border-b border-gray-100">
            New Medication Prescription
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Medication Name
              </label>
              <input
                type="text"
                required
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                placeholder="e.g. Amoxicillin"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Duration / Validity
              </label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 10 days, 1 month"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:border-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Dosage & Administration Instructions
            </label>
            <textarea
              required
              rows={2}
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g. 1 pill twice a day after meals with plenty of water"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:border-gray-900 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save & Issue Prescription"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prescriptions.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-600 bg-white rounded-xl border border-gray-200">
            <p className="font-medium">No active prescriptions found.</p>
            <p className="text-xs text-gray-600 mt-1">
              {isDoctor
                ? "Use the button above to issue a prescription."
                : "Prescriptions added by your doctor will show up here."}
            </p>
          </div>
        ) : (
          prescriptions.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">
                    {item.medicationName}
                  </h4>
                  <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                    Active Prescription
                  </p>
                </div>
                <span className="bg-gray-100 text-gray-600 text-[11px] px-2.5 py-1 rounded-md font-medium">
                  Valid: {item.duration}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs text-gray-700 space-y-1">
                <p>
                  <strong className="text-gray-900">Instructions:</strong>{" "}
                  {item.dosage}
                </p>
              </div>

              <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1 border-t border-gray-100">
                <span>Started: {item.startDate}</span>
                {item.doctorName && (
                  <span>Prescribed by {item.doctorName}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
