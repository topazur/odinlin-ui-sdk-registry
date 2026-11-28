/* @jsxImportSource vue */
import type { ComponentRenderProps } from '@openuidev/vue-lang';

import { defineComponent as defineOpenUIComponent } from '@openuidev/vue-lang';
import { defineComponent as defineVueComponent } from 'vue';
import { z } from 'zod/v4';
import { htmlAttrsConvert, htmlAttrsSchema } from '../../lib/openui-attrs';
import {
  inputClearCustomSchema,
  inputClearSourceSchema,
  inputCustomSchema,
  inputGroupCustomSchema,
  inputGroupSourceSchema,
  inputSourceSchema,
} from './input-props';
import {
  type InputAttrs,
  type InputClearAttrs,
  type InputClearProps,
  InputClear as InputClearWrapper,
  type InputGroupAttrs,
  type InputGroupProps,
  InputGroup as InputGroupWrapper,
  type InputProps,
  Input as InputWrapper,
} from './input-vue';

export const inputSchema = z.object({
  props: inputSourceSchema.extend(inputCustomSchema.shape),
  slots: z.any(),
  attrs: htmlAttrsSchema,
  action: z.any().optional(),
});

export const inputGroupSchema = z.object({
  props: inputGroupSourceSchema.extend(inputGroupCustomSchema.shape),
  slots: z.any(),
  attrs: htmlAttrsSchema,
  action: z.any().optional(),
});

export const inputClearSchema = z.object({
  props: inputClearSourceSchema.extend(inputClearCustomSchema.shape),
  slots: z.any(),
  attrs: htmlAttrsSchema,
  action: z.any().optional(),
});

export const Input = defineOpenUIComponent({
  name: 'Input',
  description:
    'A native text input that connects to field state and supports standard input attributes.',
  props: inputSchema,
  component: defineVueComponent(
    (parameters: ComponentRenderProps<z.infer<typeof inputSchema>>) => {
      return () => {
        const props = parameters.props?.props as InputProps;
        const attrs = parameters.props?.attrs as InputAttrs;
        const { allAttrs } = htmlAttrsConvert(attrs, 'vue');
        return <InputWrapper {...allAttrs} {...props} />;
      };
    },
    { name: 'OpenUIVueInput', inheritAttrs: false, props: ['props', 'renderNode'] },
  ),
});

export const InputGroup = defineOpenUIComponent({
  name: 'InputGroup',
  description: 'A group that places text, inputs, and buttons around a shared input field.',
  props: inputGroupSchema,
  component: defineVueComponent(
    (parameters: ComponentRenderProps<z.infer<typeof inputGroupSchema>>) => {
      return () => {
        const props = parameters.props?.props as InputGroupProps;
        const slots = parameters.props?.slots as Record<string, unknown> | undefined;
        const attrs = parameters.props?.attrs as InputGroupAttrs;
        const { allAttrs } = htmlAttrsConvert(attrs, 'vue');
        const renderNode = parameters.renderNode;
        const mergedSlots = slots?.children
          ? { default: () => renderNode(slots.children) }
          : undefined;

        return <InputGroupWrapper {...allAttrs} {...props} v-slots={mergedSlots} />;
      };
    },
    { name: 'OpenUIVueInputGroup', inheritAttrs: false, props: ['props', 'renderNode'] },
  ),
});

export const InputClear = defineOpenUIComponent({
  name: 'InputClear',
  description: 'A button that clears the input in its group and returns focus to the input.',
  props: inputClearSchema,
  component: defineVueComponent(
    (parameters: ComponentRenderProps<z.infer<typeof inputClearSchema>>) => {
      return () => {
        const props = parameters.props?.props as InputClearProps;
        const slots = parameters.props?.slots as Record<string, unknown> | undefined;
        const attrs = parameters.props?.attrs as InputClearAttrs;
        const { allAttrs } = htmlAttrsConvert(attrs, 'vue');
        const renderNode = parameters.renderNode;
        const mergedSlots = slots?.children
          ? { default: () => renderNode(slots.children) }
          : undefined;

        return <InputClearWrapper {...allAttrs} {...props} v-slots={mergedSlots} />;
      };
    },
    { name: 'OpenUIVueInputClear', inheritAttrs: false, props: ['props', 'renderNode'] },
  ),
});
