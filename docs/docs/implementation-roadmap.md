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
- [ ] Simple block validation: given a header + nonce, verify the face score

**Deliverable**: A standalone mining tool that finds faces in hashes and reports scores.

## Phase 2: Toy Blockchain

**Goal**: A minimal in-memory blockchain demonstrating the full consensus loop.

- [ ] Block structure (header with face-specific fields)
- [ ] Chain management (longest chain selection, fork resolution)
- [ ] Difficulty adjustment algorithm
- [ ] Simple transaction processing (transfers only)
- [ ] Coinbase transaction (block reward + NFT minting)
- [ ] Basic P2P networking (block and transaction propagation)
- [ ] Command-line miner
- [ ] Block explorer (web interface showing the face gallery)

**Deliverable**: A multi-node testnet where participants can mine, send FACE, and view the face gallery.

## Phase 3: Substrate Integration

**Goal**: Production-quality blockchain built on Substrate.

- [ ] Custom `pallet-face-detection` with host functions for fast native detection
- [ ] Custom `pallet-face-nfts` for automatic NFT minting
- [ ] Integrate with `pallet-balances` for FACE token management
- [ ] Extend `sc-consensus-pow` for Proof of Face consensus
- [ ] Implement difficulty adjustment as a runtime module
- [ ] Full transaction validation and state management
- [ ] RPC endpoints for querying face images, NFT metadata, and chain state
- [ ] Chain specification (genesis block, initial parameters)
- [ ] Testnet deployment

**Deliverable**: A Substrate-based testnet with full consensus, native tokens, and NFTs.

## Phase 4: Bridge and Ecosystem

**Goal**: Connect Facecoin to the broader crypto ecosystem.

- [ ] Deploy wFACE (ERC-20) contract on Ethereum
- [ ] Deploy FacecoinNFT (ERC-721) contract on Ethereum
- [ ] Build bridge validator software
- [ ] Implement lock-and-mint protocol for tokens and NFTs
- [ ] Bridge UI for transferring assets between chains
- [ ] Deploy SPL token on Solana (wFACE)
- [ ] Deploy Metaplex NFT on Solana
- [ ] Wallet integration guides (MetaMask, Phantom)

**Deliverable**: Working bridges to Ethereum and Solana with UI.

## Phase 5: Mainnet

**Goal**: Launch the production network.

- [ ] Security audit of consensus, bridge, and smart contracts
- [ ] Performance testing under load
- [ ] Genesis block mining ceremony
- [ ] Mainnet launch
- [ ] Bridge activation
- [ ] Documentation and community onboarding

**Deliverable**: Live mainnet with active mining and bridging.

## Open Research Questions

Several design decisions would benefit from further research and community input:

1. **Optimal image size**: Is 128x128 the right tradeoff between detection quality and generation speed? Benchmarking will inform this.

2. **Detector choice finalization**: Should the protocol support multiple detectors (with the specific detector ID recorded in the block header), or commit to exactly one?

3. **Color mapping for NFTs**: What aesthetic approach produces the most visually interesting colorized faces? This is subjective and could benefit from community input.

4. **Bridge validator incentives**: How should bridge validators be compensated? Transaction fees? Staking rewards?

5. **Governance**: How should protocol parameters (difficulty adjustment period, block time target, detector parameters) be changed over time? On-chain governance? Hard forks?

6. **CLIP integration**: Should a CLIP-based aesthetic score be added as optional NFT metadata? As a consensus parameter? This could enable "proof of beautiful face" at higher difficulty tiers.

7. **Mobile mining**: Face detection on mobile devices is well-supported (MediaPipe was designed for it). Could Facecoin support mobile mining for broader participation?
