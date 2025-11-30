import ky from "ky";
import { authStore } from '@/api/stores/auth';
import { LoginResponse } from '@/generated/auth/auth';
import {toast} from "sonner";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const getApiBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
};

const refreshTokenFlow = async (): Promise<void> => {
    try {
        const response = await ky.post('auth/refresh', {
            prefixUrl: getApiBaseUrl(),
            headers: { "Accept": "application/x-protobuf" },
            credentials: 'include',
        });

        const responseBuffer = await response.arrayBuffer();
        const refreshData = LoginResponse.decode(new Uint8Array(responseBuffer));

        if (refreshData.success && refreshData.user) {
            authStore.getState().setUser(refreshData.user);
        } else {
            toast.error("Odświeżenie tokenu autoryzacji nie powiodło się");
        }
    } catch (error) {
        authStore.getState().logout();
        return Promise.reject(error);
    }
};

export const api = ky.create({
    prefixUrl: getApiBaseUrl(),
    headers: {
        "Content-Type": "application/x-protobuf",
        "Accept": "application/x-protobuf",
    },
    credentials: 'include',
    timeout: 60000,
    retry: 0,
    hooks: {
        afterResponse: [
            async (request, options, response) => {
                if (
                    response.status === 401 &&
                    !request.url.includes('/auth/login') &&
                    !request.headers.get('X-Retry')
                ) {
                    if (!isRefreshing) {
                        isRefreshing = true;
                        refreshPromise = refreshTokenFlow();
                    }

                    try {
                        await refreshPromise;

                        return ky(request, {
                            headers: {
                                'X-Retry': 'true'
                            }
                        });
                    } catch (error) {
                        return Promise.reject(error);
                    } finally {
                        if (isRefreshing) {
                            isRefreshing = false;
                            refreshPromise = null;
                        }
                    }
                }
                return response;
            },
        ],
    },
});