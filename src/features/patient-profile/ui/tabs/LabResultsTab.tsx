import React, { useState } from "react";
import type { SurveyItem } from "../../model/types";

interface LabResultsTabProps {
  isDoctor: boolean;
  surveys: SurveyItem[];
  onUpdateSurveyResult?: (
    surveyId: string,
    details: string,
    status?: string,
  ) => void;
}

export const LabResultsTab: React.FC<LabResultsTabProps> = ({
  isDoctor,
  surveys = [],
  onUpdateSurveyResult,
}) => {
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [status, setStatus] = useState<string>("Completed");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!selectedSurveyId || !details.trim()) return;

    if (onUpdateSurveyResult) {
      onUpdateSurveyResult(selectedSurveyId, details, status);
    }

    setSelectedSurveyId("");
    setDetails("");
    setStatus("Completed");
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-8 font-manrope">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">
          Lab Results & Surveys
        </h3>
      </div>

      {isDoctor && (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h4 className="font-semibold text-gray-700 text-sm mb-4">
            Add / Update Examination Result
          </h4>
          <form onSubmit={handleSave} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Select Survey / Examination{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSurveyId}
                onChange={(e) => setSelectedSurveyId(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none bg-white ${
                  isSubmitted && !selectedSurveyId
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-emerald-500"
                }`}
              >
                <option value="">-- Choose patient survey --</option>
                {surveys.map((survey) => (
                  <option key={survey.id} value={survey.id}>
                    {survey.title} ({survey.completedDate || "Scheduled"})
                  </option>
                ))}
              </select>
              {isSubmitted && !selectedSurveyId && (
                <p className="text-red-500 text-xs mt-1">
                  This field is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Result Details / Description{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Enter lab results, notes or diagnosis..."
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none bg-white ${
                  isSubmitted && !details.trim()
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-emerald-500"
                }`}
              />
              {isSubmitted && !details.trim() && (
                <p className="text-red-500 text-xs mt-1">
                  This field is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="Completed">Completed</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Save Results
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 text-gray-600 border-y border-gray-100">
                <th className="py-3 px-6 font-medium">Title</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Results / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {surveys.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-600">
                    No lab results or surveys available yet.
                  </td>
                </tr>
              ) : (
                surveys.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-800 font-medium">
                      {item.title}
                    </td>
                    <td className="py-4 px-4 text-gray-600 font-medium">
                      {item.completedDate || "—"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {item.status ? (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block">
                          {item.status}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {item.details ? (
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100 inline-block">
                          {item.details}
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
