# ArcAgentRegistry 🤖

**Onchain AI Agent Registry + Dashboard** built exclusively for **Arc Testnet** using the **ERC-8004 (Trustless Agents)** standard.

![ArcAgent Dashboard Preview](https://avatar.vercel.sh/arc-registry)

## Features
- **Wallet Connection**: Full Wagmi v2 + Viem integration with Arc Testnet (Chain ID: 5042002).
- **USDC Gas Support**: Native support for gas payments using USDC on Arc.
- **Agent Discovery**: Browse registered agents with search and capability filtering.
- **Onchain Registration**: Register new agents via IdentityRegistry (ERC-721/8004 ID).
- **IPFS Integration**: Automated metadata pinning for trustless agent definitions.
- **Trust Metrics**: Reputation and Validation scores directly from the Arc contracts.
- **Premium UI**: Cyberpunk-dark aesthetic with smooth animations, skeletons, and mobile-responsive layout.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui + Lucide Icons
- **Blockchain**: Wagmi v2 + Viem
- **State/Query**: @tanstack/react-query
- **Form Handling**: React Hook Form + Zod
- **Toast**: Sonner

## Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- npm or pnpm
- MetaMask or any EVM wallet

### 2. Installation
```bash
# Clone the repository (or copy files)
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and provide your Pinata JWT:
```bash
cp .env.example .env
```
To get a Pinata JWT, create a free account at [Pinata](https://app.pinata.cloud/).

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

## Arc Testnet Configuration
- **Chain ID**: 5042002
- **RPC**: https://rpc.testnet.arc.network
- **Explorer**: [ArcScan](https://testnet.arcscan.app)
- **Contract Addresses**:
  - `IdentityRegistry`: 0x8004A818BFB912233c491871b3d84c89A494BD9e
  - `ReputationRegistry`: 0x8004B663056A597Dffe9eCcC1965A193B7388713
  - `ValidationRegistry`: 0x8004Cb1BF31DAf7788923b405b754f57acEB4272

## How to get Test USDC?
Visit the official [Arc Network Faucet](https://faucet.arc.network) or bridge via the documentation resources.

## License
MIT
