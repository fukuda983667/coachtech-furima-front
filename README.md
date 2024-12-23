# coachtech-furima-front

フリマアプリです。
※フロントとバック両方の環境構築が必要です。

![サンプル画像](/img/ホーム画面.png)

## 前提条件
- Dockerがインストールされていること
- Docker Composeがインストールされていること

## 環境構築

1. リポジトリをクローンしたい任意のディレクトリで以下のコマンドを実行してください。

    ```bash
    git clone https://github.com/fukuda983667/coachtech-furima-front
    ```

2. クローンしたRese-frontディレクトリに移動

    ```bash
    cd coachtech-furima-front
    ```

3. Docker Composeを使用してコンテナを作成・起動します。※Docker Descktop起動時に実行してください。

    ```bash
    docker-compose up -d --build
    ```

4. Rese-backの環境構築に移ってください。https://github.com/fukuda983667/coachtech-furima-back

5. アプリケーションがhttp://localhost:3000 で利用可能になります。
   ※coachtech-furima-backの環境構築が必要です。

## 仕様技術(実行環境)

- Nuxt3 : 3.13.2
- docker-compose.yml : 3.9

## URL

- 開発環境(ホームページ) : http://localhost:3000
- 一般ユーザ登録画面 : http://localhost:3000/register
- 一般ユーザログイン画面 : http://localhost:3000/login


## ローカルリポジトリの削除  
`git clone`したローカルリポジトリを完全に削除します。  
```
sudo rm -rf coachtech-furima-front
```
