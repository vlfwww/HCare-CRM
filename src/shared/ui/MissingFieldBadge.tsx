import React, { useState } from "react";

interface MissingFieldBadgeProps {
  fieldName: string;
  onOpenModal?: () => void;
}

export const MissingFieldBadge: React.FC<MissingFieldBadgeProps> = ({
  fieldName,
  onOpenModal,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-2">
      <span
        onClick={onOpenModal}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex h-3 w-3 cursor-pointer group"
        title={`Please fill in: ${fieldName}`}
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>

      {showTooltip && (
        <div className="absolute left-5 bottom-0 z-20 bg-gray-900 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
          Required: {fieldName} (Click to fill)
        </div>
      )}
    </div>
  );
};
