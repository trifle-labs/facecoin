---
sidebar_position: 3
title: Prior Art
---

# Prior Art

## Rhea Myers' Facecoin (2014)

Facecoin was created by artist Rhea Myers in January 2014 as part of a broader project called "Coins." It is one of the earliest blockchain artworks, predating the NFT movement by several years.

### How It Worked

1. **Hash generation**: SHA-256 is computed from transaction data plus an incrementing nonce (identical to Bitcoin)
2. **Pixel mapping**: The 256-bit hash output is interpreted as an 8x8, 256-level greyscale pixel map (32 bytes = 64 nibbles, mapped to pixels)
3. **Upscaling and blur**: The tiny pixel map is enlarged and blurred to produce an image large enough for face detection
4. **Face detection**: CCV's JavaScript face detection library scans the image for faces
5. **Iteration**: If no face is found, the nonce increments and the process repeats (typically 1 to several hundred tries)
6. **Validation**: When a face is found, the nonce and face bounding rectangle coordinates are recorded as proof

The difficulty could be varied by altering the size and blur parameters, or by restricting which face bounding rectangles were acceptable.

### Technical Details

- Implemented in HTML5/JavaScript, running entirely in the browser
- Used CCV (C-based/Cached/Core Computer Vision) JavaScript port for face detection -- a Viola-Jones style cascade classifier
- Licensed under Creative Commons Attribution-ShareAlike 4.0
- Source code: [github.com/rheaplex/facecoin](https://github.com/rheaplex/facecoin)

### Artistic Significance

Myers framed the work as mapping two value-identity systems onto each other: cryptocurrency proof of work (computationally expensive, economically valuable) and artistic proof of work (aesthetically meaningful, culturally valuable). The project asks whether a machine searching for patterns in noise constitutes a form of aesthetic labor.

## Facecoin Cash (2020)

A "higher-resolution, lower pixel bit-depth advancement" on the original. Produced larger, more defined images with clearer face identification while maintaining the same block size.

## Facecoins (2023)

A tokenized NFT edition (ERC-721 on Ethereum). The genesis block and colors of proof-of-work bitmaps are derived from the owner's Ethereum wallet address, making each edition a "portrait of the owner's blockchain identity."

## Seeing Faces in Things (ECCV 2024)

A key academic work that directly informs Facecoin's design. Researchers at the University of Edinburgh created the first large-scale dataset of pareidolic face images and benchmarked state-of-the-art face detectors against them. Key findings:

- **Face detectors fail at pareidolia**: RetinaFace achieved only 2.8-7.9% average precision on pareidolic faces (compared to 90%+ on real faces)
- **Fine-tuning helps somewhat**: Training on animal faces roughly doubled pareidolic detection rates
- **CLIP retrieval works**: The researchers used CLIP to successfully find pareidolic images in the LAION-5B dataset, suggesting CLIP's semantic understanding extends to pareidolia
- **A significant perception gap exists**: Humans dramatically outperform machines at pareidolia, indicating that current face detectors are far from capturing the full scope of face-like perception

This research validates Facecoin's core mechanism: face detection on random images is genuinely difficult for algorithms, making it viable as proof of work.

## Other Relevant Projects

- **Bitcoin** (2009): Established the proof-of-work consensus model that Facecoin adapts
- **Primecoin** (2013): Used finding prime number chains as proof of work -- an early example of "useful" PoW
- **Proof of Useful Work** literature: Various proposals for making mining computationally meaningful (protein folding, etc.)
- **Generative NFT collections**: Projects like Autoglyphs and Art Blocks that produce art through on-chain computation, though not as part of consensus
