# Astro Button validation

This app is the cross-framework validation surface for the first component.
It renders the official `@ui-sdk/react/button` and `@ui-sdk/vue/button`
components in the same Astro page. StyleX provides the wrapper styles; the
component behavior remains in ui-sdk.

```bash
pnpm --dir apps/astro dev
pnpm --dir apps/astro check
pnpm --dir apps/astro build
```

The `data-astryx-theme` and `data-theme` attributes are intentionally plain
HTML attributes for the validation stage. Astryxdesign is a CSS and theme
pattern reference here, not a component dependency.
