import * as React from 'react';

export interface StackProps extends React.ComponentProps<'div'> {}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  function StackRender(props, forwardedRef) {
    const { ...restProps } = props;
    return <div {...restProps} ref={forwardedRef} />;
  },
);
