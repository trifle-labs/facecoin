---
sidebar_position: 13
title: Implementation Roadmap
---

# Implementation Roadmap

## Phase 1: Proof of Concept

**Goal**: Validate the core Proof of Face mechanism in isolation.

- [ ] Implement hash-to-image pipeline (SHA-256 iterative expansion to 128x128 greyscale)
- [ ] Integrate Haar Cascade face detection with scoring
- [ ] Build a mining loop that finds face-producing nonces
- [ ] Benchmark: how many nonces per second can be tested?
- [ ] Benchmark: what is the distribution of face scores across random inputs?
- [ ] Calibrate initial difficulty threshold based on benchmarks
- [ ] Determinism test suite: verify identical results across platforms
- [ ] Simple proof verification: given a challenge + miner + nonce, verify the face score

**Deliverable**: A standalone mining CLI that finds faces in hashes and reports scores.

## Phase 2: Rollup with Mining

**Goal**: Deploy the Proof of Face mechanism as a Cosmos SDK module on a Rollkit sovereign rollup.

- [ ] Scaffold Cosmos SDK chain with Rollkit
- [ ] Implement `x/facecoin` module:
  - [ ] `MsgSubmitProofOfFace` transaction type
  - [ ] On-chain face detection verification (gocv or pure-Go Haar Cascade)
  - [ ] Challenge rotation logic
  - [ ] Difficulty adjustment algorithm
  - [ ] FACE token minting on valid proof
  - [ ] NFT minting on valid proof
- [ ] `MsgTransferNFT` transaction type
- [ ] Genesis state configuration
- [ ] Connect to Celestia testnet (Mocha)
- [ ] Mining client that watches chain state and submits proofs
- [ ] Basic block explorer / face gallery web UI

**Deliverable**: A testnet rollup on Celestia where participants can mine FACE, submit proofs, and view the face gallery.

## Phase 3: Polish and Testnet

**Goal**: Production-quality testnet with full feature set.

- [ ] Determinism test suite across platforms (ensure all nodes compute identical scores)
- [ ] Mining client optimizations (parallel nonce search, GPU-accelerated detection)
- [ ] RPC endpoints for querying face images, NFT metadata, mining stats
- [ ] Wallet integration (Keplr or custom)
- [ ] Face gallery web app with colorized rendering
- [ ] CLIP-based aesthetic scoring (optional, off-chain) for NFT quality ranking
- [ ] Load testing and performance tuning
- [ ] Public testnet launch

**Deliverable**: Public testnet with mining client, wallet, and gallery.

## Phase 4: Bridge and Ecosystem

**Goal**: Connect Facecoin to the broader crypto ecosystem.

- [ ] Deploy wFACE (ERC-20) contract on Ethereum
- [ ] Deploy FacecoinNFT (ERC-721) contract on Ethereum
- [ ] Implement bridge (Axelar, Lazybridging, or custom lock-and-mint)
- [ ] Bridge UI for transferring assets between chains
- [ ] Deploy SPL token on Solana (wFACE)
- [ ] Deploy Metaplex NFT on Solana
- [ ] Wallet integration guides (MetaMask, Phantom)

**Deliverable**: Working bridges to Ethereum and Solana with UI.

## Phase 5: Mainnet

**Goal**: Launch the production network.

- [ ] Security audit of application module and bridge contracts
- [ ] Migrate from Celestia testnet to mainnet
- [ ] Performance testing under load
- [ ] Mainnet launch
- [ ] Bridge activation
- [ ] Documentation and community onboarding

**Deliverable**: Live mainnet with active mining and bridging.

## Open Research Questions

1. **Optimal image size**: Is 128x128 the right tradeoff between detection quality and generation speed? Benchmarking will inform this.

2. **Detector choice finalization**: Should the protocol support multiple detectors (with the specific detector ID recorded in the proof), or commit to exactly one?

3. **Color mapping for NFTs**: What aesthetic approach produces the most visually interesting colorized faces? This is subjective and could benefit from community input.

4. **Sequencer decentralization**: When and how to transition from a centralized sequencer to shared/decentralized sequencing (Astria, Espresso, etc.).

5. **Governance**: How should protocol parameters (difficulty adjustment period, proof rate target, detector parameters) be changed over time? On-chain governance? Hard forks?

6. **CLIP integration**: Should a CLIP-based aesthetic score be added as optional NFT metadata? As a chain parameter? This could enable "proof of beautiful face" at higher difficulty tiers.

7. **Mobile mining**: Face detection on mobile devices is well-supported (MediaPipe was designed for it). Could Facecoin support a mobile mining client for broader participation?
