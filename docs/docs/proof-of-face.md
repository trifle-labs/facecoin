---
sidebar_position: 6
title: Proof of Face
---

# Proof of Face

Proof of Face is Facecoin's consensus mechanism. It replaces Bitcoin's requirement that a hash have leading zeros with the requirement that a hash, when visualized as an image, contains a machine-detectable face above a confidence threshold.

## The Mining Loop

```
while true:
    candidate = block_header + nonce
    seed = SHA-256(candidate)
    image = generate_image(seed)       // 128x128 greyscale, upscaled + blurred
    score = detect_face(image)         // Haar Cascade confidence score

    if score >= difficulty_threshold:
        broadcast_block(candidate, nonce, score)
        break

    nonce += 1
```

This is structurally identical to Bitcoin mining, with one substitution: instead of checking `hash &lt; target`, we check `face_score >= threshold`.

## Face Score

The face detection score is a normalized value in the range [0.0, 1.0] representing the detector's confidence that a face is present in the image.

For the Haar Cascade detector, the raw output is a set of detection rectangles with associated neighbor counts. The Facecoin face score is computed as:

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

The exact scoring formula is a consensus parameter -- all nodes must compute identical scores.

## Verification

Verifying a proof of face is straightforward and fast:

1. Reconstruct the image from `block_header + nonce` (deterministic)
2. Run the face detector on the image
3. Compute the face score
4. Check that `score >= block.difficulty_threshold`
5. Verify the block header hash chains correctly to the previous block

**Verification is faster than mining** because:
- The miner had to try many nonces; the verifier only checks one
- Image generation and face detection for a single known-good input is a single pass
- No search is required

This asymmetry (hard to find, easy to check) is the same property that makes Bitcoin's PoW work, and it holds for Proof of Face.

## What Constitutes a "Face"?

Facecoin deliberately avoids philosophical questions about what a face "really" is. The protocol's answer is purely operational:

> **A face exists if and only if the specified detector, with the specified parameters, on the specified image, returns a score at or above the specified threshold.**

This is a feature, not a limitation. The faces Facecoin finds are machine pareidolia -- artifacts of how the Haar Cascade processes pixel patterns. Some will look strikingly face-like to humans. Others will be abstract patterns that only the algorithm "sees." Both are equally valid proofs of work.

## Security Properties

### Grinding resistance

An attacker cannot predict which nonces will produce face-like images without actually running the detector. The SHA-256 pre-image resistance ensures that the mapping from nonce to image is effectively random.

### Verification cost

Face detection on a single image takes under 1ms on modern hardware. This means nodes can validate blocks as fast as they can receive them, preventing a class of attacks where verification is the bottleneck.

### Score manipulation

The face score is deterministic -- it depends only on the image bytes and the detector parameters. There is no way to claim a higher score than the one the detector actually produces. Any node can independently verify the score.

### Difficulty binding

The difficulty threshold is recorded in the block header and validated against the chain's difficulty adjustment rules. A miner cannot submit a block at lower difficulty than the chain requires.
