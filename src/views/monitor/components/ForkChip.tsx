import { ForkReady } from 'types/restrictions';
import { useI18n } from 'i18n';
import ToneChip, { forkTone } from './ToneChip';

export default function ForkChip({ fork }: { fork: ForkReady }) {
  const { L } = useI18n();
  return <ToneChip tone={forkTone(fork)} label={L.FORK_LABELS[fork]} tooltip={L.FORK_DESCRIPTIONS[fork]} />;
}
