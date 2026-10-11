/**
 * A typed confirmation: the action button stays off until the word is typed. Used where a tap
 * cannot be undone (Start fresh, Restore). Cancel always works and changes nothing.
 */
import { useState } from 'react';
import { Button, Field } from '../../../components/ui';
import { typedWordMatches } from '../roleFlow';
import { Actions } from './Screen';

export interface TypedConfirmProps {
  word: string;
  actionLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}

export function TypedConfirm({ word, actionLabel, onConfirm, onCancel, busy = false }: TypedConfirmProps) {
  const [typed, setTyped] = useState('');
  const matches = typedWordMatches(typed, word);
  return (
    <div className="mc-section">
      <Field
        label={`Type ${word} to confirm`}
        value={typed}
        onChange={(event) => setTyped(event.target.value)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        enterKeyHint="done"
        onKeyDown={(event) => {
          if (event.key === 'Enter' && matches && !busy) onConfirm();
        }}
      />
      <Actions>
        <Button variant="primary" disabled={!matches} loading={busy} loadingLabel="Working" onClick={onConfirm}>
          {actionLabel}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </Actions>
    </div>
  );
}
