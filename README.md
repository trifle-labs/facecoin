# Facecoin

**Proof of Face: A Cryptocurrency Powered by Machine Pareidolia**

Facecoin is a sovereign rollup on Celestia where participants mine FACE tokens by finding inputs whose visual representations contain machine-detectable faces. Miners search locally for nonces that produce face-like images, then submit proofs as transactions. The chain verifies the claim, awards FACE tokens, and mints the face image as an NFT.

Block production is handled by a standard sequencer -- Proof of Face lives entirely at the application layer, making the chain deployable with off-the-shelf Celestia rollup frameworks.

This project extends [Rhea Myers' 2014 conceptual artwork *Facecoin*](https://rhea.art/facecoin/) and draws on [Clovers Network](https://github.com/clovers-network/clovers-dapp)'s proof-of-search model.

## Documentation

Read the full whitepaper at **[trifle-labs.github.io/facecoin](https://trifle-labs.github.io/facecoin/)**

## Key Features

- **Proof of Face mining** -- find machine-perceived faces in hash-derived images, submit proofs as transactions
- **Dynamic difficulty** -- face detection confidence threshold adjusts with mining activity
- **Native NFTs** -- every valid proof mints a face image NFT for the miner
- **FACE token** -- native currency with halving emission schedule
- **Sovereign rollup on Celestia** -- standard sequencer for blocks, Celestia for data availability
- **Minimal custom code** -- only the face detection module is custom; everything else is off-the-shelf Rollkit + Cosmos SDK
- **Bridgeable** -- tokens and NFTs can bridge to Ethereum and Solana

## Project Structure

```
facecoin/
  docs/          # Docusaurus whitepaper site
  .github/       # GitHub Actions for docs deployment
```

## Development

### Docs

```bash
cd docs
npm install
npm start        # Local dev server at localhost:3000
npm run build    # Production build
```

Docs are automatically deployed to GitHub Pages on push to `main`.

## License

MIT
