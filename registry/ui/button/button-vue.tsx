/* @jsxImportSource vue */
import type { SlotsType } from 'vue';
import type { PrimitiveVue } from '../../lib/vue-factory';
import type { ButtonCustomProps } from './button-props';

import { Button as ButtonPrimitive } from '@ui-sdk/vue/button';
import { defineComponent } from 'vue';
import { buttonCustomVueProps } from './button-props';

export type ButtonProps = PrimitiveVue.Props<typeof ButtonPrimitive, ButtonCustomProps>;
export type ButtonAttrs = PrimitiveVue.Attrs<typeof ButtonPrimitive, 'color'>;
export type ButtonSlots = PrimitiveVue.Slots<typeof ButtonPrimitive>;
export type ButtonComponent = PrimitiveVue.Component<typeof ButtonPrimitive, ButtonProps>;

/**
 * 包装 `@ui-sdk/vue/button` 组件
 * 1. 属性 `color` 既是 HTML 属性，也是 Button 的 prop。需手动 Omit 排除 HTML 属性。
 */
export const Button = defineComponent(
  (rawProps, rawContext) => {
    const props = rawProps as ButtonProps;
    const attrs = rawContext.attrs as ButtonAttrs;
    const slots = rawContext.slots;
    return () => {
      const {
        variant = 'solid',
        color = 'default',
        size = 'medium',
        shape = 'default',
        block,
        ...restProps
      } = props;
      console.log('TODO:Vue ', { variant, color, size, shape, block }, rawProps, rawContext);
      return <ButtonPrimitive {...attrs} {...restProps} v-slots={slots} />;
    };
  },
  {
    name: 'Button',
    inheritAttrs: false,
    slots: ButtonPrimitive.slots as SlotsType<ButtonSlots>,
    props: {
      ...ButtonPrimitive.props,
      ...buttonCustomVueProps,
    },
  },
) as unknown as ButtonComponent;
