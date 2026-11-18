import type { CheatsheetsDictionary } from '../../types';

export const zhCheatsheets: CheatsheetsDictionary = {
  entries: {
    'git-interactive-rebase': {
      group: '分支与变基',
      title: '交互式变基最近 N 个提交',
      description: '压缩（squash）、重排或编辑当前分支最近的 5 个提交。',
      tags: ['git', 'rebase', 'squash', '历史'],
    },
    'git-reflog-recover': {
      group: '恢复',
      title: '通过 Reflog 找回丢失的提交',
      description: '查看 HEAD 移动记录并在误执行 hard reset 后抢救提交。',
      tags: ['git', 'reflog', 'reset', '撤销'],
    },
    'git-worktree-add': {
      group: '工作树',
      title: '创建并行 Worktree',
      description: '无需 stash 即可在独立目录中检出另一个分支并行开发。',
      tags: ['git', 'worktree', '分支'],
    },
    'git-amend-no-edit': {
      group: '提交',
      title: '静默追加暂存改动到上次提交',
      description: '保持原提交信息不变，将新暂存的修改合并进上一个提交。',
      tags: ['git', 'commit', 'amend'],
    },
    'git-stash-untracked': {
      group: '暂存区',
      title: '命名暂存并包含未跟踪文件',
      description: '使用清晰的描述标签同时保存已跟踪与未跟踪文件的改动。',
      tags: ['git', 'stash', 'wip'],
    },
    'gh-pr-create': {
      group: 'GitHub CLI',
      title: '创建草稿 PR 并自动填充信息',
      description: '根据提交标题和正文自动打开草稿 Pull Request。',
      tags: ['gh', 'github', 'pr', 'pull request'],
    },
    'gh-pr-checks': {
      group: 'GitHub CLI',
      title: '实时监视 PR 的 CI 检查',
      description: '流式查看当前分支对应 PR 的 GitHub Actions 检查状态。',
      tags: ['gh', 'ci', 'actions', '检查'],
    },
    'http-200-204': {
      group: '2xx 成功',
      title: '200 OK / 201 Created / 204 No Content',
      description: '创建资源返回 201，DELETE/PUT 无响应体时返回 204。',
      tags: ['http', '200', '201', '204', 'rest'],
    },
    'http-301-308': {
      group: '3xx 重定向',
      title: '301 与 308 永久重定向对比',
      description: '308 会严格保留 POST/PUT 请求方法，而 301 可能被客户端降级为 GET。',
      tags: ['http', '301', '308', '重定向'],
    },
    'http-401-403': {
      group: '4xx 客户端错误',
      title: '401 Unauthorized 与 403 Forbidden',
      description: '缺少或过期凭证返回 401；调用方缺少 RBAC 权限返回 403。',
      tags: ['http', '401', '403', '鉴权'],
    },
    'http-422-429': {
      group: '4xx 客户端错误',
      title: '422 无法处理的内容 & 429 速率限制',
      description: '422 表示模式校验失败；429 配合 Retry-After 实施 API 限流。',
      tags: ['http', '422', '429', '限流'],
    },
    'http-502-504': {
      group: '5xx 服务端错误',
      title: '502 错误网关 / 503 服务不可用 / 504 超时',
      description: '区分反向代理上游节点故障与源站服务宕机。',
      tags: ['http', '502', '503', '504', '网关'],
    },
    'http-cache-control': {
      group: '缓存响应头',
      title: '不可变静态资源长期缓存',
      description: '对带内容哈希的 JS/CSS 资源开启激进缓存且无需重新验证。',
      tags: ['http', 'cache-control', 'cdn', '性能'],
    },
    'http-cors-preflight': {
      group: 'CORS 与安全',
      title: '严格 CORS + 安全响应头',
      description: '配合 Strict-Transport-Security 与 X-Content-Type-Options: nosniff 提升安全性。',
      tags: ['http', 'cors', '安全', 'hsts'],
    },
    'regex-lookahead-password': {
      group: '正则模式',
      title: '正向先行断言密码校验',
      description: '要求至少包含 1 个大写字母、1 个数字，且总长度不少于 12 位。',
      tags: ['regex', '先行断言', '校验'],
    },
    'regex-named-group': {
      group: '正则模式',
      title: '命名捕获组 (ECMAScript)',
      description: '将 ISO 日期各部分清晰提取到 `match.groups.year` 中。',
      tags: ['regex', '捕获组', 'iso'],
    },
    'linux-ss-ports': {
      group: 'Linux CLI',
      title: '查看监听中的 TCP/UDP 端口',
      description: '比 netstat 更快地列出活动套接字及所属进程 PID。',
      tags: ['linux', 'ss', '端口', '网络'],
    },
    'linux-journalctl-tail': {
      group: 'Linux CLI',
      title: '跟踪 Systemd 服务实时日志',
      description: '实时流式查看过去 15 分钟内的 systemd 单元日志。',
      tags: ['linux', 'systemd', '日志', 'journalctl'],
    },
    'docker-exec-shell': {
      group: 'Docker',
      title: '在容器内打开交互式 Shell',
      description: '将交互式终端会话附加到正在运行的 Alpine/Debian 容器。',
      tags: ['docker', 'exec', 'shell', '容器'],
    },
    'docker-compose-rebuild': {
      group: 'Docker',
      title: '重建镜像并重启 Compose 服务',
      description: '重新构建镜像、在后台重启变更的服务并清理孤立容器。',
      tags: ['docker', 'compose', 'build'],
    },
  },
};
