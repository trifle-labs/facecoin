---
sidebar_position: 8
title: Blockchain Structure
---

# Blockchain Structure

Facecoin is a sovereign rollup on Celestia. Block production is handled by a standard sequencer; the chain's novel logic lives entirely in the application layer as transaction types and state transitions.

## Block Production

Blocks are produced by the rollup's sequencer at a regular cadence (e.g., every few seconds), independent of face mining. Blocks contain ordinary transactions (transfers, NFT operations) as well as proof of face submissions. This is no different from how any standard Rollkit or Sovereign SDK rollup produces blocks.

The sequencer posts block data to Celestia as blobs. Celestia orders the blobs and guarantees their availability via Data Availability Sampling (DAS).

## Transaction Types

Facecoin supports the following transaction types:

### Transfer

```
Transfer {
    sender:     address
    recipient:  address
    amount:     uint64       // Amount in smallest FACE unit
    fee:        uint64       // Transaction fee
    nonce:      uint64       // Sender's transaction count (replay protection)
    signature:  bytes65      // ECDSA signature (secp256k1)
}
```

### Proof of Face

```
ProofOfFace {
    miner:       address
    challenge:   bytes32      // The current chain challenge
    nonce:       uint64       // The winning nonce
    face_score:  float64      // Claimed detection score
    face_bbox:   BoundingBox  // Claimed face location
    fee:         uint64
    tx_nonce:    uint64
    signature:   bytes65
}
```

When processed, the application layer regenerates the image, runs face detection, verifies the claimed score, checks difficulty, and if valid, mints FACE tokens and an NFT to the miner.

### NFT Transfer

```
NFTTransfer {
    sender:     address
    recipient:  address
    token_id:   uint64
    fee:        uint64
    nonce:      uint64
    signature:  bytes65
}
```

## Application State

The chain's state includes:

```
FacecoinState {
    // Balances
    balances:           Map[address -> uint64]

    // NFTs
    nft_owners:         Map[uint64 -> address]
    nft_metadata:       Map[uint64 -> FaceNFTMetadata]
    next_nft_id:        uint64

    // Mining
    current_challenge:  bytes32
    current_difficulty: float64
    proof_count:        uint64
    last_adjustment:    uint64      // proof count at last adjustment
    proof_timestamps:   RingBuffer  // timestamps of recent proofs

    // Economics
    current_reward:     uint64
    total_supply:       uint64
    halving_threshold:  uint64      // proof count at next halving

    // Accounts
    nonces:             Map[address -> uint64]
}
```

## Genesis State

```
Genesis {
    current_challenge:  SHA-256("facecoin-genesis-2026")
    current_difficulty: 0.10
    current_reward:     50_000       // 50 FACE in mFACE
    proof_count:        0
    total_supply:       0
}
```

No pre-mine. The initial challenge is a well-known seed. The first miner to submit a valid proof at difficulty 0.10 earns the first 50 FACE and NFT #1.

## State Transitions

### On Proof of Face acceptance:
1. Verify proof (see [Proof of Face](./proof-of-face))
2. Mint `current_reward` FACE to miner
3. Mint NFT with face metadata to miner
4. Increment `proof_count`
5. Record timestamp in `proof_timestamps`
6. Update `current_challenge` for next proof
7. If `proof_count` hits adjustment boundary, recalculate difficulty
8. If `proof_count` hits halving boundary, halve reward

### On Transfer:
1. Verify signature and nonce
2. Check sufficient balance
3. Debit sender, credit recipient
4. Deduct fee

### On NFT Transfer:
1. Verify sender owns the NFT
2. Transfer ownership

## Validation

Full nodes validate state transitions by replaying all transactions. For proof of face transactions, this means running the face detection algorithm -- but only for the single submitted proof (not searching), so verification is fast (under 1ms per proof).

Facecoin uses the same elliptic curve cryptography (secp256k1) and address derivation as Ethereum for wallet compatibility. Addresses are the last 20 bytes of the Keccak-256 hash of the public key.
