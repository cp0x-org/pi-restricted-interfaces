import { mainnet, base, polygon, unichain } from 'wagmi/chains';

// Per-chain app config scaffold. Add protocol contract addresses here
// when wiring a real protocol (see step 2: Euler interface).
export const appChainConfig = {
  [mainnet.id]: {
    contracts: {}
  },
  [base.id]: {
    contracts: {}
  },
  [polygon.id]: {
    contracts: {}
  },
  [unichain.id]: {
    contracts: {}
  }
} as const;

export const INPUT_DECIMALS = 12;
