import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StopBand } from '../StopBand';

afterEach(cleanup);

describe('StopBand', () => {
  it('shows the octagon, the word STOP, and the condition in words', () => {
    const { container } = render(<StopBand>Paint color on the pad</StopBand>);
    expect(screen.getByText('STOP')).toBeInTheDocument();
    expect(screen.getByText('Paint color on the pad')).toBeInTheDocument();
    expect(container.querySelector('.ui-stopband__mark svg')).not.toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('is a live alert when announce is set', () => {
    render(<StopBand announce>Reading under 75 µm. No machine on this panel.</StopBand>);
    expect(screen.getByRole('alert')).toHaveTextContent('STOP');
  });

  it('becomes a full-width button named STOP plus the condition with onClick', () => {
    const onClick = vi.fn<() => void>();
    render(<StopBand onClick={onClick}>Paint color on the pad</StopBand>);
    const button = screen.getByRole('button', { name: 'STOP Paint color on the pad' });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('takes a different word when asked', () => {
    render(<StopBand word="STOP NOW">Paint color on the pad</StopBand>);
    expect(screen.getByText('STOP NOW')).toBeInTheDocument();
  });
});
