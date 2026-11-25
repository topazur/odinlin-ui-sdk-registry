/* @jsxImportSource vue */
import type { ButtonHTMLAttributes, DefineSetupFnComponent, SlotsType, VNode } from 'vue';

import { defineComponent } from 'vue';

interface ButtonProps extends ButtonHTMLAttributes {
  focusableWhenDisabled?: boolean;
}

type ButtonSlots = SlotsType<{ default?: () => VNode[] }>;

export const Button = defineComponent(
  (props, rawContext) => {
    const attrs = rawContext.attrs as ButtonHTMLAttributes;
    const slots = rawContext.slots;
    return () => {
      const { focusableWhenDisabled } = props;
      const { disabled } = attrs;
      const mergedDisabled = disabled && focusableWhenDisabled ? false : disabled;
      return (
        <button {...attrs} disabled={mergedDisabled}>
          {slots.default?.()}
        </button>
      );
    };
  },
  {
    name: 'Button',
    inheritAttrs: false,
    props: {
      focusableWhenDisabled: { type: Boolean, default: undefined },
    },
    slots: Object as ButtonSlots,
  },
) as unknown as DefineSetupFnComponent<ButtonProps, {}, ButtonSlots>;
