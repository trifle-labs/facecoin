---
sidebar_position: 7
title: Difficulty Adjustment
---

# Difficulty Adjustment

Facecoin's difficulty adjustment ensures that face proofs are submitted at a consistent target rate regardless of changes in mining activity. The mechanism adapts the face detection confidence threshold up or down based on how frequently valid proofs arrive.

## Target Proof Rate

The protocol targets one valid proof of face every **60 seconds** on average. This target balances a responsive mining experience with sustainable emission.

## Difficulty Parameter

Difficulty is expressed as a **minimum face score threshold** -- miners must find images with face scores at or above this value.

```
difficulty_threshold: float in range [0.01, 0.99]
```

- **Lower threshold** = easier (more random images will pass)
- **Higher threshold** = harder (the detector must be more "confident" of a face)

## Adjustment Algorithm

Difficulty is recalculated every **60 accepted proofs** (targeting ~1 hour of real time). The adjustment compares the actual time elapsed to the expected time.

```
expected_time = 60 proofs * 60 seconds = 3,600 seconds
actual_time = timestamp(proof_N) - timestamp(proof_N-60)

ratio = expected_time / actual_time

// Clamp the adjustment to prevent extreme swings
ratio = clamp(ratio, 0.25, 4.0)

new_threshold = old_threshold * ratio

// Enforce bounds
new_threshold = clamp(new_threshold, MIN_THRESHOLD, MAX_THRESHOLD)
```

Where:
- **`MIN_THRESHOLD = 0.01`**: The absolute minimum difficulty (nearly any detection passes)
- **`MAX_THRESHOLD = 0.99`**: The absolute maximum difficulty (only the most confident detections pass)
- **Adjustment clamp of [0.25, 4.0]**: Prevents difficulty from changing by more than 4x in a single adjustment period

## Behavior

### Proofs arriving too fast (ratio > 1.0)

If 60 proofs are accepted in less than 3,600 seconds, there is more mining activity than expected. The threshold increases, requiring more confident face detections. Valid proofs become harder to find.

### Proofs arriving too slow (ratio &lt; 1.0)

If 60 proofs take longer than 3,600 seconds, mining activity is lower than expected. The threshold decreases, accepting less confident face detections. Valid proofs become easier to find.

### Steady state

When proofs are arriving at approximately the target rate, the ratio is close to 1.0 and the threshold barely changes.

## Genesis Difficulty

The initial threshold is **0.10** (10% face confidence). This is intentionally low to allow the network to bootstrap. Early miners should find valid proofs relatively quickly, and the difficulty will adjust upward as more miners join.

## Relationship to Face Detection

The difficulty adjustment creates an interesting aesthetic property: as difficulty rises, the faces that pass the threshold become more "convincing" to the algorithm. At low difficulty, the chain accepts faint, ambiguous detections. At high difficulty, only clear, strong face patterns qualify. The chain's difficulty history traces an evolving standard of machine perception.

This has a direct consequence for the NFT gallery: faces mined at high difficulty tend to be more visually striking than those mined at low difficulty. The difficulty at time of mining becomes a quality signal for the resulting NFT.

## Comparison to Bitcoin

| Property | Bitcoin | Facecoin |
|----------|---------|----------|
| Difficulty parameter | Target hash value (leading zeros) | Minimum face score threshold |
| Direction | Lower target = harder | Higher threshold = harder |
| Target rate | 1 block / 10 minutes | 1 proof / 1 minute |
| Adjustment period | 2,016 blocks (~2 weeks) | 60 proofs (~1 hour) |
| Max adjustment per period | 4x | 4x |
| What makes it hard | Finding rare hash patterns | Finding convincing face patterns |
| Relationship to blocks | Difficulty *is* block production | Difficulty is independent of block production |

The key difference is the last row: in Bitcoin, difficulty governs block production itself. In Facecoin, block production is handled by the sequencer at a regular cadence, and difficulty only governs the application-layer mining game. This separation means the chain continues producing blocks normally even if no faces are being mined.
