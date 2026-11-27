/* @jsxImportSource vue */
import type { ComponentRenderProps } from '@openuidev/vue-lang';
import type { ButtonAttrs, ButtonProps } from './button-vue';

import { defineComponent } from '@openuidev/vue-lang';
import { defineComponent as defineVueComponent } from 'vue';
import { z } from 'zod/v4';
import { htmlAttrsConvert, htmlAttrsSchema } from '../../lib/openui-attrs';
import { buttonCustomSchema, buttonSourceSchema } from './button-props';
import { Button as OpenUIButton } from './button-vue';

export const buttonSchema = z.object({
  props: buttonSourceSchema.extend(buttonCustomSchema.shape),
  slots: z.any().optional(),
  attrs: htmlAttrsSchema,
  action: z.any().optional(),
});

/**
 * @title OpenUI 注册组件，可被 OpenUI Lang 在 <Renderer> 内解析渲染
 * 1. component/props 总是以 [props, slots, attrs, action] 顺序传递。
 * 2. component/renderNode 可嵌套渲染已解析的 OpenUI 子节点对象 (slots总是使用renderNode包裹，因为既可以渲染节点也可以渲染TODO)。
 * 3. component/bindSource vue未提供该参数。
 */
export const Button = defineComponent({
  name: 'Button',
  description: 'A button with optional content, appearance, attributes, and a click action.',
  props: buttonSchema,
  component: defineVueComponent(
    (parameters: ComponentRenderProps<z.infer<typeof buttonSchema>>) => {
      // const triggerAction = useTriggerAction();
      return () => {
        const props = parameters.props?.props as ButtonProps;
        const slots = parameters.props?.slots as any;
        const attrs = parameters.props?.attrs as ButtonAttrs;
        // const action = parameters.props?.action;
        const renderNode = parameters.renderNode;

        const { allAttrs } = htmlAttrsConvert(attrs, 'vue');

        const mergedSlots = Object.assign(
          {},
          slots?.children && { default: () => renderNode(slots.children) },
          slots?.render && { render: () => renderNode(slots.render) },
        );

        console.log('OpenUI:Vue ', parameters, allAttrs);
        return <OpenUIButton {...allAttrs} {...props} v-slots={mergedSlots} />;
      };
    },
    {
      name: 'OpenUIVueButton',
      inheritAttrs: false,
      props: ['props', 'renderNode'],
    },
  ),
});
