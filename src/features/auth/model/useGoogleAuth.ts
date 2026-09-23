import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/app/providers/firebase";
import { ensurePatientProfile } from "@/shared/lib/ensurePatientProfile";

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await ensurePatientProfile(user);
    return user;
  } catch (error: unknown) {
    console.error("Ошибка входа через Google:", error);
    throw error;
  }
};
