import { useState, type FormEvent } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "@tanstack/react-router";
import { auth } from "@/app/providers/firebase";
import { ensurePatientProfile } from "@/shared/lib/ensurePatientProfile";
import { signInWithGoogle } from "./useGoogleAuth";
import { getAuthErrorMessage } from "./authError";

type AuthFormMode = "login" | "register";

export function useAuthForm(mode: AuthFormMode) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await ensurePatientProfile(result.user);
      }
      await navigate({ to: "/", replace: mode === "register" });
    } catch (caughtError: unknown) {
      setError(
        getAuthErrorMessage(
          caughtError,
          mode === "login"
            ? "Неверный email или пароль."
            : "Не удалось создать аккаунт.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      await navigate({ to: "/", replace: mode === "register" });
    } catch (caughtError: unknown) {
      setError(
        getAuthErrorMessage(
          caughtError,
          mode === "login"
            ? "Не удалось войти через Google."
            : "Не удалось зарегистрироваться через Google.",
        ),
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    googleLoading,
    handleSubmit,
    handleGoogleSubmit,
  };
}
