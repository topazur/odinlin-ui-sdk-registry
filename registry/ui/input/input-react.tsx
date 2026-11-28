import {
  InputClear as InputClearPrimitive,
  InputGroup as InputGroupPrimitive,
  Input as InputPrimitive,
} from '@ui-sdk/react/input';
import * as React from 'react';

export type InputProps = React.ComponentProps<typeof InputPrimitive>;
export type InputGroupProps = React.ComponentProps<typeof InputGroupPrimitive>;
export type InputClearProps = React.ComponentProps<typeof InputClearPrimitive>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function InputRender(props, forwardedRef) {
    return <InputPrimitive {...props} ref={forwardedRef} />;
  },
);

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroupRender(props, forwardedRef) {
    return <InputGroupPrimitive {...props} ref={forwardedRef} />;
  },
);

export const InputClear = React.forwardRef<HTMLButtonElement, InputClearProps>(
  function InputClearRender(props, forwardedRef) {
    return <InputClearPrimitive {...props} ref={forwardedRef} />;
  },
);
