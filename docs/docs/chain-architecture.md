---
sidebar_position: 11
title: Chain Architecture
---

# Chain Architecture

Facecoin is designed as a standalone sovereign blockchain. This section compares framework options and justifies the architectural choice.

## Framework Comparison

### Option 1: Celestia Sovereign Rollup

**Language**: Rust (Sovereign SDK) or Go (Rollkit)

A sovereign rollup on Celestia publishes block data to Celestia's data availability (DA) layer but defines its own execution rules, consensus, and fork-choice logic. Celestia handles data ordering and availability; the rollup handles everything else.

**How it works for Facecoin:**
- Miners run Proof of Face locally to produce blocks
- Winning blocks are posted as data blobs to Celestia
- Celestia orders the blobs and guarantees their availability via Data Availability Sampling (DAS)
- Facecoin full nodes download their namespace's data from Celestia and verify blocks against the Proof of Face rules
- The rollup is fully sovereign -- it defines its own validity rules, and upgrades work like L1 forks

**Pros:**
- **Inherited DA security from day 1**: Celestia's validator set secures data availability immediately, solving the cold-start problem. A brand new PoW chain with low hashrate is vulnerable to data withholding attacks; Celestia eliminates this risk.
- **Separation of concerns**: PoW is used purely for block production sybil resistance, while DA is handled by a proven, dedicated layer. This is a cleaner architecture than making PoW miners responsible for both.
- **DAS-enabled light clients**: Light nodes can verify data availability with cryptographic guarantees by sampling small portions of block data, without downloading entire blocks.
- **Low DA costs**: ~$0.07/MB on Celestia vs ~$3.83/MB on Ethereum. A Facecoin block header is tiny; even with transaction data, costs are single-digit dollars per day.
- **Sovereignty preserved**: The rollup defines its own rules entirely. Celestia cannot censor or interpret Facecoin blocks. Upgrades are community forks, not smart contract governance.
- **Growing bridging infrastructure**: Lazybridging (ZK-based IBC bridging native to Celestia), Axelar integration, and IBC compatibility provide multiple paths to cross-chain interoperability.
- **No need to bootstrap a validator set for DA**: The most dangerous period for any new chain is the early days when security is low. Celestia removes this vulnerability for the DA layer.

**Cons:**
- **Dependency on Celestia**: DA availability depends on Celestia's liveness. If Celestia goes down, new Facecoin blocks cannot be finalized (though they can still be produced and queued).
- **TIA costs**: Ongoing fees to post data to Celestia (though these are low).
- **Rollup frameworks are maturing**: Rollkit is MVP-stage; Sovereign SDK is more mature but newer than Substrate.
- **Custom PoW sequencer required**: Neither Rollkit nor Sovereign SDK provides PoW out of the box. The PoW block production layer must be custom-built.

**Frameworks:**

| Framework | Language | Notes |
|-----------|----------|-------|
| **Sovereign SDK** | Rust | High-performance ZK rollup framework. 30k+ ops/sec. Write logic in standard Rust. Supports Celestia and Bitcoin as DA. Best fit for Facecoin given Rust performance needs for face detection. |
| **Rollkit** | Go | ABCI 2.0-compatible, drop-in CometBFT replacement. Any Cosmos SDK chain can become a sovereign rollup. More established but Go-based. |
| **Custom** | Any | Celestia's DA interface is just blob submission via RPC. Any language can post blobs using the `PayForBlobs` transaction type. |

### Option 2: Substrate (Polkadot Ecosystem)

**Language**: Rust

Substrate is a modular blockchain framework by Parity Technologies with a complete toolkit for building custom blockchains.

**PoW Support**: Native. Substrate includes an official `basic-pow` consensus module (`sc_consensus_pow` crate). This is the only major framework with first-class PoW support.

**Pros:**
- Most mature PoW support among all frameworks
- Modular "pallet" system: 30+ core modules for balances, NFTs, governance, etc.
- `pallet-nfts` provides ready-made NFT functionality
- Battle-tested (Polkadot, 100+ parachains)
- Can operate fully standalone or join Polkadot as a parachain
- Strong documentation and active community
- Rust ensures memory safety and high performance
- No external dependency for DA (self-contained)

**Cons:**
- Must bootstrap its own miner/validator security from scratch (cold-start problem)
- No DAS for light clients -- they must trust the validator set or download all data
- Polkadot ecosystem is PoS-oriented; PoW is somewhat against the grain
- Framework is heavy for a conceptually simple chain
- Bridging to Ethereum requires custom work (Snowbridge or similar)

### Option 3: Cosmos SDK

**Language**: Go

Cosmos SDK uses CometBFT consensus and focuses on application-specific blockchains.

**PoW Support**: Not native. Default consensus is BFT/PoS. Custom consensus engines are possible via ABCI but PoW would require building from scratch.

**Pros:**
- Go is more accessible than Rust
- IBC (Inter-Blockchain Communication) is the most mature cross-chain protocol
- 200+ chains in production, large developer community

**Cons:**
- PoW is not a natural fit; requires significant custom work
- CometBFT assumes BFT model (fixed validator sets), not PoW (open mining)
- IBC is designed for PoS chains; adapting it for PoW adds challenges

### Option 4: Custom Implementation

**Language**: Any

Build everything from scratch.

**Pros:**
- Complete control, no framework overhead

**Cons:**
- Enormous engineering effort (networking, storage, consensus, RPC, etc.)
- Must solve DA, security, and bridging from scratch
- Largest audit surface

## Recommendation: Celestia Sovereign Rollup

**A sovereign rollup on Celestia is the strongest architecture for Facecoin.**

The decisive insight is that Facecoin's novel contribution is **Proof of Face** -- the face detection consensus mechanism. Everything else (data availability, networking, storage, bridging) is infrastructure that has been solved by others. A Celestia sovereign rollup lets Facecoin focus entirely on what makes it unique while inheriting battle-tested infrastructure for everything else.

### Why Celestia over Substrate?

| Concern | Celestia Rollup | Substrate Standalone |
|---------|----------------|---------------------|
| **Cold-start security** | Inherited from Celestia day 1 | Must bootstrap; vulnerable early |
| **Data availability** | DAS with cryptographic guarantees | Trust validators or download everything |
| **Light clients** | DAS-enabled, trustless | Standard, must trust validator set |
| **DA costs** | ~$0.07/MB (explicit, low) | Hidden in inflation/validator rewards |
| **Bridging** | Lazybridging, Axelar, IBC (growing) | Snowbridge (limited), custom bridges |
| **Focus** | Build only the novel parts | Build consensus + DA + networking + everything |
| **PoW support** | Custom sequencer required | Native `sc_consensus_pow` crate |

Substrate's advantage is native PoW support. But implementing a custom PoW sequencer that posts to Celestia is a smaller engineering task than building and securing an entire standalone chain's DA layer. The cold-start security problem alone justifies the Celestia approach -- a new PoW chain with low hashrate is dangerously vulnerable, while Celestia's DA security is immediate and robust.

### Sovereign SDK as the Framework

**Sovereign SDK** (Rust) is the recommended framework for the rollup:

1. **Rust performance**: Face detection in the consensus hot path benefits from Rust's zero-cost abstractions
2. **ZK proof support**: Sovereign SDK can generate ZK proofs of execution, enabling trust-minimized bridging via Lazybridging
3. **High throughput**: 30k+ operations/sec with P99 under 10ms execution latency
4. **Standard Rust**: Write chain logic in normal Rust, no framework-specific DSL
5. **Dual DA support**: Can use Celestia or Bitcoin as DA layer, providing a fallback option

## Architecture Overview

```
+--------------------------------------------------+
|              Facecoin Sovereign Rollup             |
|                                                    |
|  +----------------------------------------------+  |
|  |          Execution Layer (Rust)               |  |
|  |                                               |  |
|  |  +-------------------+  +------------------+  |  |
|  |  | Face Detection    |  | NFT Minting      |  |  |
|  |  | (Haar Cascade)    |  | (auto per block)  |  |  |
|  |  +-------------------+  +------------------+  |  |
|  |  +-------------------+  +------------------+  |  |
|  |  | Balances          |  | Difficulty       |  |  |
|  |  | (FACE token)      |  | Adjustment       |  |  |
|  |  +-------------------+  +------------------+  |  |
|  |  +-------------------------------------------+  |
|  |  | Transaction Processing                     |  |
|  |  +-------------------------------------------+  |
|  +----------------------------------------------+  |
|                                                    |
|  +----------------------------------------------+  |
|  |     Block Production: Proof of Face           |  |
|  |  (custom PoW sequencer)                       |  |
|  +----------------------------------------------+  |
|                                                    |
|  +----------------------------------------------+  |
|  |     State Management (Sovereign SDK)          |  |
|  |     JMT (Jellyfish Merkle Tree)               |  |
|  +----------------------------------------------+  |
+--------------------------------------------------+
                       |
                       | blob submission
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

### Custom PoW Sequencer

The core custom component is the **Proof of Face sequencer** -- the block producer that:

1. Collects pending transactions from the mempool
2. Constructs a candidate block header
3. Runs the mining loop (nonce iteration + face detection)
4. When a valid proof of face is found, submits the block as a blob to Celestia
5. The blob includes: block header, transactions, face detection proof (nonce + score + bbox)

This is the only part of the stack that requires truly novel engineering. Everything else -- DA, state management, transaction processing, RPC -- is provided by Sovereign SDK and Celestia.

### Face Detection in the Execution Layer

The face detection logic lives in the execution layer as a **native Rust module**:

```rust
/// Verify a proof of face for block validation
fn verify_proof_of_face(
    block_header: &BlockHeader,
    nonce: u64,
    claimed_score: f64,
    claimed_bbox: BoundingBox,
) -> Result<bool, Error> {
    let seed = sha256(block_header, nonce);
    let image = generate_image(&seed, 128, 128);
    let detection = haar_detect(&image)?;
    Ok(detection.score == claimed_score
        && detection.bbox == claimed_bbox
        && detection.score >= block_header.difficulty)
}
```

Since this runs in native Rust (not WASM), face detection performance is optimal.

## Networking

The rollup's P2P network handles:
- **Transaction gossip**: Users submit transactions to any full node
- **Block announcement**: Miners announce new blocks to peers
- **Celestia interaction**: The sequencer posts blobs; full nodes read their namespace

Sovereign SDK provides networking primitives. Additionally, Celestia's light node network provides a secondary path for block data retrieval via DAS.

## Storage

- **State**: Stored in a Jellyfish Merkle Tree (JMT), Sovereign SDK's default state commitment scheme
- **Block data**: Available on Celestia (authoritative) and cached locally by full nodes
- **Face images**: Regenerated on demand from block header data (not stored)

The separation of DA (Celestia) from execution state (local) keeps node storage requirements minimal. A new node can sync by downloading its namespace from Celestia and replaying execution.

## Celestia DA Costs

For Facecoin's expected throughput:

| Component | Size per Block | Monthly Cost (est.) |
|-----------|---------------|-------------------|
| Block header | ~200 bytes | Negligible |
| Transactions (avg 100/block) | ~20 KB | ~$3-5/month |
| Total at 1 block/min | ~30 MB/day | ~$60-90/month |

These costs are paid in TIA by the sequencer (miner) and can be recouped via transaction fees and block rewards.
