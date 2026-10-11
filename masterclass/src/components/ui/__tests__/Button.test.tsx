import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';

afterEach(cleanup);

describe('Button', () => {
  it('renders its words as a plain button that defaults to secondary', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'secondary');
    expect(button).toHaveAttribute('data-size', 'default');
    expect(button).toHaveClass('ui-press');
  });

  it('runs onClick on a tap', () => {
    const onClick = vi.fn<() => void>();
    render(
      <Button variant="primary" onClick={onClick}>
        Done, next
      </Button>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Done, next' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does nothing and leaves the tab order when disabled', () => {
    const onClick = vi.fn<() => void>();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('ignores taps while loading but stays focusable, and shows the loading words', () => {
    const onClick = vi.fn<() => void>();
    render(
      <Button loading loadingLabel="Saving" onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Saving' });
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    button.focus();
    expect(button).toHaveFocus();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('draws the octagon on a stop button, so STOP is never color alone', () => {
    render(<Button variant="stop">Stop the job</Button>);
    const button = screen.getByRole('button', { name: 'Stop the job' });
    expect(button.querySelector('.ui-btn__icon svg')).not.toBeNull();
  });

  it('carries the size and block flags for the CSS', () => {
    render(
      <Button size="hero" block>
        Done, next
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Done, next' });
    expect(button).toHaveAttribute('data-size', 'hero');
    expect(button).toHaveAttribute('data-block', 'true');
  });

  it('accepts submit as a type', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit');
  });
});
