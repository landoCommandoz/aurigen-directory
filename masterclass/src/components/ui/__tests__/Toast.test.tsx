import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast, type ToastApi, type ToastOptions } from '../Toast';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

let api: ToastApi | null = null;

function keepApi(next: ToastApi) {
  api = next;
}

function Capture({ onApi }: { onApi: (next: ToastApi) => void }) {
  const toast = useToast();
  useEffect(() => onApi(toast), [toast, onApi]);
  return null;
}

function Shell({ held = false }: { held?: boolean }) {
  return (
    <ToastProvider held={held}>
      <Capture onApi={keepApi} />
    </ToastProvider>
  );
}

function show(message: string, options?: ToastOptions): number | null {
  let id: number | null = null;
  act(() => {
    id = api?.show(message, options) ?? null;
  });
  return id;
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe('Toast', () => {
  it('shows a message and leaves on its own after its time plus the exit', () => {
    render(<Shell />);
    show('Backup saved', { tone: 'success' });
    expect(screen.getByText('Backup saved')).toBeInTheDocument();
    advance(5000);
    advance(250);
    expect(screen.queryByText('Backup saved')).toBeNull();
  });

  it('runs the action once and closes the toast (the undo pattern)', () => {
    const undo = vi.fn<() => void>();
    render(<Shell />);
    show('Step done', { action: { label: 'Undo last', onAction: undo } });
    fireEvent.click(screen.getByRole('button', { name: 'Undo last' }));
    expect(undo).toHaveBeenCalledTimes(1);
    advance(250);
    expect(screen.queryByText('Step done')).toBeNull();
  });

  it('pauses its timer while keyboard focus is on the action', () => {
    render(<Shell />);
    show('Step done', { action: { label: 'Undo last', onAction: () => undefined } });
    const action = screen.getByRole('button', { name: 'Undo last' });
    act(() => {
      action.focus();
    });
    advance(8000);
    expect(screen.getByText('Step done')).toBeInTheDocument();
    act(() => {
      action.blur();
    });
    advance(5250);
    expect(screen.queryByText('Step done')).toBeNull();
  });

  it('never shows less than two seconds', () => {
    render(<Shell />);
    show('Saved', { duration: 10 });
    advance(1500);
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('holds toasts in Customer View and shows queued ones after', () => {
    const { rerender } = render(<Shell held />);
    expect(show('Update ready')).not.toBeNull();
    expect(screen.queryByText('Update ready')).toBeNull();
    advance(10000);
    rerender(<Shell held={false} />);
    expect(screen.getByText('Update ready')).toBeInTheDocument();
  });

  it('drops a whenHeld drop toast that arrives while held', () => {
    const { rerender } = render(<Shell held />);
    expect(show('Step done', { whenHeld: 'drop' })).toBeNull();
    rerender(<Shell held={false} />);
    expect(screen.queryByText('Step done')).toBeNull();
  });

  it('takes a toast off the screen the moment held turns on', () => {
    const { rerender } = render(<Shell />);
    show('Ready offline');
    show('Step done', { whenHeld: 'drop' });
    rerender(<Shell held />);
    expect(screen.queryByText('Ready offline')).toBeNull();
    expect(screen.queryByText('Step done')).toBeNull();
    rerender(<Shell held={false} />);
    expect(screen.getByText('Ready offline')).toBeInTheDocument();
    expect(screen.queryByText('Step done')).toBeNull();
  });

  it('shows at most three at once and lets the next one in when one leaves', () => {
    render(<Shell />);
    const first = show('One');
    show('Two');
    show('Three');
    show('Four');
    expect(screen.queryByText('Four')).toBeNull();
    act(() => {
      if (first !== null) api?.dismiss(first);
    });
    advance(250);
    expect(screen.getByText('Four')).toBeInTheDocument();
  });

  it('throws a clear error outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    function Orphan() {
      useToast();
      return null;
    }
    expect(() => render(<Orphan />)).toThrow('useToast must be used inside <ToastProvider>');
    spy.mockRestore();
  });

  it('works from a component event handler', () => {
    function Trigger() {
      const toast = useToast();
      const [count, setCount] = useState(0);
      return (
        <button
          type="button"
          onClick={() => {
            setCount(count + 1);
            toast.show(`Saved ${count + 1}`);
          }}
        >
          Save
        </button>
      );
    }
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText('Saved 1')).toBeInTheDocument();
  });
});
