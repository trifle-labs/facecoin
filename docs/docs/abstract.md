---
sidebar_position: 1
title: Abstract
slug: /abstract
---

# Facecoin: Proof of Face

**A Cryptocurrency Where Mining Means Finding Faces**

Facecoin is a cryptocurrency that replaces traditional hash-based proof of work with **proof of face** -- a consensus mechanism that requires miners to find inputs whose visual representations contain machine-detectable faces. Drawing on the phenomenon of pareidolia (seeing faces in random patterns), Facecoin transforms the computationally arbitrary work of mining into an act of machine perception.

Miners hash candidate data, convert the output to a greyscale image, and submit it to a face detection algorithm. If the detector finds a face above the current confidence threshold, the block is valid. The difficulty adjusts dynamically: if blocks are found too quickly, the required confidence score increases; if too slowly, it decreases. The result is a blockchain whose proof of work produces a permanent gallery of machine-perceived faces -- each one minted as an NFT belonging to the miner who discovered it.

Facecoin extends Rhea Myers' 2014 conceptual artwork *Facecoin* into a fully realized blockchain -- a sovereign rollup on Celestia with native currency, an NFT system for mined face images, and bridging capabilities to Ethereum and Solana ecosystems.

## Key Properties

- **Proof of Face consensus**: Mining produces images containing algorithmically detected faces
- **Dynamic difficulty**: Face detection confidence threshold adjusts based on block timing, analogous to Bitcoin's difficulty adjustment
- **Fast verification**: Face detection scoring is designed to be orders of magnitude faster than generation, keeping validation cheap
- **Native NFTs**: Every successfully mined block produces an NFT of the face image, owned by the miner
- **Native currency**: FACE tokens are awarded to miners as block rewards
- **Longest chain rule**: The canonical chain is the one with the most cumulative proof-of-face work
- **Bridgeable**: Native tokens and NFTs can be bridged to Ethereum and Solana
- **Sovereign rollup on Celestia**: Proof of Face handles block production; Celestia provides data availability with cryptographic guarantees
