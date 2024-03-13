export const getItem = (key: string): string | null => {
    return localStorage.getItem(key);
};

export const setItem = (key: string, value: unknown): void => {
    if (typeof value === 'string') localStorage.setItem(key, value);
    else localStorage.setItem(key, JSON.stringify(value));
};

export const removeItem = (key: string): void => {
    localStorage.removeItem(key);
};
