// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

/**
 * @reference https://astro.build/config
 */
export default defineConfig({
	integrations: [
		starlight({
			title: 'TODO',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://todo.com/' },
        { icon: 'starlight', label: 'Starlight', href: 'https://starlight.astro.build/' },
      ],
			sidebar: [],
		}),
	],
});
