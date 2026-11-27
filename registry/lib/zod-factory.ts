import { z } from 'zod/v4';

/**
 * 用 zod 表示 never 类型
 */
export const zodForbidden = z.never().exactOptional();

/**
 * 用 zod 表示布尔值及其字符串枚举的联合类型
 */
export const zodBooleanAndEnum = z.union([z.boolean(), z.enum(['true', 'false'])]);
