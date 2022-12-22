import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { target: 100, duration: '10s' },
    { target: 200, duration: '10s' },
  ],
};

export default function () {
  const result = http.get('http://host.k3d.internal:80');
  check(result, {
    'http response status code is 200': result.status === 200,
  });
}
