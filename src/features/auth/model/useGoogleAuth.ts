import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/app/providers/firebase";

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return user;
  } catch (error: any) {
    console.error("Ошибка входа через Google:", error);
    throw error;
  }
};
