import * as React from 'react';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  focusableWhenDisabled?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, forwardedRef) {
    const { focusableWhenDisabled, disabled, ...restProps } = props;
    const mergedDisabled = disabled && focusableWhenDisabled ? false : disabled;
    return <button {...restProps} disabled={mergedDisabled} ref={forwardedRef} />;
  },
);
