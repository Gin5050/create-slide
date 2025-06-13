# create-slide

生成AIとslidevを使ったスライド自動作成アプリのベースプロジェクトです。

## 開発サーバーの起動

```bash
npm run dev
```

## slidev プレビュー

```bash
npm run slidev
```

`slides.md` を編集することでスライドを作成できます。Vue3 + TypeScript + Vite を使用しています。

## スライドの自動生成

OpenAI API を使用してファイルの内容から `slides.md` を生成するスクリプトを用意しています。

```bash
# 環境変数 OPENAI_API_KEY を設定して実行
npx tsx generateSlide.ts <対象ファイル>
```

PDF ファイルを指定した場合はファイルをアップロードして解析し、その他のテキストファイルは内容を直接送信します。生成されたスライドは `slides.md` に上書き保存されます。

