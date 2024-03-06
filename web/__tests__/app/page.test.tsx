import Home from '@/app/page';
import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';

describe('Page', () => {
    it('renders', async () => {
        // When
        act(() => {
            render(<Home />);
        });
        const sampleText = await screen.findByText('Get started by editing');

        // Then
        expect(sampleText).toBeInTheDocument();
    });
});
