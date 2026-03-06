---
sidebar_position: 5
title: Input to Image Conversion
---

# Input to Image Conversion

A core challenge in Facecoin is converting arbitrary input data (hashes, nonces) into images suitable for face detection. The conversion must be deterministic, fast, and produce images with enough visual complexity that face detection has a meaningful (but not trivial) chance of triggering.

## The Conversion Pipeline

```
block_header + nonce  -->  SHA-256  -->  bytes  -->  pixel grid  -->  upscale + blur  -->  face detection
```

The miner constructs a candidate block header (containing the previous block hash, transaction root, timestamp, and difficulty target), appends a nonce, hashes the result, and converts the hash bytes into an image.

## Greyscale vs. Color

### Greyscale (Recommended for Mining)

Each byte maps directly to a greyscale intensity value (0 = black, 255 = white).

**Advantages:**
- **1:1 mapping**: One byte = one pixel, maximizing spatial resolution from limited data
- **Face detection native format**: Most face detectors convert to greyscale internally (Haar Cascade, HOG, and many CNNs operate on luminance). Using greyscale avoids redundant conversion.
- **Faster processing**: Single channel vs. three channels means less data to process at every stage
- **Proven**: Rhea Myers' original Facecoin used greyscale successfully
- **Simpler**: No decisions about color space, palette mapping, or channel assignment

**Disadvantages:**
- Less visually striking for NFT display purposes
- Lower information density per pixel (no hue/saturation information)

### Color (RGB)

Three bytes map to one pixel (R, G, B channels).

**Advantages:**
- Richer visual output, more interesting NFT artwork
- Myers' 2023 *Facecoins* used color derived from wallet addresses to good effect
- Could encode more information in smaller spatial grids

**Disadvantages:**
- **1/3 the pixels**: 32 bytes = ~10 RGB pixels vs. 32 greyscale pixels. Far fewer spatial features for the detector to work with.
- **No detection benefit**: Face detectors don't use color information for detection. You're spending 3x the data per pixel for zero improvement in face-finding.
- **More complex mapping**: Must decide on color space, channel ordering, gamma

### Recommendation

**Use greyscale for mining and detection. Apply color as a post-processing aesthetic layer for NFT display.**

The mining image (what the detector sees) is always greyscale. The NFT representation can apply color mapping derived from the block hash, miner address, or other metadata -- purely for visual appeal. This gives the best of both worlds: maximum detection efficiency during mining, maximum visual interest for the output.

## Image Size

### The Hash Size Problem

A SHA-256 hash produces 32 bytes. That's only enough for:
- 32 greyscale pixels (e.g., 8x4 or roughly 6x5)
- ~10 RGB pixels (e.g., 4x3)

This is far too small for any face detector. Haar Cascade requires a minimum face size of about 24x24 pixels within the image, and works best with at least 64x64 input.

### Solution: Extended Input Generation

Rather than using only the 32-byte hash, Facecoin generates a larger byte sequence to fill a usable image grid:

**Method: Iterative hashing**

```
seed = SHA-256(block_header + nonce)
chunk_0 = seed
chunk_1 = SHA-256(seed + 0x01)
chunk_2 = SHA-256(seed + 0x02)
...
chunk_n = SHA-256(seed + n)
image_bytes = chunk_0 || chunk_1 || chunk_2 || ... || chunk_n
```

Each 32-byte chunk extends the pixel data. For a 64x64 greyscale image (4,096 pixels), we need 128 hash iterations. For 128x128 (16,384 pixels), we need 512 iterations.

This is intentionally cheap -- SHA-256 is extremely fast, and the iterative hashing is a negligible cost compared to face detection. The key property is that the output is **fully deterministic** from the original seed: anyone can recompute the same image from the block header + nonce.

### Recommended Image Sizes

| Size | Pixels | Hash Iterations | Detection Quality | Mining Speed Impact |
|------|--------|----------------|-------------------|-------------------|
| 32x32 | 1,024 | 32 | Minimal | Negligible |
| 64x64 | 4,096 | 128 | Usable | Negligible |
| **128x128** | **16,384** | **512** | **Good** | **Negligible** |
| 256x256 | 65,536 | 2,048 | Excellent | Minor |

**128x128 is the recommended default.** It provides enough spatial resolution for reliable face detection while keeping image generation costs negligible relative to the detection step.

### Upscaling and Blur

Following Myers' approach, the raw pixel grid can be upscaled with bilinear or bicubic interpolation and optionally blurred with a Gaussian kernel. This smooths the harsh pixel boundaries and creates gradients that face detectors interpret more readily.

```
raw 128x128 pixels  -->  upscale 2x to 256x256  -->  Gaussian blur (sigma=1.5)  -->  detect
```

The upscale factor and blur sigma are **consensus parameters** -- all nodes must use identical values to produce identical detection results. These parameters are fixed at launch and can only change via a coordinated protocol upgrade.

## Determinism Requirements

For consensus to work, every node must produce **exactly the same image** from the same input. This means:

1. **Identical hash function**: SHA-256 (universally standardized)
2. **Identical byte-to-pixel mapping**: Direct assignment, no floating point
3. **Identical upscaling**: Specified interpolation algorithm with integer-only or IEEE 754 compliance
4. **Identical blur**: Fixed-precision Gaussian kernel with specified radius and sigma
5. **Identical detector**: Same cascade file, same parameters, same traversal order

The protocol specifies all parameters exactly, and reference implementations must pass a determinism test suite ensuring byte-identical image generation across platforms.
