# Custodian

Custodian is a charity-giving dashboard concept for making donations and fund
releases easier to follow. It presents campaigns, milestone progress, allocation
reports, and a transaction ledger, with an optional Sepolia escrow donation flow.

## Features

- Browse charity campaigns and their funding goals.
- Review each campaign's milestone and release status.
- View donation and allocation summaries in the ledger and reports.
- Connect an EIP-1193 wallet, such as MetaMask or Rabby, for Sepolia donations
  when an escrow contract is configured.
- Try the donation receipt flow in demo mode without sending a transaction.

> **Demo data:** Campaigns, totals, reports, and the initial ledger are sample
> application data from `src/lib/chain-data.ts`; they are not fetched from the
> blockchain. In demo mode, receipts are simulated locally and are not on-chain
> transactions.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```sh
git clone <repository-url>
cd trust-chain-giving-main
npm install
npm run dev
```

Open the local URL printed by Vite, usually <http://localhost:5173>.

## Available commands

```sh
npm run dev       # Start the development server
npm run build     # Build the production client and server
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## Sepolia donations

Live donations are disabled until a `CustodianEscrow` contract is deployed to
Sepolia and configured in `src/lib/chain-config.ts`. Set
`ESCROW_CONTRACT_ADDRESS` to the deployed contract address and ensure
`campaignIds` maps each campaign slug to the corresponding on-chain campaign ID.
The app expects a compatible contract with the `donate(campaignId)` payable
function. A wallet browser extension must be installed and connected to Sepolia.

Until a contract address is configured, the donation panel stays in demo mode.
It does not send ETH or create a blockchain transaction.

## Tech stack

- React 19 and TypeScript
- TanStack Start and TanStack Router
- Vite
- Tailwind CSS 4
- viem for wallet and Ethereum interactions
