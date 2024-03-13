'use client';

import { Switch } from '@headlessui/react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import {
    BsMoonFill as MoonIcon,
    BsFillSunFill as SunIcon,
} from 'react-icons/bs';
import ScreenReaderOnly from '../common/accessibility/screenReaderOnly/screenReadOnly';

const ToggleLightDark = () => {
    const { theme, setTheme } = useTheme();

    const darkEnabled = theme === 'dark';

    const onChange = (checked: boolean) => {
        setTheme(checked ? 'dark' : 'light');
    };

    return (
        <Switch
            checked={darkEnabled}
            onChange={onChange}
            className={`${
                darkEnabled ? 'bg-gray-600' : 'bg-gray-400'
            } relative inline-flex h-10 w-20 items-center rounded-full`}
        >
            <ScreenReaderOnly>
                Enable {darkEnabled ? 'dark' : 'light'} mode
            </ScreenReaderOnly>
            <span
                aria-hidden='true'
                className={`${
                    darkEnabled
                        ? 'bg-black translate-x-11'
                        : 'bg-white translate-x-1'
                } inline-block h-8 w-8 transform rounded-full transition`}
            >
                <span
                    className={`${
                        darkEnabled
                            ? 'opacity-0 duration-100 ease-out'
                            : 'opacity-100 duration-200 ease-in'
                    } text-midnight absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                >
                    <MoonIcon className='w-5 h-5' />
                </span>
                <span
                    className={`${
                        darkEnabled
                            ? 'opacity-100 duration-200 ease-in'
                            : 'opacity-0 duration-100 ease-out'
                    } text-yellow-500 absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                >
                    <SunIcon className='w-5 h-5' />
                </span>
            </span>
        </Switch>
    );
};

export default dynamic(() => Promise.resolve(ToggleLightDark), {
    ssr: false,
});
