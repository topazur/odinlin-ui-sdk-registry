import type { PartProps } from '@ui-sdk/react/primitive';

import * as React from 'react';

export interface ReactPrimitive {
  /** Class names, or a function of the part's state that returns them. */
  className?: string;
  /** Styles, or a function of the part's state that returns them. */
  style?: React.CSSProperties;
}

export interface UseReactPatchSlotsParameters<State = {}> {
  /** Renders your own element: one that receives the part's props, or a function of the props and the state. */
  render?:
    | React.ReactElement<any>
    | ((scope: { props: Record<string, any>; state: State; children: any }) => React.ReactElement);
  /** Content, or a function of the part's state that returns it. */
  children?: React.ReactNode | ((scope: { state: State }) => React.ReactNode);
}

export type UseReactPatchSlotsReturnValue<State = {}> = Pick<
  PartProps<'button', State>,
  'render' | 'children'
>;

/**
 * 为了与 Vue Slots 参数保持一致
 * @param parameters
 * @returns
 */
export function useReactPatchSlots<State = {}>(
  parameters: UseReactPatchSlotsParameters<State>,
): UseReactPatchSlotsReturnValue<State> {
  const { children: childrenProp, render: renderProp } = parameters;

  return React.useMemo(() => {
    const temp: UseReactPatchSlotsReturnValue<State> = {};

    if (typeof childrenProp === 'function') {
      temp.children = (state) => childrenProp({ state });
    } else {
      temp.children = childrenProp;
    }

    if (typeof renderProp === 'function') {
      temp.render = (props, state) => {
        const { children: content, ...partProps } = props;
        return renderProp({ props: partProps, state, children: content });
      };
    } else {
      temp.render = renderProp;
    }

    return temp;
  }, [childrenProp, renderProp]);
}
