import type { PagesDictionary } from '../../types';

export const jaPages: PagesDictionary = {
  shared: {
    breadcrumbHome: 'ホーム',
    lastUpdatedLabel: '最終更新日',
    lastUpdatedDate: '2026-11-25',
    exploreToolsHeading: 'ツールスイートを探す',
    relatedPagesHeading: 'その他の情報・ポリシー',
    openFeedbackBtn: 'フィードバック送信',
    viewMyFeedbackBtn: '送信履歴',
    openGithubBtn: 'GitHub で見る',
    emailLabel: 'サポートメール',
    copyEmailBtn: 'メールをコピー',
    copiedEmailBtn: 'コピーしました',
    noEmailNotice:
      'このデプロイでは直接サポートメールが設定されていません。アプリ内のフィードバックモーダルまたは GitHub Issues をご利用ください。',
    privacyFirstBadge: '100% クライアント側処理',
  },
  about: {
    navLabel: '概要',
    title: 'OmniDev IT-Tools について',
    metaTitle: 'OmniDev IT-Tools について — 100% クライアント側で完結する開発者ワークスペース',
    metaDescription:
      'OmniDev IT-Tools の紹介：7カテゴリー・28種類のブラウザネイティブ開発ツール。高速動作、サーバー送信ゼロ、4言語完全対応。',
    subtitle:
      '開発・デザイン・DevOps・ハードウェア診断に欠かせない28種類のユーティリティをブラウザ上で安全に実行できる、プライバシー優先のモノクロ Bento ワークスペースです。',
    keywords: [
      'omnidev 概要',
      'クライアントサイド開発ツール',
      'ブラウザユーティリティ',
      'プライバシー重視 it tools',
      'オフライン開発ツール',
    ],
    sections: [
      {
        heading: '完全なローカルプライバシーのために設計',
        body: '開発者は日々、機密性の高い JWT、設定ファイル、SSH/Nginx スニペット、ハッシュ値、ローカル画像を外部サイトに貼り付けがちです。OmniDev は標準 Web API を用いてすべての変換をブラウザメモリ内だけで実行し、そのリスクを排除します。',
        bullets: [
          'HTML5 Canvas と Web Crypto API により、画像変換・圧縮や SHA-1/256/384/512 ハッシュ計算をローカルで処理します。',
          'JSON、YAML、CSV、正規表現、JWT、OKLCH、Chmod、Cron エンジンは外部 API 通信なしで同期実行されます。',
          '速度＆遅延テストは同一オリジンの `/api/speedtest/*` エンドポイント（1リクエスト <= 4 MiB）のみと通信し、ペイロードを一切保存しません。',
        ],
      },
      {
        heading: '7つの専門スイートに28種類のユーティリティ',
        body: 'すべてのツールは Bento ワークスペースに整理され、コマンドパレット（Cmd/Ctrl + K）、お気に入りピン留め、プリセット保存、URL 状態共有、英語・ベトナム語・日本語・簡体字中国語の4言語に対応しています。',
        bullets: [
          '画像処理 (4ツール): 画像変換、画像圧縮、画像を Base64 変換、SVG 最適化。',
          'ファイル処理 (4ツール): JSON/YAML/CSV 変換、ハッシュ＆チェックサム、Magic Bytes 解析、テキスト差分比較。',
          'テキスト処理 (5ツール): ケース変換、正規表現テスター、JWT デコーダー、ID 生成、エンコード変換。',
          'カラー処理 (4ツール): OKLCH 等色空間変換、WCAG コントラスト検証、パレット生成、CSS グラスモーフィズム。',
          '計算ツール (4ツール): Chmod 権限計算、Cron 式パーサー、Unix タイムスタンプ変換、単位＆進数計算。',
          'チートシート (3ツール): Git & GitHub CLI、HTTP ステータス＆ヘッダー、Linux / Docker / Regex リファレンス。',
          '機器・ネットワーク診断 (4ツール): キーボードテスト、マイクテスト、スピーカーテスト、セルフホスト速度テスト。',
        ],
      },
      {
        heading: 'オープン設計と任意のクラウド同期',
        body: 'デフォルトではピン留め、プリセット、利用回数、フィードバックはブラウザストレージにローカル保存されます。運用者が Supabase を接続した場合のみ、ユーザー登録なしで匿名ワークスペースデータ（`user_favorites`、`saved_presets`、`tool_metrics`、`tool_ratings`、`feedback_submissions`）を同期できます。',
      },
    ],
  },
  help: {
    navLabel: 'ヘルプ・FAQ',
    title: 'ヘルプ＆よくある質問',
    metaTitle: 'ヘルプ＆FAQ — キーボード・音声・速度テストガイド | OmniDev IT-Tools',
    metaDescription:
      'OmniDev IT-Tools の使い方とトラブルシューティング：クライアント側プライバシー、キーボードキャプチャ（Esc × 2）、マイク HTTPS 権限、スピーカー 35% 上限、速度テスト。',
    subtitle:
      'ブラウザ権限の扱い、ハードウェア診断、ローカル状態の保持、キーボードショートカットに関する実践的なガイドです。',
    keywords: [
      'omnidev ヘルプ',
      'it tools faq',
      'キーボードキャプチャ esc',
      'マイク権限 https',
      'スピーカー setsinkid',
      'セルフホスト速度テスト',
    ],
    sections: [
      {
        heading: '基本操作とワークスペースショートカット',
        body: 'どこからでもグローバルコマンドパレット（`Cmd/Ctrl + K`）を開き、28個のツール、20個の DevOps/Git/HTTP チートシート項目、情報ページへ素早く移動できます。',
        bullets: [
          'カードやヘッダーの星アイコンをクリックすると、サイドバーとお気に入りドロワーにピン留めできます。',
          '各ツール内の「プリセット保存」で、よく使う入力パラメータをローカル（または設定済みの Supabase）に保存できます。',
          '「状態を共有」を使うと、現在のツール状態を `?state=` 付き URL にエンコードして共有できます。',
        ],
      },
      {
        heading: 'ハードウェア＆ネットワーク診断の注意点',
        body: 'ハードウェア・ネットワーク診断は最新のブラウザ Web API を利用するため、音声機器へアクセスする前に一度だけ許可ダイアログが表示される場合があります。',
        bullets: [
          'キーボードテスト: キャプチャモードを有効にするとスイッチ確認中に Cmd/Ctrl+K や F5 を抑止できます。`Esc` を2回続けて押すか「解除」をクリックして終了します。',
          'マイクテスト: セキュアコンテキスト（`https://` または `http://localhost`）とマイク権限が必要です。音声は端末外へ送信されません。',
          'スピーカーテスト: 聴覚保護のためマスター音量 `35%` の安全上限で起動し、Chromium 系ブラウザでは `setSinkId` による出力先切替に対応します。',
        ],
      },
    ],
    faqs: [
      {
        question: 'データは本当に100%クライアント側で処理され、送信されませんか？',
        answer:
          'はい。24種類の変換・ファイル・テキスト・カラー・計算・チートシートツールに加え、キーボード・マイク・スピーカー診断もすべて Web Crypto、HTML5 Canvas、Web Audio、MediaRecorder API を用いてブラウザメモリ内のみで動作します。任意の速度テストのみ同一オリジンの `/api/speedtest/*` と一時的な疑似乱数データをやり取りします。',
      },
      {
        question: 'キーボードテストの「キャプチャモード」を解除するにはどうすればよいですか？',
        answer:
          'キャプチャモード中は Tab、F5、Cmd/Ctrl+K などのショートカットを捕捉して全キーを正確にテストできます。`Esc` キーを素早く2回押す（`Esc × 2`）か、画面上の解除ボタンをクリックすると通常の入力モードに戻ります。',
      },
      {
        question: 'マイクテストで HTTPS やマイク許可を求められるのはなぜですか？',
        answer:
          'ブラウザはハードウェア保護のため `navigator.mediaDevices.getUserMedia` をセキュアコンテキスト（`https://` または `localhost`）に制限しています。許可後は波形・スペクトラム解析やローカル再生のみを行い、音声ストリームを外部送信することはありません。',
      },
      {
        question: 'スピーカーテストの出力切替（`setSinkId`）と35%リミッターの仕組みは？',
        answer:
          'テストトーンやスイープ音による急な大音量から耳とヘッドホンを守るため、マスターゲインの初期上限を安全な `35%` に設定しています。Chrome/Edge など `HTMLMediaElement.setSinkId` 対応ブラウザでは出力デバイスの切り替えも可能です。',
      },
      {
        question: '外部サーバーを使わないセルフホスト速度テストはどう動作しますか？',
        answer:
          '同一オリジンの `/api/speedtest/ping`、`/api/speedtest/download`、`/api/speedtest/upload` のみを対象に遅延・ジッター・上下通信速度を計測します。各通信は `<= 4 MiB`（`4,194,304` バイト）以下に制限され、メモリ上で生成後即座に破棄されるためサーバー保存はゼロです。',
      },
      {
        question: '表示言語を切り替えると入力中のツールデータは消えますか？',
        answer:
          'いいえ。新しい言語ルート（`en`、`vi`、`ja`、`zh`）へ遷移する直前に ToolWorkspace が `sessionStorage`（`omnidev:draft:<toolId>`）へ一時下書きを保存し、切り替え完了後に自動復元します。',
      },
    ],
  },
  privacy: {
    navLabel: 'プライバシーポリシー',
    title: 'プライバシーポリシー',
    metaTitle: 'プライバシーポリシー — ローカル処理・Cookie・Cloudflare Web Analytics | OmniDev IT-Tools',
    metaDescription:
      'OmniDev IT-Tools の透明性方針：28種類のツールは100%クライアント実行、localStorage・sessionStorage の利用項目、必須 Cookie omnidev_locale、任意の Cookie レス Cloudflare Web Analytics。',
    subtitle:
      'ブラウザメモリ内に留まる情報、ローカルに保存される情報、および任意で有効化される Cookie レス計測の仕組みを明確に開示します。',
    keywords: [
      'omnidev プライバシーポリシー',
      'クライアントサイドプライバシー',
      'localstorage キー',
      'omnidev_locale cookie',
      'cloudflare web analytics cookieレス',
    ],
    sections: [
      {
        heading: '100% クライアント側実行＆ペイロード追跡ゼロ',
        body: 'OmniDev には広告トラッカー、クロスサイトプロファイリング、入力ペイロードのサーバー送信はありません。28種類すべてのツールはローカルブラウザ内で動作し、入力または読み込んだデータ（JWT、ハッシュ、正規表現、画像、JSON/YAML/CSV、マイク音声）が端末外へ出ることはありません。',
      },
      {
        heading: 'ブラウザストレージ（`localStorage` と `sessionStorage`）',
        body: 'アカウント登録なしで快適な作業環境を維持するため、設定と一時下書きをブラウザストレージにのみ保存します。',
        bullets: [
          '`localStorage`: `omnidev_client_id`, `omnidev_theme`, `omnidev_locale`, `omnidev_favorites`, `omnidev_pinned_snippets`, `omnidev_presets`, `omnidev_metrics`, `omnidev_speedtest_history`, `omnidev_tool_ratings`, `omnidev_feedback_submissions`, `omnidev_feedback_last_submit_at`, および `omnidev_admin_supabase_auth`（管理コンソール専用）。',
          '`sessionStorage`: 言語切り替え直前に作成される一時下書き `omnidev:draft:<toolId>`。言語遷移後も作業内容を保持するために使用します。',
        ],
      },
      {
        heading: '厳密に必須な Cookie（`omnidev_locale`）',
        body: 'OmniDev は SSR/プロキシの言語ルーティングのために、単一のファーストパーティ必須 Cookie（`omnidev_locale`、`SameSite=Lax`、有効期限1年）のみを使用して表示言語（`en`, `vi`, `ja`, `zh`）を記憶します。広告やクロスサイト追跡 Cookie は使用しません。',
      },
      {
        heading: '任意の Cloudflare Web Analytics（ページビュー＆Core Web Vitals）',
        body: '`NEXT_PUBLIC_CF_BEACON_TOKEN`（または Cloudflare Automatic Setup）が設定された公開環境では、集計ページビューと Core Web Vitals（`LCP`, `INP`, `CLS`, `FCP`, `TTFB`）を計測するため Cloudflare Web Analytics（`static.cloudflareinsights.com/beacon.min.js`）を読み込む場合があります。ローカル開発環境や未設定のセルフホスト環境では既定で完全に無効です。',
        bullets: [
          '100% Cookie レス＆フィンガープリントなし: Cloudflare Web Analytics は Cookie を発行せず、`localStorage` への読み書きや IP・User-Agent によるサイト横断追跡を行いません。',
          'サニタイズ済みルートのみ計測: 集計ページビューと Web Vitals 指標のみを取得し、`?state=` などのクエリ文字列やハッシュからツール入力内容を取得することはありません。',
          '管理画面・ルートエラーの除外: 手動ビーコンは `/admin` および `/{locale}/admin/*` ルート、さらにロケール外のルートエラーフォールバック（`global-not-found`）では読み込まれません。',
        ],
      },
      {
        heading: '任意の Supabase 同期・フィードバック・速度テスト',
        body: 'ホスト環境に Supabase 環境変数が設定されている場合、ランダムな `omnidev_client_id` に紐づく匿名ワークスペース記録（`user_favorites`、`saved_presets`、`tool_metrics`、`tool_ratings`、`feedback_submissions`）を同期します。',
        bullets: [
          'フィードバックモーダル: 連絡先メールと診断コンテキストは完全オプトインです。診断コンテキストは `?state=` クエリと `#hash` を自動除去し、機密入力が送信されないよう保護します。',
          '速度テスト (`/api/speedtest/*`): 同一オリジンヘッダーを検証し、`<= 4 MiB` の一時バッファをメモリ上で送受信・破棄します。ログ記録や保存は行いません。',
        ],
      },
    ],
  },
  terms: {
    navLabel: '利用規約',
    title: '利用規約',
    metaTitle: '利用規約 — オープンソースユーティリティ＆免責事項 | OmniDev IT-Tools',
    metaDescription:
      'OmniDev IT-Tools の利用規約：許可される利用範囲、クライアント側計算の免責事項、オーディオ機器安全上の注意、同一オリジン速度テストの適正利用。',
    subtitle:
      'OmniDev のブラウザユーティリティ、診断ツール、およびセルフホストエンドポイントの利用に関する簡潔な規約です。',
    keywords: [
      'omnidev 利用規約',
      '開発ツール免責事項',
      'オープンソースライセンス',
      '速度テスト適正利用',
    ],
    sections: [
      {
        heading: '1. ライセンスと許可された利用',
        body: 'OmniDev IT-Tools は、個人・教育・商用エンジニアリング業務向けの無料オープンソース開発者ユーティリティ群として提供されます。リポジトリライセンスに従い、コードの閲覧、セルフホスト、カスタマイズが可能です。',
      },
      {
        heading: '2. 正確性および現状有姿（"As-Is"）での提供',
        body: 'すべてのツールおよび計算結果は「現状有姿」かつ「提供可能な範囲」で提供され、いかなる保証も行いません。本番環境へ適用する前に、暗号チェックサム、`chmod` 権限、Cron スケジュール、カラーコントラスト基準、セキュリティトークンを必ずご自身で検証してください。',
      },
      {
        heading: '3. オーディオ機器の安全性とアクセス権限',
        body: 'スピーカーテストには聴覚保護のための初期 `35%` 音量リミッターが組み込まれていますが、ゲインを上げる前や高周波スイープを再生する前に、外部アンプ・モニタースピーカー・ヘッドホン側の音量を確認する責任は利用者にあります。',
      },
      {
        heading: '4. 同一オリジン速度テスト API の適正利用',
        body: '`/api/speedtest/ping`、`/api/speedtest/download`、`/api/speedtest/upload` の各ルートは同一オリジンのブラウザセッション専用であり、1計測あたり `<= 4 MiB` に制限されています。自動スクレイピング、外部ドメインからの直リンク、意図的な帯域幅負荷行為は禁止されます。',
      },
    ],
  },
  contact: {
    navLabel: 'お問い合わせ',
    title: 'お問い合わせ＆コミュニティサポート',
    metaTitle: 'お問い合わせ＆バグ報告 — フィードバック・GitHub・サポート | OmniDev IT-Tools',
    metaDescription:
      'OmniDev IT-Tools メンテナーへの連絡方法：アプリ内フィードバックモーダルでのバグ報告・機能要望、GitHub Issues、サポートメールのご案内。',
    subtitle:
      'エッジケースの不具合、翻訳の改善点、あるいは29番目のツールのアイデアがありますか？最適な窓口からご連絡ください。',
    keywords: [
      'omnidev お問い合わせ',
      'it tools バグ報告',
      'omnidev 機能要望',
      'github issues',
    ],
    sections: [
      {
        heading: 'バグを最も早く報告する方法',
        body: 'アプリ内蔵のフィードバックモーダルを使うと、対象ツール ID を関連付け、必要に応じてサニタイズ済みの診断コンテキスト（言語、テーマ、画面サイズ、`?state=` を除いたクリーンなパス）を添付できます。',
        bullets: [
          '「送信履歴」タブ内で、ステータス更新（`受付中`、`対応中`、`解決済み`、`クローズ`）やメンテナーからの返信を追跡できます。',
          'オープンソースへのコントリビュート、Pull Request、再現可能なバグレポートは GitHub リポジトリの Issue をご利用ください。',
        ],
      },
    ],
    channelsHeading: 'サポート＆コントリビュート窓口',
    feedbackCardTitle: 'アプリ内フィードバック＆不具合トラッカー',
    feedbackCardDesc:
      'この画面からバグ報告・機能リクエスト・ご意見を送信し、メンテナーからの返信を確認できます。',
    githubCardTitle: 'GitHub リポジトリ＆Issues',
    githubCardDesc:
      'ソースコードや AI-DLC ドキュメントを閲覧し、再現手順付きのバグ報告や PR を作成できます。',
    emailCardTitle: 'ダイレクトサポートメール',
    emailCardDesc:
      'このインスタンスでサポートアドレスが設定されている場合、メールで直接メンテナーへ連絡できます。',
  },
};
