# Facecoin

**Proof of Face: A Cryptocurrency Powered by Machine Pareidolia**

Facecoin is a cryptocurrency that replaces traditional hash-based proof of work with *proof of face* -- a consensus mechanism that requires miners to find inputs whose visual representations contain machine-detectable faces.

Miners hash candidate data, convert the output to a greyscale image, and submit it to a face detection algorithm. If the detector finds a face above the current confidence threshold, the block is valid. Every mined block produces an NFT of the discovered face image.

This project extends [Rhea Myers' 2014 conceptual artwork *Facecoin*](https://rhea.art/facecoin/) into a fully realized standalone blockchain.

## Documentation

Read the full whitepaper at **[trifle-labs.github.io/facecoin](https://trifle-labs.github.io/facecoin/)**

## Key Features

- **Proof of Face consensus** -- mining produces machine-perceived face images
- **Dynamic difficulty** -- face detection confidence threshold adjusts with network hashrate
- **Native NFTs** -- every block mints a face image NFT for the miner
- **FACE token** -- native currency with halving emission schedule
- **Sovereign rollup on Celestia** -- Proof of Face for block production, Celestia for data availability
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
