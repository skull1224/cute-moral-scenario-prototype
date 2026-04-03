import './style.css';

const STIMULUS_DURATION_MS = 5000;
const STIMULUS_COUNT = 5;
const STIMULUS_LIBRARY_COUNTS = {
  neutral: 80,
  cute: 65
};

const CONDITIONS = {
  neutral: {
    code: 'A',
    label: '보통 자극',
    description: '일상적인 중립 그림 5장',
    accent: 'neutral'
  },
  cute: {
    code: 'B',
    label: '귀여운 자극',
    description: '귀여운 동물 그림 5장',
    accent: 'cute'
  }
};

const STIMULI = {
  neutral: Array.from({ length: STIMULUS_LIBRARY_COUNTS.neutral }, (_, index) => ({
    id: `neutral-${String(index + 1).padStart(2, '0')}`,
    src: `/stimuli/neutral/neutral-${String(index + 1).padStart(2, '0')}.jpg`
  })),
  cute: Array.from({ length: STIMULUS_LIBRARY_COUNTS.cute }, (_, index) => ({
    id: `cute-${String(index + 1).padStart(2, '0')}`,
    src: `/stimuli/cute/cute-${String(index + 1).padStart(2, '0')}.jpg`
  }))
};

const VIGNETTES = [
  {
    id: 'exam-cheating',
    title: '시나리오 1. 시험 부정행위',
    text:
      '이화는 평소 스스로에게 높은 기준을 두는 대학생입니다. 기말고사에서 다른 과목은 준비를 잘했지만 마지막 과목은 시간이 부족해 충분히 복습하지 못했습니다. 장학금을 유지하려면 높은 점수가 필요하다고 느낀 이화는 시험 중 부정행위를 하기로 했고, 결국 좋은 성적을 받아 장학금을 받았습니다.'
  },
  {
    id: 'ghost-writing',
    title: '시나리오 2. 대필 논문 제출',
    text:
      '민수는 국비 해외연수 선발 경쟁이 매우 치열한 학과에 다니고 있습니다. 전반적인 성적과 활동은 우수했지만 연구 역량은 아직 부족했습니다. 선발 가능성을 높이기 위해 다른 사람에게 논문 작성을 대신 부탁했고, 그 논문을 제출해 결국 해외연수 기회를 얻었습니다.'
  },
  {
    id: 'resume-fabrication',
    title: '시나리오 3. 이력서 허위 기재',
    text:
      '지현은 졸업을 앞두고 대기업 인턴 자리에 지원했습니다. 학점은 우수했지만 아르바이트나 실습 경험이 거의 없어 이력서가 비어 보였습니다. 경쟁이 치열한 인턴 자리를 꼭 얻고 싶었던 지현은 실제로 하지 않은 실무 경험을 이력서에 적었고, 결국 그 인턴 자리를 얻게 되었습니다.'
  }
];

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="shell">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>

    <aside class="side-panel">
      <section class="status-card">
        <div class="status-header">
          <div>
            <span class="meta-label">현재 단계</span>
            <strong id="stage-label">소개</strong>
          </div>
          <div class="timer-chip" id="timer-chip">대기</div>
        </div>
        <p class="objective-label">현재 목표</p>
        <h2 id="objective-text">조건 A 또는 B를 선택하세요.</h2>
        <p class="interaction-hint" id="interaction-hint">
          선택한 조건에 따라 사진 평정 과제가 시작됩니다.
        </p>
      </section>
    </aside>

    <main class="main-panel">
      <section class="screen is-active" data-screen="intro">
        <div class="hero-card intro-card">
          <span class="screen-tag">Experiment Guide</span>
          <h2>안내를 읽고 조건 A 또는 B를 선택하세요.</h2>
          <p>
            먼저 사진을 보면서 각 자극에 대해 1점에서 7점 사이로 응답합니다. 이후에는 사진 과제와는
            별개의 시나리오 판단 과제가 이어집니다.
          </p>
          <div class="intro-guide">
            <article>
              <h3>1. 시작</h3>
              <p>아래의 조건 A 또는 B 중 하나를 선택하면 실험이 바로 시작됩니다.</p>
            </article>
            <article>
              <h3>2. 사진 평정</h3>
              <p>사진은 총 5장 제시되며 각 사진은 5초 동안 나타납니다. 1~7점으로 응답해 주세요.</p>
            </article>
            <article>
              <h3>3. 시나리오 판단</h3>
              <p>사진 과제 후에는 짧은 상황 설명을 읽고 행동의 도덕성을 1~7점으로 평정합니다.</p>
            </article>
          </div>
          <div class="condition-grid">
            <button class="condition-button code-button" data-condition="neutral">
              <span class="condition-key">A</span>
              <strong>조건 A</strong>
            </button>
            <button class="condition-button code-button" data-condition="cute">
              <span class="condition-key">B</span>
              <strong>조건 B</strong>
            </button>
          </div>
          <p class="footnote">키보드 <code>A</code>, <code>B</code>로도 선택할 수 있습니다.</p>
        </div>
      </section>

      <section class="screen" data-screen="stimuli">
        <div class="stimulus-stage">
          <div class="stimulus-topbar">
            <div class="stimulus-badge" id="stimulus-condition-badge">사진 평정</div>
            <div class="stimulus-counter" id="stimulus-counter">1 / 5</div>
          </div>

          <div class="stimulus-frame">
            <img id="stimulus-image" class="stimulus-image" alt="experiment stimulus" />
          </div>

          <div class="stimulus-bottom-panel">
            <div class="stimulus-timer">
              <span>남은 시간</span>
              <strong id="stimulus-countdown">5.0</strong>
            </div>

            <div class="stimulus-progress">
              <div id="stimulus-progress-fill" class="stimulus-progress-fill"></div>
            </div>

            <div class="rating-prompt-wrap">
              <p class="rating-prompt">이 사진이 얼마나 귀여웠나요?</p>
              <p class="rating-hint">1 = 전혀 귀엽지 않음, 7 = 매우 귀여움</p>
            </div>

            <div class="scale compact-scale" id="stimulus-scale"></div>
            <p class="keyboard-hint">숫자 키 1~7 또는 버튼 클릭으로 응답</p>
          </div>
        </div>
      </section>

      <section class="screen" data-screen="bridge">
        <div class="survey-card vignette-card">
          <span class="screen-tag">Task Transition</span>
          <h2>다음 과제는 앞선 사진 평정과는 별개의 과제입니다.</h2>
          <p>
            앞서 수행한 사진 평정 과제는 여기서 종료되었습니다. 이제부터는 사진과 직접 관련이 없는
            새로운 판단 과제를 수행하게 됩니다.
          </p>
          <p>
            아래에는 짧은 상황 설명이 차례대로 제시됩니다. 각 상황을 읽고, 등장인물의 행동이 얼마나
            도덕적인지 1점에서 7점 사이로 응답해 주세요.
          </p>

          <div class="question-card">
            <h3>응답 기준</h3>
            <div class="scale-labels">
              <span>1 매우 비도덕적</span>
              <span>7 매우 도덕적</span>
            </div>
          </div>

          <div class="vignette-actions">
            <button class="primary-button" id="start-vignette-button">시나리오 과제 시작</button>
          </div>
        </div>
      </section>

      <section class="screen" data-screen="vignette">
        <div class="survey-card vignette-card">
          <span class="screen-tag">Moral Judgment</span>
          <div class="vignette-head">
            <h2 id="vignette-title">시나리오 1</h2>
            <span class="vignette-counter" id="vignette-counter">1 / 3</span>
          </div>
          <p id="vignette-text" class="vignette-text"></p>

          <div class="question-card">
            <h3>주인공의 행동은 얼마나 도덕적이라고 생각하나요?</h3>
            <div class="scale" id="vignette-scale"></div>
            <div class="scale-labels">
              <span>1 매우 비도덕적</span>
              <span>7 매우 도덕적</span>
            </div>
          </div>

          <div class="vignette-actions">
            <button class="primary-button" id="next-vignette-button" disabled>다음 시나리오</button>
          </div>
        </div>
      </section>

      <section class="screen" data-screen="result">
        <div class="result-card">
          <span class="screen-tag">Experiment Complete</span>
          <h2>실험이 완료되었습니다.</h2>
          <p id="result-summary"></p>
          <div class="result-actions">
            <button class="secondary-button" id="download-csv-button">CSV 다시 저장</button>
            <button class="primary-button" id="restart-button">처음으로 돌아가기</button>
          </div>
        </div>
      </section>
    </main>
  </div>
`;

const screens = [...document.querySelectorAll('.screen')];
const shell = document.querySelector('.shell');
const stageLabel = document.querySelector('#stage-label');
const timerChip = document.querySelector('#timer-chip');
const objectiveText = document.querySelector('#objective-text');
const interactionHint = document.querySelector('#interaction-hint');

const stimulusImage = document.querySelector('#stimulus-image');
const stimulusConditionBadge = document.querySelector('#stimulus-condition-badge');
const stimulusCounter = document.querySelector('#stimulus-counter');
const stimulusCountdown = document.querySelector('#stimulus-countdown');
const stimulusProgressFill = document.querySelector('#stimulus-progress-fill');
const stimulusScale = document.querySelector('#stimulus-scale');

const vignetteTitle = document.querySelector('#vignette-title');
const vignetteCounter = document.querySelector('#vignette-counter');
const vignetteText = document.querySelector('#vignette-text');
const vignetteScale = document.querySelector('#vignette-scale');
const nextVignetteButton = document.querySelector('#next-vignette-button');
const startVignetteButton = document.querySelector('#start-vignette-button');

const resultSummary = document.querySelector('#result-summary');
const downloadCsvButton = document.querySelector('#download-csv-button');

const appState = {
  stage: 'intro',
  sessionId: null,
  condition: null,
  sessionStartedAt: null,
  stimulusDeck: [],
  stimulusIndex: 0,
  currentStimulusRating: null,
  currentStimulusRatingAt: null,
  currentStimulusStartedAt: null,
  currentStimulusFrame: 0,
  stimulusResponses: [],
  vignetteIndex: 0,
  currentVignetteRating: null,
  vignetteResponses: [],
  csvDownloaded: false,
  events: []
};

function stageName(stage) {
  return {
    intro: '실험 안내',
    stimuli: '사진 평정',
    bridge: '전환 안내',
    vignette: '시나리오 평정',
    result: '결과 확인'
  }[stage];
}

function conditionCode(condition) {
  return condition ? CONDITIONS[condition].code : '미선택';
}

function shuffle(items) {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
}

function createSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function renderScale(target, type) {
  target.innerHTML = Array.from({ length: 7 }, (_, index) => {
    const value = index + 1;
    return `
      <button class="scale-button" data-scale-type="${type}" data-value="${value}">
        ${value}
      </button>
    `;
  }).join('');
}

renderScale(stimulusScale, 'stimulus');
renderScale(vignetteScale, 'vignette');

function updateScaleSelection(target, value) {
  target.querySelectorAll('.scale-button').forEach((button) => {
    button.classList.toggle('is-selected', Number(button.dataset.value) === value);
  });
}

function logEvent(type, detail = {}) {
  const record = {
    type,
    detail,
    elapsedMs: appState.sessionStartedAt
      ? Math.round(performance.now() - appState.sessionStartedAt)
      : 0,
    recordedAt: new Date().toISOString()
  };

  appState.events.push(record);
}

function setStage(stage) {
  appState.stage = stage;
  shell.dataset.stage = stage;
  stageLabel.textContent = stageName(stage);

  screens.forEach((screen) => {
    screen.classList.toggle('is-active', screen.dataset.screen === stage);
  });
}

function updateStatus({ objective, hint, timer }) {
  objectiveText.textContent = objective;
  interactionHint.textContent = hint;
  timerChip.textContent = timer;
}

function resetExperiment() {
  appState.stage = 'intro';
  appState.sessionId = null;
  appState.condition = null;
  appState.sessionStartedAt = null;
  appState.stimulusDeck = [];
  appState.stimulusIndex = 0;
  appState.currentStimulusRating = null;
  appState.currentStimulusRatingAt = null;
  appState.currentStimulusStartedAt = null;
  if (appState.currentStimulusFrame) {
    window.cancelAnimationFrame(appState.currentStimulusFrame);
  }
  appState.currentStimulusFrame = 0;
  appState.stimulusResponses = [];
  appState.vignetteIndex = 0;
  appState.currentVignetteRating = null;
  appState.vignetteResponses = [];
  appState.csvDownloaded = false;
  appState.events = [];
  updateScaleSelection(stimulusScale, null);
  updateScaleSelection(vignetteScale, null);
  setStage('intro');
  updateStatus({
    objective: '안내를 읽고 조건 A 또는 B를 선택하세요.',
    hint: '선택 즉시 사진 평정 과제가 시작됩니다.',
    timer: '대기'
  });
}

function preloadUpcomingStimuli(deck, index) {
  deck.slice(index + 1, index + 4).forEach((item) => {
    const image = new Image();
    image.src = item.src;
  });
}

function startExperiment(condition) {
  appState.sessionId = createSessionId();
  appState.sessionStartedAt = performance.now();
  appState.condition = condition;
  appState.stimulusDeck = shuffle(STIMULI[condition]).slice(0, STIMULUS_COUNT);
  appState.stimulusIndex = 0;
  appState.stimulusResponses = [];
  appState.vignetteResponses = [];
  appState.vignetteIndex = 0;
  appState.currentVignetteRating = null;
  appState.csvDownloaded = false;
  logEvent('condition_selected', { conditionCode: conditionCode(condition) });
  setStage('stimuli');
  loadStimulus(0);
}

function loadStimulus(index) {
  const stimulus = appState.stimulusDeck[index];

  if (!stimulus) {
    startVignettes();
    return;
  }

  appState.stimulusIndex = index;
  appState.currentStimulusRating = null;
  appState.currentStimulusRatingAt = null;
  appState.currentStimulusStartedAt = performance.now();
  updateScaleSelection(stimulusScale, null);

  stimulusImage.src = stimulus.src;
  stimulusConditionBadge.textContent = '사진 평정';
  stimulusConditionBadge.dataset.accent = 'generic';
  stimulusCounter.textContent = `${index + 1} / ${STIMULUS_COUNT}`;
  updateStatus({
    objective: `${index + 1}번째 사진을 1~7점으로 평정하세요.`,
    hint: '사진은 5초 후 자동으로 다음 자극으로 넘어갑니다.',
    timer: '5.0s'
  });

  preloadUpcomingStimuli(appState.stimulusDeck, index);
  tickStimulus();
}

function tickStimulus() {
  const elapsed = performance.now() - appState.currentStimulusStartedAt;
  const remaining = Math.max(0, STIMULUS_DURATION_MS - elapsed);
  const seconds = (remaining / 1000).toFixed(1);
  const progress = elapsed / STIMULUS_DURATION_MS;

  stimulusCountdown.textContent = seconds;
  timerChip.textContent = `${seconds}s`;
  stimulusProgressFill.style.transform = `scaleX(${Math.min(progress, 1)})`;

  if (elapsed >= STIMULUS_DURATION_MS) {
    finalizeStimulus();
    return;
  }

  appState.currentStimulusFrame = window.requestAnimationFrame(tickStimulus);
}

function recordStimulusRating(value) {
  if (appState.stage !== 'stimuli') {
    return;
  }

  appState.currentStimulusRating = value;
  appState.currentStimulusRatingAt = performance.now();
  updateScaleSelection(stimulusScale, value);
}

function finalizeStimulus() {
  window.cancelAnimationFrame(appState.currentStimulusFrame);
  appState.currentStimulusFrame = 0;

  const stimulus = appState.stimulusDeck[appState.stimulusIndex];
  const response = {
    stimulusId: stimulus.id,
    conditionCode: conditionCode(appState.condition),
    rating: appState.currentStimulusRating,
    responseMs: appState.currentStimulusRatingAt
      ? Math.round(appState.currentStimulusRatingAt - appState.currentStimulusStartedAt)
      : null,
    viewedMs: STIMULUS_DURATION_MS
  };

  appState.stimulusResponses.push(response);
  logEvent('stimulus_completed', {
    stimulusId: response.stimulusId,
    rating: response.rating
  });

  loadStimulus(appState.stimulusIndex + 1);
}

function startVignettes() {
  setStage('bridge');
  updateStatus({
    objective: '다음은 별개의 시나리오 판단 과제입니다.',
    hint: '안내를 읽은 뒤 시나리오 과제를 시작하세요.',
    timer: '안내'
  });
}

function beginVignetteRatings() {
  setStage('vignette');
  renderVignette(0);
}

function renderVignette(index) {
  const vignette = VIGNETTES[index];
  appState.vignetteIndex = index;
  appState.currentVignetteRating = null;
  updateScaleSelection(vignetteScale, null);
  nextVignetteButton.disabled = true;
  nextVignetteButton.textContent =
    index === VIGNETTES.length - 1 ? '결과 보기' : '다음 시나리오';
  vignetteTitle.textContent = vignette.title;
  vignetteCounter.textContent = `${index + 1} / ${VIGNETTES.length}`;
  vignetteText.textContent = vignette.text;
  updateStatus({
    objective: `${index + 1}번째 시나리오를 1~7점으로 평정하세요.`,
    hint: '1은 매우 비도덕적, 7은 매우 도덕적입니다.',
    timer: '평정'
  });
}

function recordVignetteRating(value) {
  if (appState.stage !== 'vignette') {
    return;
  }

  appState.currentVignetteRating = value;
  updateScaleSelection(vignetteScale, value);
  nextVignetteButton.disabled = false;
}

function finalizeCurrentVignette() {
  if (appState.currentVignetteRating == null) {
    return;
  }

  const vignette = VIGNETTES[appState.vignetteIndex];
  appState.vignetteResponses.push({
    vignetteId: vignette.id,
    rating: appState.currentVignetteRating
  });

  logEvent('vignette_completed', {
    vignetteId: vignette.id,
    rating: appState.currentVignetteRating
  });

  if (appState.vignetteIndex === VIGNETTES.length - 1) {
    showResults();
    return;
  }

  renderVignette(appState.vignetteIndex + 1);
}

function average(values) {
  if (!values.length) {
    return null;
  }
  const sum = values.reduce((acc, value) => acc + value, 0);
  return Number((sum / values.length).toFixed(2));
}

function escapeCsvValue(value) {
  if (value == null) {
    return '';
  }
  const stringValue = String(value).replace(/"/g, '""');
  return `"${stringValue}"`;
}

function buildCsv() {
  const headers = [
    'session_id',
    'condition',
    'phase',
    'trial_index',
    'item_id',
    'item_label',
    'rating',
    'response_ms',
    'viewed_ms'
  ];

  const rows = [headers.join(',')];

  appState.stimulusResponses.forEach((response, index) => {
    rows.push(
      [
        appState.sessionId,
        conditionCode(appState.condition),
        'stimulus',
        index + 1,
        response.stimulusId,
        'cuteness_rating',
        response.rating ?? '',
        response.responseMs ?? '',
        response.viewedMs ?? ''
      ]
        .map(escapeCsvValue)
        .join(',')
    );
  });

  appState.vignetteResponses.forEach((response, index) => {
    const vignette = VIGNETTES.find((item) => item.id === response.vignetteId);
    rows.push(
      [
        appState.sessionId,
        conditionCode(appState.condition),
        'vignette',
        index + 1,
        response.vignetteId,
        vignette?.title ?? response.vignetteId,
        response.rating ?? '',
        '',
        ''
      ]
        .map(escapeCsvValue)
        .join(',')
    );
  });

  return rows.join('\n');
}

function downloadCsv() {
  const csv = buildCsv();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${appState.sessionId}-${conditionCode(appState.condition)}-results.csv`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  appState.csvDownloaded = true;
  logEvent('csv_downloaded', {
    filename: `${appState.sessionId}-${conditionCode(appState.condition)}-results.csv`
  });
}

function showResults() {
  const stimulusMean = average(
    appState.stimulusResponses
      .filter((response) => response.rating != null)
      .map((response) => response.rating)
  );
  const moralMean = average(appState.vignetteResponses.map((response) => response.rating));

  logEvent('experiment_completed', {
    conditionCode: conditionCode(appState.condition),
    meanStimulusRating: stimulusMean,
    meanMoralRating: moralMean
  });

  const missingCount = appState.stimulusResponses.filter((response) => response.rating == null).length;
  resultSummary.textContent =
    `조건 ${conditionCode(appState.condition)}에서 사진 ${appState.stimulusResponses.length}장을 제시했습니다. ` +
    `사진 귀여움 평균은 ${stimulusMean ?? 'N/A'}점, ` +
    `시나리오 도덕성 평균은 ${moralMean ?? 'N/A'}점입니다. ` +
    `사진 응답 누락은 ${missingCount}개입니다.`;
  setStage('result');
  updateStatus({
    objective: '실험이 완료되었습니다.',
    hint: '결과 CSV는 자동으로 저장되며, 필요하면 다시 저장할 수 있습니다.',
    timer: '완료'
  });
  downloadCsv();
}

function handleScaleClick(event) {
  const button = event.target.closest('.scale-button');
  if (!button) {
    return;
  }

  const value = Number(button.dataset.value);
  const type = button.dataset.scaleType;

  if (type === 'stimulus') {
    recordStimulusRating(value);
  } else if (type === 'vignette') {
    recordVignetteRating(value);
  }
}

document.querySelectorAll('[data-condition]').forEach((button) => {
  button.addEventListener('click', () => {
    startExperiment(button.dataset.condition);
  });
});

stimulusScale.addEventListener('click', handleScaleClick);
vignetteScale.addEventListener('click', handleScaleClick);

nextVignetteButton.addEventListener('click', finalizeCurrentVignette);
startVignetteButton.addEventListener('click', beginVignetteRatings);
downloadCsvButton.addEventListener('click', downloadCsv);

document.querySelector('#restart-button').addEventListener('click', resetExperiment);

window.addEventListener('keydown', (event) => {
  if (appState.stage === 'intro') {
    if (event.code === 'KeyA') {
      startExperiment('neutral');
    } else if (event.code === 'KeyB') {
      startExperiment('cute');
    }
    return;
  }

  const keyValue = Number(event.key);
  const validScaleKey = Number.isInteger(keyValue) && keyValue >= 1 && keyValue <= 7;

  if (appState.stage === 'stimuli' && validScaleKey) {
    recordStimulusRating(keyValue);
    return;
  }

  if (appState.stage === 'bridge') {
    if (event.code === 'Enter' || event.code === 'Space') {
      event.preventDefault();
      beginVignetteRatings();
    }
    return;
  }

  if (appState.stage === 'vignette') {
    if (validScaleKey) {
      recordVignetteRating(keyValue);
      return;
    }

    if ((event.code === 'Enter' || event.code === 'Space') && !nextVignetteButton.disabled) {
      event.preventDefault();
      finalizeCurrentVignette();
    }
  }
});

resetExperiment();
