# TournamentChain Frontend

React frontend for TournamentChain. Connects players to tournaments. Runs Wave Defense game. Visualizes on-chain data.

## What This Frontend Does

You connect your wallet. You browse tournaments. You mint assets. You play the Wave Defense game directly in the browser. You track your leaderboard status in real-time.

## Prerequisites

Install Node.js 18 or higher. Install npm. Have a browser wallet (MetaMask) or use Social Login.

## Installation

Navigate to frontend directory:

```bash
cd TournamentChain/frontend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
VITE_PROJECT_ID=your_walletconnect_project_id
VITE_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
```

## Development

Start development server:

```bash
npm run dev
```

Server runs on http://localhost:5173

## Build

Build for production:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

## Key Components

### Wave Defense Game
Located in `src/pages/WaveDefenseGame.jsx`. A Phaser-based survival shooter. Runs in the browser. Interacts with `GameAssets` to load your NFT skins and weapons.

### Tournament Browser
Located in `src/pages/TournamentBrowser.jsx`. Fetches active tournaments from `TournamentPlatform`. Filters by entry fee and status.

### Profile & Inventory
Located in `src/pages/Profile.jsx`. Displays your Gold/Diamond balance. Shows your NFT assets. Allows minting of test tokens.

### Leaderboard
Located in `src/pages/Leaderboard.jsx`. Fetches global rankings from `ArcadePlatform`. Real-time sorting and display.

## Configuration

Contract addresses are stored in `src/config/contracts.js`. Update these after redeploying contracts.

```javascript
export const CONTRACT_ADDRESSES = {
  TOURNAMENT_PLATFORM: '0x...',
  GAME_ASSETS: '0x...',
  GOLD_TOKEN: '0x...',
  DIAMOND_TOKEN: '0x...',
  ARCADE_PLATFORM: '0x...'
};
```

## Project Structure

```
frontend/
├── src/
│   ├── assets/         # Game assets (sprites, sounds)
│   ├── components/     # UI Components
│   ├── config/         # Contract addresses & ABIs
│   ├── context/        # Auth & State context
│   ├── pages/          # Route pages
│   └── App.jsx         # Main entry point
├── public/             # Static files
├── index.html
├── package.json
└── README.md
```

## Support

For issues or questions:
- **Wagmi Docs**: https://wagmi.sh
- **Phaser Docs**: https://phaser.io
- **Vite Docs**: https://vitejs.dev
