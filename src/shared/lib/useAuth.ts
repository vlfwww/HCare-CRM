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
          const doctorRef = doc(db, "medical-staff", firebaseUser.uid);
          const doctorSnap = await getDoc(doctorRef);

          if (doctorSnap.exists()) {
            setIsDoctor(true);
          } else {
            const userRef = doc(db, "users", firebaseUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists() && userSnap.data()?.role === "Doctor") {
              setIsDoctor(true);
            } else {
              setIsDoctor(false);
            }
          }
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
