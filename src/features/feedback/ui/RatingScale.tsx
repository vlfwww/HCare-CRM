import React from "react";

interface RatingScaleProps {
  question: string;
  selectedValue: number | null;
  onSelect: (value: number) => void;
}

const ratingColors: Record<
  number,
  { border: string; text: string; hover: string }
> = {
  1: {
    border: "border-red-500",
    text: "text-red-500",
    hover: "hover:bg-red-50",
  },
  2: {
    border: "border-red-400",
    text: "text-red-400",
    hover: "hover:bg-red-50",
  },
  3: {
    border: "border-orange-500",
    text: "text-orange-500",
    hover: "hover:bg-orange-50",
  },
  4: {
    border: "border-orange-400",
    text: "text-orange-400",
    hover: "hover:bg-orange-50",
  },
  5: {
    border: "border-amber-400",
    text: "text-amber-500",
    hover: "hover:bg-amber-50",
  },
  6: {
    border: "border-yellow-500",
    text: "text-yellow-600",
    hover: "hover:bg-yellow-50",
  },
  7: {
    border: "border-lime-400",
    text: "text-lime-600",
    hover: "hover:bg-lime-50",
  },
  8: {
    border: "border-emerald-400",
    text: "text-emerald-500",
    hover: "hover:bg-emerald-50",
  },
  9: {
    border: "border-teal-400",
    text: "text-teal-500",
    hover: "hover:bg-teal-50",
  },
  10: {
    border: "border-emerald-500",
    text: "text-emerald-600",
    hover: "hover:bg-emerald-50",
  },
};

export const RatingScale: React.FC<RatingScaleProps> = ({
  question,
  selectedValue,
  onSelect,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
      <h3 className="text-sm font-semibold text-gray-900 mb-6">{question}</h3>

      <div className="flex items-center justify-between gap-1 sm:gap-2 mb-3">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
          const isSelected = selectedValue === num;
          const colors = ratingColors[num];

          return (
            <button
              key={num}
              type="button"
              onClick={() => onSelect(num)}
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                isSelected
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-105"
                  : `${colors.border} ${colors.text} ${colors.hover} bg-white`
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between text-[11px] text-gray-400 font-medium px-1">
        <span>Absolutely not satisfied</span>
        <span>Absolutely satisfied</span>
      </div>
    </div>
  );
};
