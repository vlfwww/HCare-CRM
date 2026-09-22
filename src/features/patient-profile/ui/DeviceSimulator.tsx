import React, { useState } from "react";
import { db } from "@/app/providers/firebase";
import { collection, addDoc } from "firebase/firestore";

interface DeviceSimulatorProps {
  userId: string;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({ userId }) => {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [metricName, setMetricName] = useState("Blood Pressure");
  const [value, setValue] = useState("120/80 mmHg");
  const [source, setSource] = useState("Smart Watch");
  const [status, setStatus] = useState<"Normal" | "Warning" | "Critical">(
    "Normal",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimulateDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || !userId) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, `users/${userId}/pghd`), {
        metricName,
        value,
        date: new Date().toLocaleString(),
        source,
        status,
        createdAt: new Date().toISOString(),
      });
      setValue("");
      setIsSimulatorOpen(false);
    } catch (error) {
      console.error("Error adding PGHD record to DB:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerPreset = (preset: {
    name: string;
    val: string;
    src: string;
    stat: "Normal" | "Warning" | "Critical";
  }) => {
    setMetricName(preset.name);
    setValue(preset.val);
    setSource(preset.src);
    setStatus(preset.stat);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-gray-800">
            Patient-Generated Health Data (PGHD)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Wearable data, telemetry streams, and self-monitoring indicators.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
          className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer"
        >
          <span>
            {isSimulatorOpen
              ? "Close Device Simulator"
              : "Simulate Device Data"}
          </span>
        </button>
      </div>

      {isSimulatorOpen && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all animate-fadeIn">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div>
              <h4 className="font-bold text-gray-800 text-sm">
                Virtual Wearable Telemetry Generator
              </h4>
              <p className="text-xs text-gray-500">
                Test incoming metrics stream. Data will be instantly synced to
                the database.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-xs text-gray-400 self-center mr-1">
              Presets:
            </span>
            <button
              type="button"
              onClick={() =>
                triggerPreset({
                  name: "Blood Pressure",
                  val: "118/78 mmHg",
                  src: "Smart Watch",
                  stat: "Normal",
                })
              }
              className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition"
            >
              💓 BP: 118/78
            </button>
            <button
              type="button"
              onClick={() =>
                triggerPreset({
                  name: "Heart Rate",
                  val: "135 bpm",
                  src: "Fitness Band",
                  stat: "Warning",
                })
              }
              className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition"
            >
              📈 HR: 135 bpm
            </button>
            <button
              type="button"
              onClick={() =>
                triggerPreset({
                  name: "Blood Glucose",
                  val: "5.4 mmol/L",
                  src: "Glucometer",
                  stat: "Normal",
                })
              }
              className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition"
            >
              🩸 Glucose: 5.4
            </button>
          </div>

          <form
            onSubmit={handleSimulateDevice}
            className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
          >
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Metric Name
              </label>
              <select
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:border-gray-900"
              >
                <option value="Blood Pressure">Blood Pressure</option>
                <option value="Heart Rate">Heart Rate</option>
                <option value="Blood Glucose">Blood Glucose</option>
                <option value="Weight">Weight</option>
                <option value="Sleep Duration">Sleep Duration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Value & Unit
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 120/80"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Device Source
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Apple Health"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:border-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer h-[34px] disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Push to Database"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
