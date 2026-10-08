import { mainnet, base, polygon, unichain, arbitrum, optimism } from 'wagmi/chains';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// WalletConnect Cloud project id — set VITE_WALLETCONNECT_PROJECT_ID in .env
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '00000000000000000000000000000000';

export const config = getDefaultConfig({
  appName: 'DeFi Interface Restrictions Monitor',
  projectId,
  // Default public RPCs from viem chain definitions.
  // Override per chain via transports/http('https://...') when a dedicated RPC is needed.
  chains: [mainnet, base, polygon, unichain, arbitrum, optimism],
  ssr: false
});
