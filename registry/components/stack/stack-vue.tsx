/* @jsxImportSource vue */
import type { SlotsType } from 'vue';
import type { PrimitiveVue } from '../../lib/openui-attrs-vue';
import type { ButtonCustomProps } from './stack-props';

import { Button as ButtonPrimitive } from '@ui-sdk/vue/button';
import { defineComponent } from 'vue';
import { buttonCustomVueProps } from './stack-props';

export type ButtonProps = PrimitiveVue.Props<typeof ButtonPrimitive, ButtonCustomProps>;
export type ButtonAttrs = PrimitiveVue.Attrs<typeof ButtonPrimitive>;
export type ButtonSlots = PrimitiveVue.Slots<typeof ButtonPrimitive>;
export type ButtonComponent = PrimitiveVue.Component<typeof ButtonPrimitive, ButtonProps>;

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
      console.log('TODO:React ', { variant, color, size, shape, block });
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
