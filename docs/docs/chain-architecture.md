---
sidebar_position: 11
title: Chain Architecture
---

# Chain Architecture

Facecoin is a sovereign rollup on Celestia. The key architectural decision is that **Proof of Face is application-layer logic, not consensus**. Block production uses a standard centralized sequencer provided by off-the-shelf rollup frameworks. This eliminates the need for custom consensus engineering and makes Facecoin deployable with minimal custom infrastructure.

## Why Application-Layer Mining?

In the original design (and in Rhea Myers' Facecoin), face detection *is* the block production mechanism -- you can't make a block without finding a face. This is elegant but creates a hard problem: you need a custom consensus engine, custom sequencer, and custom block production pipeline. No existing rollup framework supports PoW out of the box.

By moving Proof of Face to the application layer:

- **Block production is solved**: Use Rollkit or Sovereign SDK's standard sequencer. No custom consensus code.
- **The chain works immediately**: Blocks are produced at a regular cadence even if no one is mining faces.
- **Face mining is a transaction type**: Miners submit proofs as transactions, verified on-chain. This is the same pattern as proof-of-work tokens on Ethereum (e.g., 0xBitcoin).
- **All the interesting parts are preserved**: The face detection, difficulty adjustment, NFT minting, and economic incentives work identically -- they just live in the application layer instead of the consensus layer.

## Framework Comparison

### Option 1: Rollkit (Recommended)

**Language**: Go

Rollkit is an ABCI 2.0-compatible rollup framework that acts as a drop-in replacement for CometBFT. Any Cosmos SDK chain can become a sovereign rollup by swapping CometBFT for Rollkit.

**Why it fits Facecoin:**
- Standard centralized sequencer out of the box -- exactly what we need
- Cosmos SDK provides ready-made modules for accounts, balances, and governance
- ABCI interface lets us write custom application logic (face detection verification) as a Cosmos SDK module
- Posts blocks to Celestia automatically
- IBC compatibility for future interoperability

**Trade-off:** Face detection verification must run in Go. This is fine -- Haar Cascade is computationally trivial for single-image verification (under 1ms), and Go's OpenCV bindings (gocv) are mature.

### Option 2: Sovereign SDK

**Language**: Rust

High-performance sovereign rollup framework. Write chain logic in standard Rust.

**Why it might fit:**
- Rust gives maximum performance for face detection
- ZK proof support enables trust-minimized bridging via Celestia's Lazybridging
- 30k+ operations/sec throughput

**Trade-off:** Less mature than Rollkit. Smaller ecosystem. But Rust is ideal if face detection verification performance becomes a concern at scale.

### Option 3: Substrate

**Language**: Rust

Standalone blockchain framework with native PoW support.

**Trade-off:** Massive framework for what is now a simple application-layer problem. The whole point of making Proof of Face application-layer is to avoid needing Substrate's complexity. Also requires bootstrapping your own DA and validator security.

### Option 4: Custom

Build everything from scratch.

**Trade-off:** Unnecessary now that the architecture doesn't require custom consensus.

### Recommendation: Rollkit

Rollkit is the strongest choice because Facecoin's architecture is now a standard sovereign rollup with custom application logic. Rollkit provides everything needed out of the box:

- Sequencer and block production
- Celestia DA integration
- Cosmos SDK module system for custom logic
- Account and balance management
- Transaction processing
- RPC endpoints

The only custom code is the **Facecoin application module**: face detection verification, difficulty adjustment, NFT minting, and the proof of face transaction handler.

## Architecture Overview

```
+--------------------------------------------------+
|          Facecoin Sovereign Rollup (Rollkit)       |
|                                                    |
|  +----------------------------------------------+  |
|  |    Application Layer (Cosmos SDK Module)      |  |
|  |                                               |  |
|  |  +-------------------+  +------------------+  |  |
|  |  | Proof of Face     |  | Face NFTs        |  |  |
|  |  | - verification    |  | - auto-mint      |  |  |
|  |  | - difficulty adj  |  | - metadata       |  |  |
|  |  | - challenge mgmt  |  | - transfers      |  |  |
|  |  +-------------------+  +------------------+  |  |
|  |  +-------------------------------------------+  |
|  |  | Standard Cosmos SDK Modules               |  |
|  |  | (bank, auth, staking, etc.)               |  |
|  |  +-------------------------------------------+  |
|  +----------------------------------------------+  |
|                                                    |
|  +----------------------------------------------+  |
|  |     Rollkit (Sequencer + Block Production)    |  |
|  |     - standard centralized sequencer          |  |
|  |     - ABCI 2.0 interface                      |  |
|  +----------------------------------------------+  |
|                                                    |
+--------------------------------------------------+
                       |
                       | blob submission (automatic)
                       v
+--------------------------------------------------+
|              Celestia DA Layer                     |
|                                                    |
|  +----------------------------------------------+  |
|  |  Data Availability Sampling (DAS)             |  |
|  |  Namespaced Merkle Trees (NMT)                |  |
|  |  Consensus (CometBFT + TIA staking)           |  |
|  +----------------------------------------------+  |
+--------------------------------------------------+
```

## The Facecoin Module

The single piece of custom engineering is a Cosmos SDK module implementing:

### Message Types
- `MsgSubmitProofOfFace` -- submit a mined face proof
- `MsgTransferNFT` -- transfer a face NFT

### Keeper (State Management)
- Current challenge, difficulty, proof count
- NFT ownership and metadata registry
- Mining reward calculation
- Difficulty adjustment logic

### Face Detection (Verification Only)
- Hash-to-image pipeline (deterministic)
- Haar Cascade face detection (via gocv or a pure-Go implementation)
- Score computation and validation

This module is the entirety of Facecoin's custom code. Everything else -- accounts, balances, transaction processing, sequencing, DA, RPC -- is provided by Rollkit and Cosmos SDK.

## Networking

Rollkit handles all networking:
- **Transaction gossip**: Users submit proof of face transactions to any node
- **Block propagation**: The sequencer distributes blocks to full nodes
- **Celestia interaction**: Rollkit posts blobs and reads them back automatically

## Storage

- **State**: Cosmos SDK's IAVL tree (the standard state commitment scheme)
- **Block data**: Available on Celestia (authoritative) and cached locally
- **Face images**: Not stored -- regenerated on demand from proof data

A new node syncs by downloading block data from Celestia and replaying transactions.

## Celestia DA Costs

| Component | Size per Block | Monthly Cost (est.) |
|-----------|---------------|-------------------|
| Block header | ~200 bytes | Negligible |
| Transactions (avg) | ~5-20 KB | ~$3-10/month |
| Total at regular cadence | ~10-30 MB/day | ~$20-60/month |

These costs are covered by transaction fees collected by the sequencer.

## Decentralization Path

The initial centralized sequencer can be upgraded over time:

1. **Launch**: Single sequencer operated by the project team. Simple, reliable, fast.
2. **Shared sequencing**: Migrate to a shared sequencer (e.g., Astria, Espresso) for censorship resistance.
3. **Decentralized sequencing**: If the Celestia ecosystem develops decentralized sequencer solutions, adopt them.

The application logic (Proof of Face) is unaffected by sequencer changes -- it's the same module regardless of who produces blocks.
