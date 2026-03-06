---
sidebar_position: 6
title: Proof of Face
---

# Proof of Face

Proof of Face is Facecoin's application-layer mining mechanism. Unlike Bitcoin where proof of work is the consensus mechanism that produces blocks, Facecoin separates the two concerns: block production is handled by a standard sequencer, and Proof of Face is a transaction type that miners submit to earn rewards.

## How It Works

1. A miner searches locally for a nonce that produces a face
2. When found, the miner submits a **proof of face transaction** to the chain
3. The chain's application logic verifies the proof deterministically
4. If valid, the miner receives FACE tokens and an NFT of the face image

This is conceptually similar to how mining games or proof-of-work tokens work on Ethereum (e.g., 0xBitcoin) -- the "mining" is a search performed off-chain, and the result is submitted as a transaction for on-chain verification.

## The Mining Loop (Off-Chain)

```
challenge = current_challenge()  // from chain state

while true:
    nonce = random_uint64()
    seed = SHA-256(challenge + miner_address + nonce)
    image = generate_image(seed)       // 128x128 greyscale, upscaled + blurred
    score = detect_face(image)         // Haar Cascade confidence score

    if score >= difficulty_threshold:
        submit_proof(nonce, score)
        break
```

The **challenge** is derived from recent chain state (e.g., the hash of the most recent proof of face, or a block hash). This prevents miners from pre-computing proofs and ensures work is fresh.

The **miner address** is included in the seed so that a valid proof is bound to a specific miner -- you can't steal someone else's proof.

## Proof of Face Transaction

```
ProofOfFaceTransaction {
    miner:       address      // Miner's address (part of the image seed)
    challenge:   bytes32      // The chain challenge being solved
    nonce:       uint64       // The winning nonce
    face_score:  float64      // Claimed face detection score
    face_bbox:   BoundingBox  // Claimed face bounding box (x, y, w, h)
    signature:   bytes65      // Miner's signature
}
```

The transaction is small -- just the proof, not the image. The image is deterministically regenerable from `challenge + miner + nonce`.

## On-Chain Verification

When the chain processes a proof of face transaction, it runs:

```
fn verify_proof_of_face(tx: ProofOfFaceTx) -> Result {
    // 1. Check the challenge is current
    assert(tx.challenge == current_challenge());

    // 2. Regenerate the image deterministically
    seed = SHA-256(tx.challenge + tx.miner + tx.nonce);
    image = generate_image(seed, 128, 128);

    // 3. Run face detection
    detection = haar_detect(image);

    // 4. Verify claimed results match
    assert(detection.score == tx.face_score);
    assert(detection.bbox == tx.face_bbox);

    // 5. Check difficulty threshold
    assert(detection.score >= current_difficulty());

    // 6. Award the miner
    mint_face_tokens(tx.miner, current_reward());
    mint_face_nft(tx.miner, seed, detection);

    // 7. Update challenge for next proof
    update_challenge(tx);
}
```

**Verification is fast** -- regenerating a 128x128 image and running Haar Cascade detection takes under 1ms on modern hardware. The chain only verifies one known-good proof per transaction, while the miner had to search through potentially millions of candidates.

## Face Score

The face detection score is a normalized value in the range [0.0, 1.0] representing the detector's confidence that a face is present.

For the Haar Cascade detector, the score is computed as:

```
detections = haar_detect(image, scale_factor=1.1, min_neighbors=0, min_size=24x24)

if no detections:
    score = 0.0
else:
    best = detection with highest neighbor count
    raw_score = best.neighbors / MAX_NEIGHBORS
    size_bonus = (best.width * best.height) / (image.width * image.height)
    score = 0.7 * raw_score + 0.3 * size_bonus
```

Where:
- **`neighbors`**: Number of overlapping detections at the same location/scale (higher = more confident)
- **`MAX_NEIGHBORS`**: Protocol constant (e.g., 30) used for normalization
- **`size_bonus`**: Larger detected faces score higher, rewarding more prominent pareidolic patterns

The scoring formula is a chain parameter -- all nodes compute identical scores.

## Challenge Mechanism

The challenge rotates each time a valid proof is accepted. This creates a sequential dependency: each proof builds on the last, preventing miners from stockpiling proofs.

```
new_challenge = SHA-256(previous_challenge + accepted_nonce + block_height)
```

If no proof is submitted for a configurable number of blocks (e.g., 100), the challenge can also rotate based on the latest block hash, ensuring the system doesn't stall if mining activity drops temporarily.

## What Constitutes a "Face"?

Facecoin deliberately avoids philosophical questions about what a face "really" is. The protocol's answer is purely operational:

> **A face exists if and only if the specified detector, with the specified parameters, on the specified image, returns a score at or above the specified threshold.**

The faces Facecoin finds are machine pareidolia -- artifacts of how the Haar Cascade processes pixel patterns. Some will look strikingly face-like to humans. Others will be abstract patterns that only the algorithm "sees." Both are equally valid proofs of face.

## Security Properties

### Grinding resistance

The SHA-256 pre-image resistance ensures that the mapping from nonce to image is effectively random. Miners cannot predict which nonces will produce faces without running the detector.

### Proof binding

Including the miner's address in the image seed binds each proof to a specific miner. A valid proof cannot be front-run or stolen by another address.

### Verification cost

On-chain verification (image generation + face detection) takes under 1ms for a single proof. This is negligible relative to block processing time, ensuring proof validation is never a bottleneck.

### Score manipulation

The face score is deterministic -- it depends only on the seed bytes and the detector parameters. There is no way to claim a higher score than what the detector actually produces. Any node can independently verify.

### Difficulty binding

The difficulty threshold is stored in chain state and validated by the application logic. A miner cannot submit a proof at lower difficulty than the chain currently requires.
