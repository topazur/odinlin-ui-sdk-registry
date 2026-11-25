// @ts-check
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import vue from '@astrojs/vue';
import liveCode from 'astro-live-code';
import { defineConfig } from 'astro/config';

/**
 * @reference https://astro.build/config
 */
export default defineConfig({
  /** `astro-live-code` 仍使用旧的 remarkPlugins 配置 */
  markdown: {
    processor: unified(),
  },
  integrations: [
    /** `astro-live-code` 从代码块生成临时文件，并自动预览 */
    liveCode({}),
    /** Configure @astrojs/react with scoped include patterns so framework components coexist. */
    react({
      include: ['**/react/**/*.tsx', '**/*react.tsx'],
      compiler: false,
    }),
    /** Configure @astrojs/vue with scoped include patterns so framework components coexist. */
    vue({
      include: ['**/vue/**/*.vue'],
      jsx: { include: ['**/vue/**/*.tsx', '**/*vue.tsx'] },
    }),
    starlight({
      title: 'TODO',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://todo.com/' },
        { icon: 'starlight', label: 'Starlight', href: 'https://starlight.astro.build/' },
      ],
      sidebar: [
        {
          label: 'UI',
          items: [{ autogenerate: { directory: 'ui' } }],
        },
      ],
    }),
  ],
});
