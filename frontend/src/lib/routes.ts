export const userPaths = ['/account'];
export const authPaths = ['/login', '/register', '/reset'];
export const adminDashboard = '/admin/orders';

export function isUserPath(path: string) {
    return userPaths.some(p => path.startsWith(p));
}

export function isAdminPath(path: string) {
    return path === '/admin' || path.startsWith('/admin/');
}


export function isAuthPath(path: string) {
    return authPaths.includes(path);
}
