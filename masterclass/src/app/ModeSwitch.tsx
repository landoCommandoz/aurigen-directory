/**
 * The mode switch: Shop, Academy, Customer (the three densities, src/design/README.md).
 * Shop and Academy are a per-phone choice (mode.ts). Customer turns Customer View on through
 * the one mechanism in src/core/customerView.tsx; the frame follows the persisted flag, so the
 * switch shows the real state. A study phone is refused there (ROLE_CAN): the refusal shows in
 * words with a way to set the phone up, and the switch stays where it was.
 *
 * Phase 1 has no customer screens, so there is no customer session and leaving Customer View is
 * one tap. Phase 4 adds the switch screen with the session rule (business-customer).
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Banner, SegmentedControl, type SegmentedOption } from '../components/ui';
import { useCustomerView } from '../core/customerView';
import { densityFor, setMode, useMode, type Density } from './mode';

const OPTIONS: ReadonlyArray<SegmentedOption<Density>> = [
  { value: 'shop', label: 'Shop' },
  { value: 'academy', label: 'Academy' },
  { value: 'customer', label: 'Customer' },
];

interface Notice {
  text: string;
  setup: boolean;
}

export function ModeSwitch() {
  const navigate = useNavigate();
  const customerView = useCustomerView();
  const mode = useMode();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const value = densityFor(mode, customerView.on);

  async function choose(next: Density) {
    setNotice(null);
    if (next !== 'customer') {
      const saved = setMode(next);
      if (!saved) setNotice({ text: 'This phone is not saving settings, so the mode resets when the app reopens.', setup: false });
      return;
    }
    if (busy) return;
    setBusy(true);
    const result = await customerView.turnOn();
    setBusy(false);
    if (!result.ok) setNotice({ text: result.message, setup: result.code === 'notShopPhone' });
  }

  return (
    <div className="app-mode" data-print="hide">
      <SegmentedControl label="Mode" options={OPTIONS} value={value} onChange={(next) => void choose(next)} disabled={busy} />
      {notice !== null ? (
        <Banner
          tone="info"
          action={notice.setup ? { label: 'Set up this phone', onAction: () => navigate('/settings/setup') } : undefined}
          onDismiss={() => setNotice(null)}
          dismissLabel="OK"
        >
          {notice.text}
        </Banner>
      ) : null}
    </div>
  );
}
