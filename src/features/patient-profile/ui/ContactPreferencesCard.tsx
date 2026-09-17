import React, { useState } from "react";

export const ContactPreferencesCard: React.FC = () => {
  const [preferences, setPreferences] = useState({
    email: true,
    mobile: true,
    mail: false,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
            <tr>
              <td className="py-4 px-6 flex items-center justify-between">
                <span className="text-gray-800 font-medium text-sm">Email</span>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-semibold ${
                      !preferences.email ? "text-red-500" : "text-gray-300"
                    }`}
                  >
                    DENY
                  </span>

                  <button
                    type="button"
                    onClick={() => togglePreference("email")}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                      preferences.email ? "bg-gray-200" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        preferences.email
                          ? "translate-x-5 !bg-emerald-500"
                          : "translate-x-0 !bg-red-500"
                      }`}
                    />
                  </button>

                  <span
                    className={`font-semibold ${
                      preferences.email ? "text-emerald-500" : "text-gray-300"
                    }`}
                  >
                    ALLOW
                  </span>
                </div>
              </td>
            </tr>

            <tr>
              <td className="py-4 px-6 flex items-center justify-between">
                <span className="text-gray-800 font-medium text-sm">
                  Mobile Phone
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-semibold ${
                      !preferences.mobile ? "text-red-500" : "text-gray-300"
                    }`}
                  >
                    DENY
                  </span>

                  <button
                    type="button"
                    onClick={() => togglePreference("mobile")}
                    className="w-11 h-6 flex items-center rounded-full p-1 bg-gray-200 cursor-pointer transition-colors duration-200 ease-in-out"
                  >
                    <div
                      className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        preferences.mobile
                          ? "translate-x-5 bg-emerald-500"
                          : "translate-x-0 bg-red-500"
                      }`}
                    />
                  </button>

                  <span
                    className={`font-semibold ${
                      preferences.mobile ? "text-emerald-500" : "text-gray-300"
                    }`}
                  >
                    ALLOW
                  </span>
                </div>
              </td>
            </tr>

            <tr>
              <td className="py-4 px-6 flex items-center justify-between">
                <span className="text-gray-800 font-medium text-sm">Mail</span>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-semibold ${
                      !preferences.mail ? "text-red-500" : "text-gray-300"
                    }`}
                  >
                    DENY
                  </span>

                  <button
                    type="button"
                    onClick={() => togglePreference("mail")}
                    className="w-11 h-6 flex items-center rounded-full p-1 bg-gray-200 cursor-pointer transition-colors duration-200 ease-in-out"
                  >
                    <div
                      className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        preferences.mail
                          ? "translate-x-5 bg-emerald-500"
                          : "translate-x-0 bg-red-500"
                      }`}
                    />
                  </button>

                  <span
                    className={`font-semibold ${
                      preferences.mail ? "text-emerald-500" : "text-gray-300"
                    }`}
                  >
                    ALLOW
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
