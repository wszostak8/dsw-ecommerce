/**
 * Ustawia ciasteczko w przeglądarce.
 * @param name Nazwa ciasteczka.
 * @param value Wartość ciasteczka.
 * @param days Czas życia ciasteczka w dniach.
 */
export function setCookie(name: string, value: string, days: number): void {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // Ustawiamy ciasteczko dla całej domeny
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

/**
 * Pobiera wartość ciasteczka na podstawie jego nazwy.
 * @param name Nazwa ciasteczka.
 * @returns Wartość ciasteczka lub null, jeśli nie zostanie znalezione.
 */
export function getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const cookieArray = document.cookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

/**
 * Usuwa ciasteczko na podstawie jego nazwy.
 * @param name Nazwa ciasteczka do usunięcia.
 */
export function removeCookie(name: string): void {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}