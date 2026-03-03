# TODO: マラソントレーニング用ランニングシューズ比較検討サービス

最終更新: 2026-03-03

## Phase 1: MVP（最小限の実用製品）

### Phase 1-A: プロジェクト基盤構築 ✅ 完了
- [x] 1.1 Next.js プロジェクト初期化（App Router, TypeScript, Tailwind CSS）
- [x] 1.2 Atlassian Design System 導入（@atlaskit/css-reset, @atlaskit/tokens, 主要コンポーネント）
- [x] 1.3 Prisma + DB セットアップ（スキーマ定義、SQLite）
- [x] 1.4 シードデータ作成（28モデルのシューズデータ投入済み）
- [x] 1.5 テスト基盤構築（Vitest, Testing Library, Playwright）
- [x] 1.6 CI/CD パイプライン（GitHub Actions）

### Phase 1-B: シューズカタログ ✅ 完了
- [x] 2.1 シューズ一覧ページ（カード形式表示、ページネーション）
- [x] 2.2 フィルタ機能（ブランド、用途、価格帯、クッション種別、プロネーション）
- [x] 2.3 ソート機能（価格順、重量順、名前順、新着順）
- [x] 2.4 検索機能（モデル名・ブランド名のキーワード検索、デバウンス付き）
- [x] 2.5 シューズ詳細ページ（全スペック表示、用途適性バー、関連シューズ）

### Phase 1-C: 比較機能 ✅ 完了
- [x] 3.1 比較リスト管理（Context + LocalStorage、最大4足、ヘッダーバッジ付き）
- [x] 3.2 比較テーブルページ（13項目スペック並列比較、差分ハイライト★マーク）
- [x] 3.3 レーダーチャート（Recharts RadarChart、クッション/反発/軽量/耐久/安定 5軸）
- [x] 3.4 比較結果シェア（URLコピー機能、?ids= パラメータで共有可能）

### Phase 1-D: クイック診断 ✅ 完了
- [x] 4.1 診断フォーム（5問のステップフォーム）
- [x] 4.2 推奨ロジック（スコアリングアルゴリズムで上位3-5足を選出）
- [x] 4.3 結果表示ページ（推奨シューズ + ローテーション提案）

### Phase 1-E: お気に入り + 仕上げ ✅ 完了（5.6除く）
- [x] 5.1 お気に入り機能（LocalStorage保存、一覧表示）
- [x] 5.2 レスポンシブ対応（モバイル・タブレット対応）
- [x] 5.3 SEO最適化（メタタグ、OGP、構造化データ）
- [x] 5.4 パフォーマンス最適化（ISR設定）
- [x] 5.5 E2Eテスト（主要ユーザーフロー）
- [x] 5.6-pre Dockerローカル開発環境構築（PostgreSQL移行完了）
- [x] 5.6 デプロイ（Vercelへの本番デプロイ）

## Phase 2: 機能拡充

### Phase 2-A: 用語集/ガイド（認証不要、独立実装）✅ 完了
- [x] 2-A-1 用語データ定義（src/data/glossary.ts、24用語以上）
- [x] 2-A-2 用語集一覧ページ（/glossary、カテゴリ別タブ、キーワード検索）
- [x] 2-A-3 用語集コンポーネント（GlossaryList、GlossaryItem、GlossarySearch）
- [x] 2-A-4 ヘッダーナビゲーション更新（用語集リンク追加）
- [x] 2-A-5 SEO対応（metadata、構造化データ DefinedTermSet）
- [x] 2-A-6 テスト（ユニット）

### Phase 2-B: Supabase Auth 導入（認証基盤）✅ 完了
- [x] 2-B-1 Supabase プロジェクト設定（認証プロバイダー、環境変数）
- [x] 2-B-2 Supabaseクライアント初期化（client.ts、server.ts）
- [x] 2-B-3 Next.js Proxy（セッション管理、/admin/* 保護）
- [x] 2-B-4 User + Favorite モデル + マイグレーション（add_user_and_favorites）
- [x] 2-B-5 Auth コールバック + ユーザー同期（user-service.ts）
- [x] 2-B-6 認証UI（ログイン/サインアップページ、確認ページ）
- [x] 2-B-7 AuthContext + useAuth フック
- [x] 2-B-8 ヘッダー更新（AuthButton組み込み）
- [x] 2-B-9 バリデーションスキーマ（auth-schema.ts）
- [x] 2-B-10 テスト（ユニット: user-service + auth-schema）

### Phase 2-C: 管理画面（CMS）✅ 完了（画像アップロード除く）
- [x] 2-C-1 管理画面レイアウト（/admin layout、サイドナビ、admin認可）
- [x] 2-C-2 ダッシュボード（/admin、統計表示）
- [x] 2-C-3 シューズ一覧（/admin/shoes、動的テーブル）
- [x] 2-C-4 シューズ作成/編集フォーム（ShoeForm、TrainingFitEditor）
- [x] 2-C-5 画像アップロード（Supabase Storage連携）
- [x] 2-C-6 管理用APIエンドポイント（POST/PUT/DELETE /api/admin/shoes）
- [x] 2-C-7 管理用バリデーションスキーマ（admin-shoe-schema.ts）
- [x] 2-C-8 認可ガード（requireAuth、requireAdmin）
- [x] 2-C-9 テスト（ユニット）

### Phase 2-D: お気に入りクラウド同期 ✅ 完了
- [x] 2-D-1 Favorite モデル + マイグレーション（add_user_and_favorites）
- [x] 2-D-2 お気に入りAPI（GET/POST /api/favorites、DELETE、POST /sync）
- [x] 2-D-3 useFavorites フック改修（認証状態で動作切替、楽観的更新、同期ロジック）
- [x] 2-D-4 テスト（ユニット: favorite-service + useFavorites）

### Phase 2-E: シューズ寿命トラッカー ✅ 完了
- [x] 2-E-1 UserShoe / RunningLog モデル + マイグレーション（add_shoe_tracker）
- [x] 2-E-2 マイシューズ管理API（user-shoe-service.ts）
- [x] 2-E-3 マイシューズ一覧ページ（/my-shoes、耐久度プログレスバー）
- [x] 2-E-4 走行ログ入力フォーム（RunningLogForm）
- [x] 2-E-5 走行ログ履歴/統計（/my-shoes/[id]）
- [x] 2-E-6 交換時期アラート（80%/100%閾値、一覧ページに警告バナー）
- [x] 2-E-7 ヘッダーナビゲーション更新（ログイン時にマイシューズ追加）
- [x] 2-E-8 テスト（ユニット: user-shoe-service + shoe-life + tracker-schema）

### Phase 2-F: トレーニング計画連携 ✅ 完了
- [x] 2-F-1 TrainingPlan / WeeklyMenu / MenuItem モデル + マイグレーション
- [x] 2-F-2 トレーニング計画API（training-plan-service.ts）
- [x] 2-F-3 ローテーション提案アルゴリズム（rotation-service.ts）
- [x] 2-F-4 計画一覧ページ（/training）
- [x] 2-F-5 計画作成ウィザード（/training/new、3ステップ）
- [x] 2-F-6 週間カレンダービュー（/training/[id]）
- [x] 2-F-7 テンプレートデータ（training-templates.ts、タイム別4種）
- [x] 2-F-8 ヘッダーナビゲーション更新（ログイン時にトレーニング追加）
- [x] 2-F-9 テスト（ユニット: training-plan-service + rotation-service + training-plan-schema）

## Phase 3: 外部連携
- [ ] 価格比較（楽天API / Amazon PA-APIで実売価格取得）
- [ ] 購入リンク（アフィリエイトリンク生成）
- [ ] 価格変動通知（お気に入りシューズの値下げ通知）
- [ ] SNSシェア（比較結果のOGP画像自動生成）

## Phase 4: コミュニティ
- [ ] ユーザーレビュー（星評価 + テキストレビュー投稿）
- [ ] レビューのモデレーション（管理者承認フロー）
- [ ] コミュニティランキング（ユーザー評価に基づくランキング）
- [ ] シューズ登録リクエスト（ユーザーが未収録シューズの追加をリクエスト）
