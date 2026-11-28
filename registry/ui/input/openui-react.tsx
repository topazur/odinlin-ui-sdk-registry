import type { ComponentRenderProps } from '@openuidev/react-lang';

import { action, defineComponent } from '@openuidev/react-lang';
import * as React from 'react';
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
  InputClear as InputClearWrapper,
  InputGroup as InputGroupWrapper,
  Input as InputWrapper,
} from './input-react';

export const inputSchema = z.object({
  props: inputSourceSchema.extend(inputCustomSchema.shape),
  slots: z.any(),
  attrs: htmlAttrsSchema,
  action: action().optional(),
});

export const inputGroupSchema = z.object({
  props: inputGroupSourceSchema.extend(inputGroupCustomSchema.shape),
  slots: z.any(),
  attrs: htmlAttrsSchema,
  action: action().optional(),
});

export const inputClearSchema = z.object({
  props: inputClearSourceSchema.extend(inputClearCustomSchema.shape),
  slots: z.any(),
  attrs: htmlAttrsSchema,
  action: action().optional(),
});

export const Input = defineComponent({
  name: 'Input',
  description:
    'A native text input that connects to field state and supports standard input attributes.',
  props: inputSchema,
  component: function OpenUIReactInput(
    parameters: ComponentRenderProps<z.infer<typeof inputSchema>>,
  ) {
    const props = parameters.props?.props;
    const attrs = parameters.props?.attrs;
    const { allAttrs } = htmlAttrsConvert(attrs, 'react');
    const bindSource = parameters.bindSource;

    return <InputWrapper {...bindSource?.()} {...allAttrs} {...props} />;
  },
});

export const InputGroup = defineComponent({
  name: 'InputGroup',
  description: 'A group that places text, inputs, and buttons around a shared input field.',
  props: inputGroupSchema,
  component: function OpenUIReactInputGroup(
    parameters: ComponentRenderProps<z.infer<typeof inputGroupSchema>>,
  ) {
    const props = parameters.props?.props;
    const slots = parameters.props?.slots as Record<string, unknown> | undefined;
    const attrs = parameters.props?.attrs;
    const { allAttrs } = htmlAttrsConvert(attrs, 'react');
    const renderNode = parameters.renderNode;
    const bindSource = parameters.bindSource;
    const mergedSlots = slots?.children ? { children: renderNode(slots.children) } : undefined;

    return <InputGroupWrapper {...bindSource?.()} {...allAttrs} {...props} {...mergedSlots} />;
  },
});

export const InputClear = defineComponent({
  name: 'InputClear',
  description: 'A button that clears the input in its group and returns focus to the input.',
  props: inputClearSchema,
  component: function OpenUIReactInputClear(
    parameters: ComponentRenderProps<z.infer<typeof inputClearSchema>>,
  ) {
    const props = parameters.props?.props;
    const slots = parameters.props?.slots as Record<string, unknown> | undefined;
    const attrs = parameters.props?.attrs;
    const { allAttrs } = htmlAttrsConvert(attrs, 'react');
    const renderNode = parameters.renderNode;
    const bindSource = parameters.bindSource;
    const mergedSlots = slots?.children ? { children: renderNode(slots.children) } : undefined;

    return <InputClearWrapper {...bindSource?.()} {...allAttrs} {...props} {...mergedSlots} />;
  },
});
