import type { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/providers/firebase";

const emptyPatientProfile = (user: User) => ({
  fullName: user.displayName || "",
  role: "Patient",
  avatarUrl: user.photoURL || "",
  contactInfo: {
    phone: "",
    homePhone: "",
    address: "",
    email: user.email || "",
  },
  personalInfo: {
    gender: "",
    birthDate: "",
    age: 0,
    patientId: "",
    nationality: "",
    maritalStatus: "",
    emergencyContact: "",
  },
  insurance: {
    memberId: "",
    provider: "",
  },
  activities: [],
  appointments: [],
  surveys: [],
  feedback: [],
  contactPreferences: {
    email: false,
    mobile: false,
    mail: false,
  },
  carePlans: [],
});

export const ensurePatientProfile = async (user: User): Promise<void> => {
  const staffSnapshot = await getDoc(doc(db, "medical-staff", user.uid));
  if (staffSnapshot.exists()) {
    return;
  }

  const profileRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(profileRef);
  if (
    snapshot.exists() &&
    snapshot.data()?.role?.toString().trim().toLowerCase() === "doctor"
  ) {
    return;
  }
  const defaults = emptyPatientProfile(user);

  if (!snapshot.exists()) {
    await setDoc(profileRef, defaults);
    return;
  }

  const existing = snapshot.data();
  const patch: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(defaults)) {
    if (
      key === "fullName" &&
      existing[key] === "New Patient" &&
      value !== ""
    ) {
      patch[key] = value;
      continue;
    }
    if (!(key in existing) || existing[key] === null) {
      patch[key] = value;
      continue;
    }

    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      typeof existing[key] === "object" &&
      existing[key] !== null &&
      !Array.isArray(existing[key])
    ) {
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        if (
          !(nestedKey in (existing[key] as Record<string, unknown>)) ||
          (existing[key] as Record<string, unknown>)[nestedKey] === null
        ) {
          patch[key] = {
            ...(typeof patch[key] === "object" && patch[key] !== null
              ? patch[key]
              : {}),
            [nestedKey]: nestedValue,
          };
        }
      }
    }
  }

  if (Object.keys(patch).length > 0) {
    await setDoc(profileRef, patch, { merge: true });
  }
};
