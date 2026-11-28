import { z } from 'zod/v4';

/** Serializable options exposed by @ui-sdk/react/input Input. */
export const inputSourceSchema = z
  .object({
    value: z.string(),
    defaultValue: z.string(),
    disabled: z.boolean(),
    readOnly: z.boolean(),
    required: z.boolean(),
    debug: z.boolean(),
  })
  .partial();

export type InputSourceProps = z.input<typeof inputSourceSchema>;

/** Input has no wrapper-only props. */
export const inputCustomSchema = z.object({});
export type InputCustomProps = z.input<typeof inputCustomSchema>;

/** Serializable options exposed by @ui-sdk/react/input InputGroup. */
export const inputGroupSourceSchema = z
  .object({
    debug: z.boolean(),
  })
  .partial();

export type InputGroupSourceProps = z.input<typeof inputGroupSourceSchema>;

/** InputGroup has no wrapper-only props. */
export const inputGroupCustomSchema = z.object({});
export type InputGroupCustomProps = z.input<typeof inputGroupCustomSchema>;

/** InputClear has no serializable source options. */
export const inputClearSourceSchema = z.object({});
export type InputClearSourceProps = z.input<typeof inputClearSourceSchema>;

/** InputClear has no wrapper-only props. */
export const inputClearCustomSchema = z.object({});
export type InputClearCustomProps = z.input<typeof inputClearCustomSchema>;
