import type { ActionPlan, ComponentRenderProps } from '@openuidev/react-lang';
import type { ButtonProps } from './stack-react';

import { action, defineComponent, useTriggerAction } from '@openuidev/react-lang';
import * as React from 'react';
import { z } from 'zod/v4';
import { buttonCustomSchema, buttonSourceSchema } from './stack-props';
import { Button as OpenUIButton } from './stack-react';

export const buttonSchema = z.object({
  props: buttonSourceSchema.extend(buttonCustomSchema.shape).extend({
    onClick: z.custom<ButtonProps['onClick']>((value) => typeof value === 'function').optional(),
  }),
  slotsAndClassAndStyle: z.any().optional(),
  attrs: z.record(z.string(), z.unknown()).optional(),
  action: action().optional(),
});

export const Button = defineComponent({
  name: 'Button',
  description: 'A button with optional content, appearance, attributes, and a click action.',
  props: buttonSchema,
  component: function OpenUIReactButton(
    parameters: ComponentRenderProps<z.infer<typeof buttonSchema>>,
  ) {
    const props = parameters.props?.props;
    const slotsAndClassAndStyle = parameters.props?.slotsAndClassAndStyle as any;
    const attrs = parameters.props?.attrs as any;
    const action = parameters.props?.action as ActionPlan | undefined;
    // const renderNode = parameters.renderNode;
    const triggerAction = useTriggerAction();

    const handleClick: ButtonProps['onClick'] = action
      ? (event, details) => {
          const result = props.onClick?.(event, details);
          if (!event.defaultPrevented) {
            const message = (event.currentTarget as Element)?.textContent;
            triggerAction(message ?? '', undefined, action);
          }
          return result;
        }
      : props.onClick;

    return <OpenUIButton {...attrs} {...props} {...slotsAndClassAndStyle} onClick={handleClick} />;
  },
});
