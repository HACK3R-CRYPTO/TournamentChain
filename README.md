# TournamentChain

Decentralized Gaming Tournament Platform with Integrated Web3 Game

## Overview

TournamentChain combines a playable top-down survival shooter game with a decentralized tournament infrastructure. The game demonstrates the platform capabilities. The platform enables any Web3 game to run trustless tournaments with automatic prize distribution.

## Key Features

### Game Component

- Top-down survival shooter built with React
- Web3 asset ownership through ERC-1155 NFTs
- On-chain scoring and leaderboards
- Play-to-earn mechanics with gold and diamonds
- Weapon and character progression systems
- Wave-based enemy spawning with increasing difficulty

### Tournament Platform

- Smart contract-based tournament management
- Entry fee escrow system
- Automatic prize distribution
- On-chain result verification
- Cross-game compatibility
- Platform fee system for sustainability

## How It Works

### For Players

1. Connect your Web3 wallet
2. Browse available tournaments
3. Join tournaments by paying entry fees
4. Play the game to achieve high scores
5. Submit results automatically
6. Receive prizes if you win

### For Tournament Creators

1. Create tournaments with custom parameters
2. Set entry fees and prize distributions
3. Manage tournament participants
4. Submit results when tournament ends
5. Prizes distribute automatically

### For Game Developers

1. Integrate TournamentPlatform contract
2. Submit game results to tournaments
3. Enable competitive play in your game
4. White-label the platform for your studio

## Technical Stack

- **Frontend**: React with custom game components
- **Web3 Integration**: React hooks (useWeb3React, useContract, useContractWrite)
- **Smart Contracts**: Solidity on Ethereum-compatible chains
- **Assets**: ERC-1155 NFTs for weapons and skins
- **Currency**: ERC-20 tokens for gold and diamonds

## Gameplay

### Controls

- **W/A/S/D**: Move character
- **Auto-shooting**: Character automatically targets nearest enemies
- **Bomb**: Destroy all nearby enemies (once per game)
- **Magnet**: Collect all experience orbs (once per game)

### Scoring

Score = (Survival Time × Time Multiplier) + (Kills × Kill Multiplier)

Higher scores rank higher in tournaments. Longer survival and more kills increase your score.

### Progression

- Kill enemies to gain experience
- Level up to select upgrades
- Purchase weapons and skins with gold
- Upgrade equipment to improve performance
- Use better assets to win tournaments

## Smart Contracts

### TournamentPlatform.sol

Manages tournament creation, participation, result submission, and prize distribution.

Key functions:
- `createTournament()`: Create new tournaments
- `joinTournament()`: Join by paying entry fee
- `submitResults()`: Submit tournament results
- `getTournament()`: Get tournament details
- `getTournamentWinners()`: Get winners and prizes

### Game Contract

Manages game state, player assets, and leaderboards.

Key functions:
- `startGame()`: Begin game session
- `gameOver()`: Submit game results
- `getPlayerAllAssets()`: Get player gold and diamonds
- `getPlayerAllWeaponInfo()`: Get owned weapons
- `getTopListInfo()`: Get leaderboard

## Installation

```bash
# Clone repository
git clone [repository-url]

# Install dependencies
npm install

# Start development server
npm start
```

## Project Structure

```
TournamentChain/
├── contracts/          # Smart contracts
├── src/
│   ├── components/     # React game components
│   ├── hooks/          # Web3 React hooks
│   ├── pages/          # Tournament UI pages
│   └── utils/          # Helper functions
├── public/             # Static assets
└── README.md
```

## Hackathon Alignment

### NFT-Based Asset Ownership
✅ Weapons and skins as ERC-1155 NFTs
✅ True player ownership
✅ Transferable and tradeable assets

### Play-to-Earn and Creator Economics
✅ Players earn from gameplay and tournaments
✅ Tournament creators earn revenue share
✅ Platform fee model

### Decentralized Game Infrastructure
✅ On-chain tournament rules
✅ Verifiable results
✅ Automatic payouts
✅ Works with any Web3 game

### Metaverse and Virtual World Building
✅ Cross-game tournaments
✅ Community-driven events
✅ Interoperable assets

## Business Model

- Platform fee: 5% of prize pools
- Tournament creation fees (optional)
- White-label licensing for studios
- Multiple revenue streams

## Prize Distribution

Default distribution:
- 1st Place: 50%
- 2nd Place: 30%
- 3rd Place: 15%
- Other Places: 5% split

## Roadmap

### Phase 1: Smart Contracts ✅
- Tournament platform contract
- Game state contract
- Asset NFT contracts

### Phase 2: Frontend
- Tournament browser
- Tournament creation UI
- Game components

### Phase 3: Integration
- Connect game to tournaments
- Result submission system
- Prize distribution

### Phase 4: Polish
- UI improvements
- Documentation
- Demo preparation

## Contributing

This project is built for the Node Engine Hackathon. Contributions welcome after hackathon completion.

## License

[License information]

## Contact

[Contact information]

## Acknowledgments

Built for the Node Engine Hackathon 2026 - Gaming and Entertainment Track.


