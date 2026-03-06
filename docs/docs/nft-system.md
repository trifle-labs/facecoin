---
sidebar_position: 10
title: NFT System
---

# NFT System

Every valid proof of face submission produces an NFT -- a unique, non-fungible token representing the face image discovered during mining. This creates a generative art collection as a natural byproduct of the mining game.

## How Mining Creates NFTs

When a miner submits a valid proof of face transaction:

1. The chain verifies the proof (regenerates image, runs detection, checks score)
2. A new NFT is automatically minted to the miner's address
3. The NFT's metadata records the mining context (proof number, difficulty, score, etc.)

No additional action is required. Submitting a valid proof *is* minting.

## NFT Properties

Each Facecoin NFT contains:

```
FaceNFTMetadata {
    token_id:       uint64       // Sequential proof number
    owner:          address      // Initially the miner, transferable
    challenge:      bytes32      // The challenge that was solved
    miner:          address      // Original miner
    nonce:          uint64       // The winning nonce
    face_score:     float64      // Detection confidence score
    face_bbox:      BoundingBox  // Face location in the image
    difficulty:     float64      // Difficulty at time of mining
    timestamp:      uint64       // When the proof was accepted
    image_seed:     bytes32      // SHA-256(challenge + miner + nonce)
}
```

### Token ID

Each NFT's token ID equals its sequential proof number. The first valid proof produces NFT #1, the second produces NFT #2, and so on. This creates a natural ordering tied to the history of mining activity.

### Image Regeneration

The face image is not stored on-chain -- it is regenerated on demand from the `image_seed` (which is `SHA-256(challenge + miner + nonce)`). Any node or viewer can reconstruct the exact image. This keeps on-chain data minimal while preserving the full visual artifact.

For display purposes (wallets, marketplaces, bridges), the image can be rendered as:
- **Raw greyscale**: The actual image the detector saw (128x128)
- **Upscaled greyscale**: Smoothed version at higher resolution
- **Colorized**: Aesthetic color mapping derived from the image seed or miner address (following Myers' Facecoins approach)

## NFT Operations

### Transfer

NFTs can be transferred between addresses via a standard transfer transaction:

```
MsgTransferNFT {
    sender:     address
    recipient:  address
    token_id:   uint64
}
```

### On-Chain Metadata

All NFT metadata is stored on-chain and is fully deterministic. There are no external dependencies (no IPFS links, no centralized servers). The image itself is computable from the chain data.

## The Face Gallery

The complete set of Facecoin NFTs forms a chronological gallery of machine-perceived faces. This gallery has several interesting properties:

- **Difficulty-stratified quality**: NFTs mined at higher difficulty tend to have more visually striking faces, creating a natural quality gradient
- **Historically ordered**: NFT #N was always mined before NFT #N+1
- **Provably unique**: Each image comes from a unique challenge + miner + nonce combination; SHA-256 pre-image resistance makes duplicates virtually impossible
- **Miner-bound provenance**: The original miner is permanently recorded, even after transfer

## Rarity and Value

While all Facecoin NFTs are structurally identical, several factors create natural variation in perceived value:

- **Face score**: Higher scores indicate more "convincing" faces
- **Difficulty at time of mining**: Higher difficulty means more computational work was required
- **Visual quality**: Some faces will be more aesthetically interesting than others (subjective, but CLIP scoring could quantify this)
- **Proof number**: Early proofs may have collector value (low token IDs)
- **Historical significance**: Proofs at difficulty transitions, halving events, or other milestones

## Bridged NFT Representation

When bridged to Ethereum or Solana (see [Bridging](./bridging)), the NFT metadata is mapped to the target chain's standard:

**ERC-721 (Ethereum):**
```json
{
  "name": "Facecoin #1234",
  "description": "Face mined at proof 1234, difficulty 0.42, score 0.87",
  "image": "data:image/png;base64,...",
  "attributes": [
    { "trait_type": "Face Score", "value": 0.87 },
    { "trait_type": "Difficulty", "value": 0.42 },
    { "trait_type": "Proof Number", "value": 1234 },
    { "trait_type": "Timestamp", "value": 1709750400 }
  ]
}
```

The image is included as a base64 data URI (the 128x128 greyscale image is only ~16KB as PNG, well within on-chain limits). For the colorized version, the rendering is done at bridge time.
