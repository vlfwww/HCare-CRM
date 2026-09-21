import React from "react";
import { auth } from "@/app/providers/firebase";
import { useContactPreferences } from "../model/useContactPreferences";

export const ContactPreferencesCard: React.FC = () => {
  const userId = auth.currentUser?.uid || "";
  const { preferences, isLoading, updatePreference } =
    useContactPreferences(userId);

  const items: { key: keyof typeof preferences; label: string }[] = [
    { key: "email", label: "Email" },
    { key: "mobile", label: "Mobile Phone" },
    { key: "mail", label: "Mail" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm font-manrope overflow-hidden">
      <div className="px-6 py-5">
        <p className="text-lg font-semibold text-gray-800">
          Contact preferences
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-gray-50/70 text-gray-400 border-y border-gray-100">
              <th className="py-3 px-6 font-medium">Contact Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(({ key, label }) => {
              const isAllowed = preferences[key];

              return (
                <tr key={key}>
                  <td className="py-4 px-6 flex items-center justify-between h-[57px]">
                    {isLoading ? (
                      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      <span className="text-gray-800 font-medium text-sm">
                        {label}
                      </span>
                    )}

                    <div className="flex items-center gap-3">
                      {isLoading ? (
                        <div className="w-40 h-6 bg-gray-100 rounded animate-pulse" />
                      ) : (
                        <>
                          <span
                            className={`font-semibold ${
                              !isAllowed ? "text-red-500" : "text-gray-300"
                            }`}
                          >
                            DENY
                          </span>

                          <button
                            type="button"
                            onClick={() => updatePreference(key, !isAllowed)}
                            className="w-11 h-6 flex items-center rounded-full p-1 bg-gray-200 cursor-pointer transition-colors duration-200 ease-in-out"
                          >
                            <div
                              className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                                isAllowed
                                  ? "translate-x-5 bg-emerald-500"
                                  : "translate-x-0 bg-red-500"
                              }`}
                            />
                          </button>

                          <span
                            className={`font-semibold ${
                              isAllowed ? "text-emerald-500" : "text-gray-300"
                            }`}
                          >
                            ALLOW
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
