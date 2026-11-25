import type { PagesDictionary } from '../../types';

export const zhPages: PagesDictionary = {
  shared: {
    breadcrumbHome: '首页',
    lastUpdatedLabel: '最后更新',
    lastUpdatedDate: '2026-11-25',
    exploreToolsHeading: '探索工具套件',
    relatedPagesHeading: '更多信息与政策',
    openFeedbackBtn: '发送反馈',
    viewMyFeedbackBtn: '我的反馈',
    openGithubBtn: '在 GitHub 查看',
    emailLabel: '支持邮箱',
    copyEmailBtn: '复制邮箱',
    copiedEmailBtn: '已复制邮箱',
    noEmailNotice:
      '当前部署未配置直接支持邮箱。请使用应用内的“发送反馈”弹窗或 GitHub Issues 联系我们。',
    privacyFirstBadge: '100% 客户端本地处理',
  },
  about: {
    navLabel: '关于我们',
    title: '关于 OmniDev IT-Tools',
    metaTitle: '关于 OmniDev IT-Tools — 100% 客户端本地运行的开发者工作区',
    metaDescription:
      '了解 OmniDev IT-Tools：涵盖 7 大套件共 28 款浏览器原生开发者工具，追求极速响应、零数据上传与四语言本地化体验。',
    subtitle:
      '一个隐私优先的单色 Bento 工作区，将 28 款开发、设计、DevOps 与硬件网络诊断实用工具直接带入您的浏览器。',
    keywords: [
      '关于 omnidev',
      '客户端开发者工具',
      '浏览器实用工具',
      '隐私优先 it tools',
      '离线开发工具',
    ],
    sections: [
      {
        heading: '为绝对本地隐私而设计',
        body: '开发者在日常工作中常需要将敏感 JWT、内部配置、SSH/Nginx 片段、哈希值及本地图片粘贴到第三方网页。OmniDev 通过标准 Web API 将所有计算严格保留在浏览器内存中，彻底消除外泄风险。',
        bullets: [
          'HTML5 Canvas 与 Web Crypto API 在本地完成图像格式转换、压缩以及 SHA-1/256/384/512 哈希校验。',
          'JSON、YAML、CSV、正则表达式、JWT、OKLCH、Chmod 与 Cron 引擎均在客户端内存同步执行，零外部 API 请求。',
          '网络测速工具仅访问同源 `/api/speedtest/*` 接口（每次请求 <= 4 MiB），测试数据用后即弃，服务器零留存。',
        ],
      },
      {
        heading: '7 大专业套件 · 28 款实用工具',
        body: '所有工具均整合在响应式 Bento 工作区中，支持全局命令面板搜索（Cmd/Ctrl + K）、收藏置顶、预设保存、URL 状态分享以及英语、越南语、日语和简体中文四语言切换。',
        bullets: [
          '图像处理 (4 款): 图像格式转换、图像压缩、图像转 Base64、SVG 优化器。',
          '文件处理 (4 款): JSON/YAML/CSV 互转、文件哈希与校验、Magic Bytes 检测、文本行对比。',
          '文本处理 (5 款): 命名风格转换、正则测试、JWT 解码、ID 生成器、文本编解码。',
          '色彩处理 (4 款): OKLCH 等色彩空间转换、WCAG 对比度检测、色阶生成、CSS 毛玻璃生成器。',
          '计算工具 (4 款): Chmod 权限矩阵、Cron 表达式解析、Unix 时间戳转换、存储单位与进制计算。',
          '速查表 (3 款): Git & GitHub CLI、HTTP 状态码与请求头、Linux / Docker / 正则速查。',
          '硬件与网络诊断 (4 款): 键盘测试、麦克风测试、扬声器测试、自托管网络测速。',
        ],
      },
      {
        heading: '开放架构与可选云端同步',
        body: '默认情况下，OmniDev 将固定工具、预设、使用计数与反馈记录保存在本地浏览器存储中。当部署维护者接入 Supabase 后，无需注册账号即可同步匿名工作区记录（`user_favorites`、`saved_presets`、`tool_metrics`、`tool_ratings`、`feedback_submissions`）。',
      },
    ],
  },
  help: {
    navLabel: '帮助与常见问题',
    title: '帮助与常见问题',
    metaTitle: '帮助与 FAQ — 键盘、音频、测速与工作区指南 | OmniDev IT-Tools',
    metaDescription:
      'OmniDev IT-Tools 使用指南与故障排查：客户端隐私、键盘捕获模式（Esc × 2）、麦克风 HTTPS 权限、扬声器 35% 安全限幅及同源测速。',
    subtitle:
      '关于浏览器权限控制、硬件诊断功能、本地状态持久化以及工作区快捷键的实用解答。',
    keywords: [
      'omnidev 帮助',
      'it tools 常见问题',
      '键盘捕获模式 esc',
      '麦克风权限 https',
      '扬声器 setsinkid',
      '自托管测速',
    ],
    sections: [
      {
        heading: '快速上手与工作区快捷键',
        body: '在任意页面按下 `Cmd/Ctrl + K` 打开全局命令面板，即可直达全部 28 款工具、20 条 DevOps/Git/HTTP 速查命令以及站点信息页。',
        bullets: [
          '点击任意工具卡片或工作区顶部的星标按钮，即可将其固定到侧边栏与收藏夹抽屉。',
          '在工具内部使用“保存预设”，可将常用参数保存至本地（或已配置的 Supabase）。',
          '使用“分享状态”可将当前工具输入编码为 `?state=` 链接，方便团队共享复现。',
        ],
      },
      {
        heading: '硬件与网络诊断注意事项',
        body: '硬件与网络诊断依赖现代浏览器 Web API，在访问本地音频输入输出设备前可能会请求一次性的浏览器权限确认。',
        bullets: [
          '键盘测试：开启“捕获模式”可在测试按键时拦截 Cmd/Ctrl+K 或 F5 等快捷键；连续快速按两次 `Esc` 或点击“解锁”按钮即可退出。',
          '麦克风测试：要求安全上下文（`https://` 或 `http://localhost`）及明确的麦克风授权，所有音频流绝不会上传至服务器。',
          '扬声器测试：默认启用保护听力的 `35%` 主音量安全上限，并在 Chromium 内核浏览器中支持通过 `setSinkId` 切换音频输出设备。',
        ],
      },
    ],
    faqs: [
      {
        question: '我的数据真的完全在客户端处理、不会上传到服务器吗？',
        answer:
          '是的。全部 24 款转换、文件、文本、色彩、计算与速查工具，以及键盘、麦克风和扬声器诊断均仅通过 Web Crypto、HTML5 Canvas、Web Audio 与 MediaRecorder API 在浏览器内存中运行。仅可选的网络测速工具会与同源 `/api/speedtest/*` 接口交互临时的伪随机字节流。',
      },
      {
        question: '如何退出键盘测试中的“键盘捕获模式”？',
        answer:
          '开启键盘捕获模式后，Tab、F5、Cmd/Ctrl+K 等浏览器快捷键会被拦截以便完整检测每一颗轴体。您只需在短时间内连续按两次 `Esc`（`Esc × 2`）或点击页面上的解锁按钮，即可立即恢复正常浏览器按键行为。',
      },
      {
        question: '为什么麦克风测试需要 HTTPS 或麦克风授权？',
        answer:
          '出于硬件隐私保护，浏览器仅允许在安全上下文（`https://` 或 `localhost`）中调用 `navigator.mediaDevices.getUserMedia`。授权后，OmniDev 仅在本地绘制实时波形、频谱与回放测试录音，绝不上传任何音频流。',
      },
      {
        question: '扬声器测试的输出切换（`setSinkId`）和 35% 限幅是如何工作的？',
        answer:
          '为避免测试音、扫频或噪声突发损伤听力或耳机，OmniDev 默认将主增益限制在安全的 `35%` 上限内。在支持 `HTMLMediaElement.setSinkId` 的浏览器（如 Chrome/Edge）中，您还可以直接选择目标音频输出设备。',
      },
      {
        question: '不依赖第三方服务器的自托管测速是如何工作的？',
        answer:
          '测速工具仅针对同源的 `/api/speedtest/ping`、`/api/speedtest/download` 与 `/api/speedtest/upload` 测量延迟、抖动与上下行吞吐量。单次探测载荷严格限制在 `<= 4 MiB`（`4,194,304` 字节）以内，在内存中即时生成并丢弃，服务器零留存。',
      },
      {
        question: '切换显示语言会丢失当前工具中输入的内容吗？',
        answer:
          '不会。在跳转至新语言路由（`en`、`vi`、`ja`、`zh`）之前，ToolWorkspace 会自动将当前状态暂存至 `sessionStorage` 草稿（`omnidev:draft:<toolId>`），并在页面切换完成后自动恢复。',
      },
    ],
  },
  privacy: {
    navLabel: '隐私政策',
    title: '隐私政策',
    metaTitle: '隐私政策 — 本地执行、Cookie 与 Cloudflare Web Analytics | OmniDev IT-Tools',
    metaDescription:
      'OmniDev IT-Tools 透明隐私声明：28 款工具 100% 客户端运行、localStorage 与 sessionStorage 存储清单、必要 Cookie omnidev_locale、可选无 Cookie Cloudflare Web Analytics 及 Supabase 同步。',
    subtitle:
      '清晰说明哪些数据仅留在浏览器内存中、哪些保存在本地存储中，以及可选的无 Cookie 性能统计如何工作。',
    keywords: [
      'omnidev 隐私政策',
      '客户端隐私',
      'localstorage 键名',
      'omnidev_locale cookie',
      'cloudflare web analytics 无 cookie',
    ],
    sections: [
      {
        heading: '100% 客户端本地执行与零载荷追踪',
        body: 'OmniDev 不嵌入广告追踪器、跨站画像脚本或载荷上传日志。全部 28 款工具均在您的本地浏览器运行时中执行——您粘贴或加载的内容（JWT 令牌、哈希、正则、图片、JSON/YAML/CSV 文件、麦克风音频）绝不会离开您的设备。',
      },
      {
        heading: '浏览器存储（`localStorage` 与 `sessionStorage`）',
        body: '为了在无需注册账号的情况下保存您的工作区偏好与临时草稿，OmniDev 仅在本地浏览器存储中读写以下键名：',
        bullets: [
          '`localStorage`: `omnidev_client_id`, `omnidev_theme`, `omnidev_locale`, `omnidev_favorites`, `omnidev_pinned_snippets`, `omnidev_presets`, `omnidev_metrics`, `omnidev_speedtest_history`, `omnidev_tool_ratings`, `omnidev_feedback_submissions`, `omnidev_feedback_last_submit_at`，以及 `omnidev_admin_supabase_auth`（仅管理员审核台使用）。',
          '`sessionStorage`: 在切换显示语言前生成的临时草稿 `omnidev:draft:<toolId>`，确保跨语言跳转后工作进度不丢失。',
        ],
      },
      {
        heading: '唯一严格必要的 Cookie（`omnidev_locale`）',
        body: 'OmniDev 仅写入一个严格必要的第一方 Cookie（`omnidev_locale`，`SameSite=Lax`，有效期 1 年），用于在 SSR 与代理路由解析时记住您选择的显示语言（`en`、`vi`、`ja`、`zh`）。绝不使用任何广告或跨站追踪 Cookie。',
      },
      {
        heading: '可选 Cloudflare Web Analytics（页面浏览量与 Core Web Vitals）',
        body: '在配置了 `NEXT_PUBLIC_CF_BEACON_TOKEN`（或启用 Cloudflare Automatic Setup）的托管部署环境中，OmniDev 可能会加载 Cloudflare Web Analytics（`static.cloudflareinsights.com/beacon.min.js`）以统计汇总页面浏览量及 Core Web Vitals 性能指标（`LCP`、`INP`、`CLS`、`FCP`、`TTFB`）。在本地开发或未配置的自托管实例中默认完全关闭。',
        bullets: [
          '100% 无 Cookie 与零指纹追踪：Cloudflare Web Analytics 不设置任何 Cookie，不读写 `localStorage`，也不通过 IP 或 User-Agent 进行跨站指纹追踪。',
          '仅统计脱敏路径：仅采集汇总的页面访问次数与 Web Vitals 性能指标，绝不会读取 `?state=` 等查询参数或哈希片段中的工具输入数据。',
          '排除管理后台与根级兜底错误页：手动信标脚本会自动跳过 `/admin` 与 `/{locale}/admin/*` 路由，以及非语言前缀的根级 404 兜底页面（`global-not-found`）。',
        ],
      },
      {
        heading: '可选 Supabase 同步、反馈与测速接口',
        body: '当部署方配置了 Supabase 环境变量时，OmniDev 会以随机生成的 `omnidev_client_id` 为标识同步匿名工作区记录（`user_favorites`、`saved_presets`、`tool_metrics`、`tool_ratings`、`feedback_submissions`）。',
        bullets: [
          '反馈弹窗：联系邮箱与诊断上下文均为严格可选（opt-in）；诊断上下文会自动剥离 `?state=` 查询参数与 `#hash` 片段，绝不附带敏感工具输入。',
          '网络测速（`/api/speedtest/*`）：校验同源请求头并在内存中流式收发及丢弃 `<= 4 MiB` 的临时缓冲区，不记录日志也不落盘保存。',
        ],
      },
    ],
  },
  terms: {
    navLabel: '使用条款',
    title: '使用条款',
    metaTitle: '使用条款 — 开源工具与免责声明 | OmniDev IT-Tools',
    metaDescription:
      'OmniDev IT-Tools 使用条款：许可范围、客户端计算结果免责声明、音频硬件安全提示及同源测速接口合理使用限制。',
    subtitle:
      '关于使用 OmniDev 浏览器实用工具、硬件诊断模块及自托管接口的简洁明了条款。',
    keywords: [
      'omnidev 使用条款',
      '开发者工具免责声明',
      '开源协议',
      '测速合理使用',
    ],
    sections: [
      {
        heading: '1. 开源许可与允许用途',
        body: 'OmniDev IT-Tools 作为免费开源的开发者工具套件提供，可用于个人学习、教学演示及商业研发工作流。您可依据代码仓库许可协议自由查阅、自托管和二次定制。',
      },
      {
        heading: '2. 准确性与“按原样”免责声明',
        body: '所有工具与计算结果均“按原样”（AS IS）提供，不作任何明示或默示担保。在用于生产环境前，请务必独立核验加密校验值、文件权限（`chmod`）、Cron 定时计划、色彩对比度合规性及安全令牌。',
      },
      {
        heading: '3. 音频硬件安全与设备权限',
        body: '扬声器测试内置默认的 `35%` 安全音量限幅以保护听力，但在调高增益或播放高频扫频信号前，您仍需自行确认外接功放、监听音箱或耳机的物理音量设置。',
      },
      {
        heading: '4. 同源测速接口的合理使用',
        body: '`/api/speedtest/ping`、`/api/speedtest/download` 与 `/api/speedtest/upload` 接口仅限同源浏览器会话调用，单次测试载荷上限为 `<= 4 MiB`。禁止对公共托管实例实施自动化爬取、跨站盗链或恶意带宽消耗行为。',
      },
    ],
  },
  contact: {
    navLabel: '联系我们',
    title: '联系与社区支持',
    metaTitle: '联系我们与 Bug 报告 — 反馈弹窗、GitHub 与支持 | OmniDev IT-Tools',
    metaDescription:
      '联系 OmniDev IT-Tools 维护团队：通过应用内反馈弹窗提交 Bug 报告或功能建议、前往 GitHub 提 Issue 或通过支持邮箱联系。',
    subtitle:
      '发现了边界 Bug、翻译瑕疵，或者对第 29 款工具有好点子？欢迎通过最适合您的渠道联系我们。',
    keywords: [
      '联系 omnidev',
      '提交 bug it tools',
      '功能建议 omnidev',
      'github issues',
    ],
    sections: [
      {
        heading: '报告 Bug 的最快方式',
        body: '建议直接使用应用内置的反馈弹窗，您不仅可以直接关联具体工具 ID，还可以按需附带已脱敏的诊断上下文（语言、主题、视口尺寸及不含 `?state=` 的干净路由路径）。',
        bullets: [
          '在“我的反馈”标签页中随时查看处理状态（`待处理`、`处理中`、`已解决`、`已关闭`）及维护者回复。',
          '如需参与开源贡献、提交 Pull Request 或提供可复现测试用例，请在 GitHub 仓库提交 Issue。',
        ],
      },
    ],
    channelsHeading: '支持与协作渠道',
    feedbackCardTitle: '应用内反馈与问题追踪',
    feedbackCardDesc:
      '直接在此提交 Bug 报告、功能建议或常规反馈，并实时查看维护者的回复与进度。',
    githubCardTitle: 'GitHub 代码仓库与 Issues',
    githubCardDesc:
      '浏览项目源码与 AI-DLC 设计文档，或提交可复现的 Bug Issue 与 Pull Request。',
    emailCardTitle: '直接支持邮箱',
    emailCardDesc:
      '当当前部署实例配置了公开支持邮箱时，可通过电子邮件直接联系维护团队。',
  },
};
