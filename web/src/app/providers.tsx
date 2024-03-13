'use client';

import { ThemeProvider, useTheme } from 'next-themes';
import { ReactNode, useEffect } from 'react';
import { addThemeToUserSettings } from './api/customization/theme/theme';

export interface ProvidersProps {
    children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        addThemeToUserSettings(theme);
    }, [theme]);

    useEffect(() => {
        const localTheme = window.localStorage.getItem('theme');
        if (localTheme) setTheme(localTheme);
    }, []);

    return <ThemeProvider attribute='class'>{children}</ThemeProvider>;
};

export default Providers;
