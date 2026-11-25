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
```
