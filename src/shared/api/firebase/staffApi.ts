import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/providers/firebase";
import type { StaffMember } from "@/entities/staff/model/types";

export const fetchMedicalStaff = async (): Promise<StaffMember[]> => {
  const querySnapshot = await getDocs(collection(db, "medical-staff"));

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || "",
      specialty: data.specialty || "",
      role: data.role || "",
      hospital: data.hospital || "",
      location: data.location || "",
      availableHours: data.availableHours || "",
      confirmation: data.confirmation || "",
      avatarUrl: data.avatarUrl || "",
    };
  });
};
