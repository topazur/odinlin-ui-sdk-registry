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

/**
 * $ pnpm add @ui-sdk/core @ui-sdk/react @ui-sdk/vue @openuidev/react-lang @openuidev/vue-lang zod style-to-js
 */
dependencies:
+ @ui-sdk/core 0.1.0-beta.16
+ @ui-sdk/react 0.1.0-beta.16
+ @ui-sdk/vue 0.1.0-beta.16
+ @openuidev/react-lang 1.2.0
+ @openuidev/vue-lang 0.4.2
+ zod 4.6.7
+ style-to-js 2.0.2
```
