/* @jsxImportSource vue */
import type { SlotsType } from 'vue';
import type { PrimitiveVue } from '../../lib/vue-factory';

import {
  InputClear as InputClearPrimitive,
  InputGroup as InputGroupPrimitive,
  Input as InputPrimitive,
} from '@ui-sdk/vue/input';
import { defineComponent } from 'vue';

export type InputProps = PrimitiveVue.Props<typeof InputPrimitive>;
export type InputAttrs = PrimitiveVue.Attrs<typeof InputPrimitive>;
export type InputSlots = PrimitiveVue.Slots<typeof InputPrimitive>;
export type InputComponent = PrimitiveVue.Component<typeof InputPrimitive, InputProps>;

export const Input = defineComponent(
  (rawProps, rawContext) => {
    const props = rawProps as InputProps;
    const attrs = rawContext.attrs as InputAttrs;
    const slots = rawContext.slots;

    return () => <InputPrimitive {...attrs} {...props} v-slots={slots} />;
  },
  {
    name: 'Input',
    inheritAttrs: false,
    slots: InputPrimitive.slots as SlotsType<InputSlots>,
    props: InputPrimitive.props,
  },
) as unknown as InputComponent;

export type InputGroupProps = PrimitiveVue.Props<typeof InputGroupPrimitive>;
export type InputGroupAttrs = PrimitiveVue.Attrs<typeof InputGroupPrimitive>;
export type InputGroupSlots = PrimitiveVue.Slots<typeof InputGroupPrimitive>;
export type InputGroupComponent = PrimitiveVue.Component<
  typeof InputGroupPrimitive,
  InputGroupProps
>;

export const InputGroup = defineComponent(
  (rawProps, rawContext) => {
    const props = rawProps as InputGroupProps;
    const attrs = rawContext.attrs as InputGroupAttrs;
    const slots = rawContext.slots;

    return () => <InputGroupPrimitive {...attrs} {...props} v-slots={slots} />;
  },
  {
    name: 'InputGroup',
    inheritAttrs: false,
    slots: InputGroupPrimitive.slots as SlotsType<InputGroupSlots>,
    props: InputGroupPrimitive.props,
  },
) as unknown as InputGroupComponent;

export type InputClearProps = PrimitiveVue.Props<typeof InputClearPrimitive>;
export type InputClearAttrs = PrimitiveVue.Attrs<typeof InputClearPrimitive>;
export type InputClearSlots = PrimitiveVue.Slots<typeof InputClearPrimitive>;
export type InputClearComponent = PrimitiveVue.Component<
  typeof InputClearPrimitive,
  InputClearProps
>;

export const InputClear = defineComponent(
  (rawProps, rawContext) => {
    const props = rawProps as InputClearProps;
    const attrs = rawContext.attrs as InputClearAttrs;
    const slots = rawContext.slots;

    return () => <InputClearPrimitive {...attrs} {...props} v-slots={slots} />;
  },
  {
    name: 'InputClear',
    inheritAttrs: false,
    props: {},
  },
) as unknown as InputClearComponent;
