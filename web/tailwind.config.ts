import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            boxShadow: {
                closeEffect:
                    'inset -3.5em 0 0 0 var(--hover), inset 3.5em 0 0 0 var(--hover)',
            },
            colors: {
                disabled: '#ffffff4d',
                disabledText: '#00000042',
                darkDisabled: '#ffffff1f',
                darkDisabledText: '#ffffff4d',
                moon: '#a8a7c4',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
export default config;
