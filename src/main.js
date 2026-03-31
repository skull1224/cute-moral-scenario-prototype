import './style.css';

const PRIME_DURATION_SECONDS = 15;
const PRIME_VIDEO_SRC = '/media/cute-prime.mp4';

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="shell">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>
    <aside class="side-panel">
      <div class="panel-copy">
        <p class="eyebrow">ONLINE EXPERIMENT PROTOTYPE</p>
        <h1>귀여움 프라임 이후 도덕적 선택 행동 관찰</h1>
        <p class="lead">
          Zhang & Ye (2023)의 귀여움 프라이밍 흐름을 온라인 환경으로 옮긴 프로토타입입니다.
          그림 프라이밍 대신 15초 영상, 판단 문항 대신 3D 시나리오 행동을 기록합니다.
        </p>
      </div>

      <section class="meta-card">
        <div>
          <span class="meta-label">프라임 자극</span>
          <strong>귀여운 고양이 영상 15초</strong>
        </div>
        <div>
          <span class="meta-label">행동 과제</span>
          <strong>장학금 시험에서의 부정행위 선택</strong>
        </div>
        <div>
          <span class="meta-label">로그 포인트</span>
          <strong>메시지 확인, 답안 작성 방식, 제출 시간</strong>
        </div>
      </section>

      <section class="status-card">
        <div class="status-header">
          <div>
            <span class="meta-label">현재 단계</span>
            <strong id="stage-label">소개</strong>
          </div>
          <div class="timer-chip" id="timer-chip">01:15</div>
        </div>
        <p class="objective-label">현재 목표</p>
        <h2 id="objective-text">실험 시작 버튼을 눌러 준비하세요.</h2>
        <p class="interaction-hint" id="interaction-hint">
          본 프로토타입은 데스크톱과 모바일 모두에서 실행됩니다.
        </p>
      </section>

      <section class="timeline-card">
        <p class="meta-label">실험 흐름</p>
        <ol class="timeline" id="timeline">
          <li data-stage="intro" class="is-active">소개</li>
          <li data-stage="prime">귀여운 영상</li>
          <li data-stage="brief">시나리오 안내</li>
          <li data-stage="game">3D 시나리오</li>
          <li data-stage="survey">후속 평가</li>
          <li data-stage="result">로그 확인</li>
        </ol>
      </section>

      <section class="event-card">
        <p class="meta-label">최근 이벤트</p>
        <ul id="event-feed" class="event-feed">
          <li>대기 중</li>
        </ul>
      </section>
    </aside>

    <main class="main-panel">
      <section class="screen is-active" data-screen="intro">
        <div class="hero-card">
          <span class="screen-tag">Prototype Setup</span>
          <h2>영상 프라임 후 3D 선택 상황으로 바로 넘어갑니다.</h2>
          <p>
            논문의 핵심 구조인 "귀여운 자극 노출 후 도덕 관련 평가"를 행동 기반 과제로 바꿨습니다.
            이 버전은 한 개의 귀여운 영상과 한 개의 시험 부정행위 시나리오를 포함합니다.
          </p>
          <div class="hero-grid">
            <article>
              <h3>프라임</h3>
              <p>15초 동안 귀여운 고양이 영상을 전체 화면으로 재생합니다.</p>
            </article>
            <article>
              <h3>시나리오</h3>
              <p>3D 시험장 안에서 유출 답안 메시지를 무시할지 사용할지 선택합니다.</p>
            </article>
            <article>
              <h3>기록</h3>
              <p>선택 시점과 완료 시간, 후속 자기평가를 JSON으로 확인할 수 있습니다.</p>
            </article>
          </div>
          <button class="primary-button" id="start-button">프로토타입 시작</button>
        </div>
      </section>

      <section class="screen" data-screen="prime">
        <div class="prime-card">
          <div class="prime-copy">
            <span class="screen-tag">Cute Prime</span>
            <h2>15초간 영상을 시청합니다.</h2>
            <p>
              실제 실험에서는 이 구간만 자극 조건별 영상으로 교체하면 됩니다. 이 프로토타입에서는
              귀여운 고양이 영상을 반복 재생해 15초 동안 노출합니다.
            </p>
          </div>
          <div class="prime-frame">
            <video
              id="prime-video"
              class="prime-video"
              playsinline
              muted
              loop
              preload="auto"
              src="${PRIME_VIDEO_SRC}"
            ></video>
            <div class="prime-overlay">
              <div class="progress-label">
                <span>Prime Exposure</span>
                <strong id="prime-countdown">15s</strong>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" id="prime-progress"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="screen" data-screen="brief">
        <div class="brief-card">
          <span class="screen-tag">Scenario Brief</span>
          <h2>장학금 유지 심사 시험장</h2>
          <p>
            논문 부록의 "시험에서 부정행위를 통해 장학금을 얻는 상황"을 3D 공간으로 옮겼습니다.
            당신은 시험장에 들어가고, 시험 도중 친구가 유출 답안을 보냅니다. 메시지를 열람할지,
            실제로 부정행위를 실행할지, 그리고 언제 제출할지를 기록합니다.
          </p>
          <div class="brief-grid">
            <article>
              <h3>조작 포인트</h3>
              <p>귀여운 영상 프라임 직후 바로 과제에 진입합니다.</p>
            </article>
            <article>
              <h3>행동 포인트</h3>
              <p>메시지 무시 여부, 답안 작성 방식, 제출 완료 시간을 수집합니다.</p>
            </article>
            <article>
              <h3>조작 방법</h3>
              <p>데스크톱은 WASD와 E, 모바일은 화면 버튼으로 이동과 상호작용을 합니다.</p>
            </article>
          </div>
          <button class="primary-button" id="enter-game-button">3D 시나리오 시작</button>
        </div>
      </section>

      <section class="screen game-screen" data-screen="game">
        <div class="game-shell">
          <canvas id="game-canvas"></canvas>
          <div class="game-hud">
            <div class="game-overlay-card">
              <div class="game-hud-top">
                <span class="screen-tag">3D Scenario</span>
                <span class="interaction-state" id="interaction-state">이동 중</span>
              </div>
              <p class="game-target-title" id="game-target-title">현재 목표: 왼쪽 위 안내 데스크</p>
              <p class="game-target-route" id="game-target-route">
                노란 기둥과 링이 보이는 왼쪽 위 안내 데스크로 이동하세요.
              </p>
              <p id="mobile-objective" class="mobile-objective">
                노란 링 안에 들어가면 E, Enter, 또는 하단 버튼으로 상호작용합니다.
              </p>
              <div class="legend">
                <span>이동: WASD / 방향 버튼</span>
                <span>상호작용: E 또는 Enter / 하단 버튼</span>
                <span>노란 링 안에 들어가야 상호작용 가능</span>
              </div>
            </div>

            <div class="mini-map-card">
              <div class="mini-map-head">
                <span class="meta-label">현재 목표 위치</span>
                <strong id="game-target-location">왼쪽 위 안내 데스크</strong>
              </div>
              <div class="mini-map" id="mini-map">
                <div class="mini-map-grid"></div>
                <div class="map-landmark" data-map-id="briefingDesk" style="left: 16.4%; top: 83.6%;">지시문</div>
                <div class="map-landmark" data-map-id="phone" style="left: 82.8%; top: 83.6%;">휴대폰</div>
                <div class="map-landmark" data-map-id="examDesk" style="left: 50%; top: 46.7%;">시험지</div>
                <div class="map-landmark" data-map-id="submitBox" style="left: 12.7%; top: 14.1%;">제출함</div>
                <div class="map-target-dot" id="map-target-dot"></div>
                <div class="map-player-dot" id="map-player-dot"></div>
              </div>
            </div>
          </div>

          <div class="touch-controls" aria-label="모바일 이동 버튼">
            <button data-control="forward">▲</button>
            <div class="touch-row">
              <button data-control="left">◀</button>
              <button data-control="backward">▼</button>
              <button data-control="right">▶</button>
            </div>
          </div>

          <button id="touch-interact" class="touch-action">상호작용</button>
        </div>
      </section>

      <section class="screen" data-screen="survey">
        <div class="survey-card">
          <span class="screen-tag">Post Task</span>
          <h2>후속 평가</h2>
          <p>
            논문처럼 후속 판단 문항을 붙일 수 있도록, 프로토타입에는 자기평가 문항 두 개를 넣었습니다.
          </p>

          <div class="question-card" data-question="cuteness">
            <h3>시청한 영상이 얼마나 귀여웠나요?</h3>
            <div class="scale" id="cuteness-scale"></div>
            <div class="scale-labels">
              <span>1 전혀 귀엽지 않음</span>
              <span>7 매우 귀여움</span>
            </div>
          </div>

          <div class="question-card" data-question="justification">
            <h3>방금 자신의 선택이 얼마나 정당했다고 느껴졌나요?</h3>
            <div class="scale" id="justification-scale"></div>
            <div class="scale-labels">
              <span>1 전혀 정당하지 않음</span>
              <span>7 매우 정당함</span>
            </div>
          </div>

          <div class="question-card" data-question="immersion">
            <h3>이 시나리오에 얼마나 몰입했나요?</h3>
            <div class="scale" id="immersion-scale"></div>
            <div class="scale-labels">
              <span>1 전혀 몰입되지 않음</span>
              <span>7 매우 몰입됨</span>
            </div>
          </div>

          <button class="primary-button" id="finish-survey-button" disabled>
            로그 보기
          </button>
        </div>
      </section>

      <section class="screen" data-screen="result">
        <div class="result-card">
          <span class="screen-tag">Run Output</span>
          <h2>실험 로그</h2>
          <p id="result-summary"></p>
          <pre id="result-json" class="result-json"></pre>
          <div class="result-actions">
            <button class="secondary-button" id="copy-results-button">JSON 복사</button>
            <button class="primary-button" id="restart-button">다시 실행</button>
          </div>
        </div>
      </section>
    </main>
  </div>

  <div class="modal-backdrop is-hidden" id="decision-modal">
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="decision-title">
      <span class="screen-tag">Decision</span>
      <h2 id="decision-title"></h2>
      <p id="decision-body"></p>
      <div id="decision-actions" class="modal-actions"></div>
    </div>
  </div>
`;

const screens = [...document.querySelectorAll('.screen')];
const shell = document.querySelector('.shell');
const timelineItems = [...document.querySelectorAll('#timeline li')];
const stageLabel = document.querySelector('#stage-label');
const objectiveText = document.querySelector('#objective-text');
const interactionHint = document.querySelector('#interaction-hint');
const mobileObjective = document.querySelector('#mobile-objective');
const timerChip = document.querySelector('#timer-chip');
const eventFeed = document.querySelector('#event-feed');
const primeVideo = document.querySelector('#prime-video');
const primeProgress = document.querySelector('#prime-progress');
const primeCountdown = document.querySelector('#prime-countdown');
const decisionModal = document.querySelector('#decision-modal');
const decisionTitle = document.querySelector('#decision-title');
const decisionBody = document.querySelector('#decision-body');
const decisionActions = document.querySelector('#decision-actions');
const resultSummary = document.querySelector('#result-summary');
const resultJson = document.querySelector('#result-json');
const finishSurveyButton = document.querySelector('#finish-survey-button');
const gameTargetTitle = document.querySelector('#game-target-title');
const gameTargetRoute = document.querySelector('#game-target-route');
const gameTargetLocation = document.querySelector('#game-target-location');
const interactionState = document.querySelector('#interaction-state');
const mapPlayerDot = document.querySelector('#map-player-dot');
const mapTargetDot = document.querySelector('#map-target-dot');
const mapLandmarks = [...document.querySelectorAll('.map-landmark')];

const appState = {
  sessionStartedAt: null,
  currentStage: 'intro',
  primeViewedMs: 0,
  primeCompleted: false,
  scenario: {
    phoneChoice: null,
    examChoice: null,
    submitted: false,
    timedOut: false,
    completionMs: null
  },
  ratings: {
    cuteness: null,
    justification: null,
    immersion: null
  },
  gameGuide: {
    targetId: null,
    targetLabel: '시작 전',
    targetLocation: '대기 중',
    routeHint: '3D 시나리오를 시작하면 위치 안내가 표시됩니다.',
    interactionReady: false,
    playerPosition: { x: 0, z: 5 },
    targetPosition: null,
    mapLimit: 6.1
  },
  runEvents: []
};

function resetState() {
  appState.sessionStartedAt = performance.now();
  appState.currentStage = 'intro';
  appState.primeViewedMs = 0;
  appState.primeCompleted = false;
  appState.scenario = {
    phoneChoice: null,
    examChoice: null,
    submitted: false,
    timedOut: false,
    completionMs: null
  };
  appState.ratings = {
    cuteness: null,
    justification: null,
    immersion: null
  };
  appState.gameGuide = {
    targetId: null,
    targetLabel: '시작 전',
    targetLocation: '대기 중',
    routeHint: '3D 시나리오를 시작하면 위치 안내가 표시됩니다.',
    interactionReady: false,
    playerPosition: { x: 0, z: 5 },
    targetPosition: null,
    mapLimit: 6.1
  };
  appState.runEvents = [];
}

resetState();

function logEvent(type, detail = {}) {
  const record = {
    type,
    detail,
    elapsedMs: Math.round(performance.now() - appState.sessionStartedAt),
    recordedAt: new Date().toISOString()
  };

  appState.runEvents.push(record);
  const latest = appState.runEvents.slice(-5).reverse();
  eventFeed.innerHTML = latest
    .map(
      (event) =>
        `<li><strong>${event.type}</strong><span>${Object.keys(event.detail).length ? JSON.stringify(event.detail) : 'detail 없음'}</span></li>`
    )
    .join('');
}

function setStage(stage) {
  appState.currentStage = stage;
  shell.dataset.stage = stage;
  stageLabel.textContent = {
    intro: '소개',
    prime: '귀여운 영상',
    brief: '시나리오 안내',
    game: '3D 시나리오',
    survey: '후속 평가',
    result: '로그 확인'
  }[stage];

  screens.forEach((screen) => {
    screen.classList.toggle('is-active', screen.dataset.screen === stage);
  });

  timelineItems.forEach((item) => {
    item.classList.toggle('is-active', item.dataset.stage === stage);
  });
}

function updateObjective(text, hint, timer) {
  objectiveText.textContent = text;
  interactionHint.textContent = hint;
  if (timer) {
    timerChip.textContent = timer;
  }
}

function toMapPercent(value, limit) {
  return `${((value + limit) / (limit * 2)) * 100}%`;
}

function renderGameGuide() {
  const guide = appState.gameGuide;
  gameTargetTitle.textContent = `현재 목표: ${guide.targetLocation}`;
  gameTargetRoute.textContent = guide.routeHint;
  mobileObjective.textContent = guide.interactionReady
    ? '노란 링 안입니다. E, Enter, 또는 하단 버튼으로 상호작용하세요.'
    : '미니맵과 노란 기둥을 따라 목표 지점으로 이동하세요.';
  gameTargetLocation.textContent = guide.targetLocation;
  interactionState.textContent = guide.interactionReady ? '상호작용 가능' : '이동 중';
  interactionState.classList.toggle('is-ready', guide.interactionReady);

  mapPlayerDot.style.left = toMapPercent(guide.playerPosition.x, guide.mapLimit);
  mapPlayerDot.style.top = toMapPercent(guide.playerPosition.z, guide.mapLimit);

  if (guide.targetPosition) {
    mapTargetDot.style.display = 'block';
    mapTargetDot.style.left = toMapPercent(guide.targetPosition.x, guide.mapLimit);
    mapTargetDot.style.top = toMapPercent(guide.targetPosition.z, guide.mapLimit);
  } else {
    mapTargetDot.style.display = 'none';
  }

  mapLandmarks.forEach((landmark) => {
    landmark.classList.toggle('is-active', landmark.dataset.mapId === guide.targetId);
  });
}

function renderScale(targetId, key) {
  const element = document.querySelector(`#${targetId}`);
  element.innerHTML = Array.from({ length: 7 }, (_, index) => {
    const value = index + 1;
    return `<button class="scale-button" data-key="${key}" data-value="${value}">${value}</button>`;
  }).join('');
}

renderScale('cuteness-scale', 'cuteness');
renderScale('justification-scale', 'justification');
renderScale('immersion-scale', 'immersion');

function refreshSurveyState() {
  document.querySelectorAll('.scale-button').forEach((button) => {
    const key = button.dataset.key;
    const value = Number(button.dataset.value);
    button.classList.toggle('is-selected', appState.ratings[key] === value);
  });

  finishSurveyButton.disabled = !Object.values(appState.ratings).every(Boolean);
}

refreshSurveyState();
renderGameGuide();

function requestDecision({ title, body, options }) {
  decisionTitle.textContent = title;
  decisionBody.textContent = body;
  decisionActions.innerHTML = '';
  decisionModal.classList.remove('is-hidden');

  return new Promise((resolve) => {
    for (const option of options) {
      const button = document.createElement('button');
      button.textContent = option.label;
      button.className = `modal-button ${option.tone ?? 'primary'}`;
      button.addEventListener(
        'click',
        () => {
          decisionModal.classList.add('is-hidden');
          resolve(option.id);
        },
        { once: true }
      );
      decisionActions.append(button);
    }
  });
}

let game = null;
let gameLoader = null;

async function ensureGame() {
  if (game) {
    return game;
  }

  if (!gameLoader) {
    gameLoader = import('./scenario-game.js').then(({ createScenarioGame }) => {
      game = createScenarioGame({
        canvas: document.querySelector('#game-canvas'),
        requestDecision,
        onUpdate: ({
          objective,
          interactHint,
          timer,
          scenario,
          targetId,
          targetLabel,
          targetLocation,
          routeHint,
          interactionReady,
          playerPosition,
          targetPosition,
          mapLimit
        }) => {
          updateObjective(objective, interactHint, timer);
          appState.scenario = {
            ...appState.scenario,
            ...scenario
          };
          appState.gameGuide = {
            targetId,
            targetLabel,
            targetLocation,
            routeHint,
            interactionReady,
            playerPosition,
            targetPosition,
            mapLimit
          };
          renderGameGuide();
        },
        onEvent: (event) => {
          if (event.scenarioSnapshot) {
            appState.scenario = {
              ...appState.scenario,
              ...event.scenarioSnapshot
            };
          }
          logEvent(event.type, event.detail);
        },
        onComplete: (payload) => {
          appState.scenario = {
            ...appState.scenario,
            ...payload
          };
          logEvent('scenario_completed', {
            completionMs: payload.completionMs,
            timedOut: payload.timedOut
          });
          setStage('survey');
          updateObjective(
            '후속 자기평가 문항을 완료하세요.',
            '평가가 끝나면 행동 로그를 확인할 수 있습니다.',
            '완료'
          );
        }
      });

      return game;
    });
  }

  return gameLoader;
}

function beginPrimeSequence() {
  setStage('prime');
  updateObjective(
    '15초 동안 귀여운 영상을 시청하세요.',
    '영상은 자동으로 넘어갑니다.',
    `${String(PRIME_DURATION_SECONDS).padStart(2, '0')}s`
  );

  const startedAt = performance.now();
  primeVideo.currentTime = 0;

  primeVideo
    .play()
    .catch(() => {
      logEvent('prime_playback_blocked');
    })
    .finally(() => {
      const tick = () => {
        const elapsed = performance.now() - startedAt;
        const clamped = Math.min(elapsed, PRIME_DURATION_SECONDS * 1000);
        appState.primeViewedMs = Math.round(clamped);

        const remaining = Math.max(
          0,
          Math.ceil((PRIME_DURATION_SECONDS * 1000 - clamped) / 1000)
        );
        const progress = clamped / (PRIME_DURATION_SECONDS * 1000);
        primeProgress.style.transform = `scaleX(${progress})`;
        primeCountdown.textContent = `${remaining}s`;
        timerChip.textContent = `${String(remaining).padStart(2, '0')}s`;

        if (clamped >= PRIME_DURATION_SECONDS * 1000) {
          primeVideo.pause();
          appState.primeCompleted = true;
          logEvent('prime_completed', {
            viewedMs: appState.primeViewedMs
          });
          setStage('brief');
          updateObjective(
            '시나리오 안내를 읽고 3D 과제를 시작하세요.',
            '다음 단계에서 실제 행동 과제가 시작됩니다.',
            '준비'
          );
          return;
        }

        window.requestAnimationFrame(tick);
      };

      window.requestAnimationFrame(tick);
    });
}

function buildResultPayload() {
  return {
    paperBasis: 'Zhang & Ye (2023)',
    prototype: {
      primeType: 'cute_video',
      primeDurationSeconds: PRIME_DURATION_SECONDS,
      primeViewedMs: appState.primeViewedMs,
      scenarioType: 'scholarship_exam_cheating'
    },
    scenario: {
      phoneChoice: appState.scenario.phoneChoice,
      examChoice: appState.scenario.examChoice,
      submitted: appState.scenario.submitted,
      timedOut: appState.scenario.timedOut,
      completionMs: appState.scenario.completionMs
    },
    ratings: appState.ratings,
    events: appState.runEvents
  };
}

function renderResults() {
  const cheated = appState.scenario.examChoice === 'used_leaked_answers';
  const timedOut = appState.scenario.timedOut;

  resultSummary.textContent = timedOut
    ? '제한 시간 안에 제출하지 못해 시나리오가 종료되었습니다.'
    : cheated
      ? '참가자는 유출 답안을 활용해 시험지를 제출했습니다.'
      : '참가자는 유출 답안을 사용하지 않고 시험지를 제출했습니다.';

  resultJson.textContent = JSON.stringify(buildResultPayload(), null, 2);
}

document.querySelector('#start-button').addEventListener('click', () => {
  resetState();
  logEvent('run_started');
  beginPrimeSequence();
});

document.querySelector('#enter-game-button').addEventListener('click', async () => {
  const currentGame = await ensureGame();
  setStage('game');
  updateObjective(
    '왼쪽 위 안내 데스크에서 시나리오를 시작하세요.',
    '노란 링 안에 들어가면 E, Enter, 또는 상호작용 버튼이 활성화됩니다.',
    '01:15'
  );
  currentGame.start();
  currentGame.resize();
  logEvent('game_started');
});

document.querySelectorAll('.scale-button').forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.key;
    const value = Number(button.dataset.value);
    appState.ratings[key] = value;
    logEvent('rating_answered', { key, value });
    refreshSurveyState();
  });
});

finishSurveyButton.addEventListener('click', () => {
  renderResults();
  setStage('result');
  updateObjective(
    '로그를 확인하고 다시 실행할 수 있습니다.',
    '실험 서버 연동 전 단계에서는 JSON 확인만 지원합니다.',
    '완료'
  );
});

document.querySelector('#restart-button').addEventListener('click', () => {
  primeVideo.pause();
  primeProgress.style.transform = 'scaleX(0)';
  primeCountdown.textContent = `${PRIME_DURATION_SECONDS}s`;
  resetState();
  refreshSurveyState();
  setStage('intro');
  updateObjective(
    '실험 시작 버튼을 눌러 준비하세요.',
    '본 프로토타입은 데스크톱과 모바일 모두에서 실행됩니다.',
    '01:15'
  );
  if (game) {
    game.stop();
  }
  renderGameGuide();
  logEvent('run_reset');
});

document.querySelector('#copy-results-button').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(resultJson.textContent);
    logEvent('results_copied');
  } catch (error) {
    logEvent('results_copy_failed', { message: error.message });
  }
});

document.querySelector('#touch-interact').addEventListener('click', () => {
  if (game) {
    game.interact();
  }
});

function bindPressButton(button, control) {
  const press = (event) => {
    event.preventDefault();
    if (game) {
      game.setControl(control, true);
    }
  };

  const release = (event) => {
    event.preventDefault();
    if (game) {
      game.setControl(control, false);
    }
  };

  button.addEventListener('pointerdown', press);
  button.addEventListener('pointerup', release);
  button.addEventListener('pointerleave', release);
  button.addEventListener('pointercancel', release);
}

document.querySelectorAll('[data-control]').forEach((button) => {
  bindPressButton(button, button.dataset.control);
});

window.addEventListener('keydown', (event) => {
  if (decisionModal.classList.contains('is-hidden') === false) {
    return;
  }

  if (!game) {
    return;
  }

  if (event.code === 'KeyW' || event.code === 'ArrowUp') {
    game.setControl('forward', true);
  } else if (event.code === 'KeyS' || event.code === 'ArrowDown') {
    game.setControl('backward', true);
  } else if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
    game.setControl('left', true);
  } else if (event.code === 'KeyD' || event.code === 'ArrowRight') {
    game.setControl('right', true);
  } else if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    game.setControl('sprint', true);
  } else if (event.code === 'KeyE' || event.code === 'Enter' || event.code === 'Space') {
    if (event.repeat) {
      return;
    }
    event.preventDefault();
    game.interact();
  }
});

window.addEventListener('keyup', (event) => {
  if (!game) {
    return;
  }

  if (event.code === 'KeyW' || event.code === 'ArrowUp') {
    game.setControl('forward', false);
  } else if (event.code === 'KeyS' || event.code === 'ArrowDown') {
    game.setControl('backward', false);
  } else if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
    game.setControl('left', false);
  } else if (event.code === 'KeyD' || event.code === 'ArrowRight') {
    game.setControl('right', false);
  } else if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    game.setControl('sprint', false);
  }
});

window.addEventListener('resize', () => {
  if (game) {
    game.resize();
  }
});

setStage('intro');
updateObjective(
  '실험 시작 버튼을 눌러 준비하세요.',
  '본 프로토타입은 데스크톱과 모바일 모두에서 실행됩니다.',
  '01:15'
);
