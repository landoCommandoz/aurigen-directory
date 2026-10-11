import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Tile, TileGrid } from '../Tile';

afterEach(cleanup);

describe('Tile', () => {
  it('is one button named by its words, with the icon hidden from screen readers', () => {
    const onClick = vi.fn<() => void>();
    render(<Tile icon={<svg data-testid="glyph" />} label="Pad stopped spinning" onClick={onClick} />);
    const tile = screen.getByRole('button', { name: 'Pad stopped spinning' });
    expect(tile).toHaveAttribute('type', 'button');
    expect(screen.getByTestId('glyph').parentElement).toHaveAttribute('aria-hidden', 'true');
    fireEvent.click(tile);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows the detail line when given and skips it when empty', () => {
    const { rerender } = render(<Tile label="Haze after compound" detail="Paint" />);
    expect(screen.getByText('Paint')).toBeInTheDocument();
    rerender(<Tile label="Haze after compound" detail="" />);
    expect(screen.queryByText('Paint')).toBeNull();
  });

  it('does not fire when disabled', () => {
    const onClick = vi.fn<() => void>();
    render(<Tile label="Water spots" disabled onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Water spots' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('TileGrid', () => {
  it('is a named group when given a label', () => {
    render(
      <TileGrid label="Machine">
        <Tile label="Heavy vibration" />
      </TileGrid>,
    );
    expect(screen.getByRole('group', { name: 'Machine' })).toContainElement(
      screen.getByRole('button', { name: 'Heavy vibration' }),
    );
  });

  it('has no group role without a label', () => {
    render(
      <TileGrid>
        <Tile label="Heavy vibration" />
      </TileGrid>,
    );
    expect(screen.queryByRole('group')).toBeNull();
  });
});
