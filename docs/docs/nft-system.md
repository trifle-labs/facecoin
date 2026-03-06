---
sidebar_position: 10
title: NFT System
---

# NFT System

Every successfully mined Facecoin block produces an NFT -- a unique, non-fungible token representing the face image discovered during mining. This creates a generative art collection as a natural byproduct of consensus.

## How Mining Creates NFTs

When a miner finds a valid proof of face:

1. The face image is generated deterministically from the block header + nonce
2. A new NFT is automatically minted in the coinbase transaction
3. The NFT is assigned to the miner's address
4. The NFT's metadata records the mining context (block height, difficulty, score, etc.)

No additional action is required. Mining *is* minting.

## NFT Properties

Each Facecoin NFT contains:

```
FacecoinNFT {
    token_id:       uint64       // Sequential, equal to block height
    owner:          bytes20      // Initially the miner, transferable
    block_height:   uint64       // Block where this face was mined
    block_hash:     bytes32      // Hash of the block header
    face_score:     float64      // Detection confidence score
    face_bbox:      BoundingBox  // Face location in the image
    difficulty:     float64      // Difficulty at time of mining
    timestamp:      uint64       // When the block was mined
    nonce:          uint64       // The winning nonce
    image_seed:     bytes32      // Seed for deterministic image regeneration
}
```

### Token ID

Each NFT's token ID equals its block height. Block 1 produces NFT #1, block 2 produces NFT #2, and so on. This creates a natural ordering and makes the NFT collection a direct mirror of the blockchain itself.

### Image Regeneration

The face image is not stored in the NFT metadata -- it is regenerated on demand from the `image_seed` (which is the SHA-256 of `block_header + nonce`). Any node or viewer can reconstruct the exact image. This keeps the NFT data minimal while preserving the full visual artifact.

For display purposes (wallets, marketplaces, bridges), the image can be rendered as:
- **Raw greyscale**: The actual image the detector saw (128x128)
- **Upscaled greyscale**: Smoothed version at higher resolution
- **Colorized**: Aesthetic color mapping derived from the block hash or miner address (following Myers' Facecoins approach)

## NFT Operations

### Transfer

NFTs can be transferred between addresses via a standard transfer transaction:

```
Transaction {
    type:       NFT_TRANSFER
    token_id:   uint64
    from:       bytes20
    to:         bytes20
    signature:  bytes65
}
```

### On-Chain Metadata

All NFT metadata is stored on-chain and is fully deterministic. There are no external dependencies (no IPFS links, no centralized servers). The image itself is computable from the chain data.

## The Face Gallery

The complete set of Facecoin NFTs forms a chronological gallery of machine-perceived faces. This gallery has several interesting properties:

- **Difficulty-stratified quality**: NFTs mined at higher difficulty tend to have more visually striking faces, creating a natural quality gradient
- **Historically ordered**: NFT #N was always mined before NFT #N+1
- **Provably unique**: Each image comes from a unique block header + nonce combination; the SHA-256 pre-image resistance makes duplicates virtually impossible
- **Collectively exhaustive**: Every block that was ever mined produced exactly one NFT; there are no gaps

## Rarity and Value

While all Facecoin NFTs are structurally identical, several factors create natural variation in perceived value:

- **Face score**: Higher scores indicate more "convincing" faces
- **Difficulty at time of mining**: Higher difficulty means more computational work was required
- **Visual quality**: Some faces will be more aesthetically interesting than others (subjective, but CLIP scoring could quantify this)
- **Block height**: Early blocks may have collector value (low token IDs)
- **Historical significance**: Blocks at difficulty transitions, halving events, or other milestones

## Bridged NFT Representation

When bridged to Ethereum or Solana (see [Bridging](./bridging)), the NFT metadata is mapped to the target chain's standard:

**ERC-721 (Ethereum):**
```json
{
  "name": "Facecoin #1234",
  "description": "Face mined at block 1234, difficulty 0.42, score 0.87",
  "image": "data:image/png;base64,...",
  "attributes": [
    { "trait_type": "Face Score", "value": 0.87 },
    { "trait_type": "Difficulty", "value": 0.42 },
    { "trait_type": "Block Height", "value": 1234 },
    { "trait_type": "Timestamp", "value": 1709750400 }
  ]
}
```

The image is included as a base64 data URI (the 128x128 greyscale image is only ~16KB as PNG, well within on-chain limits). For the colorized version, the rendering is done at bridge time.
