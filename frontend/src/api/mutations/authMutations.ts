import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/api/apiClient';
import { authStore } from '@/api/stores/auth';
import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  PerformPasswordResetRequest,
  PerformPasswordResetResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyPasswordResetCodeRequest,
  VerifyPasswordResetCodeResponse,
} from '@/generated/auth/auth';
import { authMessages } from '@/api/messages/auth/message';
import { AuthResponseCode } from '@/api/messages/auth/responseCodes';
import { globalMessage } from '@/api/messages/global/message';
import { useMergeCartMutation } from './cartMutations';
import { removeCookie } from '@/utils/cookie';

type LoginWithCaptcha = { email: string; password: string; captchaToken: string };

export function useLoginMutation() {
  const { setUser } = authStore.getState();
  const mergeCartMutation = useMergeCartMutation();

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async ({ email, password, captchaToken }: LoginWithCaptcha): Promise<LoginResponse> => {
      const requestMessage = LoginRequest.create({ email, password });
      const binaryBody = LoginRequest.encode(requestMessage).finish();
      const safeBinaryBody = new Uint8Array(binaryBody);

      const responseBuffer = await api.post('auth/login', {
        body: new Blob([safeBinaryBody]),
        headers: { 'X-Captcha-Token': captchaToken },
      }).arrayBuffer();

      return LoginResponse.decode(new Uint8Array(responseBuffer));
    },
    onSuccess: (response) => {
      if (response.success && response.user) {
        toast.success(authMessages[response.errorCode as AuthResponseCode]);
        setUser(response.user);

        mergeCartMutation.mutate(undefined, {
          onSettled: () => {
            removeCookie('guest-cart-id');
            const redirectUrl = new URL(window.location.href).searchParams.get('redirect') || '/account';
            window.location.href = redirectUrl;
          },
        });
      } else {
        toast.error(authMessages[response.errorCode as AuthResponseCode]);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message === 'Failed to fetch' ? globalMessage.failedToFetch : error.message);
    },
  });
}

export function useRefreshTokenMutation() {
  const { setUser, logout } = authStore.getState();

  return useMutation({
    mutationKey: ['auth', 'refresh'],
    mutationFn: async (): Promise<LoginResponse> => {
      const responseBuffer = await api.post('auth/refresh').arrayBuffer();
      return LoginResponse.decode(new Uint8Array(responseBuffer));
    },
    onSuccess: (response) => {
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        logout();
      }
    },
    onError: () => {
      logout();
    },
  });
}

export function useLogoutMutation() {
  const { logout } = authStore.getState();

  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: async (): Promise<LogoutResponse> => {
      const responseBuffer = await api.post('auth/logout').arrayBuffer();
      return LogoutResponse.decode(new Uint8Array(responseBuffer));
    },
    onSettled: (response) => {
      if (response?.success) {
        toast.success(authMessages[response.errorCode as AuthResponseCode]);
      }
      logout();
      window.location.href = "/login";
    }
  });
}

export function useRegisterMutation(options?: { onSuccessCallback?: () => void }) {
  return useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: async (details: { name: string; email: string; password: string; captchaToken: string }): Promise<RegisterResponse> => {
      const { name, email, password, captchaToken } = details;
      const requestMessage = RegisterRequest.create({ name, email, password });
      const binaryBody = RegisterRequest.encode(requestMessage).finish();
      const safeBinaryBody = new Uint8Array(binaryBody);
      const responseBuffer = await api.post('auth/register', {
        body: new Blob([safeBinaryBody]),
        headers: { 'X-Captcha-Token': captchaToken },
      }).arrayBuffer();
      return RegisterResponse.decode(new Uint8Array(responseBuffer));
    },
    onSuccess: (response: RegisterResponse) => {
      if (response.success) {
        toast.success(authMessages[response.errorCode as AuthResponseCode]);
        options?.onSuccessCallback?.();
      } else {
        toast.error(authMessages[response.errorCode as AuthResponseCode]);
      }
    },
    onError: (error: Error) => {
      if (error.message === 'Failed to fetch') {
        toast.error(globalMessage.failedToFetch);
      } else {
        toast.error(error.message);
      }
    },
  });
}

export function useRequestPasswordResetMutation() {
  return useMutation({
    mutationKey: ['auth', 'requestPasswordReset'],
    mutationFn: async ({ email }: { email: string }): Promise<PasswordResetResponse> => {
      const requestMessage = PasswordResetRequest.create({ email });
      const binaryBody = PasswordResetRequest.encode(requestMessage).finish();
      const responseBuffer = await api.post('auth/password/request-reset', {
        body: new Blob([new Uint8Array(binaryBody)]),
      }).arrayBuffer();
      return PasswordResetResponse.decode(new Uint8Array(responseBuffer));
    },
  });
}

export function useVerifyPasswordResetCodeMutation() {
  return useMutation({
    mutationKey: ['auth', 'verifyPasswordResetCode'],
    mutationFn: async (details: { email: string; token: string }): Promise<VerifyPasswordResetCodeResponse> => {
      const requestMessage = VerifyPasswordResetCodeRequest.create(details);
      const binaryBody = VerifyPasswordResetCodeRequest.encode(requestMessage).finish();
      const responseBuffer = await api.post('auth/password/verify-code', {
        body: new Blob([new Uint8Array(binaryBody)]),
      }).arrayBuffer();
      return VerifyPasswordResetCodeResponse.decode(new Uint8Array(responseBuffer));
    },
  });
}

export function usePerformPasswordResetMutation() {
  return useMutation({
    mutationKey: ['auth', 'performPasswordReset'],
    mutationFn: async (details: { token: string; newPassword: string }): Promise<PerformPasswordResetResponse> => {
      const requestMessage = PerformPasswordResetRequest.create(details);
      const binaryBody = PerformPasswordResetRequest.encode(requestMessage).finish();
      const responseBuffer = await api.post('auth/password/perform-reset', {
        body: new Blob([new Uint8Array(binaryBody)]),
      }).arrayBuffer();
      return PerformPasswordResetResponse.decode(new Uint8Array(responseBuffer));
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Hasło zostało zresetowane pomyślnie. Możesz się teraz zalogować.");
        window.location.href = "/login";
      } else {
        toast.error("Twoja sesja wygasła. Prosimy zacząć proces resetowania hasła od nowa.");
      }
    },
    onError: () => {
      toast.error("An unexpected error occurred. Please try again.");
    },
  });
}