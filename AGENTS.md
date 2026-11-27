## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## UI SDK components

When adding or changing a component under `registry/ui/[component]/`, keep the props schema, React and Vue wrappers, OpenUI registration, preview libraries, and `src/content/docs/ui/[component].mdx` in sync.

- The OpenUI registration schema fields `props`, `slots`, and `attrs` map to the first three positional arguments in OpenUI Lang. When those fields are required, every docs source must pass all three objects, using `{}` for an unused argument.
- Register every component in both `registry/components/openui-preview/react.ts` and `registry/components/openui-preview/vue.ts`.
- Forward nested OpenUI slots through `renderNode` and convert HTML attrs with `registry/lib/openui-attrs.ts`.
- Run `pnpm lint`, `pnpm lint:format`, `pnpm lint:typecheck`, and `pnpm build` before publishing component changes.
