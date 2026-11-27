import type { DefineSetupFnComponent, SlotsType } from 'vue';

export declare namespace VuePrimitive {
  type Constructor = abstract new (...args: any[]) => any;

  /**
   * 获取 Vue 组件的 instance 实例类型。
   * NOTICE：类型 InstanceType<T> 只要求 T 具备构造签名，所以使用抽象构造器约束即可。
   */
  export type $instance<T extends Constructor> = InstanceType<T>;
  /** 获取组件实例上的 emits 类型。 */
  export type $emits<T extends Constructor> = $instance<T>['$emits'];
  /** 获取组件实例上的 slots 及其作用域参数类型。 */
  export type $slots<T extends Constructor> = $instance<T>['$slots'];
  /** 获取组件实例上的 props 类型，NOTICE: 此类型包括 attrs 属性。 */
  export type $props<T extends Constructor> = $instance<T>['$props'];

  /**
   * 获取运行时声明的 props，排除 HTML fallthrough attrs 和组件实例状态。
   * 原理：先从实例排除非 $ 字段，这一步的结果可能携带实例状态字段；再与 $props 取交集最终得到 PropsKeys。
   */
  export type PropsKeys<T extends Constructor> = Extract<
    keyof $props<T>,
    Exclude<keyof $instance<T>, `$${string}`>
  >;
  /** 从 $props 挑选 PropsKeys 字段即是运行时 Props 类型。 */
  export type Props<T extends Constructor> = Readonly<Pick<$props<T>, PropsKeys<T>>>;
  /** 从 $props 排除 PropsKeys 字段即是运行时 Attrs 类型。 */
  export type Attrs<T extends Constructor> = Readonly<Omit<$props<T>, PropsKeys<T>>>;

  /** 对 $slots 进行包装，可以直接使用 */
  export type Slots<T extends Constructor> = SlotsType<$slots<T>>;
  /** 定义包装组件的类型 */
  export type Component<T extends Constructor> = DefineSetupFnComponent<$props<T>, {}, Slots<T>>;

  /** 聚合组件包装所需的组件类型，仅需传递一次泛型。 */
  export type Types<T extends Constructor> = {
    $instance: $instance<T>;
    $emits: $emits<T>;
    $slots: $slots<T>;
    $props: $props<T>;

    PropsKeys: PropsKeys<T>;
    Props: Props<T>;
    Attrs: Attrs<T>;

    Slots: Slots<T>;
    Component: Component<T>;
  };
}
