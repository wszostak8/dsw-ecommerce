import { AuthResponseCode } from './responseCodes'

export const authMessages: Record<AuthResponseCode, string> = {
  [AuthResponseCode.INVALID_PASSWORD]: "Nieprawidłowe hasło.",
  [AuthResponseCode.INVALID_EMAIL]: "Użytkownik o takim adresie e-mail nie istnieje.",
  [AuthResponseCode.SERVER_ERROR]: "Wystąpił błąd serwera. Spróbuj ponownie.",
  [AuthResponseCode.EMAIL_EXISTS]: "Użytkownik z tym adresem email już istnieje.",
  [AuthResponseCode.LOGIN_SUCCESS]: "Zalogowano pomyślnie.",
  [AuthResponseCode.LOGOUT_SUCCESS]: "Wylogowano pomyślnie.",
  [AuthResponseCode.REGISTER_SUCCESS]: "Zarejestrowano pomyślnie. Możesz się zalogować."
};


