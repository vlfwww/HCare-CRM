import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { SurveyItem } from "../model/types";

interface SurveyBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSurveys: string[];
  onSurveyCreated: (newSurvey: Omit<SurveyItem, "id">) => void;
}

export const SurveyBookingModal: React.FC<SurveyBookingModalProps> = ({
  isOpen,
  onClose,
  availableSurveys,
  onSurveyCreated,
}) => {
  const [selectedTitle, setSelectedTitle] = useState(availableSurveys[0] || "");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");

  useEffect(() => {
    if (availableSurveys.length > 0 && !selectedTitle) {
      setSelectedTitle(availableSurveys[0]);
    }
  }, [availableSurveys, selectedTitle]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setSelectedDate("");
      setSelectedTime("");
      setDateError("");
      setTimeError("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const validateInputs = (dateVal: string, timeVal: string) => {
    let dErr = "";
    let tErr = "";

    const today = new Date();
    const chosenDate = dateVal ? new Date(dateVal) : null;

    if (chosenDate) {
      const todayDateOnly = new Date(today);
      todayDateOnly.setHours(0, 0, 0, 0);
      const chosenDateOnly = new Date(chosenDate);
      chosenDateOnly.setHours(0, 0, 0, 0);

      if (chosenDateOnly < todayDateOnly) {
        dErr = "Cannot select a past date";
      }
    }

    if (timeVal) {
      const [hours, minutes] = timeVal.split(":").map(Number);

      if (hours < 8 || hours >= 18) {
        tErr = "Please select working hours (08:00 - 18:00)";
      } else if (chosenDate) {
        const isToday =
          chosenDate.getDate() === today.getDate() &&
          chosenDate.getMonth() === today.getMonth() &&
          chosenDate.getFullYear() === today.getFullYear();

        if (isToday) {
          const nowHours = today.getHours();
          const nowMinutes = today.getMinutes();
          if (
            hours < nowHours ||
            (hours === nowHours && minutes <= nowMinutes)
          ) {
            tErr = "Cannot select past time";
          }
        }
      }
    }

    setDateError(dErr);
    setTimeError(tErr);
    return !dErr && !tErr;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedDate(val);
    validateInputs(val, selectedTime);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedTime(val);
    validateInputs(selectedDate, val);
  };

  const handleSave = () => {
    if (!selectedDate || !selectedTime) return;

    const isValid = validateInputs(selectedDate, selectedTime);
    if (!isValid) return;

    const dateTimeFormatted = new Date(
      `${selectedDate}T${selectedTime}`,
    ).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    onSurveyCreated({
      title: selectedTitle,
      completedDate: dateTimeFormatted,
      details: "Scheduled",
    });

    setSelectedDate("");
    setSelectedTime("");
    setDateError("");
    setTimeError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Book a Survey</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Select Survey
            </label>
            <select
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
              className="w-full bg-transparent border-b border-gray-200 rounded-none px-0 pb-2 text-sm text-gray-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {availableSurveys.map((survey) => (
                <option key={survey} value={survey}>
                  {survey}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={handleDateChange}
              className={`w-full bg-transparent border-b ${
                dateError ? "border-red-500" : "border-gray-200"
              } rounded-none px-0 pb-2 text-sm text-gray-700 focus:outline-none focus:border-emerald-500`}
            />
            {dateError && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">
                {dateError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
              className={`w-full bg-transparent border-b ${
                timeError ? "border-red-500" : "border-gray-200"
              } rounded-none px-0 pb-2 text-sm text-gray-700 focus:outline-none focus:border-emerald-500`}
            />
            {timeError && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">
                {timeError}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={
                !selectedDate || !selectedTime || !!dateError || !!timeError
              }
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50 cursor-pointer"
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
