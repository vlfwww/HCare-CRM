import React, { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";

export const RootLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-manrope">
      <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="relative flex flex-1 overflow-x-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
