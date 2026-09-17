import { useQuery } from "@tanstack/react-query";
import type { PatientProfileData } from "../../../entities/patient/model/types";

const fetchPatientData = async (): Promise<PatientProfileData> => {
  return {
    id: "9790",
    fullName: "James Brown",
    role: "Patient",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    contactInfo: {
      phone: "07086459584",
      homePhone: "-",
      address: "MBS Residence number 28C.",
      email: "jamesbrown@gmail.com",
    },
    personalInfo: {
      gender: "Male",
      birthDate: "07/03/1987",
      age: 36,
      patientId: "9790",
      nationality: "Germany",
      maritalStatus: "Not married",
      emergencyContact: "23546787690",
    },
    insurance: {
      memberId: "54223467897",
      provider: "Green cross shield",
    },
    appointments: [
      {
        id: "1",
        startTime: "12-12-2021 9:40 AM",
        speciality: "Radiologist",
        status: "Cancelled",
      },
      {
        id: "2",
        startTime: "15-12-2021 12:00 AM",
        speciality: "Surgeon",
        status: "Confirmed",
      },
    ],
  };
};

export const usePatientData = () => {
  return useQuery({
    queryKey: ["patient", "9790"],
    queryFn: fetchPatientData,
  });
};
