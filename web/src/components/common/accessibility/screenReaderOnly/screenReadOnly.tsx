'use client';

import type { ReactNode } from 'react';

export interface ScreenReadOnlyProps {
    children: ReactNode;
}

const ScreenReaderOnly = ({ children }: ScreenReadOnlyProps) => {
    return <span className='sr-only'>{children}</span>;
};

export default ScreenReaderOnly;
