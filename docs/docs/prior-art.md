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

## Clovers Network (2019)

Clovers Network was an Ethereum dApp that pioneered **proof of search** -- a proof-of-work variant where computational effort produces aesthetic artifacts rather than meaningless hashes. Created by Billy Rennekamp (an artist, developer, and competitive Othello player), it launched on Ethereum mainnet in August 2019 during Berlin Blockchain Week.

### How It Worked

Participants "mined" Clovers by running simulations of complete, valid games of Reversi (Othello) and searching the game's ~10^28 possible states for end-board configurations with visual symmetry. The process:

1. A miner runs random complete Reversi games locally
2. The final board state (an 8x8 grid of black and white pieces) is evaluated for six types of visual symmetry
3. If a symmetrical pattern is found, the miner submits the game's moves (in chess notation) to an Ethereum smart contract
4. The contract replays and verifies the game is valid, then mints the Clover as an NFT
5. The miner receives Clover Coin tokens as a reward, with rarer symmetry types earning more

### Significance for Facecoin

Clovers is a direct conceptual ancestor of Facecoin in several ways:

- **Meaningful proof of work**: Like Facecoin, it replaced arbitrary hash puzzles with a search through a combinatorial space for aesthetically interesting outputs
- **Mining produces art**: Every successful "mine" created a unique visual artifact (the board pattern), just as every Facecoin block produces a face image
- **Fully on-chain**: The game moves and board states were stored entirely on-chain, with the visual representation derivable from the data -- the same approach Facecoin takes with deterministically regenerable face images
- **Economic incentives for collective exploration**: Clovers created a crypto-economic game where participants were incentivized to collectively explore a vast latent space of possible patterns, surfacing the most interesting ones. Facecoin does the same with the space of possible face-like images.
- **Bonding curve tokenomics**: Used a Bancor-formula bonding curve for its native token, creating a self-sustaining loop between discovery, minting, and trading

Clovers demonstrated that proof-of-search -- computational work directed toward aesthetic discovery rather than arbitrary difficulty -- could function as the basis of a viable crypto-economic system. Facecoin extends this principle from board game symmetry to machine pareidolia.

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
