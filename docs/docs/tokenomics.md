---
sidebar_position: 9
title: Tokenomics
---

# Tokenomics

## FACE Token

FACE is the native currency of the Facecoin rollup. It is used for transaction fees and as mining rewards.

## Supply Schedule

FACE is emitted through proof of face mining. The reward halves at fixed intervals measured by proof count (not block count, since blocks are produced by the sequencer independent of mining).

| Parameter | Value |
|-----------|-------|
| **Target proof rate** | 1 per 60 seconds |
| **Initial mining reward** | 50 FACE |
| **Halving interval** | 525,600 proofs (~1 year at target rate) |
| **Minimum reward** | 1 FACE (no further halving below this) |
| **Total supply cap** | ~52,560,000 FACE |
| **Smallest unit** | 1 mFACE (milli-FACE) = 0.001 FACE |

### Emission Schedule

| Year | Reward per Proof | Annual Emission | Cumulative Supply |
|------|-----------------|-----------------|-------------------|
| 1 | 50 FACE | 26,280,000 | 26,280,000 |
| 2 | 25 FACE | 13,140,000 | 39,420,000 |
| 3 | 12.5 FACE | 6,570,000 | 45,990,000 |
| 4 | 6.25 FACE | 3,285,000 | 49,275,000 |
| 5 | 3.125 FACE | 1,642,500 | 50,917,500 |
| 6+ | ... | diminishing | approaching cap |

After approximately 6-7 years, the reward reaches the 1 FACE floor and remains there indefinitely. This provides permanent small inflation to incentivize miners while keeping the growth rate near zero.

## Transaction Fees

All transactions include a fee paid in FACE. Fees serve two purposes:

1. **Spam prevention**: Non-zero cost to submit transactions discourages spam proofs
2. **Sequencer compensation**: Fees compensate the sequencer for block production and Celestia DA costs

The fee market is simple: fees are flat per transaction byte. The sequencer includes transactions in order of fee density.

## Mining Reward Distribution

Each valid proof of face awards the miner:
- The current mining reward (50 FACE initially, halving over time)
- One NFT of the mined face image (see [NFT System](./nft-system))

## Pre-mine

There is **no pre-mine**. All FACE tokens are created through proof of face mining. The project maintainers participate in mining on equal terms with everyone else.

## Sequencer Economics

The sequencer earns transaction fees to cover operational costs (primarily Celestia DA blob submission fees, estimated at ~$60-90/month at launch throughput). If the sequencer is operated by the project team, it can run at cost. If decentralized sequencing is adopted later, fee-based compensation becomes the primary incentive.

Since block production is not tied to mining, there is no "block reward" in the Bitcoin sense. The sequencer is a service provider, not a miner. FACE emission comes exclusively from proof of face submissions.

## Economic Design Rationale

Tying emission to proof count (rather than block count) ensures that FACE is only created when computational work has been performed. If no one is mining, no FACE is emitted and the supply remains unchanged. This is a cleaner incentive alignment than emitting tokens per block regardless of mining activity.

The permanent 1 FACE floor reward ensures that mining remains viable indefinitely, avoiding the "fee death spiral" where insufficient fees cause miners to leave.
