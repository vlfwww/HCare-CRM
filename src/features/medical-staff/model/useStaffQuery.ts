import { useQuery } from "@tanstack/react-query";
import { fetchMedicalStaff } from "@/shared/api/firebase/staffApi";

export const useStaffQuery = () => {
  return useQuery({
    queryKey: ["medical-staff"],
    queryFn: fetchMedicalStaff,
  });
};
