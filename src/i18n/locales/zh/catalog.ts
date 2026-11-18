import type { CatalogDictionary } from '../../types';

export const zhCatalog: CatalogDictionary = {
  categories: {
    image: {
      name: '图像处理',
      tagline: 'Canvas 格式转换、压缩、Data URL 与 SVG 优化',
      description:
        '直接在浏览器内存中完成图片格式转换、压缩、Base64 Data URL 编码以及 SVG 矢量精简，零上传延迟。',
      seoTitle: '浏览器原生图像工具 — 转换、压缩、Base64 与 SVG 优化',
      seoDescription:
        '基于 HTML5 Canvas 100% 本地运行的隐私优先图片格式转换、压缩、Base64 编码和 SVG 优化工具。',
    },
    file: {
      name: '文件处理',
      tagline: 'JSON/YAML/CSV 转换、SHA 校验、Magic Bytes 检测与 Diff 对比',
      description:
        '转换结构化数据、通过 Web Crypto 验证 SHA-1/256/384/512 校验和、解析二进制 Magic Bytes 并进行并排文本差异对比。',
      seoTitle: '开发者文件工具 — JSON/YAML/CSV、SHA-256、Magic Bytes 与 Diff',
      seoDescription:
        '本地转换 JSON、YAML 和 CSV，计算 Web Crypto 文件哈希，检测 MIME Magic Bytes 并对比文本差异。',
    },
    text: {
      name: '文本处理',
      tagline: '命名风格转换、正则测试、JWT 解码、ID 生成与编解码',
      description:
        '批量转换变量命名风格、调试带捕获组的正则表达式、解码 JWT 声明、生成 UUID/ULID/NanoID 以及编码字符串。',
      seoTitle: '开发者文本工具 — 命名转换、正则测试、JWT 解码、UUID 与 Base64',
      seoDescription:
        '客户端文本实用工具：命名规范转换、实时正则测试、JWT 载荷检查、UUID/ULID 生成和 Base64/URL/HTML 编解码。',
    },
    color: {
      name: '色彩与 CSS',
      tagline: 'HEX/RGB/HSL/OKLCH 转换、WCAG 对比度、色调阶梯与毛玻璃 CSS',
      description:
        '转换包含 OKLCH 在内的感知色彩空间、检测 WCAG 2.1 AA/AAA 对比度、生成 50–950 色阶并调试 CSS 毛玻璃效果。',
      seoTitle: 'UI 色彩与 CSS 工具 — OKLCH 转换、WCAG 对比度与 Glassmorphism',
      seoDescription:
        '转换 HEX、RGB、HSL 与 OKLCH 颜色，检测 WCAG 对比度，构建 50–950 色阶并生成 Bento 毛玻璃卡片 CSS。',
    },
    calculators: {
      name: '计算工具',
      tagline: 'Chmod 权限矩阵、Cron 表达式、Unix 时间戳、字节与进制转换',
      description:
        '计算 Unix chmod 八进制权限、解析 5 字段 Cron 计划任务、跨时区转换 Epoch 时间戳并换算 IEC/SI 字节与进制。',
      seoTitle: '开发者计算器 — Chmod、Cron 解析、时间戳与字节换算',
      seoDescription:
        '交互式 chmod 权限矩阵、带下次运行时间的 Cron 解析器、Unix 时间戳转换器以及 IEC/SI 字节与大整数进制计算器。',
    },
    cheatsheets: {
      name: '速查手册',
      tagline: '可检索的 Git、HTTP 状态码、正则、Linux 与 Docker 卡片',
      description:
        '支持即时过滤与一键复制的 Bento 速查面板，涵盖 Git/GitHub CLI、HTTP 状态码与请求头及 DevOps/Docker/Regex 模式。',
      seoTitle: '开发者速查手册 — Git CLI、HTTP 状态码、Linux 与 Docker',
      seoDescription:
        '支持快速过滤、一键复制与片段固定的 Git、HTTP 状态码、Linux、Docker 与正则表达式速查表。',
    },
  },
  tools: {
    'image-converter': {
      name: '图片格式转换器',
      shortDescription: '通过 HTML5 Canvas 离线转换 PNG、JPEG 和 WebP 图片。',
      longDescription:
        '拖放或选择光栅图像，在 PNG、JPEG 和 WebP 之间无缝转码，支持自定义压缩质量并实时对比文件大小。',
      keywords: ['png', 'jpg', 'jpeg', 'webp', '转换', 'canvas', '图片格式'],
      howItWorks: [
        '通过 FileReader / Object URL 在本地读取所选图片，不接触任何服务器。',
        '将解码后的位图以完整分辨率绘制到离屏 HTML5 Canvas 元素中。',
        '按可选压缩质量将画布缓冲区导出为 PNG、JPEG 或 WebP 格式。',
      ],
      faqs: [
        {
          question: '图片会上传到云服务器进行转换吗？',
          answer: '不会。所有解码和编码操作均通过 HTML5 Canvas API 严格在浏览器本地完成。',
        },
        {
          question: '哪些输出格式支持透明通道？',
          answer: 'PNG 和 WebP 可保留 Alpha 透明通道；JPEG 会使用纯色背景填充透明像素。',
        },
      ],
    },
    'image-compressor': {
      name: '图片压缩与缩放器',
      shortDescription: '调整尺寸并压缩体积，实时预览字节变化。',
      longDescription:
        '支持锁定宽高比调整图像尺寸，调节有损压缩质量，并在下载前精确查看节省的字节百分比。',
      keywords: ['压缩', '调整大小', '优化', '瘦身', '宽高比', 'webp', 'jpeg'],
      howItWorks: [
        '解析原始像素尺寸并按比例计算目标宽度和高度。',
        '使用 Canvas 2D 高质量插值算法平滑重采样图像。',
        '对比原始字节数与压缩后 Blob 大小，精确报告节省百分比。',
      ],
      faqs: [
        {
          question: '锁定宽高比如何工作？',
          answer: '开启锁定后，修改宽度或高度中的任意一项都会按原图比例自动重新计算另一项。',
        },
        {
          question: 'Web 资源推荐使用多高的压缩质量？',
          answer: 'WebP 或 JPEG 在 0.78–0.85 质量下通常可减少 60–80% 体积且几乎无肉眼可见失真。',
        },
      ],
    },
    'image-base64': {
      name: '图片转 Base64 / Data URL',
      shortDescription: '将图片编码为 Base64 字符串、CSS url() 或 HTML <img> 标签。',
      longDescription:
        '将任意图片文件转换为可直接粘贴的 Data URL、纯 Base64 字符串、CSS 背景代码或内联 HTML img 标签。',
      keywords: ['base64', 'data url', 'data uri', '内联图片', 'css url'],
      howItWorks: [
        '完全在浏览器内通过 FileReader.readAsDataURL 读取图片二进制字节。',
        '提取 MIME 类型、字节大小和 Base64 载荷以便即时复制。',
        '自动生成格式化 Data URL、CSS background-image 和 HTML <img> 代码片段。',
      ],
      faqs: [
        {
          question: '什么时候适合将图片内联为 Base64？',
          answer: '小于 ~10 KB 的小图标、Favicon 或邮件模板使用内联可有效减少 HTTP 请求次数。',
        },
        {
          question: 'Base64 编码会增大数据体积吗？',
          answer: '是的，与原始二进制文件相比，Base64 编码会增加约 33% 的体积开销。',
        },
      ],
    },
    'svg-optimizer': {
      name: 'SVG 优化与预览器',
      shortDescription: '精简内联 SVG 代码、清理元数据并实时预览。',
      longDescription:
        '粘贴或上传 SVG 文件以移除 XML 注释、多余空白和编辑器元数据，同时实时检查矢量渲染效果。',
      keywords: ['svg', '精简', '优化', '矢量图', '清理', '预览'],
      howItWorks: [
        '移除 XML 声明、注释、设计软件命名空间属性以及多余空白字符。',
        '精确计算原始 SVG 与精简后 SVG 之间的字节缩减比例。',
        '在棋盘格透明背景上实时渲染预览，并提供可复制的优化后代码。',
      ],
      faqs: [
        {
          question: 'SVG 优化是无损的吗？',
          answer: '是的，移除注释、元数据和多余空白会完整保留矢量路径和渲染效果。',
        },
        {
          question: '可以预览带透明背景的 SVG 吗？',
          answer: '可以，预览舞台会在矢量图形背后展示清晰的棋盘格透明指示背景。',
        },
      ],
    },
    'data-converter': {
      name: 'JSON ↔ YAML ↔ CSV 转换器',
      shortDescription: '在 JSON、YAML 和 CSV 之间双向转换与格式化。',
      longDescription:
        '在 JSON、YAML 和 RFC-4180 标准 CSV 之间无缝转换配置文件与表格数据集，并支持美化缩进输出。',
      keywords: ['json', 'yaml', 'yml', 'csv', '转换器', '格式化', '解析器'],
      howItWorks: [
        '将源 JSON、YAML 或 CSV 文本解析为中间结构化 JavaScript 对象。',
        '校验语法并在格式错误时精准报告行列或语法问题。',
        '以规范缩进将抽象结构序列化为目标格式输出。',
      ],
      faqs: [
        {
          question: '导出为 CSV 时如何处理嵌套对象？',
          answer: '数组行内的嵌套值会安全序列化为紧凑的 JSON 字符串并包裹在带引号的 CSV 单元格中。',
        },
        {
          question: 'YAML 转换器支持多行字符串和布尔值吗？',
          answer: '支持，本工具完全遵循 YAML 1.2 规范进行解析和导出。',
        },
      ],
    },
    'file-hash': {
      name: '文件哈希与校验和计算器',
      shortDescription: '通过 Web Crypto 本地计算 SHA-1、SHA-256、SHA-384 和 SHA-512。',
      longDescription:
        '使用浏览器硬件加速的 Web Crypto 摘要原语在本地校验下载文件或文本哈希，并与预期校验和对比。',
      keywords: ['sha256', 'sha512', 'sha1', '校验和', '哈希', '完整性', 'web crypto'],
      howItWorks: [
        '将拖入的文件读取为 ArrayBuffer，或将文本输入编码为 UTF-8 字节数组。',
        '并行调用原生 `crypto.subtle.digest` 计算 SHA-1、SHA-256、SHA-384 和 SHA-512。',
        '将计算出的十六进制摘要与可选预期校验和比对，即时验证是否一致。',
      ],
      faqs: [
        {
          question: 'Web Crypto 计算大文件哈希的速度快吗？',
          answer: '很快，`crypto.subtle.digest` 会调用浏览器底层的原生 C++/SIMD 加速实现。',
        },
        {
          question: '为什么推荐使用 SHA-256 而不是 SHA-1？',
          answer: 'SHA-1 易受碰撞攻击，而 SHA-256 与 SHA-512 在文件完整性校验方面仍具备密码学安全性。',
        },
      ],
    },
    'file-inspector': {
      name: 'MIME 类型与 Magic Bytes 检测器',
      shortDescription: '通过二进制十六进制文件头与签名识别真实文件格式。',
      longDescription:
        '以十六进制和 ASCII 视图检查任意文件的前 32 个字节，无视被修改的扩展名，精准识别真实 MIME 类型。',
      keywords: ['magic bytes', 'mime', '文件签名', 'hex', '二进制', '检测'],
      howItWorks: [
        '使用 `File.slice()` 和 `Uint8Array` 仅读取文件开头的文件头字节。',
        '匹配常见二进制文件签名（PNG、JPEG、WebP、PDF、ZIP、GZIP、ELF、WASM、SQLite、MP3）。',
        '展示格式化十六进制头、ASCII 预览以及检测到的 MIME 类型。',
      ],
      faqs: [
        {
          question: '为什么要检查 Magic Bytes 而不是文件扩展名？',
          answer: '文件扩展名可以随意重命名或伪造，而 Magic Bytes 反映了底层真实的二进制格式。',
        },
        {
          question: '如果文件没有二进制签名怎么办？',
          answer: '检测器会评估 UTF-8 可打印性及启发式特征，以识别 SVG、JSON 或纯文本文件。',
        },
      ],
    },
    'file-diff': {
      name: '并排文件 Diff 对比工具',
      shortDescription: '通过逐行 LCS 算法高亮对比两段文本或配置文件。',
      longDescription:
        '粘贴原始与修改后的配置、代码片段或日志，清晰查看新增行、删除行与双栏行号。',
      keywords: ['diff', '对比', '合并', '行差异', '补丁', '文本对比'],
      howItWorks: [
        '将两侧输入拆分为规范化的行数组。',
        '计算最长公共子序列（LCS）以对齐未变更的上下文行。',
        '用暗红标注删除行、用翡翠绿标注新增行，并附带双侧行号。',
      ],
      faqs: [
        {
          question: '可以直接对比本地文件内容吗？',
          answer: '可以，您可以将文本粘贴到左侧原始窗格或右侧修改窗格进行对比。',
        },
        {
          question: '会保留空白字符差异吗？',
          answer: '会的，每行的任何字符级差异都会被标记，避免遗漏细微的配置改动。',
        },
      ],
    },
    'case-converter': {
      name: '命名规范与大小写转换器',
      shortDescription: '在 camelCase、snake_case、kebab-case、PascalCase 等间一键转换。',
      longDescription:
        '同时将标识符和文本转换为 12 种常见开发命名规范，并实时统计字符数、词数、行数与 UTF-8 字节数。',
      keywords: ['camelcase', 'snake_case', 'kebab-case', 'pascalcase', 'constant_case', '大小写转换'],
      howItWorks: [
        '识别驼峰边界、下划线、连字符、点号和空白符进行分词。',
        '实时重构为 12 种标准编程命名和文本格式。',
        '结合原生 `TextEncoder` 同步统计字符、单词、行数与 UTF-8 字节长度。',
      ],
      faqs: [
        {
          question: '能准确拆分混合格式的 camelCase 或 snake_case 输入吗？',
          answer: '可以，词边界检测能够准确处理诸如 `apiResponse_v2URL` 等混合标识符。',
        },
        {
          question: '对表情符号和非 ASCII 文本的 UTF-8 字节计数准确吗？',
          answer: '准确，字节长度直接通过原生 `TextEncoder` API 测算。',
        },
      ],
    },
    'regex-tester': {
      name: '正则表达式测试与匹配检查器',
      shortDescription: '实时测试 JS 正则表达式、切换修饰符并查看捕获组。',
      longDescription:
        '针对样本载荷验证正则表达式，切换 `g`、`i`、`m`、`s`、`u` 标志，并检查编号与命名捕获组。',
      keywords: ['regex', 'regexp', '正则表达式', '捕获组', '模式', '匹配'],
      howItWorks: [
        '在受保护的 `new RegExp()` 代码块中编译您的模式和修饰符。',
        '安全遍历匹配项，内置零长度匹配保护以防止死循环。',
        '在表格中列出匹配子串、起止索引以及编号和命名捕获组。',
      ],
      faqs: [
        {
          question: '该测试器使用哪种正则引擎语法？',
          answer: '它直接在浏览器的 JavaScript ECMAScript RegExp 引擎上运行，支持后行断言与命名捕获组。',
        },
        {
          question: '空匹配（零宽匹配）如何处理？',
          answer: '零宽匹配会安全推进 `lastIndex` 并限制最大迭代次数，避免浏览器卡死。',
        },
      ],
    },
    'jwt-decoder': {
      name: 'JWT 解码器与载荷检查器',
      shortDescription: '在本地解码 JSON Web Token 并自动检查过期状态。',
      longDescription:
        '解析 JWT JOSE 头部、载荷声明、`iat`/`exp`/`nbf` 时间戳和签名段，全程绝不向网络发送令牌。',
      keywords: ['jwt', 'json web token', '解码', '声明', 'bearer', 'exp', '鉴权'],
      howItWorks: [
        '将紧凑的 JWS 字符串拆分为 Header、Payload 和 Signature 三段。',
        '将 Base64URL UTF-8 片段解码为格式化的 JSON 树。',
        '对照本地时钟评估 `exp` 与 `nbf` 声明，展示有效期状态徽章。',
      ],
      faqs: [
        {
          question: '在这里粘贴生产环境的 JWT 安全吗？',
          answer: '安全。解码 100% 在本地内存中完成，任何令牌都不会离开您的浏览器标签页。',
        },
        {
          question: '解码操作会验证加密签名吗？',
          answer: '解码仅用于查看头部和载荷声明；签名校验需要服务端密钥或公钥 JWKS。',
        },
      ],
    },
    'id-generator': {
      name: 'UUID / ULID / NanoID 与密钥生成器',
      shortDescription: '生成密码学随机 UUID v4、ULID、NanoID 与高熵令牌。',
      longDescription:
        '基于 `crypto.getRandomValues` 单个或批量生成防碰撞标识符与 API 密钥令牌。',
      keywords: ['uuid', 'ulid', 'nanoid', 'token', '密码', '随机', 'csprng'],
      howItWorks: [
        '从浏览器密码学安全伪随机数生成器（`crypto.randomUUID` / `crypto.getRandomValues`）获取熵源。',
        '生成 RFC 4122 v4 UUID、按字典序可排序的 Crockford Base32 ULID 或自定义长度 NanoID。',
        '支持一次批量生成最多 30 个标识符并提供一键复制。',
      ],
      faqs: [
        {
          question: '相比 UUID v4，ULID 有什么优势？',
          answer: 'ULID 嵌入了 48 位毫秒级时间戳前缀，因此在数据库索引中可以按时间字典序排序。',
        },
        {
          question: '生成的令牌在密码学上安全吗？',
          answer: '是的，所有随机性均来自 Web Crypto `getRandomValues`，绝不使用 `Math.random()`。',
        },
      ],
    },
    'text-encoder': {
      name: 'Base64 / URL / HTML 编解码器',
      shortDescription: '在统一工作区中编解码 UTF-8 Base64、URL 参数和 HTML 实体。',
      longDescription:
        '使用支持 UTF-8 的 Base64、`encodeURIComponent` 和 HTML 实体转义对字符串进行双向转换。',
      keywords: ['base64', 'url 编码', '解码', 'html 实体', '转义', 'utf-8'],
      howItWorks: [
        '在 Base64 编码前先将 Unicode 字符串转为 UTF-8 字节数组，确保中文和表情符号不会导致 `btoa()` 报错。',
        '为查询字符串与 URL 参数应用 RFC 3986 百分号编码。',
        '安全转义或反转义 HTML 上下文中的 `<`、`>`、`&`、`"` 和 `\'`。',
      ],
      faqs: [
        {
          question: '为什么原生 `btoa()` 在处理中文或 Emoji 时会失败？',
          answer: '原生 `btoa` 仅接受 Latin-1 字节；本工具先通过 `TextEncoder` 转为 UTF-8 再编码。',
        },
        {
          question: '`encodeURI` 和 `encodeURIComponent` 有什么区别？',
          answer: '`encodeURIComponent` 会对 `&`、`=`、`/` 等保留分隔符进行编码，最适合处理 URL 查询参数值。',
        },
      ],
    },
    'color-converter': {
      name: 'HEX / RGB / HSL / OKLCH 色彩转换器',
      shortDescription: '在 HEX、RGB、HSL 与感知均匀色彩空间 OKLCH 之间转换。',
      longDescription:
        '选取或输入任意颜色值，精准查看 HEX、sRGB、HSL 与广色域 OKLCH 的 CSS 声明。',
      keywords: ['hex', 'rgb', 'hsl', 'oklch', '色彩转换', 'css 颜色'],
      howItWorks: [
        '将 3 位或 6 位 HEX 字符串解析为标准化 sRGB 通道。',
        '将 sRGB 转换为柱面坐标 HSL 以及感知空间 OKLab/OKLCH 坐标。',
        '输出可直接复制到现代设计系统的 CSS Level 4 颜色声明。',
      ],
      faqs: [
        {
          question: '为什么现代 CSS 推荐用 OKLCH 替代 HSL？',
          answer: 'OKLCH 具有感知均匀性，意味着相同亮度（L）值的不同颜色在人眼中看起来亮度一致。',
        },
        {
          question: '现代浏览器都支持 `oklch()` 吗？',
          answer: '是的，Chrome、Safari、Firefox 和 Edge 均已原生支持 CSS `oklch()`。',
        },
      ],
    },
    'contrast-checker': {
      name: 'WCAG 对比度检测器',
      shortDescription: '依据 WCAG 2.1 AA 和 AAA 标准测试前景/背景配色组合。',
      longDescription:
        '通过精确的相对亮度比、实时 UI 卡片预览与 AA/AAA 通过徽章，即刻验证文本可读性。',
      keywords: ['wcag', '对比度', '无障碍', 'a11y', 'aa', 'aaa', '亮度'],
      howItWorks: [
        '将 sRGB 通道线性化并计算前景色和背景色的 WCAG 2.1 相对亮度。',
        '计算精确的 `(L1 + 0.05) / (L2 + 0.05)` 对比度比值。',
        '自动评估正文文本（4.5:1 AA / 7:1 AAA）与大号文本（3:1 AA / 4.5:1 AAA）的合规性。',
      ],
      faqs: [
        {
          question: 'WCAG 2.1 中什么算作大号文本（Large Text）？',
          answer: '常规字重至少 18pt（24px）或粗体字重至少 14pt（18.67px）的文本。',
        },
        {
          question: '正文文本的最低对比度要求是多少？',
          answer: 'WCAG AA 标准要求普通正文文本至少达到 4.5:1。',
        },
      ],
    },
    'palette-generator': {
      name: '单色与阶梯调色板生成器',
      shortDescription: '生成均衡的 50–950 色阶并导出为 CSS 变量或 JSON。',
      longDescription:
        '输入任意基础色，即可合成 11 级设计系统色阶（50 至 950），并自动匹配高对比度前景色提示。',
      keywords: ['调色板', '色阶', '设计令牌', 'css 变量', '色深', '50-950'],
      howItWorks: [
        '从种子颜色中提取基础色相与饱和度。',
        '从 97%（50）到 9%（950）插值生成 11 个均衡亮度色阶。',
        '支持一键导出干净的 CSS 自定义属性（`--color-50`..`--color-950`）或 JSON Token。',
      ],
      faqs: [
        {
          question: '生成器如何为每个色块选择深色或浅色文字？',
          answer: '每个色阶都会计算其相对亮度，并自动选取高对比度的 `#09090B` 或 `#FAFAFA` 标签色。',
        },
        {
          question: '可以把导出结果直接粘贴到 `globals.css` 吗？',
          answer: '可以，“复制 CSS 变量”会输出可直接使用的 `:root` 声明块。',
        },
      ],
    },
    'glass-generator': {
      name: 'CSS 毛玻璃与 Bento 卡片生成器',
      shortDescription: '交互式调节模糊度、透明度、饱和度与高光边框 CSS。',
      longDescription:
        '可视化设计磨砂单色玻璃表面，在高对比画布上实时预览并复制生产级 CSS 代码。',
      keywords: ['glassmorphism', 'backdrop-filter', '模糊', 'bento', 'css 生成器', '毛玻璃'],
      howItWorks: [
        '调节背景不透明度、`backdrop-filter` 模糊半径、饱和度与 `1px` 高光边框透明度。',
        '在深色几何光晕背景上实时预览毛玻璃卡片效果。',
        '生成带有浏览器前缀、可直接用于 Bento 组件的纯净 CSS 代码。',
      ],
      faqs: [
        {
          question: '为什么在 `backdrop-filter` 中同时使用 `blur()` 和 `saturate()`？',
          answer: '适度提升饱和度可以防止磨砂表面在中性背景下显得灰暗发浑。',
        },
        {
          question: '毛玻璃效果也适用于浅色模式吗？',
          answer: '适用，使用半透明白色背景搭配细腻深色边框可在浅色画布上营造立体质感。',
        },
      ],
    },
    'chmod-calculator': {
      name: 'Chmod 权限计算器',
      shortDescription: '支持八进制与符号模式双向同步的 Unix rwx 权限矩阵。',
      longDescription:
        '切换 Owner、Group 和 Others 的读/写/执行权限位，或输入如 `755` 的八进制数字以生成精准 `chmod` 命令。',
      keywords: ['chmod', 'unix', '权限', '八进制', 'rwx', 'linux', '755', '644'],
      howItWorks: [
        '将读（4）、写（2）和执行（1）标志映射到所有者、用户组和其他用户。',
        '复选框矩阵与 3 位八进制数（`755`）及符号串（`rwxr-xr-x`）双向实时同步。',
        '提供常见文件（`644`）、可执行文件（`755`）和私钥（`600`）快速预设。',
      ],
      faqs: [
        {
          question: 'SSH 私钥应该设置什么权限？',
          answer: '私钥通常要求设置为 `600`（`-rw-------`），确保仅文件所有者可读写。',
        },
        {
          question: '`644` 和 `755` 有什么区别？',
          answer: '`755` 额外赋予了执行（`x`）权限，这对于运行脚本或进入目录是必需的。',
        },
      ],
    },
    'cron-calculator': {
      name: 'Cron 表达式解析与生成器',
      shortDescription: '将 5 字段 Cron 计划任务翻译为自然语言并预测未来 5 次运行时间。',
      longDescription:
        '校验标准 Unix Cron 表达式，选择常用预设、阅读通俗说明并查看接下来的 UTC 执行时间。',
      keywords: ['cron', 'crontab', '定时任务', '调度器', '运行时间', 'devops'],
      howItWorks: [
        '解析以空格分隔的 5 个字段（分 时 日 月 周），支持步长（`*/5`）、区间（`1-5`）与列表。',
        '生成清晰易懂的调度周期描述。',
        '模拟未来分钟刻度并列出接下来的 5 个精确 ISO-8601 UTC 执行时间戳。',
      ],
      faqs: [
        {
          question: '`*/15 * * * *` 代表什么意思？',
          answer: '表示每 15 分钟执行一次（即每小时的 :00、:15、:30 和 :45 分）。',
        },
        {
          question: '星期字段的值是从 0 开始的吗？',
          answer: '是的，`0` 代表星期日，一直到 `6` 代表星期六。',
        },
      ],
    },
    'timestamp-converter': {
      name: 'Unix 时间戳与 ISO 日期转换器',
      shortDescription: '跨时区转换 Unix 时间戳（秒/毫秒）与 ISO-8601 日期。',
      longDescription:
        '自动识别秒或毫秒精度，查看 UTC、相对时间差以及多个常用时区的格式化时间。',
      keywords: ['unix timestamp', '时间戳', 'iso 8601', '日期', '时区', 'utc'],
      howItWorks: [
        '自动区分 10 位 Unix 秒级时间戳与 13 位毫秒级时间戳。',
        '利用浏览器 `Date` 与 `Intl.DateTimeFormat` 解析 ISO-8601 和 RFC-2822 日期字符串。',
        '同时展示 UTC、America/New_York、Europe/London、Asia/Tokyo 与 Asia/Ho_Chi_Minh 时区结果。',
      ],
      faqs: [
        {
          question: '自动检测如何区分秒和毫秒？',
          answer: '小于 `1e11` 的数值按秒处理；更大的数值则按毫秒处理。',
        },
        {
          question: '什么是 2038 年问题？',
          answer: '有符号 32 位 Unix 秒级整数将在 2038 年 1 月 19 日溢出；现代 64 位系统与 JS 数值已规避此限制。',
        },
      ],
    },
    'unit-base-calculator': {
      name: '字节 / 带宽 / 进制转换计算器',
      shortDescription: '换算 SI/IEC 存储单位及二进制/八进制/十进制/十六进制大整数。',
      longDescription:
        '同步计算十进制（KB/MB/GB）与二进制（KiB/MiB/GiB）容量、估算网络传输耗时并支持 BigInt 无损进制转换。',
      keywords: ['bytes', 'kib', 'mib', 'gib', '二进制', '十六进制', '八进制', '十进制', '进制'],
      howItWorks: [
        '同时计算以 10 为底的 SI 单位（`1000^n`）和以 2 为底的 IEC 单位（`1024^n`）。',
        '使用 JavaScript `BigInt` 实现超越 53 位限制的无损二/八/十/十六进制互转。',
        '根据 Mbps 链路带宽估算文件传输所需时间。',
      ],
      faqs: [
        {
          question: '为什么 1 TB 硬盘在操作系统中通常显示约 931 GiB？',
          answer: '硬件厂商按十进制 TB（`10^12` 字节）标称容量，而操作系统常按二进制 GiB（`2^30` 字节）换算显示。',
        },
        {
          question: '进制转换器支持 64 位或 128 位整数吗？',
          answer: '支持，底层采用 `BigInt`，可无损处理任意长度大整数。',
        },
      ],
    },
    'git-cheatsheet': {
      name: 'Git 与 GitHub CLI 速查表',
      shortDescription: '支持一键复制与固定的 Git 及 `gh` 高频命令手册。',
      longDescription:
        '快速查找并复制 Git 分支管理、交互式变基、reflog 恢复、worktree 以及 GitHub CLI（`gh`）核心命令。',
      keywords: ['git', 'github', 'gh cli', 'rebase', 'reflog', 'stash', '速查表'],
      howItWorks: [
        '将实战 Git 与 `gh` 工作流整理为可筛选的 Bento 命令卡片。',
        '支持按命令参数与描述即时关键词过滤。',
        '可将高频命令直接固定到工作区存储以便置顶查看。',
      ],
      faqs: [
        {
          question: '误执行了 `git reset --hard` 后如何恢复？',
          answer: '运行 `git reflog` 查找之前的提交 SHA，然后用 `git checkout -b recovery <sha>` 救回。',
        },
        {
          question: '我可以固定最常用的命令吗？',
          answer: '可以，点击任意卡片上的图钉图标即可跨会话置顶保留。',
        },
      ],
    },
    'http-cheatsheet': {
      name: 'HTTP 状态码与请求头参考',
      shortDescription: '可检索的 1xx–5xx 状态码、缓存控制、CORS 与安全请求头。',
      longDescription:
        '快速查阅 HTTP 响应状态码、RFC 语义、Cache-Control 指令、CORS 预检头及现代安全响应头。',
      keywords: ['http', '状态码', '404', '429', '502', 'cors', 'cache-control', '请求头'],
      howItWorks: [
        '按 1xx 信息、2xx 成功、3xx 重定向、4xx 客户端错误和 5xx 服务端错误分类整理。',
        '内置可直接复制的 CORS、CSP、HSTS 和 Cache-Control 响应头片段。',
        '支持按数字状态码、头名称或业务场景即时筛选。',
      ],
      faqs: [
        {
          question: 'API 何时应返回 401 而不是 403？',
          answer: '401 Unauthorized 表示缺少或无效的身份凭证；403 Forbidden 表示已认证但缺乏操作权限。',
        },
        {
          question: '301 和 308 永久重定向有什么区别？',
          answer: '两者均为永久重定向，但 308 保证保留原始 HTTP 方法（如 POST），而 301 可能降级为 GET。',
        },
      ],
    },
    'devops-cheatsheet': {
      name: 'Regex、Linux CLI 与 Docker 速查表',
      shortDescription: '常用正则模式、Linux 网络诊断与 Docker CLI 核心命令。',
      longDescription:
        '一键复制包含常用正则前瞻/命名组、`ss`/`lsof`/`journalctl` Linux 排障以及 Docker/Compose 操作的速查卡片。',
      keywords: ['docker', 'linux', 'bash', 'regex', 'lsof', 'systemd', 'devops', '速查表'],
      howItWorks: [
        '将实用命令按正则模式、Linux 网络与进程、Docker/容器分组展示。',
        '提供带视觉确认的一键剪贴板复制。',
        '固定的片段会持久化保存在本地或已配置的 Supabase 中。',
      ],
      faqs: [
        {
          question: '如何在 Linux 中查看占用某个端口的进程？',
          answer: '使用 `ss -tulpn | grep :3000` 或 `lsof -i :3000`。',
        },
        {
          question: '如何安全清理悬空的 Docker 镜像？',
          answer: '运行 `docker image prune` 可清理未打标签的镜像层，同时不影响正在运行的容器。',
        },
      ],
    },
  },
};
