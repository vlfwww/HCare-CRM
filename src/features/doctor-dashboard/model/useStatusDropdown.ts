import { useCallback, useEffect, useRef, useState } from "react";

export const statusOptions = [
  "Scheduled",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const;

export type AppointmentStatus = (typeof statusOptions)[number];

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

export const useStatusDropdown = (
  onChange: (status: AppointmentStatus) => void,
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<DropdownPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const menuHeight = statusOptions.length * 36 + 8;
    const openAbove = rect.bottom + menuHeight > window.innerHeight;
    setPosition({
      top: openAbove ? rect.top - menuHeight : rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 136),
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  const selectStatus = (status: AppointmentStatus) => {
    onChange(status);
    setIsOpen(false);
  };

  return {
    isOpen,
    position,
    triggerRef,
    menuRef,
    toggle: () => setIsOpen((open) => !open),
    selectStatus,
  };
};
