import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Facecoin',
  tagline: 'Proof of Face: A Cryptocurrency Powered by Machine Pareidolia',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://trifle-labs.github.io',
  baseUrl: '/facecoin/',

  organizationName: 'trifle-labs',
  projectName: 'facecoin',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/trifle-labs/facecoin/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/facecoin-social-card.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Facecoin',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'whitepaperSidebar',
          position: 'left',
          label: 'Whitepaper',
        },
        {
          href: 'https://github.com/trifle-labs/facecoin',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Whitepaper',
              to: '/docs/abstract',
            },
          ],
        },
        {
          title: 'Links',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/trifle-labs/facecoin',
            },
            {
              label: 'Trifle Labs',
              href: 'https://github.com/trifle-labs',
            },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Trifle Labs. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
