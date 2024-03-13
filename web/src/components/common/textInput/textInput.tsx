import type { HTMLAttributes, InputHTMLAttributes } from 'react';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    isError?: boolean;
    errorText?: string;
    fullWidth?: boolean;
    paddingTop?: number;
    LabelProps?: HTMLAttributes<HTMLLabelElement>;
    ErrorTextProps?: HTMLAttributes<HTMLSpanElement>;
}

const TextInput = ({
    id,
    label,
    isError = false,
    errorText,
    fullWidth = false,
    required = false,
    paddingTop = 2,
    LabelProps,
    ErrorTextProps,
    ...props
}: TextInputProps) => {
    return (
        <div className={`flex flex-col pt-${paddingTop}`}>
            <label
                htmlFor={id}
                {...LabelProps}
                className={`text-lg ${LabelProps?.className}`}
            >
                {label}
                {required && ' *'}
            </label>
            <input
                id={id}
                aria-labelledby={`${id}-label`}
                {...props}
                className={`text-md focus:outline focus:outline-2 focus:outline-blue-400 dark:bg-gray-600 bg-gray-100 rounded h-12 pl-2 mt-2 ${
                    fullWidth ? 'w-full' : 'max-w-lg'
                } ${
                    isError &&
                    'outline outline-2 outline-red-500 focus:outline-red-500'
                } ${props.className}`}
                required={required}
            />
            {isError && errorText && (
                <span
                    {...ErrorTextProps}
                    className={`mt-2 text-red-500 dark:text-red-400 ${ErrorTextProps?.className}`}
                >
                    {errorText}
                </span>
            )}
        </div>
    );
};

export default TextInput;
