import { FirebaseError } from "firebase/app";

export function getAuthErrorMessage(
  error: unknown,
  fallback = "Не удалось выполнить операцию. Попробуйте ещё раз.",
): string {
  if (!(error instanceof FirebaseError)) {
    return fallback;
  }

  switch (error.code) {
    case "auth/api-key-not-valid":
      return "Сервис авторизации временно недоступен. Обратитесь к администратору.";
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Неверный email или пароль.";
    case "auth/email-already-in-use":
      return "Пользователь с таким email уже зарегистрирован.";
    case "auth/weak-password":
      return "Пароль должен содержать не менее 6 символов.";
    case "auth/invalid-email":
      return "Введите корректный email.";
    case "auth/popup-closed-by-user":
      return "Окно входа было закрыто. Попробуйте ещё раз.";
    case "auth/popup-blocked":
      return "Браузер заблокировал окно входа. Разрешите всплывающие окна для этого сайта.";
    case "auth/cancelled-popup-request":
      return "Запрос входа отменён. Попробуйте ещё раз.";
    case "auth/operation-not-allowed":
      return "Этот способ входа ещё не включён администратором.";
    case "auth/network-request-failed":
      return "Не удалось подключиться к сервису авторизации. Проверьте интернет-соединение.";
    default:
      return fallback;
  }
}
