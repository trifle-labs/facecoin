---
sidebar_position: 12
title: Bridging
---

# Bridging

As a sovereign rollup on Celestia, Facecoin benefits from the Celestia ecosystem's growing bridging infrastructure. FACE tokens and face NFTs gain significant utility when accessible on major ecosystems.

## Why Bridge?

- **Liquidity**: FACE tokens can be traded on established DEXes (Uniswap, Raydium)
- **NFT marketplaces**: Face NFTs can be listed on OpenSea, Magic Eden, etc.
- **DeFi composability**: FACE tokens can participate in lending, staking, and other DeFi protocols
- **Wider wallet support**: MetaMask, Phantom, and other popular wallets can hold bridged assets

## Bridging Options for a Celestia Sovereign Rollup

### Lazybridging (Native Celestia Bridging)

Celestia's **Lazybridging** initiative adds ZK proof verification natively to the Celestia base layer, enabling sovereign rollups to bridge assets directly via Celestia using a ZK-based IBC client.

**How it works:**
1. Facecoin generates ZK proofs of its state transitions (enabled by Sovereign SDK)
2. These proofs are verified on the Celestia base layer
3. Assets can be bridged to any IBC-compatible chain via Celestia's native IBC connections
4. Single-slot finality makes deposits and withdrawals feel near-instant

**Status**: In development. This is the long-term preferred bridging path.

### Axelar Integration

Axelar's Interchain Amplifier provides cross-chain messaging for Celestia rollups to Ethereum, Cosmos chains, and other ecosystems. This is the most practical bridge option available today.

### Lock-and-Mint (Custom Bridge)

As a fallback, Facecoin can use a traditional **lock-and-mint** bridge:

#### Facecoin to Ethereum/Solana

1. User locks FACE tokens or NFT in a bridge module on the Facecoin chain
2. Bridge validators observe the lock event and reach consensus
3. Wrapped tokens (wFACE) or wrapped NFTs are minted on the destination chain
4. User receives the wrapped assets in their destination wallet

#### Ethereum/Solana to Facecoin

1. User burns wrapped tokens/NFTs on the destination chain
2. Bridge validators observe the burn event
3. The original tokens/NFTs are unlocked on Facecoin
4. User receives the native assets in their Facecoin wallet

## Bridge Target Comparison

### Ethereum

| Factor | Assessment |
|--------|-----------|
| **NFT ecosystem** | Largest and most established. OpenSea, Blur, Rarefied. |
| **Token standard** | ERC-20 (fungible), ERC-721 (NFT) -- mature and universal |
| **DeFi ecosystem** | Deepest liquidity, most protocols |
| **Gas costs** | High ($5-50+ per transaction). L2s (Arbitrum, Base, Optimism) reduce this. |
| **Bridge tooling** | Most bridges support Ethereum as a target |
| **Developer tools** | Most mature (Hardhat, Foundry, ethers.js) |
| **Wallet support** | MetaMask, Rainbow, Coinbase Wallet, etc. |

### Solana

| Factor | Assessment |
|--------|-----------|
| **NFT ecosystem** | Growing. Magic Eden, Tensor. Strong for PFP/generative art. |
| **Token standard** | SPL tokens (fungible), Metaplex (NFT) |
| **DeFi ecosystem** | Growing rapidly. Raydium, Jupiter, Marinade. |
| **Gas costs** | Very low (under $0.01 per transaction) |
| **Bridge tooling** | Fewer options than Ethereum, but Wormhole supports it |
| **Developer tools** | Good but less mature (Anchor, solana-web3.js) |
| **Wallet support** | Phantom, Solflare, Backpack |

### Recommendation: Bridge to Both, Ethereum First

Ethereum is the priority target due to its larger NFT ecosystem and deeper liquidity. Solana is a secondary target, particularly attractive for its low fees (important for NFT trading where users may transfer frequently).

## Bridge Validator Set

The bridge is operated by a set of **bridge validators** -- nodes that run both a Facecoin full node and a connection to the target chain. The validator set is initially permissioned (operated by known, trusted parties) and can transition to a more decentralized model over time.

### Validator Requirements

- Run a Facecoin full node (to observe lock/unlock events)
- Run an Ethereum and/or Solana node (to submit mint/burn transactions)
- Stake collateral (FACE tokens) as a security bond
- Participate in threshold signing for bridge transactions

### Security Model

The bridge uses **multi-signature consensus**: a bridge transaction requires signatures from a threshold (e.g., 5 of 7) of bridge validators. This prevents any single validator from unilaterally minting wrapped assets.

The security of the bridge is bounded by the honesty of the validator set. For a new chain, this is an acceptable tradeoff -- the bridge can become more decentralized as the network matures.

## Cross-Chain Bridge Protocols

### Wormhole

- Supports 30+ chains including Ethereum and Solana
- Guardian network of 19 validators
- Supports both token and NFT bridging
- Adding a custom chain requires significant integration effort
- Most viable option for bridging to both Ethereum and Solana simultaneously

### LayerZero

- Omnichain messaging protocol
- More flexible for custom integrations
- Supports cross-chain NFT transfers (ONFT standard)
- Ethereum-focused but expanding

### Custom Bridge

- Simplest to implement for a novel chain
- Full control over validator set and security model
- No dependency on external protocols
- Must build: event monitoring, validator consensus, relay infrastructure

### Recommendation: Custom Bridge Initially, Wormhole Integration Later

For launch, a custom bridge is the pragmatic choice:
- No dependency on external protocol governance
- Simpler integration with Facecoin's custom consensus
- Faster path to deployment

As the network grows, integrating with Wormhole provides access to 30+ chains through a single integration. This can be pursued as a later milestone.

## Bridged Token Details

### wFACE (ERC-20 on Ethereum)

```solidity
// Wrapped FACE token on Ethereum
contract WrappedFACE is ERC20, Ownable {
    // Bridge validators can mint/burn
    function mint(address to, uint256 amount) external onlyBridge;
    function burn(address from, uint256 amount) external onlyBridge;
}
```

### Bridged Face NFTs (ERC-721 on Ethereum)

```solidity
contract FacecoinNFT is ERC721, ERC721URIStorage {
    struct FaceMetadata {
        uint256 blockHeight;
        uint256 faceScore;    // scaled to uint256
        uint256 difficulty;   // scaled to uint256
        uint256 timestamp;
        bytes32 imageSeed;    // for image regeneration
    }

    mapping(uint256 => FaceMetadata) public faceData;
}
```

The NFT contract stores the mining metadata on-chain and renders the face image either as an on-chain SVG/base64 PNG or via an IPFS reference for the colorized version.
