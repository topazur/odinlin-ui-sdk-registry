## 项目依赖

```diff
/**
 * $ pnpm create astro@latest
 */
dependencies:
+ @astrojs/starlight 0.43.1
+ astro 7.4.13
+ sharp 0.35.5 # sharp 是 Astro 默认的图片处理引擎。

/**
 * $ pnpm add oxlint oxfmt -D
 * $ pnpm add typescript@^6.0.3 -D
 */
devDependencies:
+ oxfmt 0.80.0
+ oxlint 1.95.0 # 安装 `tsrs` or `oxlint-tsgolint` 以启用 type-aware linter。
+ typescript 6.0.3

/**
 * $ pnpm add react react-dom react-is @astrojs/react
 * $ npm add @types/react @types/react-dom @types/react-is -D
 * $ pnpm add vue @astrojs/vue
 */
dependencies:
+ @astrojs/react 7.1.9 # 只有显式设置 react({ compiler: true || object }) 才需要把 oxc-transform-react 装为开发依赖
+ react 19.3.1
+ react-dom 19.3.1
+ react-is 19.3.1
devDependencies:
+ @types/react 19.3.0
+ @types/react-dom 19.3.0
+ @types/react-is 19.3.0
dependencies:
+ @astrojs/vue 7.1.6
+ vue 3.5.46
```
