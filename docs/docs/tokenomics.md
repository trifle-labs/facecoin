---
sidebar_position: 9
title: Tokenomics
---

# Tokenomics

## FACE Token

FACE is the native currency of the Facecoin blockchain. It is used for transaction fees, block rewards, and as the unit of economic value in the network.

## Supply Schedule

Facecoin follows a halving-based emission schedule similar to Bitcoin, adapted for the faster block time.

| Parameter | Value |
|-----------|-------|
| **Block time target** | 60 seconds |
| **Initial block reward** | 50 FACE |
| **Halving interval** | 525,600 blocks (~1 year) |
| **Minimum block reward** | 1 FACE (no further halving below this) |
| **Total supply cap** | ~52,560,000 FACE |
| **Smallest unit** | 1 mFACE (milli-FACE) = 0.001 FACE |

### Emission Schedule

| Year | Block Reward | Annual Emission | Cumulative Supply |
|------|-------------|-----------------|-------------------|
| 1 | 50 FACE | 26,280,000 | 26,280,000 |
| 2 | 25 FACE | 13,140,000 | 39,420,000 |
| 3 | 12.5 FACE | 6,570,000 | 45,990,000 |
| 4 | 6.25 FACE | 3,285,000 | 49,275,000 |
| 5 | 3.125 FACE | 1,642,500 | 50,917,500 |
| 6+ | ... | diminishing | approaching cap |

After approximately 6-7 years, the block reward reaches the 1 FACE floor and remains there indefinitely. This provides a permanent small inflation to incentivize miners even after the initial emission period, while keeping the supply growth rate near zero as total supply grows.

## Transaction Fees

All transactions include a fee paid in FACE. Fees serve two purposes:

1. **Spam prevention**: Non-zero cost to submit transactions
2. **Miner incentive**: Fees are collected by the block miner in addition to the block reward

The fee market is simple: miners include transactions in order of fee-per-byte, and users set fees based on how quickly they want confirmation. There is no complex gas mechanism -- fees are flat per transaction byte.

## Block Reward Distribution

Each valid block awards the miner:
- The current block reward (50 FACE initially, halving over time)
- All transaction fees from included transactions
- One NFT of the mined face image (see [NFT System](./nft-system))

The block reward is created as a special coinbase transaction, the first transaction in every block.

## Pre-mine

There is **no pre-mine**. All FACE tokens are created through mining. The project maintainers participate in mining on equal terms with everyone else.

## Economic Design Rationale

The 1-minute block time and 1-year halving are chosen to create a compressed version of Bitcoin's emission curve. This accelerates the path to a mature fee-based economy while still providing meaningful mining rewards in the early years.

The permanent 1 FACE floor reward ensures that mining remains economically viable indefinitely. Unlike Bitcoin, where mining eventually depends entirely on transaction fees, Facecoin guarantees a small ongoing subsidy to miners. This reduces the risk of a "fee death spiral" where insufficient fees cause miners to leave, reducing security.
