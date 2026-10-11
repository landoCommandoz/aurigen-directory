import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import { Drawer } from '../Drawer';
import { TAP_GUARD_MS } from '../useTapGuard';
import { advance, fingerTap } from './tap';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function Harness({ onClose, onAdd }: { onClose?: () => void; onAdd?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open hood</Button>
      <Drawer
        open={open}
        onClose={() => {
          onClose?.();
          setOpen(false);
        }}
        eyebrow="Hood"
        title="Readings"
        footer={<Button variant="primary">Save</Button>}
      >
        <p>Three readings.</p>
        <Button onClick={onAdd}>Add reading</Button>
      </Drawer>
    </>
  );
}

function openDrawer() {
  const opener = screen.getByRole('button', { name: 'Open hood' });
  opener.focus();
  fireEvent.click(opener);
  return opener;
}

describe('Drawer', () => {
  it('renders nothing while closed', () => {
    render(<Harness />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens as a dialog named by its title and moves focus into the sheet', () => {
    render(<Harness />);
    openDrawer();
    const dialog = screen.getByRole('dialog', { name: 'Readings' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveFocus();
    expect(screen.getByText('Hood')).toBeInTheDocument();
  });

  it('closes from its Close button, unmounts after the exit, and returns focus to the opener', () => {
    const onClose = vi.fn<() => void>();
    render(<Harness onClose={onClose} />);
    const opener = openDrawer();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(opener).toHaveFocus();
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes on Escape', () => {
    const onClose = vi.fn<() => void>();
    render(<Harness onClose={onClose} />);
    openDrawer();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('leaves Escape alone when something inside already handled it', () => {
    const onClose = vi.fn<() => void>();
    render(<Harness onClose={onClose} />);
    openDrawer();
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    event.preventDefault();
    act(() => {
      document.dispatchEvent(event);
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes on a tap on the backdrop', () => {
    const onClose = vi.fn<() => void>();
    render(<Harness onClose={onClose} />);
    openDrawer();
    const backdrop = document.querySelector('.ui-drawer-backdrop');
    expect(backdrop).not.toBeNull();
    if (backdrop !== null) fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps Tab inside the sheet, wrapping at both ends', () => {
    render(<Harness />);
    openDrawer();
    const close = screen.getByRole('button', { name: 'Close' });
    const save = screen.getByRole('button', { name: 'Save' });
    save.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(close).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(save).toHaveFocus();
  });

  it('holds its footer actions and body content', () => {
    render(<Harness />);
    openDrawer();
    expect(screen.getByText('Three readings.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add reading' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('reopens cleanly when opened again during the exit', () => {
    render(<Harness />);
    openDrawer();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open hood' }));
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(screen.getByRole('dialog', { name: 'Readings' })).toBeInTheDocument();
  });
});

describe('Drawer tap guard (QA DEF-04: the second tap of a double tap on the opener)', () => {
  function backdrop(): Element {
    const element = document.querySelector('.ui-drawer-backdrop');
    if (element === null) throw new Error('no backdrop');
    return element;
  }

  function layer(): Element | null {
    return document.querySelector('.ui-drawer-layer');
  }

  it('a tap inside the window does nothing: the backdrop, Close, and a body button all hold', () => {
    const onClose = vi.fn<() => void>();
    const onAdd = vi.fn<() => void>();
    render(<Harness onClose={onClose} onAdd={onAdd} />);
    openDrawer();
    expect(layer()).toHaveAttribute('data-tap-guard', 'on');
    advance(40);
    fingerTap(backdrop());
    fingerTap(screen.getByRole('button', { name: 'Close' }));
    fingerTap(screen.getByRole('button', { name: 'Add reading' }));
    fingerTap(screen.getByRole('button', { name: 'Save' }));
    expect(onClose).not.toHaveBeenCalled();
    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Readings' })).toBeInTheDocument();
  });

  it('a tap after the window works: a body button, then the backdrop closes it', () => {
    const onClose = vi.fn<() => void>();
    const onAdd = vi.fn<() => void>();
    render(<Harness onClose={onClose} onAdd={onAdd} />);
    openDrawer();
    advance(TAP_GUARD_MS);
    expect(layer()).not.toHaveAttribute('data-tap-guard');
    fingerTap(screen.getByRole('button', { name: 'Add reading' }));
    expect(onAdd).toHaveBeenCalledTimes(1);
    fingerTap(backdrop());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('a press that begins inside the window and lifts after it does not close the sheet', () => {
    const onClose = vi.fn<() => void>();
    render(<Harness onClose={onClose} />);
    openDrawer();
    advance(TAP_GUARD_MS - 50);
    fireEvent.pointerDown(backdrop());
    advance(100);
    fireEvent.pointerUp(backdrop());
    fireEvent.click(backdrop(), { detail: 1 });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('keyboard users are never held: focus moves into the sheet, and Escape or Enter on Close works at once', () => {
    const onClose = vi.fn<() => void>();
    render(<Harness onClose={onClose} />);
    openDrawer();
    expect(screen.getByRole('dialog', { name: 'Readings' })).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    advance(250);
    openDrawer();
    fireEvent.click(screen.getByRole('button', { name: 'Close' })); // Enter or Space: detail 0, no pointer
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('holds again each time it opens, including a reopen during the exit', () => {
    const onClose = vi.fn<() => void>();
    render(<Harness onClose={onClose} />);
    openDrawer();
    advance(TAP_GUARD_MS);
    fingerTap(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    fingerTap(screen.getByRole('button', { name: 'Open hood' }));
    expect(layer()).toHaveAttribute('data-tap-guard', 'on');
    fingerTap(backdrop());
    expect(onClose).toHaveBeenCalledTimes(1);
    advance(TAP_GUARD_MS);
    fingerTap(backdrop());
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
