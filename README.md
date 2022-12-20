# k6-github-actions-sample

github actionsでのk6実行サンプル

## k6の実行手順

### k6インストール

```shell
brew install k6
```

### docker-compose 起動

```shell
docker-compose up -d
```

### k6を実行

#### 結果を標準出力のみで表示

```shell
k6 run simple-k6-sample.js --rps 100
```

#### 結果をgrafanaで表示する

```shell
k6 run simple-k6-sample.js --rps 100 --out influxdb=http://localhost:8086/loadtest
```
