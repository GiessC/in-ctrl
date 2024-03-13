import { ButtonHTMLAttributes } from 'react';

export type ButtonColor = 'primary' | 'secondary' | 'error';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    size?: ButtonSize;
    color?: ButtonColor;
    fullWidth?: boolean;
    children: string;
}

const COLOR_STYLES: Record<ButtonColor, string> = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white',
    error: 'bg-red-500 text-white',
};
const HOVER_COLOR_STYLES: Record<ButtonColor, string> = {
    primary: 'hover:bg-blue-600',
    secondary: 'hover:bg-gray-600',
    error: 'hover:bg-red-600',
};
const SIZE_STYLES: Record<ButtonSize, string> = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
};
const DISABLED_STYLE =
    'bg-disabled dark:bg-disabled text-disabledText dark:text-darkDisabledText cursor-not-allowed';

const Button = ({
    color = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    children,
    className,
    ...props
}: ButtonProps) => {
    // TODO: Add tooltip on hover to display button state - this must be accessible (focusable by keyboard)
    return (
        <button
            aria-disabled={disabled}
            className={`transition-colors font-semibold rounded ${
                COLOR_STYLES[color]
            } ${HOVER_COLOR_STYLES[color]} ${fullWidth && 'w-full'} ${
                disabled && DISABLED_STYLE
            } ${SIZE_STYLES[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children.toLocaleUpperCase()}
        </button>
    );
};

export default Button;
