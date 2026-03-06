---
sidebar_position: 7
title: Difficulty Adjustment
---

# Difficulty Adjustment

Facecoin's difficulty adjustment mechanism ensures that blocks are produced at a consistent target rate regardless of changes in network hashrate. The mechanism is directly analogous to Bitcoin's, adapted for the face detection scoring system.

## Target Block Time

The protocol targets one block every **60 seconds** (1 minute). This is faster than Bitcoin's 10 minutes, reflecting Facecoin's lighter-weight blocks and the desire for reasonable transaction confirmation times.

## Difficulty Parameter

In Bitcoin, difficulty is expressed as a target hash value -- miners must find hashes below the target. In Facecoin, difficulty is expressed as a **minimum face score threshold** -- miners must find images with face scores at or above the threshold.

```
difficulty_threshold: float in range [0.01, 0.99]
```

- **Lower threshold** = easier (more random images will pass)
- **Higher threshold** = harder (the detector must be more "confident" of a face)

## Adjustment Algorithm

Difficulty is recalculated every **60 blocks** (targeting ~1 hour of real time). The adjustment looks at the actual time taken to mine the last 60 blocks compared to the expected time.

```
expected_time = 60 blocks * 60 seconds = 3,600 seconds
actual_time = timestamp(block_N) - timestamp(block_N-60)

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

### Blocks coming too fast (ratio > 1.0)

If 60 blocks are mined in less than 3,600 seconds, the network has more hashrate than expected. The threshold increases, requiring more confident face detections. This makes valid blocks harder to find.

### Blocks coming too slow (ratio &lt; 1.0)

If 60 blocks take longer than 3,600 seconds, the network has less hashrate than expected. The threshold decreases, accepting less confident face detections. This makes valid blocks easier to find.

### Steady state

When blocks are arriving at approximately the target rate, the ratio is close to 1.0 and the threshold barely changes.

## Genesis Difficulty

The genesis block uses an initial threshold of **0.10** (10% face confidence). This is intentionally low to allow the network to bootstrap. Early miners should find blocks relatively quickly, and the difficulty will adjust upward as hashrate joins the network.

## Relationship to Face Detection

The difficulty adjustment creates an interesting property: as difficulty rises, the faces that pass the threshold become more "convincing" to the algorithm. At low difficulty, the chain accepts faint, ambiguous detections. At high difficulty, only clear, strong face patterns qualify. The chain's difficulty history thus traces an evolving standard of machine perception.

This has a direct aesthetic consequence for the NFT gallery: blocks mined at high difficulty tend to contain more visually striking face images than those mined at low difficulty. The difficulty at time of mining becomes a quality signal for the resulting NFT.

## Comparison to Bitcoin

| Property | Bitcoin | Facecoin |
|----------|---------|----------|
| Difficulty parameter | Target hash value (leading zeros) | Minimum face score threshold |
| Direction | Lower target = harder | Higher threshold = harder |
| Target block time | 10 minutes | 1 minute |
| Adjustment period | 2,016 blocks (~2 weeks) | 60 blocks (~1 hour) |
| Max adjustment per period | 4x | 4x |
| What makes blocks hard | Finding rare hash patterns | Finding convincing face patterns |

The faster adjustment period (1 hour vs. 2 weeks) is appropriate for a newer, smaller network where hashrate may be more volatile. As the network matures, the adjustment period could be extended via protocol upgrade.
