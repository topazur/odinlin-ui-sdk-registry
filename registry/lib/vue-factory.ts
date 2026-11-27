import type { DefineSetupFnComponent } from 'vue';

export declare namespace PrimitiveVue {
  /**
   * @private 内置类型宽松的抽象构造器
   * NOTICE：类型 InstanceType<T> 只要求 T 具备构造签名，所以使用抽象构造器约束即可。
   */
  type Constructor = abstract new (...args: any[]) => any;

  /** @private 获取组件实例上的 emits 类型。 */
  type $emits<T extends Constructor> = InstanceType<T>['$emits'];
  /** @private 获取组件实例上的 slots 及其作用域参数类型。 */
  type $slots<T extends Constructor> = InstanceType<T>['$slots'];
  /** @private 获取组件实例上的 props 类型，NOTICE: 此类型包括 attrs 属性。 */
  type $props<T extends Constructor> = InstanceType<T>['$props'];

  /**
   * 获取运行时声明的 props，排除 HTML fallthrough attrs 和组件实例状态。
   * 原理：先从实例排除非 $ 字段，这一步的结果可能携带实例状态字段；再与 $props 取交集最终得到 PropsKeys。
   */
  export type PropsKeys<T extends Constructor> = Extract<
    keyof $props<T>,
    Exclude<keyof InstanceType<T>, `$${string}`>
  >;
  /** 从 $props 挑选 PropsKeys 字段即是运行时 Props 类型。 */
  export type Props<T extends Constructor, K extends object = {}> = Readonly<
    Pick<$props<T>, PropsKeys<T>> & K
  >;
  /** 从 $props 排除 PropsKeys 字段即是运行时 Attrs 类型。 */
  export type Attrs<T extends Constructor, K extends string = ''> = Readonly<
    Omit<$props<T>, PropsKeys<T> | K>
  >;
  /** 对 $slots 进行包装，可以直接使用 */
  export type Slots<T extends Constructor> = $slots<T>;
  /** 复写 DefineSetupFnComponent 的构造器用于定义包装组件的类型 */
  export type Component<
    T extends Constructor,
    K extends object = $props<T>,
  > = DefineSetupFnComponent<$props<T>, {}, Slots<T>> & {
    new (...args: any[]): { $props: K };
  };
}
