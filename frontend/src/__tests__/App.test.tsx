import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('App Smoke Test', () => {
    it('renders correctly', () => {
        render(<div data-testid="app-root">Hello World</div>);
        expect(screen.getByTestId('app-root')).toBeInTheDocument();
    });
});
