/* @jsxImportSource vue */
import type { ComponentRenderProps } from '@openuidev/vue-lang';
import type { ButtonProps } from './stack-vue';

import { BuiltinActionType, defineComponent, useTriggerAction } from '@openuidev/vue-lang';
import { defineComponent as defineVueComponent } from 'vue';
import { z } from 'zod/v4';
import { buttonCustomSchema, buttonSourceSchema } from './stack-props';
import { Button as OpenUIButton } from './stack-vue';

export const buttonSchema = z.object({
  props: buttonSourceSchema.extend(buttonCustomSchema.shape).extend({
    // Keep the callback schema representable in the Vue renderer's JSON Schema.
    onClick: z
      .unknown()
      .refine((value): value is NonNullable<ButtonProps['onClick']> => typeof value === 'function')
      .optional(),
  }),
  slotsAndClassAndStyle: z.any().optional(),
  attrs: z.record(z.string(), z.unknown()).optional(),
  action: z.any().optional(),
});

export const Button = defineComponent({
  name: 'Button',
  description: 'A button with optional content, appearance, attributes, and a click action.',
  props: buttonSchema,
  component: defineVueComponent(
    (parameters: ComponentRenderProps<z.infer<typeof buttonSchema>>) => {
      const triggerAction = useTriggerAction();

      return () => {
        const props = parameters.props?.props;
        const slotsAndClassAndStyle = parameters.props?.slotsAndClassAndStyle as any;
        const attrs = parameters.props?.attrs as any;
        const action = parameters.props?.action;
        // const renderNode = parameters.renderNode;
        const handleClick: ButtonProps['onClick'] = action
          ? (event, details) => {
              const result = props.onClick?.(event, details);
              if (!event.defaultPrevented) {
                const message =
                  action.type === BuiltinActionType.ContinueConversation
                    ? action.message
                    : (event.currentTarget as Element)?.textContent;
                triggerAction(message ?? '', undefined, action);
              }
              return result;
            }
          : props.onClick;

        return (
          <OpenUIButton
            {...attrs}
            {...props}
            v-slot={slotsAndClassAndStyle}
            onClick={handleClick}
          />
        );
      };
    },
    {
      name: 'OpenUIVueButton',
      inheritAttrs: false,
      props: ['props', 'renderNode'],
    },
  ),
});
