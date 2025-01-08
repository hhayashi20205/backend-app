# より安定したベースイメージを使用
FROM node:18-bullseye

# システムの依存関係をインストール
RUN apt-get update && apt-get install -y \
    apache2 \
    && rm -rf /var/lib/apt/lists/*

# Apacheのプロキシモジュールを有効にする
RUN a2enmod proxy proxy_http

# 作業ディレクトリを作成
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY src/package*.json ./

# npm設定の調整
RUN npm config set cache /app/.npm-cache
RUN npm config set update-notifier false

# 依存関係をインストール（プロジェクト依存関係とnodemon）
RUN npm install && npm install -g nodemon

# MongoDB接続用のmongooseパッケージをインストール
RUN npm install mongoose

# アプリケーションのソースコードをコピー
COPY src/. .

# Apacheの設定ファイルをコピー
COPY apache.conf /etc/apache2/sites-available/000-default.conf

# ポートの設定
EXPOSE 8080

# デフォルトのコマンドは docker-compose.yml で上書きされます
CMD ["npm", "run", "dev"]