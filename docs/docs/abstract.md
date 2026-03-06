---
sidebar_position: 1
title: Abstract
slug: /abstract
---

# Facecoin: Proof of Face

**A Cryptocurrency Where Mining Means Finding Faces**

Facecoin is a sovereign rollup on Celestia where participants mine FACE tokens by finding inputs whose visual representations contain machine-detectable faces. Drawing on the phenomenon of pareidolia (seeing faces in random patterns), Facecoin transforms the computationally arbitrary work of mining into an act of machine perception.

Miners search locally for nonces that, when hashed and converted to a greyscale image, produce a face detection score above the current difficulty threshold. They submit their proof as a transaction to the chain. The application layer verifies the claim, awards FACE tokens, and mints the face image as an NFT. Block production itself is handled by a standard centralized sequencer -- Proof of Face lives entirely at the application layer, making the chain simple to deploy using off-the-shelf Celestia rollup frameworks like Rollkit or Sovereign SDK.

The difficulty adjusts dynamically: if valid proofs are submitted too quickly, the required confidence score increases; if too slowly, it decreases. The result is a blockchain whose application-layer mining produces a permanent gallery of machine-perceived faces -- each one an NFT belonging to the miner who discovered it.

Facecoin extends Rhea Myers' 2014 conceptual artwork *Facecoin* into a fully realized blockchain -- a sovereign rollup on Celestia with native currency, an NFT system for mined face images, and bridging capabilities to Ethereum and Solana ecosystems.

## Key Properties

- **Proof of Face mining**: Participants find images containing algorithmically detected faces and submit proofs as transactions
- **Dynamic difficulty**: Face detection confidence threshold adjusts based on submission rate
- **Fast verification**: On-chain face detection scoring is designed to be orders of magnitude faster than the search that produced it
- **Native NFTs**: Every valid proof of face mints an NFT of the face image, owned by the miner
- **Native currency**: FACE tokens are awarded for valid face submissions
- **Sovereign rollup on Celestia**: Standard sequencer handles block production; Celestia provides data availability. Proof of Face is purely application-layer logic.
- **Bridgeable**: Native tokens and NFTs can be bridged to Ethereum and Solana
- **Minimal custom infrastructure**: No custom consensus or sequencer -- uses Celestia rollup frameworks as-is
