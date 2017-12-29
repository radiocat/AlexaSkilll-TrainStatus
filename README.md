# Trainstatus

Alexa Skill向けのサンプルLambdaスクリプト。阪急電車の運行情報を取得してAlexaに結果を返す。

# 作成手順

packageをインストール

``` sh
$ npm install
```

`index.js` と `node_modules` 配下をzipでまとめてLambdaにアップロードする。


``` sh
$ zip -r trainstatus.zip index.js ./node_modules/*
```


