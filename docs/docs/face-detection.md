---
sidebar_position: 4
title: Face Detection Methods
---

# Face Detection Methods

The choice of face detection algorithm is the most critical design decision in Facecoin. The detector must be:

1. **Fast** -- miners will run it millions of times; validators must check proofs quickly
2. **Deterministic** -- the same input must always produce the same result across all nodes
3. **Scored** -- it must return a confidence value, not just a binary yes/no
4. **Pareidolia-sensitive** -- it should occasionally detect faces in random noise

## Method Comparison

### Haar Cascade Classifiers (OpenCV)

The original approach used in face detection since 2001 (Viola-Jones algorithm).

**How it works**: Hand-crafted Haar-like features (edge, line, center-surround patterns) evaluated via an integral image. A cascade of increasingly complex classifiers quickly rejects non-face regions.

| Property | Value |
|----------|-------|
| **Speed** | ~25 images/sec CPU (very fast) |
| **Accuracy on real faces** | ~92.5% frontal |
| **Pareidolia sensitivity** | Moderate -- coarse features trigger on noise |
| **Confidence scores** | Limited (neighbor count, not true probability) |
| **Determinism** | Fully deterministic |
| **Dependencies** | OpenCV (C++/Python bindings widely available) |

**Pros**: Extremely fast, minimal compute, no GPU required, well-understood behavior. Its simplicity means it occasionally "sees" faces in random patterns -- exactly what we want.

**Cons**: Weakest accuracy, poor on rotated/non-frontal faces, limited confidence scoring.

### HOG + SVM (dlib)

Histogram of Oriented Gradients features classified by a linear Support Vector Machine.

| Property | Value |
|----------|-------|
| **Speed** | 5-15 FPS CPU |
| **Accuracy on real faces** | Better than Haar, worse than deep learning |
| **Pareidolia sensitivity** | Low-moderate |
| **Confidence scores** | Yes (SVM decision function) |
| **Determinism** | Fully deterministic |
| **Dependencies** | dlib (C++/Python) |

**Pros**: Returns real confidence scores, more robust than Haar.

**Cons**: Not fast enough for high-throughput mining, too discriminating for pareidolia (fewer false positives).

### MTCNN (Multi-task Cascaded Convolutional Networks)

Three-stage CNN cascade: P-Net (proposal), R-Net (refinement), O-Net (output).

| Property | Value |
|----------|-------|
| **Speed** | ~3 images/sec CPU, 15-30 FPS GPU |
| **Accuracy on real faces** | Excellent (99.9% with masks) |
| **Pareidolia sensitivity** | Low |
| **Confidence scores** | Yes (probability per detection) |
| **Determinism** | Deterministic given fixed weights and hardware |
| **Dependencies** | TensorFlow/PyTorch |

**Pros**: High quality detections with probability scores.

**Cons**: Too slow for mining, too accurate (rarely triggers on noise).

### RetinaFace

Single-stage dense face detector using Feature Pyramid Network.

| Property | Value |
|----------|-------|
| **Speed** | Moderate (MobileNet) to slow (ResNet50) |
| **Accuracy on real faces** | Best overall (~93% F1) |
| **Pareidolia sensitivity** | Very poor (2.8-7.9% AP on pareidolic faces) |
| **Confidence scores** | Yes |
| **Determinism** | Deterministic given fixed weights |
| **Dependencies** | PyTorch/TensorFlow |

**Pros**: Industry-leading accuracy on real faces.

**Cons**: Terrible at pareidolia (ECCV 2024 study found under 8% AP). Too slow and too accurate for Facecoin's purposes.

### CLIP (OpenAI)

Multi-modal vision-language model encoding images and text into a shared embedding space.

| Property | Value |
|----------|-------|
| **Speed** | Slow (designed for classification, not detection) |
| **Accuracy on real faces** | N/A (not a face detector) |
| **Pareidolia sensitivity** | High (semantic understanding of "face-likeness") |
| **Confidence scores** | Yes (cosine similarity) |
| **Determinism** | Deterministic given fixed weights |
| **Dependencies** | PyTorch, large model weights |

**Pros**: Best semantic understanding of pareidolia. Can score "how face-like does this look?" in ways traditional detectors cannot. The ECCV 2024 researchers used CLIP to successfully curate pareidolia datasets from LAION-5B.

**Cons**: Far too computationally expensive for mining. Requires large model weights (~400MB-1.7GB). Better suited as a secondary aesthetic scorer than as the primary PoW mechanism.

### MediaPipe Face Detection (Google BlazeFace)

Lightweight SSD-based model optimized for mobile and edge deployment.

| Property | Value |
|----------|-------|
| **Speed** | 180-200 FPS (0.55-0.78ms per image) |
| **Accuracy on real faces** | 99.6% on LFW |
| **Pareidolia sensitivity** | Moderate |
| **Confidence scores** | Yes (detection confidence) |
| **Determinism** | Deterministic given fixed runtime |
| **Dependencies** | MediaPipe (C++/Python/JS/mobile) |

**Pros**: Extremely fast -- can process hundreds of candidate images per second. Returns confidence scores. Lightweight model suitable for deployment on consumer hardware.

**Cons**: Designed for real faces, not pareidolia. Mobile-optimized architecture may limit customization.

### YOLO Face Detection

Single-shot detector processing the entire image in one pass. Modern versions use CSPDarknet backbone.

| Property | Value |
|----------|-------|
| **Speed** | ~135 FPS GPU, 50+ FPS CPU |
| **Accuracy on real faces** | 98%+ mAP |
| **Pareidolia sensitivity** | Low-moderate |
| **Confidence scores** | Yes |
| **Determinism** | Deterministic given fixed weights |
| **Dependencies** | Ultralytics/PyTorch |

**Pros**: Fast, accurate, well-supported ecosystem, returns confidence scores.

**Cons**: Heavier than MediaPipe, requires more setup for deterministic behavior.

## Summary Comparison

| Method | Speed | Pareidolia | Scores | Mining Fit |
|--------|-------|------------|--------|------------|
| Haar Cascade | Very Fast | Moderate | Limited | Good |
| HOG+SVM | Moderate | Low | Yes | Fair |
| MTCNN | Slow | Low | Yes | Poor |
| RetinaFace | Slow | Very Low | Yes | Poor |
| CLIP | Very Slow | High | Yes | Poor |
| **MediaPipe** | **Fastest** | **Moderate** | **Yes** | **Excellent** |
| YOLO | Fast | Low-Mod | Yes | Good |

## Recommended Approach: Tiered Detection

Facecoin uses a **tiered detection strategy**:

### Primary detector (mining and validation): Haar Cascade

The Haar Cascade classifier is the recommended primary detector for several reasons:

1. **Speed**: Among the fastest options, critical for mining throughput
2. **Pareidolia-friendly**: Its reliance on coarse features makes it more prone to detecting face-like patterns in noise than more sophisticated detectors
3. **Deterministic**: Identical results across platforms with the same cascade file
4. **Battle-tested**: Decades of use in OpenCV, behavior is well understood
5. **Minimal dependencies**: Part of OpenCV, no GPU or ML framework required
6. **Precedent**: Aligns with Rhea Myers' original approach (CCV uses the same Viola-Jones algorithm family)

The confidence score for Haar is derived from the cascade stage reached and the number of overlapping detections (neighbor count) at a given scale. For Facecoin, we define a normalized face score based on these parameters.

### Secondary scorer (optional, for NFT quality): CLIP

For mining nodes that wish to assess the aesthetic quality of their mined faces (not required for consensus), CLIP can provide a semantic "face-likeness" score. This does not affect block validity but could be used for:

- Ranking NFTs by visual quality
- Community curation
- Future protocol upgrades that incorporate aesthetic scoring

### Why Not Deep Learning for Primary Detection?

The ECCV 2024 "Seeing Faces in Things" study is decisive here. Modern deep learning detectors (RetinaFace, MTCNN) achieve under 8% average precision on pareidolic faces. They are *too good* at distinguishing real faces from face-like patterns. For Facecoin's purposes, we *want* an algorithm that can be fooled -- one that occasionally hallucinates faces in random pixel grids. Classical cascade classifiers are the right tool for this job.
