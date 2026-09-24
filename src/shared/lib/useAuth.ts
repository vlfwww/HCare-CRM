import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/app/providers/firebase";

interface AuthState {
  user: User | null;
  isDoctor: boolean;
  loading: boolean;
  roleError: Error | null;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roleError, setRoleError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setRoleError(null);

      if (firebaseUser) {
        try {
          let isStaffDoctor = false;
          const doctorSnap = await getDoc(
            doc(db, "medical-staff", firebaseUser.uid),
          );
          isStaffDoctor =
            doctorSnap.exists() &&
            doctorSnap.data()?.role?.toString().trim().toLowerCase() ===
              "doctor";
          setIsDoctor(isStaffDoctor);
        } catch (error) {
          console.error("Error checking user role:", error);
          setIsDoctor(false);
          setRoleError(
            error instanceof Error
              ? error
              : new Error("Unable to check the user's role."),
          );
        }
      } else {
        setIsDoctor(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return createElement(
    AuthContext.Provider,
    { value: { user, isDoctor, loading, roleError } },
    children,
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
