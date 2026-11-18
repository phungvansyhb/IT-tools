# UI/UX Design Specification (`ui-design.md`)

- **Phase**: `INCEPTION`
- **Stage**: `Stage 1.4 — Application & UI Design`
- **Design System**: `Monochrome Zinc Glass + Single Emerald-Mint Accent + 12-Column Bento Grid`
- **Status**: `Validated Baseline (v0.1.0) + i18n UI Delta`

---

## 1. Clarified UI Design Decisions

| Dimension | Selection | Specification Summary |
| :--- | :--- | :--- |
| **Target UI Surfaces** | Home Hub (`/`), Category Hubs (`/categories/[category]`), Tool Workspaces (`/tools/[category]/[slug]`), `Cmd+K` Modal | Persistent `AppShell` (268px fixed sidebar + 64px sticky topbar) wrapping a max-width `1320px` Bento canvas. |
| **Visual Aesthetic** | Dark-first Monochrome Zinc Glass + Light Parity (`data-theme="dark"` / `"light"`) | Translucent glass surfaces (`backdrop-filter: blur(16px) saturate(140%)`), `1px` specular inner edge highlights, subtle radial emerald ambient glow, and single `#10B981` / `#059669` accent. |
| **Typography & Motion** | `Inter` (`--font-sans`) + `JetBrains Mono` (`--font-mono`) | Tight display tracking (`-0.03em`), tabular monospace outputs, and smooth `150ms–180ms` hover lift (`translateY(-1px)`). |
| **Responsive Grid** | 12-column Bento Grid (`src/styles/bento.css`) | Collapses cleanly at `1024px` (8-col / 4-col spans) and `640px` (1-col stack + slide-out mobile sidebar drawer). |

---

## 2. Design Tokens (`src/app/globals.css`)

```css
:root,
[data-theme='dark'] {
  --bg-canvas: #09090b;
  --bg-elevated: #111114;
  --bg-modal: rgba(17, 17, 21, 0.88);
  --bg-input: rgba(15, 15, 19, 0.85);
  --glass-surface: rgba(24, 24, 28, 0.68);
  --glass-surface-hover: rgba(34, 34, 40, 0.78);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-border-highlight: rgba(255, 255, 255, 0.16);
  --glass-specular: rgba(255, 255, 255, 0.06);
  --text-primary: #f4f4f6;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --accent: #10b981;
  --accent-glow: rgba(16, 185, 129, 0.14);
  --glass-blur: blur(16px) saturate(140%);
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
}

[data-theme='light'] {
  --bg-canvas: #f4f4f6;
  --bg-elevated: #ffffff;
  --glass-surface: rgba(255, 255, 255, 0.72);
  --text-primary: #09090b;
  --text-secondary: #52525b;
  --accent: #059669;
  --accent-glow: rgba(5, 150, 105, 0.1);
}
```

---

## 3. Surface-by-Surface Component Specs
1. **App Shell & Command Palette (`AppShell.tsx`, `CommandPalette.tsx`)**:
   - Fixed left navigation rail (`--sidebar-width: 268px`) with category links, pinned tools drawer, and sync mode pill (`Local` vs. `Cloud`).
   - Topbar (`--topbar-height: 64px`) with mobile drawer button, global search trigger (`Cmd+K` / `Ctrl+K`), compact Language Switcher dropdown, and Dark/Light theme switcher.
2. **Bento Grid & Cards (`BentoGrid.tsx`, `BentoCard.tsx`, `src/styles/glass.css`)**:
   - Reusable `.bento-grid` with `.bento-span-12`, `.bento-span-8`, `.bento-span-7`, `.bento-span-6`, `.bento-span-5`, `.bento-span-4`, `.bento-span-3`, and `.bento-row-2` modifiers.
   - `.glass-surface` + `.glass-interactive` cards with specular top highlights and focus-visible outlines.
3. **Tool Workspace (`ToolWorkspace.tsx`)**:
   - Header bar with breadcrumb, single `<h1>`, Pin toggle, Preset manager, and Shareable URL button.
   - Interactive suite area + dropzones/checkerboard previews + How-It-Works card + FAQ accordion + Related Tools Bento row.

---

## 4. Multilingual UI & Typography Specs (i18n Delta)

1. **Topbar Language Switcher (`src/components/layout/LanguageSwitcher.tsx`)**:
   - Positioned in `AppShell` Topbar immediately beside the Theme Toggle so it stays accessible on both Desktop and Mobile (`375px`+).
   - Trigger uses `.btn` Monochrome Zinc Glass styling with `<Globe size={15} />`, uppercase locale code (`EN` / `VI` / `JA` / `ZH`), and `<ChevronDown size={13} />`.
   - Popover menu uses `background: var(--bg-modal)`, `backdrop-filter: var(--glass-blur)`, `1px solid var(--glass-border-highlight)`, `border-radius: var(--radius-md)`, listing `English (EN)`, `Tiếng Việt (VI)`, `日本語 (JA)`, `简体中文 (ZH)` with emerald `<Check size={14} />` on the active option.
   - Full ARIA & keyboard accessibility: `aria-haspopup="listbox"`, `aria-expanded`, `role="listbox"`/`role="option"`, `aria-selected`, `Escape` / outside-click close, `ArrowUp`/`ArrowDown` navigation.
2. **Responsive Mobile Topbar (`<= 640px`)**:
   - Replace fixed `minWidth: 'min(360px, 52vw)'` on the search trigger with responsive `.topbar-search-btn` (`flex: 1; max-width: 360px; min-width: 0`) and hide `<kbd>` shortcut hints and the `"Favorites"` text label below `520px`, keeping `<Star />` + count badge + Language Switcher + Theme Toggle cleanly aligned with zero horizontal overflow at `375px`.
3. **Vietnamese & CJK Typography Stack**:
   - `Inter` and `JetBrains_Mono` loaded with `subsets: ['latin', 'vietnamese']`.
   - `:lang(ja)` appends `'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans JP', sans-serif` after `--font-sans`.
   - `:lang(zh-Hans)` appends `'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'Hiragino Sans GB', sans-serif` after `--font-sans` (preserving `Inter` / `JetBrains Mono` for Latin/numeric characters).
