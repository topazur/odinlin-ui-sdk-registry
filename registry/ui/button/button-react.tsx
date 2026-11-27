import type { ButtonCustomProps } from './button-props';

import { Button as ButtonPrimitive } from '@ui-sdk/react/button';
import * as React from 'react';

export interface ButtonProps
  extends Omit<React.ComponentProps<typeof ButtonPrimitive>, 'color'>, ButtonCustomProps {}

/**
 * @title 包装 `@ui-sdk/react/button` 组件
 * 1. 属性 `color` 既是 HTML 属性，也是 Button 的 prop。需手动 Omit 排除 HTML 属性。
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function ButtonRender(props, forwardedRef) {
    const {
      variant = 'solid',
      color = 'default',
      size = 'medium',
      shape = 'default',
      block,
      ...restProps
    } = props;
    console.log('TODO:React ', { variant, color, size, shape, block }, props);
    return <ButtonPrimitive {...restProps} ref={forwardedRef} />;
  },
);
