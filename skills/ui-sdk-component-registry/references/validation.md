# Validation checklist

Run these checks from the repository root after replacing `<component>` and `<Component>` with the target names. Record the baseline result before editing when the repository already has unrelated failures, then report only new failures introduced by the component.

For a component family, choose the directory as `<component>` and list every public part in `--parts`. The family still needs one shared file matrix, while each listed part needs its own schema and registered definition.

## Structural checks

```bash
component=button

test -f "registry/ui/$component/${component}-props.ts"
test -f "registry/ui/$component/${component}-react.tsx"
test -f "registry/ui/$component/${component}-vue.tsx"
test -f "registry/ui/$component/openui-react.tsx"
test -f "registry/ui/$component/openui-vue.tsx"
test -f "src/content/docs/ui/$component.mdx"

rg -n "ui/$component/openui-react" registry/components/openui-preview/react.ts
rg -n "ui/$component/openui-vue" registry/components/openui-preview/vue.ts

python skills/ui-sdk-component-registry/scripts/check_component.py "$component"
# For a family with multiple public parts, list them explicitly.
python skills/ui-sdk-component-registry/scripts/check_component.py input --parts Input,InputGroup,InputClear
```

Check both preview-library arrays manually. An import without an entry in `components` leaves the docs renderer unable to resolve the component.

## Schema and OpenUI argument checks

Inspect both registration files and confirm that the top-level schema has these fields in order.

```ts
props: <component>SourceSchema.extend(<component>CustomSchema.shape),
slots: ...,
attrs: htmlAttrsSchema,
action: ...,
```

The exact action schema can vary by installed language package, but `props`, `slots`, and `attrs` must match the parser's positional contract. If any of these fields is required, check every MDX source string.

For a component family, verify that each part has a distinct schema and registration name. Verify nested calls in `slots.children` as well as the root call.

```bash
rg -n "root\s*=\s*<Component>\(" "src/content/docs/ui/$component.mdx"
```

For each source, count the top-level arguments. A comma nested inside an object or string does not separate an argument. The common valid shape is:

```text
root = Component(propsObject, slotsObject, attrsObject)
```

An empty attrs object is still an argument. Do not change the schema to optional merely to preserve a two-argument example.

## Framework and render checks

Run the repository's normal checks.

```bash
pnpm lint
pnpm lint:format
pnpm lint:typecheck
pnpm build
```

If dependencies are not installed, run `pnpm install --frozen-lockfile` first. Keep formatting changes scoped to the files touched by the component.

Use typecheck failures to correct primitive prop, ref, event, and slot drift. Use build failures to correct Astro MDX imports, framework include patterns, and OpenUI library registration.

## Manual runtime smoke test

Start the documented dev server in background mode.

```bash
astro dev --background
astro dev status
```

Open the generated component docs page and confirm all of the following.

- React and Vue previews both resolve the registered component.
- Required props, slots, and attrs are accepted by the OpenUI parser.
- Child nodes render through `renderNode` rather than as a raw OpenUI object.
- HTML attrs reach the correct framework spelling and style conversion.
- Actions, when supported, produce an event in the existing preview renderer.
- The source shown under “OpenUI Lang” exactly matches the string sent to both renderers.

Stop the server when the smoke test is finished.

```bash
astro dev stop
```

## Common failures

| Symptom                                              | Likely cause                                               | Fix                                                                                          |
| ---------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `Unknown component`                                  | Registration file is not in one preview library            | Add the import and component entry to both `react.ts` and `vue.ts`                           |
| Schema validation says a positional value is missing | MDX source has fewer arguments than required schema fields | Add the missing `{}` or real object, preserving `props`, `slots`, `attrs` order              |
| React renders but Vue does not                       | Vue wrapper dropped attrs or used the wrong slot name      | Forward `rawContext.attrs` and map nested slots to Vue slot functions                        |
| Native attr changes a custom prop                    | Name collision was not omitted in the wrapper type         | Add the collision to `Omit` or `PrimitiveVue.Attrs` and map it explicitly                    |
| Child content is blank                               | Registration passed a raw node object to the framework     | Call `parameters.renderNode` for every nested OpenUI slot                                    |
| Build cannot import the MDX renderer                 | Alias or import path does not match existing docs          | Copy the established `~/registry/components/openui-preview/...` import                       |
| JSON schema generation fails on callbacks            | A non-serializable function was included in the schema     | Use the repository's representable callback pattern or keep the callback outside OpenUI data |
