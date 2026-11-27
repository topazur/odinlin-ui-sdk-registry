# Component patterns

Use this reference after reading `SKILL.md`. Replace every `<component>` placeholder and every `Component` placeholder with the kebab-case directory name and PascalCase export name. The `button` files are the concrete repository example.

## File matrix

| Layer                 | Path                                            | Responsibility                                                       |
| --------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| Props and schema      | `registry/ui/<component>/<component>-props.ts`  | Source props, custom props, inferred types, Vue runtime declarations |
| React wrapper         | `registry/ui/<component>/<component>-react.tsx` | Primitive import, custom-prop mapping, ref and prop forwarding       |
| Vue wrapper           | `registry/ui/<component>/<component>-vue.tsx`   | Primitive import, runtime props, attrs and slots forwarding          |
| React registration    | `registry/ui/<component>/openui-react.tsx`      | OpenUI schema and React render adapter                               |
| Vue registration      | `registry/ui/<component>/openui-vue.tsx`        | OpenUI schema and Vue render adapter                                 |
| React preview library | `registry/components/openui-preview/react.ts`   | Add the registered component to the React library                    |
| Vue preview library   | `registry/components/openui-preview/vue.ts`     | Add the registered component to the Vue library                      |
| Documentation         | `src/content/docs/ui/<component>.mdx`           | OpenUI source examples and framework previews                        |

## Props schema skeleton

Keep the source and custom schemas separate so the boundary is visible in the registration layer.

```ts
import type { ComponentObjectPropsOptions, PropType } from 'vue';

import { z } from 'zod/v4';

export const <component>SourceSchema = z
  .object({
    // Copy only serializable primitive props after inspecting the package types.
    disabled: z.boolean(),
  })
  .partial();

export type <Component>SourceProps = NonNullable<z.input<typeof <component>SourceSchema>>;

export const <component>CustomSchema = z
  .object({
    // Add wrapper-level props only when the public API needs them.
    tone: z.enum(['default', 'accent']),
  })
  .partial();

export type <Component>CustomProps = NonNullable<z.input<typeof <component>CustomSchema>>;

function <component>CustomValidator(
  key: keyof typeof <component>CustomSchema.shape,
  value: unknown,
): boolean {
  return <component>CustomSchema.shape[key].safeParse(value).success;
}

export const <component>CustomVueProps = {
  tone: {
    type: String as PropType<<Component>CustomProps['tone']>,
    validator: (value: unknown) => <component>CustomValidator('tone', value),
  },
} satisfies Required<ComponentObjectPropsOptions<<Component>CustomProps>>;
```

If no custom props exist, export an empty custom schema and omit the Vue runtime object only when the component has no wrapper-level runtime declarations. Do not copy a source package's TypeScript interface into a second hand-maintained type.

## React wrapper skeleton

```tsx
import type { <Component>CustomProps } from './<component>-props';

import { <Component> as <Component>Primitive } from '@ui-sdk/react/<component>';
import * as React from 'react';

export interface <Component>Props
  extends Omit<React.ComponentProps<typeof <Component>Primitive>, 'tone'>,
    <Component>CustomProps {}

export const <Component> = React.forwardRef<
  React.ElementRef<typeof <Component>Primitive>,
  <Component>Props
>(function <Component>Render(props, forwardedRef) {
  const { tone = 'default', ...restProps } = props;

  // Map or consume `tone` according to the primitive API.
  return <<Component>Primitive {...restProps} ref={forwardedRef} />;
});
```

Use the primitive's actual ref type when `React.ElementRef` is not accepted by its declaration. Keep an explicit `Omit` for every custom prop that collides with a native attribute or primitive prop.

## Vue wrapper skeleton

```tsx
/* @jsxImportSource vue */
import type { SlotsType } from 'vue';
import type { PrimitiveVue } from '../../lib/vue-factory';
import type { <Component>CustomProps } from './<component>-props';

import { <Component> as <Component>Primitive } from '@ui-sdk/vue/<component>';
import { defineComponent } from 'vue';
import { <component>CustomVueProps } from './<component>-props';

export type <Component>Props = PrimitiveVue.Props<
  typeof <Component>Primitive,
  <Component>CustomProps
>;
export type <Component>Attrs = PrimitiveVue.Attrs<typeof <Component>Primitive, 'tone'>;
export type <Component>Slots = PrimitiveVue.Slots<typeof <Component>Primitive>;
export type <Component>Component = PrimitiveVue.Component<
  typeof <Component>Primitive,
  <Component>Props
>;

export const <Component> = defineComponent(
  (rawProps, rawContext) => {
    const props = rawProps as <Component>Props;
    const attrs = rawContext.attrs as <Component>Attrs;
    const slots = rawContext.slots;

    return () => {
      const { tone = 'default', ...restProps } = props;
      // Map or consume `tone` according to the primitive API.
      return <<Component>Primitive {...attrs} {...restProps} v-slots={slots} />;
    };
  },
  {
    name: '<Component>',
    inheritAttrs: false,
    slots: <Component>Primitive.slots as SlotsType<<Component>Slots>,
    props: {
      ...<Component>Primitive.props,
      ...<component>CustomVueProps,
    },
  },
) as unknown as <Component>Component;
```

When the primitive does not expose a static `slots` member, use the narrowest slot type the package exports and keep the cast local to the `slots` option.

## OpenUI registration skeleton

The two framework registrations share the schema shape. The rendering adapter differs only where the language package requires it.

```tsx
export const <component>Schema = z.object({
  props: <component>SourceSchema.extend(<component>CustomSchema.shape),
  slots: z.any(),
  attrs: htmlAttrsSchema,
  action: action().optional(),
});
```

Keep `slots` and `attrs` required when the OpenUI language calls the first three fields positionally. A docs call with no attrs still needs an explicit third argument.

```tsx
export const <Component> = defineComponent({
  name: '<Component>',
  description: 'Describe the component behavior in one sentence.',
  props: <component>Schema,
  component: function OpenUI<Component>(parameters: ComponentRenderProps<z.infer<typeof <component>Schema>>) {
    const props = parameters.props?.props as <Component>Props;
    const slots = parameters.props?.slots as Record<string, unknown> | undefined;
    const attrs = parameters.props?.attrs;
    const renderNode = parameters.renderNode;
    const bindSource = parameters.bindSource;
    const { allAttrs } = htmlAttrsConvert(attrs, 'react');
    const mergedSlots = slots?.children
      ? { children: renderNode(slots.children) }
      : undefined;

    return <<Component> {...bindSource?.()} {...allAttrs} {...props} {...mergedSlots} />;
  },
});
```

For Vue, use the Vue language `defineComponent`, wrap the actual component in `defineVueComponent`, convert attrs with `'vue'`, and map `slots.children` to a `default` slot function. Keep the same required top-level schema fields.

Do not pass `parameters.props` directly to the wrapper. Separate `props`, `slots`, `attrs`, and `action` first so a custom prop cannot accidentally overwrite an HTML attribute or a generated slot.

## Preview library wiring

```ts
import { createLibrary } from '@openuidev/react-lang';
import { <Component> } from '../../ui/<component>/openui-react';

export const library = createLibrary({
  root: 'ExistingRoot',
  components: [ExistingComponent, <Component>],
});
```

Mirror the import and array entry in `vue.ts`. Keep both libraries in lockstep.

## MDX source and render skeleton

```mdx
---
title: <Component>
description: Examples for the Odinlin UI SDK <component> in React and Vue.
---

import { OpenUIRenderReact } from '~/registry/components/openui-preview/openui-render-react';
import { OpenUIRenderVue } from '~/registry/components/openui-preview/openui-render-vue';

export const basicSource = `root = <Component>({}, { children: "Label" }, {})`;
export const attrsSource = `root = <Component>({}, { children: "Link" }, { href: "#installation" })`;

## Basic

<OpenUIRenderReact client:only="react" source={basicSource} />
<OpenUIRenderVue client:only="vue" source={basicSource} />

<details>
  <summary>OpenUI Lang</summary>
  <pre>
    <code>{basicSource}</code>
  </pre>
</details>
```

If the component has no `children` slot, use its real slot name or `{}` for the second argument. Always keep the third argument when the registration schema requires `attrs`.
