import { ForkReady } from 'types/restrictions';
import ToneChip, { forkTone } from './ToneChip';
import { FORK_DESCRIPTIONS, FORK_LABELS } from '../constants';

export default function ForkChip({ fork }: { fork: ForkReady }) {
  return <ToneChip tone={forkTone(fork)} label={FORK_LABELS[fork]} tooltip={FORK_DESCRIPTIONS[fork]} />;
}
