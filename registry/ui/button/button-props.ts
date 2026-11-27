import type { ComponentObjectPropsOptions, PropType } from 'vue';

import { z } from 'zod/v4';

/***************************************************************************************************/
/**************************************** buttonSource *********************************************/
/***************************************************************************************************/

/**
 * import('@ui-sdk/react/button').ButtonOptions
 */
export const buttonSourceSchema = z
  .object({
    disabled: z.boolean(),
    focusableWhenDisabled: z.boolean(),
    type: z.enum(['button', 'submit', 'reset']),
    pendingAnnouncement: z.string(),
    debug: z.boolean(),
  })
  .partial();

/**
 * 类型通过 z.input 从 schema 推导。
 */
export type ButtonSourceProps = NonNullable<z.input<typeof buttonSourceSchema>>;

/***************************************************************************************************/
/**************************************** buttonCustom *********************************************/
/***************************************************************************************************/

/**
 * 自定义属性的 zod 对象
 */
export const buttonCustomSchema = z
  .object({
    variant: z.enum(['solid', 'outlined', 'dashed', 'filled', 'text', 'link']),
    color: z.enum(['default', 'primary', 'info', 'success', 'warning', 'error']),
    size: z.enum(['small', 'medium', 'large']),
    shape: z.enum(['default', 'circle', 'round']),
    block: z.boolean(),
  })
  .partial();

/**
 * 类型通过 z.input 从 schema 推导。
 */
export type ButtonCustomProps = NonNullable<z.input<typeof buttonCustomSchema>>;

/**
 * zod safeParse
 * @param key
 * @param value
 * @returns {boolean} 是否满足约束
 */
function buttonCustomValidator(
  key: keyof typeof buttonCustomSchema.shape,
  value: unknown,
): boolean {
  return buttonCustomSchema.shape[key].safeParse(value).success;
}

/**
 * Vue 的运行时 props 对象逐项硬编码声明。
 */
export const buttonCustomVueProps = {
  variant: {
    type: String as PropType<ButtonCustomProps['variant']>,
    validator: (value: unknown) => buttonCustomValidator('variant', value),
  },
  color: {
    type: String as PropType<ButtonCustomProps['color']>,
    validator: (value: unknown) => buttonCustomValidator('color', value),
  },
  size: {
    type: String as PropType<ButtonCustomProps['size']>,
    validator: (value: unknown) => buttonCustomValidator('size', value),
  },
  shape: {
    type: String as PropType<ButtonCustomProps['shape']>,
    validator: (value: unknown) => buttonCustomValidator('shape', value),
  },
  block: { type: Boolean, default: undefined },
} satisfies Required<ComponentObjectPropsOptions<ButtonCustomProps>>;
