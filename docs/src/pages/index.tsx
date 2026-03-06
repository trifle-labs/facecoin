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
              description="Miners search for hash inputs whose visual representations contain machine-detected faces. Submit a valid proof, earn FACE tokens and a unique NFT of the face you found."
            />
            <Feature
              title="Every Proof is an NFT"
              description="Each valid face proof mints an NFT of the discovered image. The chain builds a permanent gallery of machine pareidolia -- faces found in noise."
            />
            <Feature
              title="Celestia Rollup"
              description="A sovereign rollup on Celestia using standard sequencing. Proof of Face is pure application logic -- no custom consensus needed. Bridgeable to Ethereum and Solana."
            />
          </div>
        </section>
      </main>
    </Layout>
  );
}
