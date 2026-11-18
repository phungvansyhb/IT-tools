import type { CheatsheetsDictionary } from '../../types';

export const jaCheatsheets: CheatsheetsDictionary = {
  entries: {
    'git-interactive-rebase': {
      group: 'ブランチ & リベース',
      title: '直近 N 件のコミットを対話的リベース',
      description: '現在のブランチの直近 5 件のコミットを統合（squash）・並べ替え・編集します。',
      tags: ['git', 'rebase', 'squash', '履歴'],
    },
    'git-reflog-recover': {
      group: '復旧',
      title: 'Reflog から失われたコミットを復元',
      description: 'HEAD の移動履歴を確認し、hard reset 後のコミットを救出します。',
      tags: ['git', 'reflog', 'reset', '取り消し'],
    },
    'git-worktree-add': {
      group: 'Worktree',
      title: '並列 Worktree を作成',
      description: 'stash せずに別ディレクトリで別のブランチをチェックアウトします。',
      tags: ['git', 'worktree', 'ブランチ'],
    },
    'git-amend-no-edit': {
      group: 'コミット',
      title: 'ステージ済み変更を直前コミットへ静かに追加',
      description: 'コミットメッセージを変えずに新しくステージした変更を直前コミットへ統合します。',
      tags: ['git', 'commit', 'amend'],
    },
    'git-stash-untracked': {
      group: 'Stash',
      title: '未追跡ファイルを含めて名前付き Stash',
      description: '追跡対象と未追跡の変更を分かりやすいメッセージ付きで一時退避します。',
      tags: ['git', 'stash', 'wip'],
    },
    'gh-pr-create': {
      group: 'GitHub CLI',
      title: 'ドラフト PR を作成してメタデータを自動入力',
      description: 'コミットのタイトルと本文を使用してドラフト Pull Request を自動作成します。',
      tags: ['gh', 'github', 'pr', 'pull request'],
    },
    'gh-pr-checks': {
      group: 'GitHub CLI',
      title: 'PR の CI チェックを監視',
      description: '現在のブランチの PR に対する GitHub Actions チェック状況をリアルタイム表示します。',
      tags: ['gh', 'ci', 'actions', 'チェック'],
    },
    'http-200-204': {
      group: '2xx 成功',
      title: '200 OK / 201 Created / 204 No Content',
      description: 'リソース作成時は 201、レスポンスボディを返さない DELETE/PUT には 204 を使用します。',
      tags: ['http', '200', '201', '204', 'rest'],
    },
    'http-301-308': {
      group: '3xx リダイレクト',
      title: '301 vs 308 恒久的リダイレクト',
      description: '308 は GET へダウングレードし得る 301 と異なり、POST/PUT メソッドを確実に維持します。',
      tags: ['http', '301', '308', 'リダイレクト'],
    },
    'http-401-403': {
      group: '4xx クライアントエラー',
      title: '401 Unauthorized vs 403 Forbidden',
      description: '認証情報が未指定・期限切れなら 401、RBAC 権限不足なら 403 を返します。',
      tags: ['http', '401', '403', '認証'],
    },
    'http-422-429': {
      group: '4xx クライアントエラー',
      title: '422 Unprocessable Content & 429 Rate Limit',
      description: '422 はスキーマ検証エラー、429 は Retry-After 付きの API レート制限を示します。',
      tags: ['http', '422', '429', 'レート制限'],
    },
    'http-502-504': {
      group: '5xx サーバーエラー',
      title: '502 Bad Gateway / 503 Unavailable / 504 Timeout',
      description: 'リバースプロキシの上流障害とオリジンサーバーの停止を区別します。',
      tags: ['http', '502', '503', '504', 'ゲートウェイ'],
    },
    'http-cache-control': {
      group: 'キャッシュヘッダー',
      title: '不変静的アセットのキャッシュ',
      description: 'コンテンツハッシュ付き JS/CSS バンドルを再検証なしで積極キャッシュします。',
      tags: ['http', 'cache-control', 'cdn', 'パフォーマンス'],
    },
    'http-cors-preflight': {
      group: 'CORS & セキュリティ',
      title: '厳格な CORS + セキュリティヘッダー',
      description: 'Strict-Transport-Security と X-Content-Type-Options: nosniff を併用します。',
      tags: ['http', 'cors', 'セキュリティ', 'hsts'],
    },
    'regex-lookahead-password': {
      group: '正規表現パターン',
      title: '肯定先読みバリデーション',
      description: '大文字 1 文字以上、数字 1 文字以上、12 文字以上を必須とします。',
      tags: ['regex', '先読み', 'バリデーション'],
    },
    'regex-named-group': {
      group: '正規表現パターン',
      title: '名前付きキャプチャグループ (ECMAScript)',
      description: 'ISO 日付の各要素を `match.groups.year` に綺麗に抽出します。',
      tags: ['regex', 'グループ', 'iso'],
    },
    'linux-ss-ports': {
      group: 'Linux CLI',
      title: 'リッスン中の TCP/UDP ポートを確認',
      description: 'netstat より高速にアクティブなソケットと所有 PID を一覧表示します。',
      tags: ['linux', 'ss', 'ポート', 'ネットワーク'],
    },
    'linux-journalctl-tail': {
      group: 'Linux CLI',
      title: 'Systemd サービスログをリアルタイム追跡',
      description: '直近 15 分間に絞り込んで systemd ユニットのログをストリーミング表示します。',
      tags: ['linux', 'systemd', 'ログ', 'journalctl'],
    },
    'docker-exec-shell': {
      group: 'Docker',
      title: 'コンテナ内で対話的シェルを開く',
      description: '稼働中の Alpine/Debian コンテナに対話型ターミナルセッションを接続します。',
      tags: ['docker', 'exec', 'shell', 'コンテナ'],
    },
    'docker-compose-rebuild': {
      group: 'Docker',
      title: 'Compose サービスを再ビルド & 再作成',
      description: 'イメージを再ビルドし、変更されたサービスをバックグラウンドで再起動して孤立コンテナを削除します。',
      tags: ['docker', 'compose', 'build'],
    },
  },
};
