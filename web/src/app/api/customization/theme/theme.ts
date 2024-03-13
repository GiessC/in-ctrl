import { setItem } from '@/utils/localStorage';

export const addThemeToUserSettings = (theme?: string | null) => {
    if (!theme) return;
    setItem('theme', theme);
};
