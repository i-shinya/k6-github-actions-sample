import { check } from "k6"
import http from "k6/http"

export const options = {
    // 閾値（設定した条件を満たせないと負荷テストがfailになる）
    thresholds: {
        // リクエストの失敗が1%以内
        http_req_failed: ["rate<0.01"],
        // 90パーセンタイルが500ms以内、95パーセンタイルが1000ms以内のレイテンシ
        http_req_duration: ["p(90)<500", 'p(95) < 1000']
    },
    // テストステージ（順番に実行される）
    stages: [
        // targetは同時実行数、durationは実行時間
        { target: 50, duration: '15s' },
        { target: 100, duration: '15s' }
    ]
}

// テストケース
export default function () {
    const res = http.get(
        "http://host.docker.internal:80"
    )
    check(res, {
        'is_status_200': (r) => r.status === 200
    })
}
