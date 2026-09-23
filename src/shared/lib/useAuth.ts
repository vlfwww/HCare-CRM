import { useState, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/app/providers/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          let isStaffDoctor = false;
          try {
            const doctorSnap = await getDoc(
              doc(db, "medical-staff", firebaseUser.uid),
            );
            isStaffDoctor =
              doctorSnap.exists() &&
              doctorSnap.data()?.role?.toString().trim().toLowerCase() ===
                "doctor";
          } catch (error) {
            console.error("Error checking medical staff role:", error);
          }

          if (!isStaffDoctor) {
            const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
            isStaffDoctor =
              userSnap.exists() &&
              userSnap.data()?.role?.toString().trim().toLowerCase() ===
                "doctor";
          }
          setIsDoctor(isStaffDoctor);
        } catch (error) {
          console.error("Error checking user role:", error);
          setIsDoctor(false);
        }
      } else {
        setIsDoctor(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, isDoctor, loading };
}
