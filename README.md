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

※ grafana側の設定は[ブログ](https://it-blue-collar-dairy.com/try-to-use-k6/)に記載しています。

#### 結果をDatadogで表示する

`.env.template`を`.env`にリネームし、DD_API_KEYとDD_SITEを設定

```shell
K6_STATSD_ENABLE_TAGS=true k6 run simple-k6-sample.js --rps 100 --out statsd
```

## k3d上でk6-operatorの実行

[k6-operator](https://github.com/grafana/k6-operator)はkubernetes上でk6の分散実行を行うプロジェクト

### k6-operatorのclone

```shell
git clone https://github.com/grafana/k6-operator
```

.gitと.githubは削除しておいた

### k3dのインストール

```shell
brew install k3d
```

### 必要なツールをインストール

```shell
brew install kubectl
brew install kustomize
```

#### k3dのセットアップ

```shell
# クラスター作成
k3d cluster create loadtest-cluster
```

#### k6-operatorのデプロイ

```shell
cd k6-operator

kubectl config get-contexts

make deploy
```

#### k6-operatorでの負荷テスト実行

```shell
# 負荷テスト用のコンフィグマップを作成
kubectl create configmap k6-operator-sample --from-file ../k6-operator-sample.js

# 作成したコンフィグマップを確認するだけ
kubectl describe configmap k6-operator-sample

# カスタムリソースをデプロイするとテストを実行する
kubectl apply -f ../custom-resource.yml
```

もろもろが動いていることの確認

```shell
kubectl get k6
kubectl get jobs
kubectl get pods
```

#### ログの確認

```shell
# k6-sample-1-f7ktlの部分はget podsで表示されたものに置き換えてください
kubectl logs k6-sample-1-f7ktl
```

#### 後片付け

```shell
# カスタムリソースの削除
kubectl delete -f ../custom-resource.yml

# クラスター削除
k3d cluster delete loadtest-cluster
```
