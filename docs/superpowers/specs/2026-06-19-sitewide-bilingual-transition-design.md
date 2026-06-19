# Sitewide Bilingual Transition Design

## Objective

在 `/Users/cherry_xiao/Developer/xiao12-top` 为整个前台站点补一套真实可用的中英文切换系统，而不是只加一个语言按钮。目标是：

- 所有公开页面都支持 `en / zh` 双语切换
- 切换体验采用已确认的 `B` 方向：先收紧旧语言，再展开新语言
- 动效按区域接力，而不是整页一次性同步切换
- Header 里的语言入口保持紧凑，使用带滑块的 `EN / 中` 控件

这次要解决的是“整站内容和字形系统如何切换”，不是单个按钮的装饰动画。

## Confirmed Scope

本轮包含这些页面和模板：

- `/`
- `/about`
- `/articles`
- `/articles/[slug]`
- `/projects`
- `/projects/[slug]`
- `/services`
- `/services/[slug]`
- `not-found`
- 全站 header / mobile menu / footer / metadata 文案

本轮要求所有上述页面都能在同一套语言状态下切换，不保留“只有首页双语，详情页后补”的中间态。

## Out of Scope

本轮明确不做：

- 第三种以上语言
- 基于浏览器语言的自动重定向
- 路径级国际化，例如 `/zh/articles/...`
- 中文与英文使用完全不同的 URL slug
- 真正的 `font-family` morph
- 为每个页面做不同的特效节奏

这轮先把“一个站、两种语言、一套稳定切换机制”做扎实。

## Final UX Decisions

### 1. Language Model

全站语言状态只允许两个值：

- `en`
- `zh`

用户显式切换后，站点应记住最后一次选择，并在后续页面访问中延续该选择。

### 2. Toggle Placement

- Desktop：放在 header 导航最右侧，紧挨 `Contact`
- Mobile：放在 mobile menu 顶部或第一屏可见区域，不藏到更深层

### 3. Toggle Visual

语言控件采用紧凑版 segmented toggle：

- 文案固定显示为 `EN / 中`
- 中间保留斜杠 `/`
- 有一个可横向移动的滑块表示当前语言
- 整体尺寸要更接近“header 辅助控制”，而不是独立 CTA 按钮

### 4. Transition Direction

最终动效采用 `B + sectional stagger`：

- 保留 `B` 的 typographic breathing
- 不做整页同时切换
- 改为区域接力切换

区域顺序固定为：

1. Header
2. Hero / page header
3. Main content column
4. Secondary content column / side content

如果某个页面没有双列结构，则按页面实际区块顺序接力，例如：

1. Header
2. Page intro
3. Main body
4. Footer or trailing callout

## Motion Spec

### Core Illusion

由于 `font-family` 本身是离散切换，不适合直接作为“丝滑变形”的主手段，这次采用视觉错觉方案：

- 旧语言先轻微收紧
- 旧语言略微上提、变窄、轻失焦
- 新语言从轻微下沉或放松的状态进入
- 新语言在自己的字重、字宽和节奏上稳定落下

### Per-Region Motion

每个区域独立完成一次语言交接，使用以下组合：

- `opacity`
- `transform`
- `filter: blur()`
- `letter-spacing`
- 可选的 `font-variation-settings` 或等价字重/字宽调整

视觉原则：

- 英文切出时更偏收紧、变窄、轻一点
- 中文切入时更偏稳、略宽、略厚一点
- 不做强烈旋转、翻牌或大幅位移

### Timing

建议默认时序：

- 单个区域切换时长：`380ms - 520ms`
- 区域之间延迟：`70ms - 110ms`
- 整页总感知时长：控制在 `650ms - 900ms`

目标是让用户感到“站点呼吸了一次”，而不是“看了一段转场动画”。

## Information and Content Architecture

### Locale Source of Truth

语言状态需要同时存在于：

- 当前客户端状态
- 可持久化存储
- 服务端可读入口

设计上采用：

- URL query：`?lang=en` 或 `?lang=zh`
- cookie：用于后续页面访问保持语言连续性

原因：

1. query 能让当前页面切换具有显式状态，便于刷新和分享
2. cookie 能让服务端在新请求时拿到当前语言
3. 这比仅依赖 localStorage 更适合服务端渲染页面

### URL Rule

- 站点默认语言不隐藏在“无状态假设”里
- 当前语言切换时，同步更新当前 URL 的 `lang` query
- 默认建议首轮也显式保留 `lang`，避免 SSR / hydration 对语言来源理解不一致

## Content Strategy

### Site-Level Copy

站点壳层文案改造成 locale dictionary，包括：

- navigation
- footer links
- hero subtitle
- hero meta
- stats labels / notes
- quote
- contact
- list page header copy
- 404 copy

这部分不再用单份 `siteContent` 字符串直接硬写死，而是改为按 locale 取值。

### About Page

`about` 由单份正文改成双语正文来源。要求：

- 英文和中文都可独立编辑
- 同一路由下按当前语言读取对应正文

### Collection Content

文章、项目、服务三类内容全部改成“双份正文 + 同一 slug”的组织方式。

设计约束：

- 同一条内容在中英两种语言下保持同一路由 slug
- 这样语言切换时不需要额外跳到另一条 slug
- 中文详情页允许先沿用英文 slug，以换取整套机制更稳定

推荐内容组织方式：

```text
src/content/
  articles/
    article-01.en.mdx
    article-01.zh.mdx
  projects/
    project-01.en.mdx
    project-01.zh.mdx
  services/
    service-01.en.mdx
    service-01.zh.mdx
```

每对文件共享：

- `slug`
- `translationKey`
- `cover` 等可共用资产

每种语言独立拥有：

- `title`
- `summary`
- `body`
- 可能不同的 metadata 文案

### Loader Rule

内容读取层必须显式接收 `locale` 参数。所有页面数据读取都从：

- `collection`
- `slug`
- `locale`

三元组出发，而不是先拿默认语言再在组件里补判断。

## Rendering Architecture

### Locale Resolution

需要一个统一 locale resolver，按以下优先级决定当前语言：

1. 当前 URL 的 `lang`
2. 持久化 cookie
3. fallback 默认值 `en`

resolver 应被：

- App Router 页面
- metadata 生成函数
- header / mobile menu
- list/detail loader

共同复用。

### Server and Client Boundary

切换行为本身是 client-side 交互，但内容来源仍以服务端页面为准。

建议分层：

- Server：根据 locale 读取对应文案和内容
- Client：负责点击 toggle、触发 view transition、更新 URL / cookie、发起 refresh 或 navigation

不要把整站真实内容都下沉到纯客户端状态，否则会把内容层、SEO 和 hydration 复杂度一起拉高。

### Route Behavior

切换语言时，用户仍停留在同一路由语义上：

- 首页切首页
- 列表页切同一列表页
- 详情页切同一 slug 的另一语言正文

如果对应语言内容缺失：

- 开发阶段：直接报出明确缺失错误，方便补内容
- 线上策略：可退回默认语言，但本轮 seed 内容应尽量补齐，不依赖兜底

## Component Map

这轮预计会影响这些模块：

- `src/components/layout/SiteHeader.tsx`
- `src/components/layout/MobileMenu.tsx`
- `src/components/layout/SiteFooter.tsx`
- `src/content/site.ts`
- `src/lib/content/loaders.ts`
- `src/lib/content/selectors.ts`
- `src/lib/content/schemas.ts`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/about/page.tsx`
- `src/app/articles/page.tsx`
- `src/app/articles/[slug]/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/projects/[slug]/page.tsx`
- `src/app/services/page.tsx`
- `src/app/services/[slug]/page.tsx`
- `src/app/not-found.tsx`
- `src/app/globals.css`

新增模块建议：

- `src/lib/i18n/resolve-locale.ts`
- `src/lib/i18n/locale-cookie.ts`
- `src/components/layout/LanguageToggle.tsx`
- `src/components/transition/LocaleTransitionProvider.tsx`

## Accessibility

语言切换控件必须满足：

- 是真实按钮，不是纯 div
- 有可读的 `aria-label`
- 当前语言状态可被辅助技术识别
- 键盘可触发

动画需满足：

- 尊重 `prefers-reduced-motion`
- reduced motion 下保留语言切换，但明显降低位移和模糊

## Styling Constraints

这次切换要像“版式和字形系统在换语气”，不是像营销页 micro-interaction。

因此：

- 按钮尺寸偏小
- 动画偏短
- 模糊和位移都要克制
- 不使用高饱和色块
- 不做强烈 bounce、flip、overshoot

## Testing and Verification

### Automated

至少需要覆盖：

- locale resolver 优先级
- loader 在不同 locale 下读取正确内容
- 缺失 locale 内容时的报错或兜底行为
- toggle 触发后 URL / cookie 更新

### Manual

手工验证至少覆盖：

1. Desktop 首页切换
2. Mobile menu 内切换
3. 列表页切换后标题、摘要、导航一致变化
4. 详情页切换后正文语言正确变化
5. 刷新当前页后语言保持
6. 从一个页面跳到另一个页面后语言保持
7. `prefers-reduced-motion` 下切换不过度运动

## Risks

### 1. Content Surface Expansion

全站双语意味着每一条内容都需要双份 seed。真正的工程量不在按钮，而在内容面。

### 2. Server / Client Drift

如果客户端语言状态和服务端内容来源不统一，最容易出现 hydration 不一致或切换后闪回默认语言。

### 3. Over-animated Feel

如果分区切换延迟过长，站点会显得“在表演”。因此动效要像结构变化，不像展示特效。

## Implementation Decision Summary

这次实现前先把以下决策锁死：

- 全站都做双语，不只首页
- 使用 `B` 方案作为主视觉逻辑
- 但切换节奏改成分区域接力，不做整页同步
- 按钮用紧凑的 `EN / 中` 滑块控件
- 语言状态由 `query + cookie` 共同承载
- 内容按 `locale` 显式读取，不依赖组件层硬判断
- 同一路由 slug 在中英文下保持一致

## Success Criteria

如果以下条件全部满足，就认为这轮设计达标：

- 任一公开页面都能切换到另一种语言
- 切换后内容、导航、页头和正文语言一致
- 页面刷新和页面跳转不会丢语言
- 动效呈现为“按区域接力的字形呼吸”，不是整页同时淡入淡出
- Header 里的语言控件紧凑，不破坏导航气质
