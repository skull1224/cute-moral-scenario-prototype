import * as THREE from 'three';

const ROOM_LIMIT = 5.7;
const MOVE_SPEED = 3.1;
const RUN_SPEED = 4.5;
const TIME_LIMIT_MS = 75_000;
const MAP_LIMIT = 6.1;

const BLOCKERS = [
  { minX: -5.6, maxX: -2.6, minZ: 3.0, maxZ: 5.4 },
  { minX: 2.4, maxX: 5.3, minZ: 3.1, maxZ: 5.3 },
  { minX: -1.9, maxX: 1.9, minZ: -1.7, maxZ: 0.8 },
  { minX: -5.5, maxX: -3.7, minZ: -5.3, maxZ: -3.4 }
];

const OBJECTIVES = {
  intro: '왼쪽 위 안내 데스크로 가서 시험 지시문을 확인하세요.',
  phone: '오른쪽 위 책상으로 가서 휴대폰 메시지를 확인하세요.',
  exam: '가운데 시험 책상에서 답안 작성 방식을 결정하세요.',
  submit: '왼쪽 아래 제출함으로 이동해 답안을 제출하세요.',
  done: '시나리오가 종료되었습니다.'
};

const TARGET_META = {
  briefingDesk: {
    locationLabel: '왼쪽 위 안내 데스크',
    shortLabel: '지시문 데스크'
  },
  phone: {
    locationLabel: '오른쪽 위 휴대폰 책상',
    shortLabel: '휴대폰 책상'
  },
  examDesk: {
    locationLabel: '가운데 시험 책상',
    shortLabel: '시험 책상'
  },
  submitBox: {
    locationLabel: '왼쪽 아래 제출함',
    shortLabel: '제출함'
  }
};

function createMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.55,
    metalness: 0.08
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function insideBlocker(x, z) {
  return BLOCKERS.some(
    (blocker) =>
      x > blocker.minX &&
      x < blocker.maxX &&
      z > blocker.minZ &&
      z < blocker.maxZ
  );
}

function formatRemaining(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function createLabelSprite(text, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'rgba(255, 250, 243, 0.94)';
  context.strokeStyle = color;
  context.lineWidth = 8;

  const x = 12;
  const y = 12;
  const width = canvas.width - 24;
  const height = canvas.height - 24;
  const radius = 28;

  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  context.fill();
  context.stroke();

  context.fillStyle = '#2b231f';
  context.font = '700 40px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    })
  );
  sprite.scale.set(2.15, 0.54, 1);
  sprite.position.y = 2.22;
  return sprite;
}

function getRouteHint(playerPosition, targetPosition, isReady) {
  if (!targetPosition) {
    return '시나리오가 종료되었습니다.';
  }

  if (isReady) {
    return '노란 링 안에 들어왔습니다. E, Enter, 또는 하단 상호작용 버튼을 누르세요.';
  }

  const dx = targetPosition.x - playerPosition.x;
  const dz = targetPosition.z - playerPosition.z;
  const parts = [];

  if (Math.abs(dx) > 0.8) {
    parts.push(dx > 0 ? '오른쪽' : '왼쪽');
  }

  if (Math.abs(dz) > 0.8) {
    parts.push(dz > 0 ? '아래쪽' : '위쪽');
  }

  if (!parts.length) {
    return '조금만 더 가까이 가서 노란 링 안으로 들어오세요.';
  }

  return `${parts.join(' ')} 방향으로 이동해 노란 링 안에 들어오세요.`;
}

function createRoom(scene) {
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(12.8, 0.2, 12.8),
    createMaterial('#d7d1c7')
  );
  floor.position.y = -0.1;
  scene.add(floor);

  const rug = new THREE.Mesh(
    new THREE.BoxGeometry(4.7, 0.04, 3.2),
    createMaterial('#c86a4c')
  );
  rug.position.set(0, 0.03, -0.4);
  scene.add(rug);

  const wallMaterial = createMaterial('#f5eee5');

  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(13, 4.5, 0.25),
    wallMaterial
  );
  backWall.position.set(0, 2.1, -6.1);
  scene.add(backWall);

  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 4.5, 13),
    wallMaterial
  );
  leftWall.position.set(-6.1, 2.1, 0);
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 4.5, 13),
    wallMaterial
  );
  rightWall.position.set(6.1, 2.1, 0);
  scene.add(rightWall);

  const ceilingGlow = new THREE.Mesh(
    new THREE.BoxGeometry(6.2, 0.08, 2.2),
    new THREE.MeshStandardMaterial({
      color: '#fff6df',
      emissive: '#fff5d7',
      emissiveIntensity: 0.8,
      roughness: 0.3
    })
  );
  ceilingGlow.position.set(0, 4.05, 0);
  scene.add(ceilingGlow);
}

function createDesk({ width, depth, color, topColor }) {
  const group = new THREE.Group();
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.18, depth),
    createMaterial(topColor)
  );
  top.position.y = 0.86;
  group.add(top);

  const legGeometry = new THREE.BoxGeometry(0.18, 0.82, 0.18);
  const legMaterial = createMaterial(color);
  const legOffsets = [
    [width / 2 - 0.16, 0.41, depth / 2 - 0.16],
    [width / 2 - 0.16, 0.41, -depth / 2 + 0.16],
    [-width / 2 + 0.16, 0.41, depth / 2 - 0.16],
    [-width / 2 + 0.16, 0.41, -depth / 2 + 0.16]
  ];

  for (const [x, y, z] of legOffsets) {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(x, y, z);
    group.add(leg);
  }

  return group;
}

function createInteractable(id, label, badgeText, color) {
  const group = new THREE.Group();

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.06, 16, 48),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.38,
      roughness: 0.3,
      metalness: 0.15
    })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.08;
  group.add(ring);

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.58, 2.6, 20, 1, true),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );
  beam.position.y = 1.32;
  group.add(beam);

  const beacon = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.16, 0),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.82,
      roughness: 0.4
    })
  );
  beacon.position.y = 1.45;
  group.add(beacon);

  const labelSprite = createLabelSprite(badgeText, color);
  group.add(labelSprite);

  return {
    id,
    label,
    group,
    ring,
    beam,
    beacon,
    labelSprite,
    labelScale: { x: 2.15, y: 0.54 },
    radius: 1.8
  };
}

function createScenarioProps(scene) {
  const props = new Map();

  const briefingDesk = createDesk({
    width: 2.5,
    depth: 1.7,
    color: '#6b5243',
    topColor: '#8a6d5a'
  });
  briefingDesk.position.set(-4.1, 0, 4.1);
  scene.add(briefingDesk);

  const briefingCard = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.05, 0.65),
    createMaterial('#fff7ea')
  );
  briefingCard.position.set(-4.1, 0.98, 4.15);
  scene.add(briefingCard);

  const phoneDesk = createDesk({
    width: 2.2,
    depth: 1.6,
    color: '#5f4c43',
    topColor: '#7f6659'
  });
  phoneDesk.position.set(4, 0, 4.1);
  scene.add(phoneDesk);

  const phone = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.05, 0.42),
    createMaterial('#1f2328')
  );
  phone.position.set(4.05, 0.96, 4.0);
  scene.add(phone);

  const examDesk = createDesk({
    width: 3.2,
    depth: 2.1,
    color: '#6f5d4c',
    topColor: '#9f8572'
  });
  examDesk.position.set(0, 0, -0.5);
  scene.add(examDesk);

  const examPaper = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.04, 0.7),
    createMaterial('#fffdf7')
  );
  examPaper.position.set(0.2, 0.98, -0.42);
  scene.add(examPaper);

  const monitor = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.45, 0.08),
    createMaterial('#24343c')
  );
  monitor.position.set(-0.75, 1.25, -1.1);
  scene.add(monitor);

  const monitorStand = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.28, 0.12),
    createMaterial('#2e4247')
  );
  monitorStand.position.set(-0.75, 0.99, -1.1);
  scene.add(monitorStand);

  const submitDesk = createDesk({
    width: 1.35,
    depth: 1.45,
    color: '#5b4638',
    topColor: '#7a5d4e'
  });
  submitDesk.position.set(-4.55, 0, -4.4);
  scene.add(submitDesk);

  const submitBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.9, 0.8),
    createMaterial('#c95d35')
  );
  submitBox.position.set(-4.55, 1.35, -4.38);
  scene.add(submitBox);

  const slot = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.04, 0.12),
    createMaterial('#5c2310')
  );
  slot.position.set(-4.55, 1.62, -4.02);
  scene.add(slot);

  const plantPot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.34, 0.45, 18),
    createMaterial('#ca6b48')
  );
  plantPot.position.set(4.8, 0.22, -4.85);
  scene.add(plantPot);

  const plant = new THREE.Mesh(
    new THREE.ConeGeometry(0.55, 1.1, 18),
    createMaterial('#557e52')
  );
  plant.position.set(4.8, 0.95, -4.85);
  scene.add(plant);

  const plush = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, 24, 18),
    createMaterial('#f0b8a5')
  );
  plush.position.set(4.7, 1.02, 4.72);
  scene.add(plush);

  const plushEarLeft = new THREE.Mesh(
    new THREE.ConeGeometry(0.14, 0.22, 18),
    createMaterial('#f0b8a5')
  );
  plushEarLeft.position.set(4.48, 1.32, 4.72);
  plushEarLeft.rotation.z = -0.4;
  scene.add(plushEarLeft);

  const plushEarRight = new THREE.Mesh(
    new THREE.ConeGeometry(0.14, 0.22, 18),
    createMaterial('#f0b8a5')
  );
  plushEarRight.position.set(4.92, 1.32, 4.72);
  plushEarRight.rotation.z = 0.4;
  scene.add(plushEarRight);

  props.set('briefingDesk', {
    ...createInteractable('briefingDesk', '시험 지시문 확인', '지시문', '#da6f4b'),
    position: new THREE.Vector3(-4.1, 0, 4.1)
  });
  props.set('phone', {
    ...createInteractable('phone', '휴대폰 메시지 확인', '휴대폰', '#3f8f9f'),
    position: new THREE.Vector3(4, 0, 4.1)
  });
  props.set('examDesk', {
    ...createInteractable('examDesk', '시험지 작성 방식 결정', '시험지', '#d2a93f'),
    position: new THREE.Vector3(0, 0, -0.4)
  });
  props.set('submitBox', {
    ...createInteractable('submitBox', '답안 제출', '제출함', '#a14932'),
    position: new THREE.Vector3(-4.55, 0, -4.38)
  });

  for (const prop of props.values()) {
    prop.group.position.copy(prop.position);
    scene.add(prop.group);
  }

  return props;
}

function createPlayer(scene) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.32, 0.8, 6, 16),
    createMaterial('#364045')
  );
  body.position.y = 0.88;
  group.add(body);

  const accent = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 0.22, 0.18),
    createMaterial('#f2be6d')
  );
  accent.position.set(0, 1.02, 0.3);
  group.add(accent);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 20, 20),
    createMaterial('#f1dcc6')
  );
  head.position.y = 1.62;
  group.add(head);

  group.position.set(0, 0, 5);
  scene.add(group);

  return group;
}

export function createScenarioGame({
  canvas,
  requestDecision,
  onUpdate,
  onEvent,
  onComplete
}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#f6eee6');
  scene.fog = new THREE.Fog('#f6eee6', 10, 22);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 12.6, 12.2);
  camera.lookAt(0, 1.1, 0);

  const hemisphere = new THREE.HemisphereLight('#fff8ef', '#6b6057', 1.8);
  scene.add(hemisphere);

  const key = new THREE.DirectionalLight('#fff5db', 1.7);
  key.position.set(5, 9, 3);
  scene.add(key);

  const fill = new THREE.PointLight('#d97c58', 1.15, 18, 2.2);
  fill.position.set(-4.5, 3.6, -2.6);
  scene.add(fill);

  createRoom(scene);
  const player = createPlayer(scene);
  const interactables = createScenarioProps(scene);

  const controls = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false
  };

  let animationFrame = 0;
  let lastTime = performance.now();
  let modalOpen = false;
  let running = false;
  let activeId = null;
  let statusHash = '';
  let zoneSeen = new Set();

  let scenario = {
    instructionsSeen: false,
    phoneChoice: null,
    examChoice: null,
    submitted: false,
    timedOut: false,
    startedAt: null,
    completedAt: null
  };

  function currentTargetId() {
    if (scenario.submitted || scenario.timedOut) {
      return null;
    }
    if (!scenario.instructionsSeen) {
      return 'briefingDesk';
    }
    if (!scenario.phoneChoice) {
      return 'phone';
    }
    if (!scenario.examChoice) {
      return 'examDesk';
    }
    return 'submitBox';
  }

  function currentObjective() {
    if (scenario.submitted || scenario.timedOut) {
      return OBJECTIVES.done;
    }
    if (!scenario.instructionsSeen) {
      return OBJECTIVES.intro;
    }
    if (!scenario.phoneChoice) {
      return OBJECTIVES.phone;
    }
    if (!scenario.examChoice) {
      return OBJECTIVES.exam;
    }
    return OBJECTIVES.submit;
  }

  function availability(id) {
    if (scenario.submitted || scenario.timedOut) {
      return false;
    }
    switch (id) {
      case 'briefingDesk':
        return !scenario.instructionsSeen;
      case 'phone':
        return scenario.instructionsSeen && !scenario.phoneChoice;
      case 'examDesk':
        return scenario.instructionsSeen && Boolean(scenario.phoneChoice) && !scenario.examChoice;
      case 'submitBox':
        return Boolean(scenario.examChoice) && !scenario.submitted;
      default:
        return false;
    }
  }

  function emitUpdate() {
    const targetId = currentTargetId();
    const target = targetId ? interactables.get(targetId) : null;
    const interactionReady = Boolean(activeId && activeId === targetId);
    const routeHint = getRouteHint(player.position, target?.position, interactionReady);
    const remaining =
      scenario.instructionsSeen && !scenario.submitted && !scenario.timedOut
        ? formatRemaining(
            Math.max(0, TIME_LIMIT_MS - (performance.now() - scenario.startedAt))
          )
        : '01:15';

    const activeLabel = interactionReady
      ? `${interactables.get(activeId).label} · E / Enter`
      : '노란 링 안에 들어가면 E, Enter, 또는 하단 버튼으로 상호작용합니다.';

    const nextStatusHash = [
      currentObjective(),
      remaining,
      activeLabel,
      targetId ?? '-',
      interactionReady ? '1' : '0',
      Math.round(player.position.x * 10) / 10,
      Math.round(player.position.z * 10) / 10,
      scenario.phoneChoice ?? '-',
      scenario.examChoice ?? '-'
    ].join('|');

    if (nextStatusHash === statusHash) {
      return;
    }

    statusHash = nextStatusHash;
    onUpdate({
      objective: currentObjective(),
      interactHint: activeLabel,
      targetId,
      targetLabel: targetId ? TARGET_META[targetId].shortLabel : '완료',
      targetLocation: targetId ? TARGET_META[targetId].locationLabel : '완료',
      routeHint,
      interactionReady,
      playerPosition: {
        x: player.position.x,
        z: player.position.z
      },
      targetPosition: target
        ? {
            x: target.position.x,
            z: target.position.z
          }
        : null,
      mapLimit: MAP_LIMIT,
      timer: remaining,
      scenario: {
        phoneChoice: scenario.phoneChoice,
        examChoice: scenario.examChoice,
        submitted: scenario.submitted,
        timedOut: scenario.timedOut
      }
    });
  }

  function log(type, detail = {}) {
    onEvent({
      type,
      detail,
      scenarioSnapshot: {
        phoneChoice: scenario.phoneChoice,
        examChoice: scenario.examChoice,
        submitted: scenario.submitted,
        timedOut: scenario.timedOut
      }
    });
  }

  function resetInteractableVisuals(elapsed) {
    const targetId = currentTargetId();

    for (const prop of interactables.values()) {
      const enabled = availability(prop.id);
      const highlight = activeId === prop.id;
      const isCurrentTarget = targetId === prop.id;
      prop.group.visible = enabled;
      prop.ring.scale.setScalar(highlight ? 1.2 : isCurrentTarget ? 1.08 : 1);
      prop.ring.material.emissiveIntensity = highlight ? 1 : 0.38;
      prop.beam.material.opacity = highlight ? 0.3 : isCurrentTarget ? 0.18 : 0.1;
      prop.beacon.position.y = 1.35 + Math.sin(elapsed * 0.003 + prop.position.x) * 0.12;
      prop.beacon.visible = enabled;
      prop.beam.visible = enabled;
      prop.labelSprite.visible = enabled;
      prop.labelSprite.material.opacity = highlight ? 1 : isCurrentTarget ? 0.92 : 0.72;
      prop.labelSprite.scale.set(
        prop.labelScale.x * (highlight ? 1.08 : 1),
        prop.labelScale.y * (highlight ? 1.08 : 1),
        1
      );
    }
  }

  function updateActiveInteractable() {
    let nearestId = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const prop of interactables.values()) {
      if (!availability(prop.id)) {
        continue;
      }
      const distance = prop.position.distanceTo(player.position);
      if (distance < prop.radius && distance < nearestDistance) {
        nearestDistance = distance;
        nearestId = prop.id;
      }
      if (distance < 1.75 && !zoneSeen.has(prop.id)) {
        zoneSeen.add(prop.id);
        log(`approached_${prop.id}`);
      }
    }

    activeId = nearestId;
  }

  function applyMovement(delta) {
    if (!running || modalOpen || scenario.submitted || scenario.timedOut) {
      return;
    }

    const x = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
    const z = (controls.backward ? 1 : 0) - (controls.forward ? 1 : 0);

    if (!x && !z) {
      return;
    }

    const direction = new THREE.Vector3(x, 0, z).normalize();
    const speed = controls.sprint ? RUN_SPEED : MOVE_SPEED;
    const nextX = clamp(player.position.x + direction.x * speed * delta, -ROOM_LIMIT, ROOM_LIMIT);
    const nextZ = clamp(player.position.z + direction.z * speed * delta, -ROOM_LIMIT, ROOM_LIMIT);

    if (!insideBlocker(nextX, player.position.z)) {
      player.position.x = nextX;
    }
    if (!insideBlocker(player.position.x, nextZ)) {
      player.position.z = nextZ;
    }

    player.rotation.y = Math.atan2(direction.x, direction.z);
  }

  async function handleBriefingDesk() {
    await requestDecision({
      title: '시험 지시문',
      body:
        '당신은 장학금 유지 심사를 위한 온라인 시험장에 들어왔습니다. 제한 시간은 75초이며, 답안은 한 번만 제출할 수 있습니다. 시험 도중 도착하는 정보는 전부 선택 사항입니다.',
      options: [{ id: 'start', label: '시험 시작', tone: 'primary' }]
    });

    scenario.instructionsSeen = true;
    scenario.startedAt = performance.now();
    log('scenario_started');
  }

  async function handlePhone() {
    const result = await requestDecision({
      title: '친구에게서 메시지가 왔습니다',
      body:
        '"이번 시험 유출 답안이야. 지금 열어보면 장학금 붙을 가능성이 높아." 메시지를 열람할지 선택하세요.',
      options: [
        { id: 'ignore', label: '무시한다', tone: 'muted' },
        { id: 'download', label: '답안을 내려받는다', tone: 'primary' }
      ]
    });

    scenario.phoneChoice = result === 'download' ? 'downloaded_leaked_answers' : 'ignored_message';
    log('phone_choice', { choice: scenario.phoneChoice });
  }

  async function handleExamDesk() {
    const usingLeak = scenario.phoneChoice === 'downloaded_leaked_answers';
    const result = await requestDecision({
      title: '답안 작성 방식',
      body: usingLeak
        ? '유출 답안을 확인할 수 있는 상태입니다. 어떤 방식으로 시험지를 작성할지 선택하세요.'
        : '메시지를 무시했습니다. 이제 자신의 실력으로 시험지를 작성할 차례입니다.',
      options: usingLeak
        ? [
            { id: 'honest', label: '내 실력대로 작성한다', tone: 'muted' },
            { id: 'cheat', label: '유출 답안을 참고해 적는다', tone: 'danger' }
          ]
        : [{ id: 'honest', label: '내 실력대로 작성한다', tone: 'primary' }]
    });

    scenario.examChoice = result === 'cheat' ? 'used_leaked_answers' : 'solved_honestly';
    log('exam_choice', { choice: scenario.examChoice });
  }

  async function handleSubmit() {
    await requestDecision({
      title: '답안 제출',
      body:
        scenario.examChoice === 'used_leaked_answers'
          ? '현재 상태 그대로 제출하면 유출 답안을 참고한 시험지가 기록됩니다.'
          : '현재 상태 그대로 제출하면 스스로 작성한 시험지가 기록됩니다.',
      options: [{ id: 'submit', label: '제출한다', tone: 'primary' }]
    });

    scenario.submitted = true;
    scenario.completedAt = performance.now();
    log('submitted', {
      completionMs: Math.round(scenario.completedAt - scenario.startedAt)
    });
    onComplete({
      ...scenario,
      completionMs: Math.round(scenario.completedAt - scenario.startedAt)
    });
  }

  async function interact() {
    if (modalOpen || !running) {
      return;
    }

    if (!activeId) {
      log('interaction_not_ready', {
        targetId: currentTargetId()
      });
      emitUpdate();
      return;
    }

    modalOpen = true;

    try {
      if (activeId === 'briefingDesk') {
        await handleBriefingDesk();
      } else if (activeId === 'phone') {
        await handlePhone();
      } else if (activeId === 'examDesk') {
        await handleExamDesk();
      } else if (activeId === 'submitBox') {
        await handleSubmit();
      }
    } finally {
      modalOpen = false;
      emitUpdate();
    }
  }

  function handleTimeout() {
    scenario.timedOut = true;
    scenario.completedAt = performance.now();
    log('timed_out', {
      completionMs: Math.round(scenario.completedAt - scenario.startedAt)
    });
    onComplete({
      ...scenario,
      completionMs: Math.round(scenario.completedAt - scenario.startedAt)
    });
  }

  function tick(now) {
    const delta = Math.min(0.03, (now - lastTime) / 1000);
    lastTime = now;

    applyMovement(delta);
    updateActiveInteractable();
    resetInteractableVisuals(now);

    const targetCameraX = player.position.x * 0.24;
    const targetCameraZ = 12.2 + player.position.z * 0.12;
    camera.position.x += (targetCameraX - camera.position.x) * 0.06;
    camera.position.z += (targetCameraZ - camera.position.z) * 0.06;
    camera.lookAt(player.position.x * 0.35, 1, player.position.z * 0.25);

    if (
      running &&
      scenario.instructionsSeen &&
      !scenario.submitted &&
      !scenario.timedOut &&
      performance.now() - scenario.startedAt >= TIME_LIMIT_MS
    ) {
      handleTimeout();
    }

    emitUpdate();
    renderer.render(scene, camera);
    animationFrame = window.requestAnimationFrame(tick);
  }

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function reset() {
    scenario = {
      instructionsSeen: false,
      phoneChoice: null,
      examChoice: null,
      submitted: false,
      timedOut: false,
      startedAt: null,
      completedAt: null
    };
    player.position.set(0, 0, 5);
    player.rotation.set(0, 0, 0);
    activeId = null;
    statusHash = '';
    zoneSeen = new Set();
    emitUpdate();
  }

  function start() {
    reset();
    running = true;
    lastTime = performance.now();
    emitUpdate();
  }

  function stop() {
    running = false;
  }

  function setControl(name, value) {
    if (Object.hasOwn(controls, name)) {
      controls[name] = value;
    }
  }

  function destroy() {
    running = false;
    window.cancelAnimationFrame(animationFrame);
    renderer.dispose();
  }

  resize();
  animationFrame = window.requestAnimationFrame(tick);

  return {
    start,
    stop,
    resize,
    destroy,
    interact,
    setControl
  };
}
