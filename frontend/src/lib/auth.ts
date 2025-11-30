import { jwtVerify } from 'jose';
import { Role } from '@/generated/auth/auth';

export interface JwtPayload {
    role: string;
}

export async function verifyAuthToken(token?: string) {
    if (!token) return null;

    try {
        const secretKey = Buffer.from(process.env.JWT_SECRET!, 'base64');
        const { payload } = await jwtVerify<JwtPayload>(token, secretKey);
        return payload;
    } catch {
        return null;
    }
}

export function isAdmin(payload: JwtPayload) {
    return payload?.role === Role[Role.ADMIN];
}
