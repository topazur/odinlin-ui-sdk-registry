import type { ComponentRenderProps } from '@openuidev/react-lang';
import type { ButtonProps } from './button-react';

import { action, defineComponent } from '@openuidev/react-lang';
import * as React from 'react';
import { z } from 'zod/v4';
import { htmlAttrsConvert, htmlAttrsSchema } from '../../lib/openui-attrs';
import { buttonCustomSchema, buttonSourceSchema } from './button-props';
import { Button as OpenUIButton } from './button-react';

export const buttonSchema = z.object({
  props: buttonSourceSchema.extend(buttonCustomSchema.shape),
  slots: z.any(),
  attrs: htmlAttrsSchema,
  action: action().optional(),
});

/**
 * @title OpenUI 注册组件，可被 OpenUI Lang 在 <Renderer> 内解析渲染
 * 1. component/props 总是以 [props, slots, attrs, action] 顺序传递。
 * 2. component/renderNode 可嵌套渲染已解析的 OpenUI 子节点对象 (slots总是使用renderNode包裹，因为既可以渲染节点也可以渲染TODO)。
 * 3. component/bindSource 给 DOM 元素加上 OpenUI 源码定位标记，多用于检查模式定位。
 */
export const Button = defineComponent({
  name: 'Button',
  description: 'A button with optional content, appearance, attributes, and a click action.',
  props: buttonSchema,
  component: function OpenUIReactButton(
    parameters: ComponentRenderProps<z.infer<typeof buttonSchema>>,
  ) {
    const props = parameters.props?.props as ButtonProps;
    const slots = parameters.props?.slots as any;
    const attrs = parameters.props?.attrs as ButtonProps;
    // const action = parameters.props?.action as ActionPlan | undefined;
    const renderNode = parameters.renderNode;
    const bindSource = parameters.bindSource;

    const { allAttrs } = htmlAttrsConvert(attrs, 'react');
    const mergedSlots = Object.assign(
      {},
      slots?.children && { children: renderNode(slots.children) },
      slots?.render && { render: renderNode(slots.render) },
    );

    console.log('OpenUI:React ', parameters, allAttrs);
    return <OpenUIButton {...bindSource?.()} {...allAttrs} {...props} {...mergedSlots} />;
  },
});
