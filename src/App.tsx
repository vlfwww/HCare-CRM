import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PatientProfilePage } from "./features/patient-profile/ui/PatientProfilePage";
import { Header } from "./widgets/Header/Header";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />

        <main className="flex-1">
          <PatientProfilePage />
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
