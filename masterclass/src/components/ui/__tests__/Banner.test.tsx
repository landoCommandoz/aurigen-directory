import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Banner } from '../Banner';

afterEach(cleanup);

describe('Banner', () => {
  it('shows a title, the notice, and a glyph for its variant', () => {
    const { container } = render(
      <Banner tone="warning" title="Offline">
        Shop Mode, Fix It, and the Academy all still work.
      </Banner>,
    );
    expect(screen.getByText('Offline')).toBeInTheDocument();
    expect(screen.getByText('Shop Mode, Fix It, and the Academy all still work.')).toBeInTheDocument();
    const banner = container.querySelector('.ui-banner');
    expect(banner).toHaveAttribute('data-tone', 'warning');
    expect(banner).toHaveAttribute('aria-live', 'polite');
    expect(container.querySelector('.ui-banner__glyph svg')).not.toBeNull();
  });

  it('has no buttons without an action or onDismiss', () => {
    render(<Banner>Ready offline.</Banner>);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('runs its action and its dismiss', () => {
    const update = vi.fn<() => void>();
    const later = vi.fn<() => void>();
    render(
      <Banner title="Update ready" action={{ label: 'Update now', onAction: update }} onDismiss={later} dismissLabel="Later">
        A new version is saved on this phone.
      </Banner>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Update now' }));
    fireEvent.click(screen.getByRole('button', { name: 'Later' }));
    expect(update).toHaveBeenCalledTimes(1);
    expect(later).toHaveBeenCalledTimes(1);
  });

  it('shows a busy action without running it again', () => {
    const update = vi.fn<() => void>();
    render(
      <Banner action={{ label: 'Update now', onAction: update, loading: true, loadingLabel: 'Updating' }}>
        A new version is saved on this phone.
      </Banner>,
    );
    const button = screen.getByRole('button', { name: 'Updating' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button);
    expect(update).not.toHaveBeenCalled();
  });

  it('defaults to info and a Dismiss button', () => {
    const { container } = render(<Banner onDismiss={vi.fn<() => void>()}>Add this app to your Home Screen.</Banner>);
    expect(container.querySelector('.ui-banner')).toHaveAttribute('data-tone', 'info');
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });
});
