import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import { Drawer } from '../Drawer';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function Harness({ onClose }: { onClose?: () => void }) {
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
        <Button>Add reading</Button>
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
