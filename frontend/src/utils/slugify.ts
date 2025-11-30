export function slugify(str: string): string {
    return str
        .normalize("NFKD")                    // usuwa akcenty z polskich znaków
        .replace(/[\u0300-\u036f]/g, "")      // wycina diakrytyki
        .replace(/[\u200B-\u200D\uFEFF]/g, "") // usuwa zero-width chars
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")                 // spacja → -
        .replace(/[^a-z0-9\-]/g, "")          // usuwa wszystko, co nie jest alfanumeryczne
        .replace(/-+/g, "-")                  // wiele ---- → jedno -
        .replace(/^-+|-+$/g, "");             // usuwa - na początku/końcu
}