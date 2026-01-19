import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, polygonMumbai } from 'viem/chains'

// Get project ID from https://cloud.reown.com
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || 'YOUR_PROJECT_ID'

const metadata = {
  name: 'GameArena',
  description: 'Decentralized Gaming Tournament Platform',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://gamearena.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const networks = [polygon, polygonMumbai, mainnet]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
    email: true, // Enable email login
    socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook'], // Enable social logins
    onramp: false, // Hide crypto onramp
    swaps: false // Hide token swaps
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#7b2ff7' // Match your app's purple theme
  },
  featuredWalletIds: [], // Hide featured wallets to emphasize social login
  includeWalletIds: [], // Only show social login options
  excludeWalletIds: ['all'] // Exclude all wallet options
})

export const config = wagmiAdapter.wagmiConfig
