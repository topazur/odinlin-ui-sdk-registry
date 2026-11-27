import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { isPortal } from 'react-is';
import { z } from 'zod/v4';

/**
 * 检查可用作 `children` 的 React 节点。数组会逐项校验，其他可迭代对象和
 * Promise 仅检查外层形态，避免提前消耗迭代器或等待异步结果。
 */
function isReactNode(value: unknown): boolean {
  if (value == null || isValidElement(value) || isPortal(value)) return true;
  if (Array.isArray(value)) return value.every(isReactNode);

  if (typeof value === 'object') {
    return (
      value instanceof Promise ||
      (Symbol.iterator in value && typeof value[Symbol.iterator] === 'function')
    );
  }

  return ['string', 'number', 'bigint', 'boolean'].includes(typeof value);
}

const reactElementSchema = z.custom<ReactElement>(isValidElement);

const reactNodeSchema = z.custom<ReactNode>(isReactNode);

/**
 * 用传入的状态 schema 校验 `useReactPatchSlots` 接收的 `render` 和 `children`。
 * 解析会包装回调，调用包装后的回调时才校验参数和返回值。
 */
export function createReactPatchSlotsSchema<State>(state: z.ZodType<State, State>) {
  // 自定义渲染接收部件属性、当前状态和原有内容，并返回一个 React 元素。
  const renderCallback = z.function({
    input: [
      z.object({
        props: z.record(z.string(), z.any()),
        state,
        children: z.any(),
      }),
    ],
    output: reactElementSchema,
  });

  // 内容回调只接收当前状态，可以返回任意 React 节点。
  const childrenCallback = z.function({
    input: [z.object({ state })],
    output: reactNodeSchema,
  });

  return z.object({
    render: z.union([z.custom<ReactElement<any>>(isValidElement), renderCallback]).optional(),
    children: z.union([childrenCallback, reactNodeSchema]).optional(),
  });
}

const slotsSchema = createReactPatchSlotsSchema(z.object({ disabled: z.boolean() }));

type Slots = z.infer<typeof slotsSchema>;
// 与 UseReactPatchSlotsParameters<{ disabled: boolean }> 一致
