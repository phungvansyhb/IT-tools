import type { CheatsheetsDictionary } from '../../types';

export const enCheatsheets: CheatsheetsDictionary = {
  entries: {
    'git-interactive-rebase': {
      group: 'Branch & Rebase',
      title: 'Interactive Rebase Last N Commits',
      description: 'Squash, reorder, or edit the last 5 commits on the current branch.',
      tags: ['git', 'rebase', 'squash', 'history'],
    },
    'git-reflog-recover': {
      group: 'Recovery',
      title: 'Recover Lost Commit via Reflog',
      description: 'Inspect HEAD movement history and rescue commits after a hard reset.',
      tags: ['git', 'reflog', 'reset', 'undo'],
    },
    'git-worktree-add': {
      group: 'Worktrees',
      title: 'Create Parallel Worktree',
      description: 'Check out another branch in a separate directory without stashing.',
      tags: ['git', 'worktree', 'branch'],
    },
    'git-amend-no-edit': {
      group: 'Commits',
      title: 'Amend Staged Changes Silently',
      description: 'Fold newly staged edits into the previous commit keeping the same message.',
      tags: ['git', 'commit', 'amend'],
    },
    'git-stash-untracked': {
      group: 'Stash',
      title: 'Named Stash Including Untracked Files',
      description: 'Save tracked and untracked changes with a descriptive stash label.',
      tags: ['git', 'stash', 'wip'],
    },
    'gh-pr-create': {
      group: 'GitHub CLI',
      title: 'Create Draft PR & Fill Metadata',
      description: 'Open a draft Pull Request using commit titles and body automatically.',
      tags: ['gh', 'github', 'pr', 'pull request'],
    },
    'gh-pr-checks': {
      group: 'GitHub CLI',
      title: 'Watch PR CI Checks',
      description: 'Stream live GitHub Actions check status for the current branch PR.',
      tags: ['gh', 'ci', 'actions', 'checks'],
    },
    'http-200-204': {
      group: '2xx Success',
      title: '200 OK / 201 Created / 204 No Content',
      description: 'Use 201 when creating resources, 204 when DELETE/PUT returns no body.',
      tags: ['http', '200', '201', '204', 'rest'],
    },
    'http-301-308': {
      group: '3xx Redirect',
      title: '301 vs 308 Permanent Redirect',
      description: '308 keeps POST/PUT methods intact, unlike 301 which may downgrade to GET.',
      tags: ['http', '301', '308', 'redirect'],
    },
    'http-401-403': {
      group: '4xx Client Error',
      title: '401 Unauthorized vs 403 Forbidden',
      description: 'Return 401 when credentials are missing/expired; 403 when caller lacks RBAC scope.',
      tags: ['http', '401', '403', 'auth'],
    },
    'http-422-429': {
      group: '4xx Client Error',
      title: '422 Unprocessable Content & 429 Rate Limit',
      description: '422 signals schema validation errors; 429 enforces API throttling with Retry-After.',
      tags: ['http', '422', '429', 'rate limit'],
    },
    'http-502-504': {
      group: '5xx Server Error',
      title: '502 Bad Gateway / 503 Unavailable / 504 Timeout',
      description: 'Distinguish reverse-proxy upstream failures from origin downtime.',
      tags: ['http', '502', '503', '504', 'gateway'],
    },
    'http-cache-control': {
      group: 'Caching Headers',
      title: 'Immutable Static Asset Caching',
      description: 'Cache content-hashed JS/CSS bundles aggressively without revalidation.',
      tags: ['http', 'cache-control', 'cdn', 'performance'],
    },
    'http-cors-preflight': {
      group: 'CORS & Security',
      title: 'Strict CORS + Security Headers',
      description: 'Pair with Strict-Transport-Security and X-Content-Type-Options: nosniff.',
      tags: ['http', 'cors', 'security', 'hsts'],
    },
    'regex-lookahead-password': {
      group: 'Regex Patterns',
      title: 'Positive Lookahead Validation',
      description: 'Require at least 1 uppercase letter, 1 digit, and minimum 12 characters.',
      tags: ['regex', 'lookahead', 'validation'],
    },
    'regex-named-group': {
      group: 'Regex Patterns',
      title: 'Named Capture Group (ECMAScript)',
      description: 'Extract ISO date components cleanly into `match.groups.year`.',
      tags: ['regex', 'groups', 'iso'],
    },
    'linux-ss-ports': {
      group: 'Linux CLI',
      title: 'Inspect Listening TCP/UDP Ports',
      description: 'List active sockets and owning PIDs faster than netstat.',
      tags: ['linux', 'ss', 'ports', 'network'],
    },
    'linux-journalctl-tail': {
      group: 'Linux CLI',
      title: 'Follow Systemd Service Logs',
      description: 'Stream live systemd unit logs filtered to the last 15 minutes.',
      tags: ['linux', 'systemd', 'logs', 'journalctl'],
    },
    'docker-exec-shell': {
      group: 'Docker',
      title: 'Open Interactive Shell in Container',
      description: 'Attach an interactive terminal session to a running Alpine/Debian container.',
      tags: ['docker', 'exec', 'shell', 'container'],
    },
    'docker-compose-rebuild': {
      group: 'Docker',
      title: 'Rebuild & Recreate Compose Services',
      description: 'Rebuild images, restart changed services in detached mode, and prune orphans.',
      tags: ['docker', 'compose', 'build'],
    },
  },
};
