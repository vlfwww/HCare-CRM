import React from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Check,
} from "lucide-react";
import {
  statusOptions,
  useStatusDropdown,
  type AppointmentStatus,
} from "../model/useStatusDropdown";

interface StatusDropdownProps {
  value: string;
  onChange: (status: AppointmentStatus) => void;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  value,
  onChange,
}) => {
  const {
    isOpen,
    position,
    triggerRef,
    menuRef,
    toggle,
    selectStatus,
  } = useStatusDropdown(onChange);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="inline-flex min-w-[136px] items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-left text-xs font-semibold text-gray-700 shadow-xs transition-colors hover:border-emerald-500 focus:outline-none focus:border-emerald-500"
      >
        <span>{value}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0" />
      </button>

      {isOpen &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-label="Appointment status"
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              width: position.width,
              zIndex: 1000,
            }}
            className="rounded-lg border border-gray-200 bg-white p-1 shadow-xl"
          >
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                role="option"
                aria-selected={status === value}
                onClick={() => selectStatus(status)}
                className="flex h-8 w-full items-center justify-between rounded-md px-3 text-left text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <span>{status}</span>
                {status === value && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
};
