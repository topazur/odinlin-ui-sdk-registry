---
name: ui-sdk-component-registry
description: Create or update a UI SDK component end to end from a source component, including registry/ui/[component] props schemas, React and Vue wrappers, OpenUI registration, preview-library wiring, and src/content/docs/ui/[component].mdx examples. Use when a task mentions adding a component to the UI SDK registry, wrapping @ui-sdk/react or @ui-sdk/vue components, defining OpenUI schemas, or rendering component examples in the Astro/Starlight docs.
---

# UI SDK component registry

Use this skill to keep the four layers of a component in sync. Treat the existing `button` implementation as a reference for repository conventions, then verify every decision against the primitive component's published types and the shared helpers in `registry/lib`.

## Inputs and naming

- Read the repository `AGENTS.md` and inspect the target primitive in `@ui-sdk/react/<component>` and `@ui-sdk/vue/<component>` before writing files.
- Keep the component directory in kebab-case, for example `registry/ui/date-picker/`.
- Derive the exported component name in PascalCase, for example `DatePicker`.
- Use the same `<component>` name in the props file, wrapper files, OpenUI registration files, docs path, and library imports.
- Reuse `registry/lib/openui-attrs.ts` and `registry/lib/vue-factory.ts`. Do not create a second HTML-attribute converter or a second Vue type factory for one component.

## Workflow

### 1. Map the primitive API

Record the primitive's source props, event props, slots, refs, and HTML attributes. Separate them into three groups before defining schemas.

1. Source props that OpenUI can carry as JSON-like values.
2. Wrapper-only custom props that change the public API or map to primitive props.
3. HTML attributes and framework events that belong in the `attrs` object or the source-prop schema.

Resolve name collisions explicitly. A custom prop that has the same name as an HTML attribute must be omitted from the primitive's HTML prop type and re-applied deliberately, as `button` does for `color`.

### 2. Define the props and runtime schema layer

Create `registry/ui/<component>/<component>-props.ts`.

- Export `<component>SourceSchema` for serializable primitive props.
- Export `<component>CustomSchema` for wrapper-level props.
- Make a field optional only when the primitive or wrapper accepts it as optional. Derive public types with `z.input`, not a hand-written duplicate type.
- Export Vue runtime declarations for custom props. Use `PropType` and a schema-backed validator for enum-like values. Keep `default: undefined` when an absent boolean must remain distinguishable from `false`.
- Keep callbacks, DOM nodes, component instances, and other non-serializable values out of the OpenUI JSON schema. If a framework renderer needs a callback, use the repository's representable `z.custom` or refined `z.unknown` pattern and keep it out of generated JSON data.

### 3. Build the framework wrappers

Create `<component>-react.tsx` and `<component>-vue.tsx`.

For React:

- Import the primitive and the custom-prop type.
- Preserve the primitive's ref type with `React.forwardRef`.
- Omit colliding HTML props from `React.ComponentProps<typeof Primitive>`.
- Consume or map every custom prop. Forward the remaining source props, events, and attributes to the primitive.
- Preserve children and render-prop semantics. Do not replace them with string-only children.

For Vue:

- Use `PrimitiveVue.Props`, `PrimitiveVue.Attrs`, `PrimitiveVue.Slots`, and `PrimitiveVue.Component` from `registry/lib/vue-factory`.
- Use `defineComponent` with `inheritAttrs: false` when attrs are forwarded manually.
- Keep primitive props in the runtime `props` option, add the custom Vue declarations, forward `rawContext.attrs`, and pass through slots with `v-slots`.
- Preserve the primitive's slot and event types. Do not cast the whole component to `any` to silence a mismatch.

Do not leave `console.log`, `TODO`, placeholder defaults, or swallowed props in the finished wrapper.

### 4. Register the component with OpenUI

Create `openui-react.tsx` and `openui-vue.tsx` in the component directory.

Each registration module must:

- Define one exported `<component>Schema`.
- Combine the source and custom schemas for the nested `props` value.
- Declare top-level `props`, `slots`, and `attrs` in that order. The first three positional OpenUI arguments map to these fields, so keep all three required when the language contract requires them. Use an empty object in docs for an unused third argument.
- Keep `action` optional unless the component has a real action contract. Use the framework's `action()` helper in React and the repository's Vue-compatible action schema pattern in Vue.
- Convert HTML attrs with `htmlAttrsConvert(attrs, 'react' | 'vue')`.
- Call `parameters.renderNode` for nested OpenUI slot values. Do not pass a raw AST object directly into a framework slot.
- Use `parameters.bindSource` in React when source-location binding is supported. Keep the Vue implementation aligned with the installed Vue language package.
- Forward the registered props to the wrapper only after separating attrs, slots, and action behavior.

The schema is the source of truth for the OpenUI call shape. If `attrs` is required in the schema, every example must use `Component(props, slots, attrs)`, including examples whose attrs object is `{}`. Do not make a required field optional just to keep a two-argument example short.

### 5. Wire both preview libraries

Update `registry/components/openui-preview/react.ts` and `registry/components/openui-preview/vue.ts`.

- Import the component's OpenUI registration from `../../ui/<component>/openui-react` or `openui-vue`.
- Add it to the existing `components` array without removing the existing entries.
- Keep the existing `root` behavior unless the task explicitly changes the preview entry point.

The shared `OpenUIRenderReact` and `OpenUIRenderVue` components already provide the document render layer. Only change them when the task requires a shared renderer behavior change. Component-specific rendering belongs in the registration modules and the MDX source examples.

### 6. Add the MDX documentation render layer

Create `src/content/docs/ui/<component>.mdx` with Starlight frontmatter, a short description, and source constants for meaningful states.

- Import `OpenUIRenderReact` from `~/registry/components/openui-preview/openui-render-react` and `OpenUIRenderVue` from `~/registry/components/openui-preview/openui-render-vue`.
- Store OpenUI Lang in template literals so the displayed source matches what the renderer receives.
- Use the registered component's exact name and argument order.
- Include all required positional arguments. For the common contract use `root = Component({}, { children: "Label" }, {})`, then add real props or attrs as needed.
- Render each source with both `<OpenUIRenderReact client:only="react" ... />` and `<OpenUIRenderVue client:only="vue" ... />`.
- Show the source beside the preview. Reuse the repository's existing details block or shared preview component rather than inventing a second renderer.
- Include examples that exercise the component's important props, slots, attrs, and action behavior. Avoid examples that only prove the default state.

### 7. Verify the complete path

Run the checks in `references/validation.md`. At minimum, verify the following.

- Both framework wrappers and both OpenUI registration files exist.
- Both preview libraries import and register the component.
- The registration schema and each MDX source agree on the first three positional arguments.
- Every source used in docs renders in React and Vue.
- Type checking catches primitive prop or slot drift.
- The Astro build parses the MDX and framework integrations.

Read `references/component-patterns.md` for copyable skeletons and schema details. Read `references/validation.md` before declaring the component complete.
