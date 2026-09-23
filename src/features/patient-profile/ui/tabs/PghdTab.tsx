import React from "react";
import { DeviceSimulator } from "../DeviceSimulator";

export interface PghdItem {
  id: string;
  metricName: string;
  value: string;
  date: string;
  source?: string;
  status?: "Normal" | "Warning" | "Critical" | string;
}

interface PghdTabProps {
  userId: string;
  pghdData?: PghdItem[];
  isDoctor?: boolean;
}

export const PghdTab: React.FC<PghdTabProps> = ({ userId, pghdData = [] }) => {
  return (
    <div className="space-y-6 font-manrope">
      <DeviceSimulator userId={userId} />

      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <th className="py-3 px-6 font-medium">Metric / Parameter</th>
                <th className="py-3 px-4 font-medium">Value</th>
                <th className="py-3 px-4 font-medium">Date & Time</th>
                <th className="py-3 px-4 font-medium">Source</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pghdData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-600">
                    <p className="font-medium">
                      No PGHD records available yet.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Open the device simulator above to generate test
                      telemetry.
                    </p>
                  </td>
                </tr>
              ) : (
                pghdData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-800 font-medium">
                      {item.metricName}
                    </td>
                    <td className="py-4 px-4 text-gray-800 font-semibold">
                      {item.value}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {item.date || "—"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {item.source ? (
                        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[11px]">
                          {item.source}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {item.status ? (
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium border inline-block ${
                            item.status === "Normal"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                              : item.status === "Warning"
                                ? "bg-amber-50 text-amber-700 border-amber-200/60"
                                : "bg-red-50 text-red-700 border-red-200/60"
                          }`}
                        >
                          {item.status}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
