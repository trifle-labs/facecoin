---
sidebar_position: 8
title: Blockchain Structure
---

# Blockchain Structure

Facecoin uses a conventional blockchain structure with modifications to accommodate the Proof of Face consensus mechanism.

## Block Header

```
FacecoinBlockHeader {
    version:            uint32       // Protocol version
    previous_hash:      bytes32      // SHA-256 hash of previous block header
    transactions_root:  bytes32      // Merkle root of block transactions
    timestamp:          uint64       // Unix timestamp (seconds)
    difficulty:         float64      // Required minimum face score threshold
    nonce:              uint64       // Mining nonce
    face_score:         float64      // Achieved face detection score
    face_bbox:          BoundingBox  // Detected face location (x, y, w, h)
    image_hash:         bytes32      // SHA-256 of the generated face image
    miner_address:      bytes20      // Address receiving the block reward
}
```

The `previous_hash` field creates the chain linkage -- each block references the hash of the block before it. The longest valid chain (most cumulative work) is canonical.

### Face-Specific Fields

- **`face_score`**: The actual score achieved by this block's image. Must be >= `difficulty`.
- **`face_bbox`**: The bounding box of the detected face (x, y, width, height in pixels). Stored for verification and as NFT metadata.
- **`image_hash`**: Hash of the full generated image. Allows nodes to verify the image without storing it permanently (the image can be regenerated from `previous_hash + nonce`).

## Block Body

```
FacecoinBlock {
    header:        FacecoinBlockHeader
    transactions:  Transaction[]
    face_image:    bytes              // The generated face image (optional storage)
}
```

The face image itself can be regenerated deterministically from the block header, so storing it in the block body is optional. However, for convenience and archival purposes, nodes may include it.

## Genesis Block

```
Block 0 (Genesis) {
    previous_hash:  0x0000...0000 (32 zero bytes)
    difficulty:     0.10
    nonce:          <to be determined at launch>
    face_score:     <to be determined at launch>
    timestamp:      <launch timestamp>
    transactions:   []
}
```

The genesis block is hardcoded into the client software. Its nonce and face score are determined by the project maintainers before launch by mining the first valid face at the initial difficulty.

## Chain Selection: Longest Chain Rule

When a node receives competing chains, it selects the chain with the **most blocks** as canonical. This is the same rule Bitcoin uses (technically, Bitcoin uses most cumulative work, but since Facecoin's difficulty is per-block and adjusts frequently, block count serves as a reasonable proxy).

More precisely, the chain with the greatest **cumulative difficulty** is preferred:

```
chain_work = sum(block.difficulty for block in chain)
```

A chain of 100 blocks at difficulty 0.5 represents more work than a chain of 100 blocks at difficulty 0.1, and is therefore preferred.

## Transaction Format

```
Transaction {
    sender:     bytes20      // Sender address
    recipient:  bytes20      // Recipient address
    amount:     uint64       // Amount in smallest FACE unit
    fee:        uint64       // Transaction fee
    nonce:      uint64       // Sender's transaction count (replay protection)
    data:       bytes        // Optional data field (for NFT operations)
    signature:  bytes65      // ECDSA signature (secp256k1)
}
```

Facecoin uses the same elliptic curve cryptography (secp256k1) and address derivation as Ethereum for wallet compatibility. Addresses are the last 20 bytes of the Keccak-256 hash of the public key.

## Block Validation Rules

A block is valid if and only if:

1. `previous_hash` matches the hash of the current chain tip (or a valid fork point)
2. `timestamp` is greater than the previous block's timestamp
3. `difficulty` matches the expected difficulty per the adjustment algorithm
4. The image generated from `header + nonce` (via the deterministic image generation pipeline) produces a face score >= `difficulty` when run through the reference detector
5. `face_score` matches the actual detected score
6. `face_bbox` matches the actual detected bounding box
7. `image_hash` matches SHA-256 of the generated image
8. `transactions_root` is the correct Merkle root of the included transactions
9. All transactions are individually valid (correct signatures, sufficient balances, correct nonces)
10. The block reward transaction is correct (proper amount, sent to `miner_address`)

## Block Size

The maximum block size is **1 MB**, sufficient for several thousand transactions. The face image is not counted against the block size limit since it is deterministically regenerable.
