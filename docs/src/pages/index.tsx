import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/abstract">
            Read the Whitepaper
          </Link>
        </div>
      </div>
    </header>
  );
}

function Feature({title, description}: {title: string; description: string}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md padding-vert--lg">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Proof of Face Cryptocurrency"
      description="A cryptocurrency that uses facial recognition as proof of work. Mining means finding faces in noise.">
      <HomepageHeader />
      <main>
        <section className="container padding-vert--xl">
          <div className="row">
            <Feature
              title="Proof of Face"
              description="Mining produces images containing algorithmically detected faces. Instead of wasting energy on meaningless hashes, every block creates a unique piece of machine-perceived art."
            />
            <Feature
              title="Every Block is an NFT"
              description="Each mined block produces a face image that becomes an NFT owned by the miner. The blockchain is a permanent gallery of machine pareidolia."
            />
            <Feature
              title="Bridgeable"
              description="Standalone chain with native bridging to Ethereum and Solana. Trade FACE tokens on DEXes and list face NFTs on major marketplaces."
            />
          </div>
        </section>
      </main>
    </Layout>
  );
}
