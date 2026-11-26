import { relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { organization } from './projects.mjs';
import remarkSourceLinks from './scripts/remark-source-links.mjs';

const generatedDir = fileURLToPath(new URL('./.generated-docs/', import.meta.url));

export default {
  title: 'Hotel Booking System',
  url: process.env.HBS_DOCS_URL ?? 'http://localhost:8081',
  baseUrl: '/',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  i18n: { defaultLocale: 'ru', locales: ['ru'] },
  markdown: {
    format: 'md',
    mermaid: true,
    hooks: { onBrokenMarkdownLinks: 'throw', onBrokenMarkdownImages: 'throw' },
    async parseFrontMatter(params) {
      const parsed = await params.defaultParseFrontMatter(params);
      const [project, file] = relative(generatedDir, params.filePath).split(sep);
      if (file === 'README.md') {
        parsed.frontMatter.slug = `/${project}`;
      }
      return parsed;
    },
  },
  themes: ['@docusaurus/theme-mermaid'],
  presets: [
    ['classic', {
      docs: {
        path: '.generated-docs',
        sidebarPath: './sidebars.mjs',
        beforeDefaultRemarkPlugins: [[remarkSourceLinks, { generatedDir }]],
      },
      blog: false,
      theme: { customCss: './src/css/custom.css' },
    }],
  ],
  themeConfig: {
    navbar: {
      title: 'Hotel Booking System',
      items: [
        { type: 'docSidebar', sidebarId: 'services', position: 'left', label: 'Документация' },
        { href: `https://github.com/${organization}`, position: 'right', label: 'GitHub' },
      ],
    },
  },
};
