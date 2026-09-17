export interface PatientProfileData {
  id: string;
  fullName: string;
  role: string;
  avatarUrl: string;
  contactInfo: {
    phone: string;
    homePhone: string;
    address: string;
    email: string;
  };
  personalInfo: {
    gender: string;
    birthDate: string;
    age: number;
    patientId: string;
    nationality: string;
    maritalStatus: string;
    emergencyContact: string;
  };
  insurance: {
    memberId: string;
    provider: string;
  };
  appointments: Array<{
    id: string;
    startTime: string;
    speciality: string;
    status: "Cancelled" | "Confirmed" | "Pending";
  }>;
}
