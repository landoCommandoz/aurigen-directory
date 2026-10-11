/**
 * The offline indicator's words (BLUEPRINT 3.6 and 5). Pure, tested.
 * "Ready offline" appears once the full copy of the app is saved on the phone; "Offline" comes
 * from the phone's own connection state. Shop Mode behaves the same either way; only the words
 * change.
 */
import { connectivityLabel, type ConnectivityState } from '../core/connectivity';

export type StatusTone = 'ready' | 'neutral' | 'warning';

export interface StatusWords {
  label: string;
  tone: StatusTone;
}

export function statusWords(input: { connectivity: ConnectivityState; offlineReady: boolean; registered: boolean; supported: boolean }): StatusWords {
  if (input.connectivity === 'offline') {
    return { label: connectivityLabel('offline', input.offlineReady), tone: input.offlineReady ? 'ready' : 'warning' };
  }
  if (input.offlineReady) return { label: 'Ready offline', tone: 'ready' };
  if (input.supported && input.registered) return { label: 'Saving for offline', tone: 'neutral' };
  return { label: 'Online', tone: 'neutral' };
}
