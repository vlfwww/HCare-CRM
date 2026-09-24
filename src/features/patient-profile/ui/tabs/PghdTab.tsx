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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="hidden sm:table-header-group">
              <tr className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <th className="py-3 px-6 font-medium">Metric / Parameter</th>
                <th className="py-3 px-4 font-medium">Value</th>
                <th className="py-3 px-4 font-medium">Date & Time</th>
                <th className="py-3 px-4 font-medium">Source</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="block divide-y divide-gray-100 sm:table-row-group">
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
                    className="block p-4 hover:bg-gray-50/50 transition-colors sm:table-row sm:p-0"
                  >
                    <td className="block px-0 py-3 text-gray-800 font-medium sm:table-cell sm:px-6 sm:py-4">
                      <div className="flex items-start gap-3">
                        <span className="w-24 shrink-0 text-xs font-semibold text-gray-500 sm:hidden">Metric</span>
                        <span className="min-w-0 break-words">{item.metricName}</span>
                      </div>
                    </td>
                    <td className="block px-0 py-3 text-gray-800 font-semibold sm:table-cell sm:px-4 sm:py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-24 shrink-0 text-xs font-semibold text-gray-500 sm:hidden">Value</span>
                        <span className="break-words">{item.value}</span>
                      </div>
                    </td>
                    <td className="block px-0 py-3 text-gray-600 sm:table-cell sm:px-4 sm:py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-24 shrink-0 text-xs font-semibold text-gray-500 sm:hidden">Date & Time</span>
                        <span className="break-words">{item.date || "—"}</span>
                      </div>
                    </td>
                    <td className="block px-0 py-3 text-gray-600 sm:table-cell sm:px-4 sm:py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-24 shrink-0 text-xs font-semibold text-gray-500 sm:hidden">Source</span>
                        {item.source ? (
                        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[11px]">
                          {item.source}
                        </span>
                        ) : "—"}
                      </div>
                    </td>
                    <td className="block px-0 py-3 sm:table-cell sm:px-4 sm:py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-24 shrink-0 text-xs font-semibold text-gray-500 sm:hidden">Status</span>
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
                        ) : <span className="text-gray-400">—</span>}
                      </div>
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
