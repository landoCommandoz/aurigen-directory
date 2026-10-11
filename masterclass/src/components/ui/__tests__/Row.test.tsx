import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import { Row, RowList } from '../Row';

afterEach(cleanup);

describe('Row', () => {
  it('renders title, detail, and trailing as plain content without onClick', () => {
    render(<Row title="Last backup" detail="Oct 10, 2026" trailing="Saved" />);
    expect(screen.getByText('Last backup')).toBeInTheDocument();
    expect(screen.getByText('Oct 10, 2026')).toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('lets a plain row hold its own control in the trailing slot', () => {
    const onShare = vi.fn<() => void>();
    render(<Row title="Last backup" trailing={<Button onClick={onShare}>Share</Button>} />);
    fireEvent.click(screen.getByRole('button', { name: 'Share' }));
    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it('becomes one button for the whole row with onClick', () => {
    const onClick = vi.fn<() => void>();
    render(<Row title="Wash route" detail="7 panels" leading="1" trailing="Open" onClick={onClick} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Wash route');
    expect(button).toHaveTextContent('Open');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ignores taps when disabled', () => {
    const onClick = vi.fn<() => void>();
    render(<Row title="Wash route" onClick={onClick} disabled />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('skips an empty detail', () => {
    const { container } = render(<Row title="Wash route" detail="" />);
    expect(container.querySelector('.ui-row__detail')).toBeNull();
  });
});

describe('RowList', () => {
  it('is a named list of list items', () => {
    render(
      <RowList label="Backups">
        <Row as="li" title="First" />
        <Row as="li" title="Second" />
      </RowList>,
    );
    const list = screen.getByRole('list', { name: 'Backups' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
  });

  it('shows the empty message in words when there are no rows', () => {
    render(
      <RowList label="Backups" empty="No backups yet.">
        {[]}
        {null}
      </RowList>,
    );
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.getByText('No backups yet.')).toBeInTheDocument();
  });

  it('renders nothing for an empty list with no message', () => {
    const { container } = render(<RowList label="Backups">{false}</RowList>);
    expect(container).toBeEmptyDOMElement();
  });
});
