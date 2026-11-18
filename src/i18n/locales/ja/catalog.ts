import type { CatalogDictionary } from '../../types';

export const jaCatalog: CatalogDictionary = {
  categories: {
    image: {
      name: '画像処理',
      tagline: 'Canvas 変換・圧縮、Data URL 生成、SVG 最適化',
      description:
        'アップロード遅延ゼロで、ブラウザメモリ内にて画像フォーマット変換、圧縮、Base64 Data URL エンコード、SVG ベクター軽量化を実行します。',
      seoTitle: 'ブラウザ完結の画像ツール — 変換・圧縮・Base64・SVG 最適化',
      seoDescription:
        'HTML5 Canvas を用いて 100% ローカルで動作するプライバシー重視の画像変換、圧縮、Base64 化、SVG 最適化ツール。',
    },
    file: {
      name: 'ファイル処理',
      tagline: 'JSON/YAML/CSV 変換、SHA ハッシュ、Magic Bytes 検査、Diff 比較',
      description:
        '構造化データの変換、Web Crypto による SHA-1/256/384/512 チェックサム検証、バイナリの Magic Bytes 解析、左右並置 Diff 比較を行います。',
      seoTitle: '開発者向けファイルツール — JSON/YAML/CSV・SHA-256・Magic Bytes・Diff',
      seoDescription:
        'JSON・YAML・CSV の相互変換、Web Crypto によるファイルハッシュ計算、MIME Magic Bytes 判定、テキスト差分比較をローカルで実行。',
    },
    text: {
      name: 'テキスト処理',
      tagline: 'ケース変換、正規表現検証、JWT デコード、ID 生成、エンコード',
      description:
        '命名規則の変換、キャプチャグループ付き正規表現のデバッグ、JWT クレームのデコード、UUID/ULID/NanoID 生成、各種エンコードに対応。',
      seoTitle: '開発者向けテキストツール — ケース変換・正規表現・JWT・UUID・Base64',
      seoDescription:
        'クライアント側テキストツール：命名規則変換、ライブ正規表現テスター、JWT インスペクタ、UUID/ULID 生成、Base64/URL/HTML エンコーダー。',
    },
    color: {
      name: 'カラー・CSS',
      tagline: 'HEX/RGB/HSL/OKLCH 変換、WCAG コントラスト、階調パレット、Glass CSS',
      description:
        'OKLCH を含む知覚色空間の変換、WCAG 2.1 AA/AAA コントラスト比検証、50–950 階調スケール生成、CSS グラスモーフィズム調整を提供。',
      seoTitle: 'UI カラー & CSS ツール — OKLCH 変換・WCAG コントラスト・Glassmorphism',
      seoDescription:
        'HEX/RGB/HSL/OKLCH 相互変換、WCAG コントラスト確認、50–950 トーナルパレット生成、Bento カード向け CSS グラスモーフィズム作成。',
    },
    calculators: {
      name: '計算ツール',
      tagline: 'Chmod マトリックス、Cron 式解析、Unix エポック、バイト・基数変換',
      description:
        'Unix chmod 8進数権限計算、5フィールド Cron スケジュール解析、複数タイムゾーンでの Epoch 変換、IEC/SI バイト・進数変換を行います。',
      seoTitle: '開発者向け計算ツール — Chmod・Cron 解析・Unix 時刻・バイト変換',
      seoDescription:
        '対話型 chmod 権限マトリックス、次回実行時刻付き Cron 解析、Unix タイムスタンプ変換、IEC/SI バイト＆基数計算機。',
    },
    cheatsheets: {
      name: 'チートシート',
      tagline: '検索可能な Git・HTTP ステータス・Regex・Linux・Docker リファレンス',
      description:
        'Git/GitHub CLI、HTTP ステータスコード＆ヘッダー、DevOps/Docker/Regex パターンを即座に絞り込み・ワンクリックコピーできる Bento 参照集。',
      seoTitle: '開発者チートシート — Git CLI・HTTP ステータス・Linux・Docker',
      seoDescription:
        'ワンクリックコピーとピン留めに対応した Git、HTTP ステータスコード、Linux、Docker、正規表現の高速フィルタリングチートシート。',
    },
  },
  tools: {
    'image-converter': {
      name: '画像フォーマット変換',
      shortDescription: 'HTML5 Canvas で PNG・JPEG・WebP をオフライン相互変換。',
      longDescription:
        'ラスター画像をドロップまたは選択し、画質設定とファイルサイズ比較を行いながら PNG・JPEG・WebP へシームレスに変換します。',
      keywords: ['png', 'jpg', 'jpeg', 'webp', '変換', 'canvas', '画像フォーマット'],
      howItWorks: [
        '選択した画像をサーバーへ送信せず FileReader / Object URL 経由でローカル読み込みします。',
        'デコードされたビットマップをフル解像度でオフスクリーンの HTML5 Canvas に描画します。',
        '指定した圧縮品質で PNG・JPEG・WebP 形式のバッファとして書き出します。',
      ],
      faqs: [
        {
          question: '変換のために画像がクラウドサーバーへアップロードされますか？',
          answer:
            'いいえ。デコードとエンコードは HTML5 Canvas API を使用してブラウザ内のみで完結します。',
        },
        {
          question: '透過（アルファチャンネル）に対応している出力形式はどれですか？',
          answer:
            'PNG と WebP は透過を保持します。JPEG は透明ピクセルを単色背景で塗りつぶします。',
        },
      ],
    },
    'image-compressor': {
      name: '画像圧縮 & リサイズ',
      shortDescription: '解像度変更と容量削減をリアルタイムのバイト差分プレビューで確認。',
      longDescription:
        'アスペクト比ロック付きで画像をリサイズし、非可逆圧縮の品質を調整してダウンロード前に正確な削減バイト数を確認できます。',
      keywords: ['圧縮', 'リサイズ', '最適化', '軽量化', 'アスペクト比', 'webp', 'jpeg'],
      howItWorks: [
        '元画像の自然ピクセル寸法を読み取り、縦横比を保った目標サイズを計算します。',
        'Canvas 2D の高品質補間を用いて滑らかにリサンプリングします。',
        '元サイズと圧縮後 Blob サイズを比較し、正確な削減率（%）を算出します。',
      ],
      faqs: [
        {
          question: 'アスペクト比ロックはどのように動作しますか？',
          answer:
            'ロックが有効な場合、幅または高さのいずれかを編集すると、もう一方の寸法が比率に応じて自動再計算されます。',
        },
        {
          question: 'Web 用アセットに最適な品質設定はどのくらいですか？',
          answer:
            'WebP または JPEG で品質 0.78〜0.85 に設定すると、視覚的劣化を抑えつつ 60〜80% の容量削減が期待できます。',
        },
      ],
    },
    'image-base64': {
      name: '画像 → Base64 / Data URL 変換',
      shortDescription: '画像を Base64 文字列、CSS url()、HTML <img> タグへ変換。',
      longDescription:
        'あらゆる画像ファイルを即座に貼り付け可能な Data URL、生 Base64 文字列、CSS 背景スニペット、インライン HTML img タグに変換します。',
      keywords: ['base64', 'data url', 'data uri', 'インライン画像', 'css url'],
      howItWorks: [
        'FileReader.readAsDataURL を用いて画像バイナリを完全にブラウザ内で読み込みます。',
        'MIME タイプ、バイトサイズ、Base64 ペイロードを抽出して即コピー可能にします。',
        'Data URL・CSS background-image・HTML <img> の各スニペットを自動生成します。',
      ],
      faqs: [
        {
          question: 'どのような場合に画像を Base64 としてインライン化すべきですか？',
          answer:
            '10 KB 未満の小さなアイコンやファビコン、メールテンプレートなど、HTTP リクエスト数を減らしたい場合に有効です。',
        },
        {
          question: 'Base64 エンコードでデータサイズは増加しますか？',
          answer:
            'はい。Base64 化すると元のバイナリファイルと比べて約 33% サイズが増加します。',
        },
      ],
    },
    'svg-optimizer': {
      name: 'SVG 最適化 & ビューアー',
      shortDescription: 'インライン SVG の軽量化、メタデータ削除、リアルタイムプレビュー。',
      longDescription:
        'SVG ファイルを貼り付けまたは読み込み、XML コメントや余分な空白、エディタのメタデータを除去しながらベクター描画を確認できます。',
      keywords: ['svg', 'minify', '最適化', 'ベクター', 'クリーンアップ', 'プレビュー'],
      howItWorks: [
        'XML 宣言、コメント、エディタ固有の名前空間属性、余分な空白を取り除きます。',
        '元の SVG と最適化後の SVG のバイト数および削減率をリアルタイム計算します。',
        'チェッカーボード背景のプレビューとともにコピー可能なマークアップを表示します。',
      ],
      faqs: [
        {
          question: 'SVG の最適化は可逆（品質劣化なし）ですか？',
          answer:
            'はい。コメントやメタデータ、不要な空白のみを削除するため、ベクターパスや描画結果は完全に保持されます。',
        },
        {
          question: '透過背景の SVG も確認できますか？',
          answer:
            'はい。プレビュー領域は透過を確認しやすいチェッカーボード背景を採用しています。',
        },
      ],
    },
    'data-converter': {
      name: 'JSON ↔ YAML ↔ CSV コンバーター',
      shortDescription: 'JSON・YAML・CSV 間の双方向変換と整形フォーマット。',
      longDescription:
        '設定ファイルや表形式データを JSON、YAML、RFC-4180 準拠 CSV の間で綺麗に整形しながらシームレスに変換します。',
      keywords: ['json', 'yaml', 'yml', 'csv', '変換', 'フォーマッター', 'パーサー'],
      howItWorks: [
        '入力された JSON・YAML・CSV テキストを中間 JavaScript オブジェクトへパースします。',
        '構文を検証し、不正な場合は具体的なエラー内容を通知します。',
        '適切なインデントやクォート処理を施して目的のフォーマットへシリアライズします。',
      ],
      faqs: [
        {
          question: 'CSV へエクスポートする際、ネストされたオブジェクトはどう扱われますか？',
          answer:
            '配列行内のネストされた値は、引用符で囲まれた CSV セル内にコンパクトな JSON 文字列として安全に出力されます。',
        },
        {
          question: 'YAML コンバーターは複数行文字列や真偽値に対応していますか？',
          answer: 'はい。YAML 1.2 に完全準拠したパースと出力を行います。',
        },
      ],
    },
    'file-hash': {
      name: 'ファイルハッシュ & チェックサム計算',
      shortDescription: 'Web Crypto で SHA-1 / SHA-256 / SHA-384 / SHA-512 を計算。',
      longDescription:
        'ハードウェアアクセラレーション対応の Web Crypto API を用いてファイルや文字列のハッシュをローカル計算し、期待値と照合します。',
      keywords: ['sha256', 'sha512', 'sha1', 'チェックサム', 'ハッシュ', '整合性', 'web crypto'],
      howItWorks: [
        'ドロップされたファイルを ArrayBuffer として読み込むか、テキストを UTF-8 バイト列に変換します。',
        'ブラウザ標準の `crypto.subtle.digest` で SHA-1/256/384/512 を並列計算します。',
        '任意の期待チェックサム文字列と自動照合し、一致アルゴリズムを即座に表示します。',
      ],
      faqs: [
        {
          question: '大きなファイルでも Web Crypto のハッシュ計算は高速ですか？',
          answer:
            'はい。`crypto.subtle.digest` はブラウザ内部のネイティブ C++/SIMD 実装を呼び出すため高速です。',
        },
        {
          question: 'なぜ SHA-1 よりも SHA-256 が推奨されるのですか？',
          answer:
            'SHA-1 は衝突攻撃に対して脆弱であるため、整合性検証には暗号学的に安全な SHA-256 や SHA-512 が推奨されます。',
        },
      ],
    },
    'file-inspector': {
      name: 'MIME タイプ & Magic Bytes 解析',
      shortDescription: 'バイナリの 16進ヘッダーとシグネチャから真のファイル形式を判定。',
      longDescription:
        'ファイルの先頭 32 バイトを 16進数と ASCII で可視化し、拡張子に左右されず正確な MIME タイプを特定します。',
      keywords: ['magic bytes', 'mime', 'ファイルシグネチャ', 'hex', 'バイナリ', '解析'],
      howItWorks: [
        '`File.slice()` と `Uint8Array` を使ってファイルの先頭ヘッダーバイトのみを読み取ります。',
        '既知のバイナリシグネチャ（PNG, JPEG, WebP, PDF, ZIP, GZIP, ELF, WASM, SQLite, MP3）と照合します。',
        '整形された 16進ヘッダー、ASCII プレビュー、検出された MIME タイプを表示します。',
      ],
      faqs: [
        {
          question: '拡張子ではなく Magic Bytes を確認する理由は何ですか？',
          answer:
            'ファイル拡張子は簡単に書き換えや偽装ができますが、Magic Bytes は実際のバイナリ構造そのものを示します。',
        },
        {
          question: 'バイナリシグネチャを持たないテキストファイルの場合はどうなりますか？',
          answer:
            'UTF-8 の印字可能性やヒューリスティックを用いて SVG・JSON・プレーンテキストを自動判定します。',
        },
      ],
    },
    'file-diff': {
      name: '並置ファイル Diff 比較チェッカー',
      shortDescription: '2つのテキストや設定を行単位 LCS ハイライトで比較。',
      longDescription:
        '元のコード・設定と変更後の内容を貼り付け、追加行・削除行・行番号を視覚的に確認できます。',
      keywords: ['diff', '比較', 'マージ', '行差分', 'パッチ', 'テキスト比較'],
      howItWorks: [
        '双方の入力を正規化された行配列へ分割します。',
        '最長共通部分列（LCS）アルゴリズムにより変更のないコンテキスト行を整列させます。',
        '削除行をクリムゾン、追加行をエメラルドミントで左右の行番号とともに強調表示します。',
      ],
      faqs: [
        {
          question: 'ローカルのファイル内容を比較できますか？',
          answer: 'はい。Original と Modified の各ペインにテキストを直接貼り付けて比較できます。',
        },
        {
          question: '空白文字の違いも検出されますか？',
          answer:
            'はい。行単位のあらゆる文字差異を検出するため、インデントや設定の微細な変更も見逃しません。',
        },
      ],
    },
    'case-converter': {
      name: 'ケース & 命名規則コンバーター',
      shortDescription: 'camelCase・snake_case・kebab-case・PascalCase などを一括変換。',
      longDescription:
        '識別子や文章を 12 種類のプログラミング命名規則へ同時変換し、文字数・単語数・行数・UTF-8 バイト数をリアルタイム計測します。',
      keywords: ['camelcase', 'snake_case', 'kebab-case', 'pascalcase', 'constant_case', 'ケース変換'],
      howItWorks: [
        'camelCase の境界、アンダースコア、ハイフン、ドット、空白でトークン分割します。',
        '12 種類の標準的な命名規則・テキストケースへリアルタイムに再構成します。',
        '文字数・単語数・行数に加えて UTF-8 バイト長も正確に算出します。',
      ],
      faqs: [
        {
          question: 'camelCase と snake_case が混在した入力も正しく分割できますか？',
          answer:
            'はい。`apiResponse_v2URL` のような複合的な識別子も正確に単語境界を認識します。',
        },
        {
          question: '絵文字や日本語の UTF-8 バイト数も正確ですか？',
          answer: 'はい。ネイティブの `TextEncoder` API により正確なバイト数を計測しています。',
        },
      ],
    },
    'regex-tester': {
      name: '正規表現テスター & マッチ解析',
      shortDescription: 'JS 正規表現のリアルタイム一致検証とキャプチャグループ確認。',
      longDescription:
        'サンプル文字列に対して正規表現パターンを検証し、フラグ（`g`, `i`, `m`, `s`, `u`）の切り替えや番号・名前付きグループを確認できます。',
      keywords: ['regex', 'regexp', '正規表現', 'キャプチャグループ', 'パターン', 'マッチ'],
      howItWorks: [
        '安全に保護された `new RegExp()` ブロック内でパターンとフラグをコンパイルします。',
        'ゼロ幅マッチによる無限ループを防ぎながら全一致箇所を安全に走査します。',
        '一致文字列の範囲と番号付き・名前付きキャプチャグループを一覧表示します。',
      ],
      faqs: [
        {
          question: 'どの正規表現エンジンを使用していますか？',
          answer:
            'ブラウザ内蔵の JavaScript ECMAScript RegExp エンジンで直接実行されるため、後読みや名前付きグループにも対応しています。',
        },
        {
          question: '空文字にマッチするパターンはどう処理されますか？',
          answer:
            'ゼロ幅マッチ時は `lastIndex` を安全に進め、反復上限を設けることでブラウザのフリーズを防止します。',
        },
      ],
    },
    'jwt-decoder': {
      name: 'JWT デコーダー & クレーム検査',
      shortDescription: 'JSON Web Token をローカルデコードし有効期限を自動判定。',
      longDescription:
        'トークンを外部送信することなく、JOSE ヘッダー、ペイロードクレーム、`iat`/`exp`/`nbf` タイムスタンプを即座に解析します。',
      keywords: ['jwt', 'json web token', 'デコード', 'クレーム', 'bearer', 'exp', '認証'],
      howItWorks: [
        'コンパクト JWS 文字列をヘッダー・ペイロード・署名の 3 セグメントに分割します。',
        'Base64URL エンコードされた UTF-8 セグメントを整形済み JSON へデコードします。',
        '`exp` および `nbf` クレームを端末時刻と比較し、有効／期限切れバッジを表示します。',
      ],
      faqs: [
        {
          question: '本番環境の JWT を貼り付けても安全ですか？',
          answer:
            'はい。デコード処理は 100% ブラウザメモリ内で完結し、トークンがタブ外へ送信されることはありません。',
        },
        {
          question: 'デコード時に暗号署名の検証も行われますか？',
          answer:
            'このツールはヘッダーとペイロード内容の検査用です。署名検証にはサーバーの秘密鍵または公開 JWKS が必要です。',
        },
      ],
    },
    'id-generator': {
      name: 'UUID / ULID / NanoID & トークン生成',
      shortDescription: '暗号学的に安全な UUID v4・ULID・NanoID・シークレットを生成。',
      longDescription:
        '`crypto.getRandomValues` を利用して衝突耐性の高い識別子や API シークレットトークンを単発または一括生成します。',
      keywords: ['uuid', 'ulid', 'nanoid', 'トークン', 'パスワード', '乱数', 'csprng'],
      howItWorks: [
        'ブラウザの暗号論的疑似乱数生成器（`crypto.randomUUID` / `crypto.getRandomValues`）からエントロピーを取得します。',
        'RFC 4122 v4 UUID、辞書順ソート可能な Crockford Base32 ULID、任意長の NanoID やトークンを生成します。',
        '最大 30 件の一括生成とワンクリックコピーに対応しています。',
      ],
      faqs: [
        {
          question: 'UUID v4 と比較した ULID の利点は何ですか？',
          answer:
            'ULID は先頭に 48 ビットのミリ秒タイムスタンプを含むため、データベースのインデックスで辞書順にソートできます。',
        },
        {
          question: '生成されたトークンは暗号学的に安全ですか？',
          answer:
            'はい。すべての乱数は `Math.random()` ではなく Web Crypto の `getRandomValues` から生成されます。',
        },
      ],
    },
    'text-encoder': {
      name: 'Base64 / URL / HTML エンコーダー & デコーダー',
      shortDescription: 'UTF-8 対応 Base64、URL コンポーネント、HTML エンティティを相互変換。',
      longDescription:
        '絵文字や日本語を含む UTF-8 安全な Base64、`encodeURIComponent`、HTML エスケープを一つのワークスペースで双方向変換します。',
      keywords: ['base64', 'url エンコード', 'デコード', 'html エンティティ', 'エスケープ', 'utf-8'],
      howItWorks: [
        'Unicode 文字列を `TextEncoder` で UTF-8 バイト列へ変換してから Base64 化するため、`btoa()` エラーを防ぎます。',
        'クエリ文字列や URL パラメータ向けに RFC 3986 パーセントエンコーディングを適用します。',
        '`<`, `>`, `&`, `"`, `\'` を HTML コンテキスト向けに安全にエスケープ／アンエスケープします。',
      ],
      faqs: [
        {
          question: 'なぜ標準の `btoa()` は日本語や絵文字で失敗するのですか？',
          answer:
            '標準の `btoa` は Latin-1 文字しか受け付けないため、本ツールでは `TextEncoder` で UTF-8 化してから処理しています。',
        },
        {
          question: '`encodeURI` と `encodeURIComponent` の違いは何ですか？',
          answer:
            '`encodeURIComponent` は `&`, `=`, `/` などの予約区切り文字もエスケープするため、クエリパラメータの値に最適です。',
        },
      ],
    },
    'color-converter': {
      name: 'HEX / RGB / HSL / OKLCH カラー変換',
      shortDescription: 'HEX・RGB・HSL・知覚均等色空間 OKLCH をリアルタイム変換。',
      longDescription:
        '任意のカラーを選択または入力し、HEX・sRGB・HSL・広色域 OKLCH の正確な CSS 表現を取得できます。',
      keywords: ['hex', 'rgb', 'hsl', 'oklch', 'カラー変換', 'css カラー'],
      howItWorks: [
        '3桁または6桁の HEX 文字列を正規化された sRGB チャンネルへ変換します。',
        'sRGB から円筒座標の HSL および知覚空間の OKLab/OKLCH 座標へ変換します。',
        'モダンなデザインシステムですぐ使える CSS Level 4 宣言を出力します。',
      ],
      faqs: [
        {
          question: 'なぜモダン CSS では HSL より OKLCH が推奨されるのですか？',
          answer:
            'OKLCH は知覚的に均等であるため、同じ明度（L）を指定すると人間の目にも同じ明るさに見えます。',
        },
        {
          question: '主要ブラウザは `oklch()` に対応していますか？',
          answer: 'はい。Chrome・Safari・Firefox・Edge の最新版はすべてネイティブ対応しています。',
        },
      ],
    },
    'contrast-checker': {
      name: 'WCAG コントラスト比チェッカー',
      shortDescription: '前景色・背景色の組み合わせを WCAG 2.1 AA / AAA 基準で検証。',
      longDescription:
        '正確な相対輝度比、ライブ UI カードプレビュー、AA/AAA 合否バッジによりテキストの視認性を即座に確認できます。',
      keywords: ['wcag', 'コントラスト', 'アクセシビリティ', 'a11y', 'aa', 'aaa', '輝度'],
      howItWorks: [
        'sRGB チャンネルを線形化し、前景色と背景色の WCAG 2.1 相対輝度を計算します。',
        '正確なコントラスト比 `(L1 + 0.05) / (L2 + 0.05)` を算出します。',
        '通常テキスト（AA 4.5:1 / AAA 7:1）および大文字（AA 3:1 / AAA 4.5:1）の基準を判定します。',
      ],
      faqs: [
        {
          question: 'WCAG 2.1 における「大きな文字（Large Text）」の定義は？',
          answer: '通常ウェイトで 18pt（24px）以上、または太字で 14pt（18.67px）以上のテキストです。',
        },
        {
          question: '本文テキストに必要な最小コントラスト比はどれくらいですか？',
          answer: 'WCAG AA 基準では通常の本文テキストに対して 4.5:1 以上が求められます。',
        },
      ],
    },
    'palette-generator': {
      name: 'モノクロ & トーナルパレット生成',
      shortDescription: '50〜950 の均整な階調スケールを CSS 変数と JSON で出力。',
      longDescription:
        'ベースカラーからデザインシステム用の 11 段階（50〜950）カラーランプを生成し、各色の視認性の高い文字色も自動判定します。',
      keywords: ['パレット', '階調スケール', 'デザイントークン', 'css 変数', 'シェード', '50-950'],
      howItWorks: [
        '基準色から色相と彩度を抽出します。',
        '明度 97%（50）から 9%（950）まで 11 段階のバランスの取れたステップを補間生成します。',
        'CSS カスタムプロパティ（`--color-50`〜`--color-950`）および JSON マップとしてコピーできます。',
      ],
      faqs: [
        {
          question: '各スウォッチ上の文字色（黒／白）はどのように決まりますか？',
          answer:
            '各ステップの相対輝度を計算し、視認性の高い `#09090B` または `#FAFAFA` を自動選択します。',
        },
        {
          question: '出力をそのまま `globals.css` に貼り付けられますか？',
          answer: 'はい。「CSS 変数をコピー」ボタンから有効な `:root` 宣言を取得できます。',
        },
      ],
    },
    'glass-generator': {
      name: 'CSS グラスモーフィズム & Bento カード生成',
      shortDescription: 'ぼかし・透過度・彩度・スペキュラ枠線をリアルタイム調整。',
      longDescription:
        'すりガラス調のモノクロサーフェスを視覚的にデザインし、ダークキャンバス上で確認しながら本番用 CSS をコピーできます。',
      keywords: ['glassmorphism', 'backdrop-filter', 'blur', 'bento', 'css 生成', 'すりガラス'],
      howItWorks: [
        '背景不透明度、`backdrop-filter` のぼかし半径、彩度、`1px` 光沢ボーダーの透過度を調整します。',
        '高コントラストなアンビエント背景上でガラスカードをリアルタイムプレビューします。',
        'Bento UI コンポーネントにすぐ使えるベンダープレフィックス付き CSS を出力します。',
      ],
      faqs: [
        {
          question: 'なぜ `backdrop-filter` で `blur()` と `saturate()` を併用するのですか？',
          answer:
            '彩度を少し高めることで、落ち着いた背景の上でもすりガラスがくすんで見えるのを防ぎます。',
        },
        {
          question: 'ライトモードでもグラスモーフィズムは使えますか？',
          answer:
            'はい。半透明の白背景と繊細な暗色ボーダーを組み合わせることで、ライトテーマでも立体感が生まれます。',
        },
      ],
    },
    'chmod-calculator': {
      name: 'Chmod パーミッション計算機',
      shortDescription: '8進数・シンボル表記を双方向変換する Unix rwx 権限マトリックス。',
      longDescription:
        'Owner・Group・Others の読み取り／書き込み／実行ビットを切り替えたり `755` を入力して正確な `chmod` コマンドを生成します。',
      keywords: ['chmod', 'unix', 'パーミッション', '8進数', 'rwx', 'linux', '755', '644'],
      howItWorks: [
        '所有者・グループ・その他の Read(4)・Write(2)・Execute(1) フラグをマッピングします。',
        'チェックボックスと 3桁8進数（`755`）・シンボル表記（`rwxr-xr-x`）を双方向に同期します。',
        '一般ファイル（`644`）、実行ファイル（`755`）、秘密鍵（`600`）のプリセットを用意しています。',
      ],
      faqs: [
        {
          question: 'SSH 秘密鍵にはどの権限を設定すべきですか？',
          answer:
            '秘密鍵は所有者のみが読み書きできるよう `600`（`-rw-------`）を設定するのが一般的です。',
        },
        {
          question: '`644` と `755` の違いは何ですか？',
          answer:
            '`755` には実行権限（`x`）が含まれており、スクリプトの実行やディレクトリの通過に必要です。',
        },
      ],
    },
    'cron-calculator': {
      name: 'Cron 式パーサー & ジェネレーター',
      shortDescription: '5フィールドの Cron 式を分かりやすい説明と次回 5 回の実行時刻へ変換。',
      longDescription:
        '標準的な Unix Cron 式を検証し、プリセット選択、人間向けの要約、今後の UTC 実行予定時刻を確認できます。',
      keywords: ['cron', 'crontab', 'スケジュール', 'スケジューラ', '次回実行', 'devops'],
      howItWorks: [
        'スペース区切り 5 フィールド（分・時・日・月・曜日）をステップ（`*/5`）、範囲（`1-5`）、リスト対応で解析します。',
        'スケジュール間隔の分かりやすい説明文を生成します。',
        '現在時刻から未来の分ティックをシミュレーションし、次回 5 回の ISO-8601 UTC 時刻を一覧表示します。',
      ],
      faqs: [
        {
          question: '`*/15 * * * *` はどういう意味ですか？',
          answer: '毎時 00分・15分・30分・45分の 15分おきに実行することを意味します。',
        },
        {
          question: '曜日の数値は 0 始まりですか？',
          answer: 'はい。`0` が日曜日、`6` が土曜日を表します。',
        },
      ],
    },
    'timestamp-converter': {
      name: 'Unix タイムスタンプ & ISO 日時変換',
      shortDescription: 'Unix エポック（秒／ミリ秒）と ISO-8601 日時を各タイムゾーンで変換。',
      longDescription:
        '秒・ミリ秒を自動判別し、UTC や相対時間、世界主要タイムゾーンでのフォーマット済み日時を一覧表示します。',
      keywords: ['unix timestamp', 'エポック', 'iso 8601', '日時', 'タイムゾーン', 'utc'],
      howItWorks: [
        '10桁の Unix 秒と 13桁のミリ秒を自動的に判別します。',
        'ISO-8601 や RFC-2822 日付文字列をブラウザの `Date` と `Intl.DateTimeFormat` で解析します。',
        'UTC、America/New_York、Europe/London、Asia/Tokyo、Asia/Ho_Chi_Minh の時刻を同時表示します。',
      ],
      faqs: [
        {
          question: '秒とミリ秒はどのように自動判別されますか？',
          answer:
            '`1e11` 未満の数値は秒として、それ以上の数値はミリ秒として扱われます。',
        },
        {
          question: '2038年問題とは何ですか？',
          answer:
            '符号付き 32ビット Unix 秒整数が 2038年1月19日にオーバーフローする問題ですが、現代の 64ビット環境や JS 数値では回避されます。',
        },
      ],
    },
    'unit-base-calculator': {
      name: 'バイト / 帯域幅 / 基数変換計算機',
      shortDescription: 'SI/IEC ストレージ単位と 2/8/10/16 進数（BigInt）を相互変換。',
      longDescription:
        '10進数（KB/MB/GB）と 2進数（KiB/MiB/GiB）のサイズ計算、回線速度に基づく転送時間見積もり、任意長整数の基数変換を行います。',
      keywords: ['bytes', 'kib', 'mib', 'gib', '2進数', '16進数', '8進数', '10進数', '基数'],
      howItWorks: [
        '10進 SI 単位（`1000^n`）と 2進 IEC 単位（`1024^n`）を同時に算出します。',
        'JavaScript の `BigInt` により 53ビットを超える整数でも精度劣化なく 2/8/10/16 進変換を行います。',
        'Mbps 回線速度に応じた推定データ転送時間を計算します。',
      ],
      faqs: [
        {
          question: 'なぜ 1 TB のドライブは OS 上で約 931 GiB と表示されるのですか？',
          answer:
            'メーカーは 10進数（`10^12` バイト）で表記する一方、OS は 2進数（`2^30` バイト）の GiB 基準で計算することが多いためです。',
        },
        {
          question: '64ビットや 128ビットの整数も変換できますか？',
          answer: 'はい。`BigInt` を使用しているため任意精度の大きな整数を正確に処理できます。',
        },
      ],
    },
    'git-cheatsheet': {
      name: 'Git & GitHub CLI チートシート',
      shortDescription: 'ワンクリックコピー＆ピン留め対応の Git / `gh` コマンド集。',
      longDescription:
        'ブランチ操作、対話的リベース、reflog 復旧、worktree、GitHub CLI（`gh`）の必須コマンドを素早く検索・コピーできます。',
      keywords: ['git', 'github', 'gh cli', 'rebase', 'reflog', 'stash', 'チートシート'],
      howItWorks: [
        '実践的な Git / `gh` ワークフローを絞り込み可能な Bento コマンドカードに整理しています。',
        'コマンドフラグや説明文を対象とした即時キーワード検索に対応しています。',
        'よく使うコマンドをワークスペースへピン留めして常に上位表示できます。',
      ],
      faqs: [
        {
          question: '誤って実行した `git reset --hard` を元に戻すには？',
          answer:
            '`git reflog` で直前のコミット SHA を確認し、`git checkout -b recovery <sha>` で復元できます。',
        },
        {
          question: 'よく使うコマンドをピン留めできますか？',
          answer:
            'はい。各カードのピンアイコンをクリックすると、セッションをまたいで上部に固定されます。',
        },
      ],
    },
    'http-cheatsheet': {
      name: 'HTTP ステータスコード & ヘッダー参照',
      shortDescription: '1xx〜5xx ステータスコード、キャッシュ、CORS、セキュリティヘッダー集。',
      longDescription:
        'HTTP レスポンスコード、RFC セマンティクス、Cache-Control ディレクティブ、CORS プリフライト、セキュリティヘッダーを素早く参照できます。',
      keywords: ['http', 'ステータスコード', '404', '429', '502', 'cors', 'cache-control', 'ヘッダー'],
      howItWorks: [
        '1xx 情報、2xx 成功、3xx リダイレクト、4xx クライアントエラー、5xx サーバーエラーに分類しています。',
        'CORS、CSP、HSTS、Cache-Control のそのままコピーできるヘッダースニペットを収録しています。',
        'ステータス番号、ヘッダー名、用途から瞬時に絞り込めます。',
      ],
      faqs: [
        {
          question: 'API で 401 と 403 はどう使い分けるべきですか？',
          answer:
            '401 Unauthorized は認証情報が不足・無効な場合、403 Forbidden は認証済みだが権限（RBAC）が不足している場合に返します。',
        },
        {
          question: '301 と 308 リダイレクトの違いは何ですか？',
          answer:
            'どちらも恒久的リダイレクトですが、308 は POST などの HTTP メソッドを確実に維持します。',
        },
      ],
    },
    'devops-cheatsheet': {
      name: 'Regex・Linux CLI・Docker リファレンス',
      shortDescription: '実用的な正規表現、Linux 診断コマンド、Docker CLI リファレンス。',
      longDescription:
        '正規表現の先読み・名前付きグループ、`ss`/`lsof`/`journalctl` の Linux 診断、Docker/Compose 操作をワンクリックでコピーできます。',
      keywords: ['docker', 'linux', 'bash', 'regex', 'lsof', 'systemd', 'devops', 'チートシート'],
      howItWorks: [
        '実務で頻出するコマンドを「正規表現パターン」「Linux ネットワーク・プロセス」「Docker/コンテナ」に整理しています。',
        'コピー完了の視覚フィードバック付きでワンクリックコピーできます。',
        'ピン留めしたスニペットはローカルまたは Supabase に永続化されます。',
      ],
      faqs: [
        {
          question: 'Linux で特定ポートをリッスンしているプロセスを確認するには？',
          answer: '`ss -tulpn | grep :3000` または `lsof -i :3000` を使用します。',
        },
        {
          question: '不要になった Docker のダングリングイメージを安全に削除するには？',
          answer:
            '`docker image prune` を実行すると、稼働中コンテナに影響を与えずタグなしレイヤーを削除できます。',
        },
      ],
    },
  },
};
