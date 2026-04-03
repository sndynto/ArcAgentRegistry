import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { arcTestnet } from './chains'

export const config = createConfig({
  chains: [arcTestnet],
  connectors: [injected()],
  transports: {
    [arcTestnet.id]: http(),
  },
})
