---
sidebar_position: 2
title: Introduction
---

# Introduction

## The Problem with Proof of Work

Bitcoin's proof of work requires miners to find hash values with a certain number of leading zeros. This work is computationally expensive but semantically empty -- the output has no meaning beyond proving that energy was spent. The hashes are discarded once validated. Trillions of SHA-256 computations produce nothing of lasting interest.

What if proof of work could produce something?

## Pareidolia as Computation

**Pareidolia** is the human tendency to perceive faces in random or ambiguous visual stimuli -- faces in clouds, in electrical outlets, in the grain of wood. It is one of the most fundamental perceptual biases in human cognition, wired deep into the fusiform face area of the brain.

Face detection algorithms exhibit their own form of machine pareidolia. When presented with random pixel patterns, they occasionally "detect" faces where none were intended. This is typically considered a failure mode -- a false positive. Facecoin treats it as the entire point.

## From Art to Protocol

In 2014, artist Rhea Myers created *Facecoin*, a conceptual artwork that demonstrated this idea as a browser-based toy blockchain. Myers' work posed a provocative question: if proof of work is about expending computational effort to produce something valuable, what if that "something" were aesthetically meaningful rather than mathematically arbitrary?

Myers described the core insight:

> *"Cryptocurrencies such as Bitcoin use a proof of work system to prevent abuse. Artworks are proofs of aesthetic work."*

The original Facecoin converted SHA-256 hashes into 8x8 greyscale pixel grids, upscaled and blurred them, and ran face detection using CCV's JavaScript library. It was a proof of concept -- a complete toy blockchain running in the browser, but not a deployable network.

Facecoin (this project) takes Myers' concept to its logical conclusion: a sovereign rollup on Celestia where application-layer mining produces a permanent, on-chain gallery of machine-perceived faces. The chain has real economic mechanics, dynamic difficulty adjustment, native NFTs, and bridging to major ecosystems.

## Design Goals

1. **Meaningful work**: Mining produces artifacts (face images) rather than disposable hashes
2. **Fast verification**: Validating a proof of face should be much cheaper than finding one
3. **Tunable difficulty**: The system must adapt to changes in mining activity
4. **Aesthetic output**: The face images are preserved as NFTs, creating a generative art collection as a byproduct of mining
5. **Simple deployment**: By keeping Proof of Face at the application layer and using a standard rollup framework, the chain requires no custom consensus or sequencer engineering
