import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Comprehensive Git Guide',
      description: 'A practical guide to Git for teams new to version control',
      social: {
        github: 'https://github.com/roymatsunaga/git-guide',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Home', slug: 'index' },
          ],
        },
        {
          label: 'Learning Path',
          items: [
            { label: '1. Concepts', slug: '01-concepts' },
            { label: '2. Installation', slug: '02-installation' },
            { label: '3. Basic Workflow', slug: '03-basics' },
            { label: '4. Branching & Merging', slug: '04-branching' },
            { label: '5. Advanced Features', slug: '05-advanced' },
            { label: '6. Collaboration', slug: '06-collaboration' },
            { label: '7. Troubleshooting', slug: '07-troubleshooting' },
            { label: '8. Command Reference', slug: '08-reference' },
            { label: '9. Visual Guide', slug: '09-visual-guide' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
  ],
  site: 'https://roymatsunaga.github.io/git-guide/',
});
