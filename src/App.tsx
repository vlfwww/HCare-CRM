import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PatientProfilePage } from "./features/patient-profile/ui/PatientProfilePage";
import { MedicalStaffPage } from "./features/medical-staff/ui/MedicalStaffPage";
import { Header } from "./widgets/Header";
import { Sidebar } from "./widgets/Sidebar";

const queryClient = new QueryClient();

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100 flex flex-col font-manrope">
          <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

          <div className="flex flex-1 overflow-hidden relative">
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<PatientProfilePage />} />
                <Route path="/profile" element={<PatientProfilePage />} />
                <Route path="/medical-staff" element={<MedicalStaffPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
