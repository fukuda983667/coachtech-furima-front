# coachtech-furima-front

フリマアプリです。
※フロントとバック両方の環境構築が必要です。

![サンプル画像](/front/public/images/ホーム画面.png)

## 前提条件
- Dockerがインストールされていること
- Docker Composeがインストールされていること

## 環境構築

1. リポジトリをクローンしたい任意のディレクトリで以下のコマンドを実行してください。

    ```bash
    git clone https://github.com/fukuda983667/Rese-front
    ```

2. クローンしたRese-frontディレクトリに移動

    ```bash
    cd Rese-front
    ```

3. Docker Composeを使用してコンテナを作成・起動します。※Docker Descktop起動時に実行してください。

    ```bash
    docker-compose up -d --build
    ```

4. Rese-backの環境構築に移ってください。https://github.com/fukuda983667/Rese-back

5. アプリケーションがhttp://localhost:3000 で利用可能になります。
   ※Rese-backの環境構築が必要です。

## 仕様技術(実行環境)

- Nuxt3 : 3.12.4
- docker-compose.yml : 3.9

## URL

- 開発環境(ホームページ) : http://localhost:3000
- 一般ユーザ登録画面 : http://localhost:3000/register
- 一般ユーザログイン画面 : http://localhost:3000/login
- 管理者ユーザ登録画面 : http://localhost:3000/admin/register
- 管理者ユーザログイン画面 : http://localhost:3000/admin/login
- 店舗運営者ユーザ登録画面 : http://localhost:3000/vendor/login

## ローカルリポジトリの削除  
`git clone`したローカルリポジトリを完全に削除します。  
```
sudo rm -rf Rese-front
```
