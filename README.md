# Cute Prime Moral Scenario Prototype

Zhang & Ye (2023)의 실험 구조를 온라인 환경용으로 바꾼 프로토타입입니다.

구성:

- 15초 귀여운 영상 프라임
- 3D 시험장 시나리오
- 행동 로그와 후속 자기평가 JSON 출력

## 실행

```bash
npm install
npm run dev
```

빌드:

```bash
npm run build
```

## 커스터마이징 포인트

- 프라임 영상: `public/media/cute-prime.mp4`
- 프라임 길이: `src/main.js`의 `PRIME_DURATION_SECONDS`
- 시나리오 로직: `src/scenario-game.js`

## 논문 반영 포인트

- 원 논문은 그림 프라이밍 후 도덕 판단 평정을 수행했습니다.
- 이 프로토타입은 그림을 영상으로 교체하고, 평정 대신 행동 기반 선택 과제를 넣었습니다.
- 기본 시나리오는 논문 부록의 시험 부정행위 상황을 바탕으로 했습니다.
