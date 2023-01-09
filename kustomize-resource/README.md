# kustomize-resource

resourceをkustomizeを使用してデプロイするようにしたもの

## k3d上でk6-operatorの実行

#### k3dのセットアップ

```shell
# クラスター作成
k3d cluster create loadtest-cluster

# テスト対象のdocker compose起動
docker-compose up -d
```

#### k6-operatorのデプロイ

```shell
cd k6-operator && make deploy && cd ..
```

#### k6-operatorでの負荷テスト実行

```shell
# 各リソースの追加
kubectl apply -k kustomize-resource/overlays/local/datadog-agent/

# 負荷テスト用のコンフィグマップを作成
kubectl create configmap k6-operator-sample --from-file ./k6-operator-resource/k6-operator-sample.js
# カスタムリソースをデプロイするとテストを実行する
kubectl apply -f ./k6-operator-resource/custom-resource.yml 
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
# リソース削除（クラスター削除したら全て消えるので個別に削除する必要は特にない）
kubectl delete -k kustomize-resource/overlays/local/datadog-agent/

# クラスター削除
k3d cluster delete loadtest-cluster

# docker compose 停止
docker-compose down
```

## 参考

- [datadog-agent issue](https://github.com/DataDog/datadog-agent/issues/14152)
- [k6-operator issue](https://github.com/grafana/k6-operator/issues/63)
