// KeyStrike EST 41 - Motor del Videojuego de Mecanografía

(() => {
  'use strict';

  // ==========================================
  // ESTADO Y CONFIGURACIÓN PERSISTENTE
  // ==========================================
  const STORAGE_SETTINGS = 'keystrike_est41_settings';
  const STORAGE_HISTORY = 'keystrike_est41_history';
  const STORAGE_BEST = 'keystrike_est41_best';

  const defaultSettings = {
    studentGroupKey: '',
    studentListNum: 0,
    studentName: '',
    studentGroup: '',
    sheetsWebhook: '',
    fingerGuide: true,
    nextKeyHint: true,
    sound: true
  };

  let settings = loadJSON(STORAGE_SETTINGS, defaultSettings);
  // En aula compartida, iniciar cada carga pidiendo que el alumno elija su grupo y nombre
  settings.studentGroupKey = '';
  settings.studentListNum = 0;
  settings.studentName = '';
  settings.studentGroup = '';
  let historyLog = loadJSON(STORAGE_HISTORY, []);
  let bestByMission = loadJSON(STORAGE_BEST, {});

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? { ...fallback, ...JSON.parse(raw) } : structuredCloneFallback(fallback);
    } catch {
      return structuredCloneFallback(fallback);
    }
  }

  function structuredCloneFallback(val) {
    return Array.isArray(val) ? [...val] : { ...val };
  }

  function loadArrayJSON(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  historyLog = loadArrayJSON(STORAGE_HISTORY);

  // ==========================================
  // REFERENCIAS DEL DOM
  // ==========================================
  const el = {
    navTabs: document.querySelectorAll('.nav-tab'),
    tabViews: document.querySelectorAll('.tab-view'),
    headerStudentBadge: document.getElementById('headerStudentBadge'),
    selectGroup: document.getElementById('selectGroup'),
    selectStudent: document.getElementById('selectStudent'),
    inputStudentPassword: document.getElementById('inputStudentPassword'),
    btnVerifyStudent: document.getElementById('btnVerifyStudent'),
    studentAuthError: document.getElementById('studentAuthError'),
    studentRecordText: document.getElementById('studentRecordText'),
    btnQuickPractice: document.getElementById('btnQuickPractice'),

    // HUD
    hudMissionBadge: document.getElementById('hudMissionBadge'),
    hudMissionTitle: document.getElementById('hudMissionTitle'),
    hudMissionSub: document.getElementById('hudMissionSub'),
    hudProgressRing: document.getElementById('hudProgressRing'),
    hudProgressText: document.getElementById('hudProgressText'),
    hudScore: document.getElementById('hudScore'),
    hudCombo: document.getElementById('hudCombo'),
    hudAccuracy: document.getElementById('hudAccuracy'),
    hudWpm: document.getElementById('hudWpm'),
    hudTimerBox: document.getElementById('hudTimerBox'),
    hudTimer: document.getElementById('hudTimer'),
    hudShieldsBox: document.getElementById('hudShieldsBox'),
    hudShieldsContainer: document.getElementById('hudShieldsContainer'),
    btnAudioToggle: document.getElementById('btnAudioToggle'),
    audioIcon: document.getElementById('audioIcon'),
    btnPause: document.getElementById('btnPause'),

    // Arena
    arenaBox: document.getElementById('arenaBox'),
    arenaModePill: document.getElementById('arenaModePill'),
    arenaSpeedLabel: document.getElementById('arenaSpeedLabel'),
    errorBanner: document.getElementById('errorBanner'),
    errorBannerText: document.getElementById('errorBannerText'),
    particleCanvas: document.getElementById('particleCanvas'),
    letterArena: document.getElementById('letterArena'),
    lettersLayer: document.getElementById('lettersLayer'),
    floatingFeedbackLayer: document.getElementById('floatingFeedbackLayer'),
    paragraphArena: document.getElementById('paragraphArena'),
    paragraphDisplay: document.getElementById('paragraphDisplay'),
    paraCharCounter: document.getElementById('paraCharCounter'),
    paraTimeBar: document.getElementById('paraTimeBar'),
    hudFingerHint: document.getElementById('hudFingerHint'),

    // Overlay inicio y Toast de misión
    arenaOverlay: document.getElementById('arenaOverlay'),
    overlayBadge: document.getElementById('overlayBadge'),
    overlayTitle: document.getElementById('overlayTitle'),
    overlayDesc: document.getElementById('overlayDesc'),
    btnStartMission: document.getElementById('btnStartMission'),
    btnGoLevels: document.getElementById('btnGoLevels'),
    missionToast: document.getElementById('missionToast'),
    missionToastIcon: document.getElementById('missionToastIcon'),
    missionToastTitle: document.getElementById('missionToastTitle'),
    missionToastSub: document.getElementById('missionToastSub'),

    // Teclado
    virtualKeyboard: document.getElementById('virtualKeyboard'),

    // Vistas secundarias
    letterMissionsGrid: document.getElementById('letterMissionsGrid'),
    paragraphMissionsGrid: document.getElementById('paragraphMissionsGrid'),
    rankingTableBody: document.getElementById('rankingTableBody'),
    btnExportCsv: document.getElementById('btnExportCsv'),
    rankingFilters: document.querySelectorAll('.ranking-filter'),
    btnClearHistory: document.getElementById('btnClearHistory'),

    // Ajustes
    inputStudentName: document.getElementById('inputStudentName'),
    inputStudentGroup: document.getElementById('inputStudentGroup'),
    inputSheetsWebhook: document.getElementById('inputSheetsWebhook'),
    toggleFingerGuide: document.getElementById('toggleFingerGuide'),
    toggleNextKeyHint: document.getElementById('toggleNextKeyHint'),
    toggleSound: document.getElementById('toggleSound'),
    btnSaveSettings: document.getElementById('btnSaveSettings'),

    // Modales
    pauseModal: document.getElementById('pauseModal'),
    pausePct: document.getElementById('pausePct'),
    pauseScore: document.getElementById('pauseScore'),
    pauseGrade: document.getElementById('pauseGrade'),
    btnResume: document.getElementById('btnResume'),
    btnSaveProgressFromPause: document.getElementById('btnSaveProgressFromPause'),
    btnRestartFromPause: document.getElementById('btnRestartFromPause'),
    btnExitToLevels: document.getElementById('btnExitToLevels'),

    resultModal: document.getElementById('resultModal'),
    resMissionBadge: document.getElementById('resMissionBadge'),
    resTitle: document.getElementById('resTitle'),
    resRankBadge: document.getElementById('resRankBadge'),
    resGradeBox: document.getElementById('resGradeBox'),
    resPracticeNotice: document.getElementById('resPracticeNotice'),
    resApprovalBanner: document.getElementById('resApprovalBanner'),
    resApprovalIcon: document.getElementById('resApprovalIcon'),
    resApprovalText: document.getElementById('resApprovalText'),
    resPctInline: document.getElementById('resPctInline'),
    resGrade: document.getElementById('resGrade'),
    resPercent: document.getElementById('resPercent'),
    resScore: document.getElementById('resScore'),
    resAccuracy: document.getElementById('resAccuracy'),
    resWpm: document.getElementById('resWpm'),
    btnResultLevels: document.getElementById('btnResultLevels'),
    btnRetryMission: document.getElementById('btnRetryMission'),
    btnNextMission: document.getElementById('btnNextMission')
  };

  // ==========================================
  // SISTEMA DE PARTÍCULAS (CANVAS)
  // ==========================================
  const particles = [];
  const shockwaves = [];
  let ctx = el.particleCanvas.getContext('2d');

  function resizeCanvas() {
    const rect = el.arenaBox.getBoundingClientRect();
    el.particleCanvas.width = rect.width || 900;
    el.particleCanvas.height = rect.height || 260;
  }
  window.addEventListener('resize', resizeCanvas);

  function spawnExplosion(x, y, color = '#0284c7', count = 24) {
    shockwaves.push({
      x,
      y,
      radius: 10,
      maxRadius: 68,
      alpha: 0.9,
      color
    });

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 2.2 + Math.random() * 5.2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 3.5,
        alpha: 1,
        decay: 0.025 + Math.random() * 0.02,
        color: i % 3 === 0 ? '#16a34a' : color
      });
    }
  }

  function updateAndDrawParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, el.particleCanvas.width, el.particleCanvas.height);

    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const s = shockwaves[i];
      s.radius += 3.5;
      s.alpha -= 0.045;
      if (s.alpha <= 0 || s.radius >= s.maxRadius) {
        shockwaves.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.strokeStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.restore();
    }
  }

  // ==========================================
  // ESTADO DEL JUEGO
  // ==========================================
  let currentMission = window.MISSIONS[0];
  let gameState = 'ready'; // 'ready' | 'playing' | 'paused' | 'finished'
  let animFrameId = null;
  let lastFrameTime = 0;
  let errorBannerTimer = null;

  const run = {
    score: 0,
    combo: 0,
    maxCombo: 0,
    correctHits: 0,
    totalAttempts: 0,
    errors: 0,
    startTimeMs: 0,
    pausedAccumMs: 0,
    pauseStartMs: 0,

    // Modo letras
    lettersSpawned: 0,
    lettersCleared: 0,
    spawnTimerMs: 0,
    activeTiles: [],
    shields: 5,
    maxShields: 5,

    // Modo párrafo
    paraIndex: 0,
    paraTimeRemaining: 60,
    paraLastTickSec: 60,
    paraSpans: []
  };

  // ==========================================
  // NAVEGACIÓN DE PESTAÑAS
  // ==========================================
  let practiceMode = false;

  function switchTab(tabName) {
    const isGameplayTab = tabName === 'arena' || tabName === 'practica';
    if (!isGameplayTab && gameState === 'playing') {
      // Pausar silenciosamente sin mostrar el modal encima de la otra pestaña
      gameState = 'paused';
      run.pauseStartMs = performance.now();
      cancelAnimationFrame(animFrameId);
    }

    if (tabName === 'practica') {
      practiceMode = true;
    } else if (tabName === 'arena') {
      practiceMode = false;
    }

    el.navTabs.forEach((btn) => {
      const active = btn.dataset.tab === tabName;
      if (btn.dataset.tab === 'practica') {
        btn.classList.toggle('bg-amber-600', active);
        btn.classList.toggle('hover:bg-amber-700', active);
        btn.classList.toggle('text-white', active);
        btn.classList.toggle('bg-amber-50', !active);
        btn.classList.toggle('hover:bg-amber-100', !active);
        btn.classList.toggle('text-amber-800', !active);
      } else {
        btn.classList.toggle('bg-primary-container', active);
        btn.classList.toggle('text-on-primary', active);
        btn.classList.toggle('shadow-sm', active);
        btn.classList.toggle('text-slate-700', !active);
        btn.classList.toggle('hover:text-sky-700', !active);
        btn.classList.toggle('hover:bg-slate-100', !active);
      }
    });

    const viewKey = isGameplayTab ? 'arena' : tabName;
    el.tabViews.forEach((view) => {
      view.classList.toggle('hidden', view.id !== `view-${viewKey}`);
    });

    if (tabName === 'niveles') renderLevelsView();
    if (tabName === 'ranking') renderRankingView();
    if (isGameplayTab) {
      applySettingsToUI();
      updateStartButtonState();
      if (gameState !== 'playing') {
        prepareMission();
      }
      resizeCanvas();
    }
  }

  el.navTabs.forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // ==========================================
  // TECLADO EN PANTALLA (MAPEO Y RESALTADO)
  // ==========================================
  function normalizeKeyForBoard(key) {
    if (!key) return '';
    if (key === ' ') return ' ';
    const upper = key.toUpperCase();
    const accents = { Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U', Ü: 'U' };
    return accents[upper] || upper;
  }

  function findBoardKeys(eKey, eCode) {
    const matched = [];
    const norm = normalizeKeyForBoard(eKey);
    el.virtualKeyboard.querySelectorAll('.kb-key').forEach((node) => {
      if (node.dataset.key && node.dataset.key === norm) {
        matched.push(node);
      } else if (eCode && node.dataset.code && node.dataset.code === eCode) {
        matched.push(node);
      }
    });
    return matched;
  }

  function flashKeyClass(nodes, className, durationMs = 180) {
    nodes.forEach((n) => {
      n.classList.add(className);
      setTimeout(() => n.classList.remove(className), durationMs);
    });
  }

  function updateTargetKeyHighlight() {
    el.virtualKeyboard.querySelectorAll('.kb-key.key-target').forEach((n) => n.classList.remove('key-target'));

    let nextChar = '';
    if (currentMission.type === 'letters' && run.activeTiles.length > 0) {
      nextChar = run.activeTiles[0].char;
    } else if (currentMission.type === 'paragraph' && run.paraIndex < currentMission.text.length) {
      nextChar = currentMission.text[run.paraIndex];
    }

    el.hudFingerHint.textContent = window.getFingerHint(nextChar);

    if (!settings.nextKeyHint || !nextChar) return;
    const norm = normalizeKeyForBoard(nextChar);
    el.virtualKeyboard.querySelectorAll('.kb-key').forEach((node) => {
      if (node.dataset.key === norm) {
        node.classList.add('key-target');
      }
    });
  }

  // ==========================================
  // SELECCIÓN Y PREPARACIÓN DE MISIÓN
  // ==========================================
  function getMaxUnlockedMissionId() {
    if (practiceMode) return window.MISSIONS.length;
    if (!isStudentIdentified()) return 1;

    let maxApproved = 0;
    historyLog.forEach((r) => {
      if (r.student === settings.studentName && r.group === settings.studentGroup) {
        const rate = r.approvalRate !== undefined ? Number(r.approvalRate) : Math.min(Number(r.percent) || 0, Number(r.accuracy) || 0);
        if (r.approved || rate >= 90) {
          maxApproved = Math.max(maxApproved, Number(r.missionId) || 0);
        }
      }
    });
    return Math.min(window.MISSIONS.length, maxApproved + 1);
  }

  function selectMission(missionId) {
    const found = window.MISSIONS.find((m) => m.id === missionId);
    if (!found) return;
    if (!practiceMode && missionId > getMaxUnlockedMissionId()) {
      showMissionToast(
        'NIVEL BLOQUEADO',
        'Debes aprobar el nivel anterior con mínimo 90% de aciertos para desbloquear este nivel',
        'lock',
        2600
      );
      return;
    }
    currentMission = found;
    prepareMission();
    switchTab(practiceMode ? 'practica' : 'arena');
  }

  function prepareMission() {
    cancelAnimationFrame(animFrameId);
    gameState = 'ready';

    // Limpiar arena
    el.lettersLayer.innerHTML = '';
    el.floatingFeedbackLayer.innerHTML = '';
    particles.length = 0;
    shockwaves.length = 0;
    updateAndDrawParticles();

    // Resetear estado
    run.score = 0;
    run.combo = 0;
    run.maxCombo = 0;
    run.correctHits = 0;
    run.totalAttempts = 0;
    run.errors = 0;
    run.startTimeMs = 0;
    run.pausedAccumMs = 0;

    run.lettersSpawned = 0;
    run.lettersCleared = 0;
    run.spawnTimerMs = 0;
    run.activeTiles = [];
    run.maxShields = currentMission.shields || 5;
    run.shields = run.maxShields;

    run.paraIndex = 0;
    run.paraTimeRemaining = currentMission.timeLimitSec || 60;
    run.paraSpans = [];

    // Configurar UI según tipo de misión
    el.hudMissionBadge.textContent = currentMission.badge;
    el.hudMissionTitle.textContent = currentMission.title;
    el.hudMissionSub.textContent = currentMission.subtitle;

    el.overlayBadge.textContent = currentMission.badge;
    el.overlayTitle.textContent = currentMission.title;
    el.overlayDesc.textContent = currentMission.description;
    el.arenaOverlay.classList.remove('hidden');
    el.pauseModal.classList.add('hidden');
    el.resultModal.classList.add('hidden');
    hideErrorBanner();

    if (currentMission.type === 'letters') {
      el.letterArena.classList.remove('hidden');
      el.paragraphArena.classList.add('hidden');
      el.hudTimerBox.classList.add('hidden');
      el.hudShieldsBox.classList.remove('hidden');
      el.arenaModePill.textContent = 'PISTA DE LETRAS ALEATORIAS';
      el.arenaSpeedLabel.innerHTML = 'Velocidad actual: <strong class="text-primary">1.0x</strong>';
      renderShields();
    } else {
      el.letterArena.classList.add('hidden');
      el.paragraphArena.classList.remove('hidden');
      el.hudTimerBox.classList.remove('hidden');
      el.hudShieldsBox.classList.add('hidden');
      el.arenaModePill.textContent = 'CONTRARRELOJ • MÁXIMO 1 MINUTO';
      el.arenaSpeedLabel.innerHTML = `Meta: <strong class="text-primary">${currentMission.text.length} caracteres en 60s</strong>`;
      renderParagraphText();
      updateTimerDisplay();
    }

    updateHudStats();
    updateTargetKeyHighlight();
    resizeCanvas();
  }

  const SEC_DB_URL = 'https://script.google.com/macros/s/AKfycbz3BqG3ZjnbU82z1VC2jw4ZMQVWs5Fmudb_0y0dPQ7Frr5_91CRnLtCHjSBFypCp30d/exec';
  const GROUP_LABELS = { '1A': '1° A', '1B': '1° B', '2B': '2° B', '3C': '3° C' };
  const secRosterCache = {};
  let selectedStudentObj = null;
  let studentAuthenticated = false;

  function normalizeShortKey(val) {
    return String(val || '').trim().toUpperCase().replace(/[-\s]+/g, '');
  }

  function showAuthError(msg) {
    if (!el.studentAuthError) return;
    if (msg) {
      el.studentAuthError.textContent = msg;
      el.studentAuthError.classList.remove('hidden');
    } else {
      el.studentAuthError.textContent = '';
      el.studentAuthError.classList.add('hidden');
    }
  }

  function isStudentIdentified() {
    return Boolean(settings.studentGroupKey && settings.studentName && studentAuthenticated);
  }

  function updateStartButtonState() {
    if (!el.btnStartMission) return;
    const ready = practiceMode || isStudentIdentified();
    el.btnStartMission.disabled = false;
    el.btnStartMission.classList.remove('opacity-50', 'cursor-not-allowed');
    el.btnStartMission.classList.add('cursor-pointer');
    el.btnStartMission.classList.toggle('bg-amber-600', !ready);
    el.btnStartMission.classList.toggle('hover:bg-amber-700', !ready);
    el.btnStartMission.classList.toggle('bg-sky-600', ready);
    el.btnStartMission.classList.toggle('hover:bg-sky-700', ready);
    const labelSpan = el.btnStartMission.querySelector('span:last-child');
    if (labelSpan) {
      if (practiceMode) {
        labelSpan.textContent = 'INICIAR PRÁCTICA LIBRE';
      } else {
        labelSpan.textContent = ready ? 'INICIAR MISIÓN' : '1° VALIDA GRUPO, NOMBRE Y CLAVE ARRIBA';
      }
    }
  }

  function startMission() {
    if (gameState === 'playing') return;
    if (!practiceMode && !isStudentIdentified()) {
      if (selectedStudentObj && el.inputStudentPassword && el.inputStudentPassword.value.trim()) {
        verifyStudentPassword();
      }
    }
    if (!practiceMode && !isStudentIdentified()) {
      const bar = document.getElementById('studentSelectorBar');
      if (bar) {
        bar.scrollIntoView({ behavior: 'smooth', block: 'center' });
        bar.classList.add('ring-4', 'ring-sky-400');
        setTimeout(() => bar.classList.remove('ring-4', 'ring-sky-400'), 1800);
      }
      if (!settings.studentGroupKey && el.selectGroup) {
        el.selectGroup.focus();
      } else if (!selectedStudentObj && el.selectStudent && !el.selectStudent.disabled) {
        el.selectStudent.focus();
      } else if (el.inputStudentPassword && !el.inputStudentPassword.disabled) {
        el.inputStudentPassword.focus();
      }
      showMissionToast(
        'IDENTIFICACIÓN REQUERIDA',
        'Elige tu grupo, tu nombre e ingresa tu contraseña para iniciar',
        'badge',
        2600
      );
      return;
    }
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    gameState = 'playing';
    run.startTimeMs = performance.now();
    lastFrameTime = performance.now();
    el.arenaOverlay.classList.add('hidden');
    resizeCanvas();

    showMissionToast(
      practiceMode ? `PRÁCTICA LIBRE • ${currentMission.badge}` : `INICIANDO ${currentMission.badge}`,
      practiceMode
        ? `${currentMission.title} • Ensayo sin registro ni calificación`
        : `${currentMission.title} • ¡Coloca tus dedos y escribe!`,
      practiceMode ? 'fitness_center' : 'rocket_launch',
      2200
    );

    if (currentMission.type === 'letters') {
      spawnNextLetterTile();
    }

    animFrameId = requestAnimationFrame(gameLoop);
  }

  let missionToastTimer = null;
  function showMissionToast(title, sub, icon = 'rocket_launch', durationMs = 2400) {
    if (!el.missionToast) return;
    el.missionToastIcon.textContent = icon;
    el.missionToastTitle.textContent = title;
    el.missionToastSub.textContent = sub;
    el.missionToast.classList.remove('opacity-0', '-translate-y-2');
    el.missionToast.classList.add('opacity-100', 'translate-y-0');

    clearTimeout(missionToastTimer);
    missionToastTimer = setTimeout(() => {
      el.missionToast.classList.remove('opacity-100', 'translate-y-0');
      el.missionToast.classList.add('opacity-0', '-translate-y-2');
    }, durationMs);
  }

  function pauseGame() {
    if (gameState !== 'playing') return;
    gameState = 'paused';
    run.pauseStartMs = performance.now();
    cancelAnimationFrame(animFrameId);

    const pct = Math.round(getProgressRatio() * 100);
    const partialGrade = Math.min(10, Math.max(0, Math.round((pct / 10) * 10) / 10)).toFixed(1);
    if (el.pausePct) el.pausePct.textContent = `${pct}%`;
    if (el.pauseScore) el.pauseScore.textContent = run.score.toLocaleString('es-MX');
    if (el.pauseGrade) el.pauseGrade.textContent = practiceMode ? 'LIBRE' : partialGrade;

    if (el.btnSaveProgressFromPause) {
      const hasProgress = practiceMode || pct > 0;
      el.btnSaveProgressFromPause.disabled = !hasProgress;
      el.btnSaveProgressFromPause.classList.toggle('opacity-50', !hasProgress);
      el.btnSaveProgressFromPause.classList.toggle('cursor-not-allowed', !hasProgress);
      const labelSpan = el.btnSaveProgressFromPause.querySelector('span:last-child');
      if (labelSpan) {
        if (practiceMode) {
          labelSpan.textContent = 'VER RESUMEN DE ENSAYO (SIN CALIF.)';
        } else {
          labelSpan.textContent = hasProgress ? 'GUARDAR AVANCE Y CALIFICACIÓN' : 'SIN AVANCE EN ESTA MISIÓN';
        }
      }
    }

    el.pauseModal.classList.remove('hidden');
  }

  function resumeGame() {
    if (gameState !== 'paused') return;
    run.pausedAccumMs += performance.now() - run.pauseStartMs;
    gameState = 'playing';
    lastFrameTime = performance.now();
    el.pauseModal.classList.add('hidden');
    animFrameId = requestAnimationFrame(gameLoop);
  }

  // ==========================================
  // BUCLE PRINCIPAL DEL JUEGO
  // ==========================================
  function gameLoop(now) {
    if (gameState !== 'playing') return;
    const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
    lastFrameTime = now;

    if (currentMission.type === 'letters') {
      updateLetterMode(dt);
    } else {
      updateParagraphMode(dt);
    }

    updateAndDrawParticles();
    updateWpmLive(now);

    if (gameState === 'playing') {
      animFrameId = requestAnimationFrame(gameLoop);
    }
  }

  // ==========================================
  // MODO 1: LETRAS ALEATORIAS CON VELOCIDAD PROGRESIVA
  // ==========================================
  function getProgressRatio() {
    if (currentMission.type === 'letters') {
      return Math.min(1, run.lettersCleared / currentMission.totalLetters);
    }
    return Math.min(1, run.paraIndex / currentMission.text.length);
  }

  function updateLetterMode(dt) {
    const progress = getProgressRatio();
    const currentSpeed = currentMission.baseSpeed + (currentMission.maxSpeed - currentMission.baseSpeed) * progress;
    const speedMult = (currentSpeed / currentMission.baseSpeed).toFixed(1);
    el.arenaSpeedLabel.innerHTML = `Velocidad actual: <strong class="text-primary">${speedMult}x</strong>`;

    // Spawner
    if (run.lettersSpawned < currentMission.totalLetters) {
      run.spawnTimerMs += dt * 1000;
      const currentInterval =
        currentMission.spawnIntervalMs - (currentMission.spawnIntervalMs - currentMission.minSpawnMs) * progress;

      if (run.spawnTimerMs >= currentInterval || run.activeTiles.length === 0) {
        run.spawnTimerMs = 0;
        spawnNextLetterTile();
      }
    }

    // Mover fichas
    for (let i = run.activeTiles.length - 1; i >= 0; i--) {
      const tile = run.activeTiles[i];
      tile.x -= currentSpeed * dt;
      tile.el.style.left = `${tile.x}px`;

      tile.el.classList.toggle('is-next', i === 0);
      tile.el.classList.toggle('is-danger', tile.x < 165);

      // Si pasó la zona de impacto sin ser presionada
      if (tile.x < 42) {
        handleMissedTile(tile, i);
      }
    }

    if (run.lettersSpawned >= currentMission.totalLetters && run.activeTiles.length === 0) {
      finishMission();
    }
  }

  let lastSpawnedChar = '';
  function spawnNextLetterTile() {
    if (run.lettersSpawned >= currentMission.totalLetters) return;

    const pool = currentMission.chars;
    const filteredPool = pool.length > 1 ? pool.filter((c) => c !== lastSpawnedChar) : pool;
    const char = filteredPool[Math.floor(Math.random() * filteredPool.length)];
    lastSpawnedChar = char;
    const arenaWidth = el.letterArena.clientWidth || 900;
    const startX = arenaWidth - 40;

    const tileEl = document.createElement('div');
    tileEl.className = 'letter-tile';
    tileEl.style.left = `${startX}px`;
    tileEl.innerHTML = `
      <span class="font-sans text-2xl font-bold text-primary leading-none">${char}</span>
      <span class="text-[9px] text-primary-container/80 font-bold mt-1 tracking-tight">${window.getFingerHint(char)}</span>
    `;

    el.lettersLayer.appendChild(tileEl);
    run.activeTiles.push({ char, x: startX, el: tileEl });
    run.lettersSpawned++;
    updateTargetKeyHighlight();
  }

  function handleMissedTile(tile, index) {
    tile.el.remove();
    run.activeTiles.splice(index, 1);
    run.lettersCleared++;
    run.totalAttempts++;
    run.errors++;
    run.combo = 0;
    run.shields = Math.max(0, run.shields - 1);

    triggerRedError(`¡SE ESCAPÓ LA [${tile.char}]! (-1 Escudo)`);
    renderShields();
    updateHudStats();
    updateTargetKeyHighlight();

    if (run.shields <= 0) {
      finishMission();
    }
  }

  function explodeFrontTile() {
    const tile = run.activeTiles.shift();
    if (!tile) return;

    const rect = tile.el.getBoundingClientRect();
    const arenaRect = el.arenaBox.getBoundingClientRect();
    const cx = rect.left - arenaRect.left + rect.width / 2;
    const cy = rect.top - arenaRect.top + rect.height / 2;

    tile.el.remove();
    run.lettersCleared++;
    run.correctHits++;
    run.totalAttempts++;
    run.combo++;
    run.maxCombo = Math.max(run.maxCombo, run.combo);

    const pts = 100 + Math.min(run.combo, 15) * 15;
    run.score += pts;

    spawnExplosion(cx, cy, '#0284c7', 26);
    showFloatingText(cx, cy - 18, `+${pts} ¡BIEN!`, 'text-tertiary-container');
    window.soundEngine.playHit(run.combo);

    updateHudStats();
    updateTargetKeyHighlight();

    if (run.lettersCleared >= currentMission.totalLetters && run.activeTiles.length === 0) {
      finishMission();
    }
  }

  // ==========================================
  // MODO 2: PÁRRAFO CONTRARRELOJ (60 SEGUNDOS)
  // ==========================================
  function renderParagraphText() {
    el.paragraphDisplay.innerHTML = '';
    run.paraSpans = [];

    for (let i = 0; i < currentMission.text.length; i++) {
      const span = document.createElement('span');
      span.textContent = currentMission.text[i];
      span.className = i === 0 ? 'para-char-current' : 'para-char-pending';
      el.paragraphDisplay.appendChild(span);
      run.paraSpans.push(span);
    }

    el.paraCharCounter.textContent = `0 / ${currentMission.text.length} caracteres`;
  }

  function updateParagraphMode(dt) {
    run.paraTimeRemaining = Math.max(0, run.paraTimeRemaining - dt);
    updateTimerDisplay();

    if (run.paraTimeRemaining <= 0) {
      finishMission();
    }
  }

  function updateTimerDisplay() {
    const secs = Math.ceil(run.paraTimeRemaining);
    const min = String(Math.floor(secs / 60)).padStart(2, '0');
    const sec = String(secs % 60).padStart(2, '0');
    el.hudTimer.textContent = `${min}:${sec}`;

    const pct = (run.paraTimeRemaining / (currentMission.timeLimitSec || 60)) * 100;
    el.paraTimeBar.style.width = `${pct}%`;

    if (secs <= 10) {
      el.hudTimer.classList.remove('text-amber-900');
      el.hudTimer.classList.add('text-red-700', 'animate-pulse');
    } else {
      el.hudTimer.classList.add('text-amber-900');
      el.hudTimer.classList.remove('text-red-700', 'animate-pulse');
    }
  }

  function stripAccentsKeepN(ch) {
    const map = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u', Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U', Ü: 'U' };
    return map[ch] || ch;
  }

  function charsMatch(pressed, target) {
    if (pressed === target) return true;
    if (pressed.toLowerCase() === target.toLowerCase()) return true;
    return stripAccentsKeepN(pressed).toLowerCase() === stripAccentsKeepN(target).toLowerCase();
  }

  function handleParagraphKey(pressedChar) {
    const targetChar = currentMission.text[run.paraIndex];
    run.totalAttempts++;

    if (charsMatch(pressedChar, targetChar)) {
      const curSpan = run.paraSpans[run.paraIndex];
      curSpan.className = 'para-char-done';

      // Explosión sutil de partículas sobre la letra completada
      const spanRect = curSpan.getBoundingClientRect();
      const arenaRect = el.arenaBox.getBoundingClientRect();
      spawnExplosion(
        spanRect.left - arenaRect.left + spanRect.width / 2,
        spanRect.top - arenaRect.top + spanRect.height / 2,
        '#16a34a',
        10
      );

      run.paraIndex++;
      run.correctHits++;
      run.combo++;
      run.maxCombo = Math.max(run.maxCombo, run.combo);
      run.score += 50 + Math.min(run.combo, 20) * 5;

      if (run.paraIndex < run.paraSpans.length) {
        run.paraSpans[run.paraIndex].className = 'para-char-current';
      }

      el.paraCharCounter.textContent = `${run.paraIndex} / ${currentMission.text.length} caracteres`;
      window.soundEngine.playHit(run.combo);
      updateHudStats();
      updateTargetKeyHighlight();

      if (run.paraIndex >= currentMission.text.length) {
        finishMission();
      }
      return true;
    } else {
      run.errors++;
      run.combo = 0;
      const curSpan = run.paraSpans[run.paraIndex];
      if (curSpan) {
        curSpan.classList.add('is-error');
        setTimeout(() => curSpan.classList.remove('is-error'), 280);
      }

      const shownPressed = pressedChar === ' ' ? 'ESPACIO' : pressedChar;
      const shownTarget = targetChar === ' ' ? 'ESPACIO' : targetChar;
      triggerRedError(`¡ERROR! Pulsaste [${shownPressed}] en vez de [${shownTarget}]`);
      updateHudStats();
      return false;
    }
  }

  // ==========================================
  // SEÑAL ROJA DE ERROR Y FEEDBACK VISUAL
  // ==========================================
  function triggerRedError(message) {
    window.soundEngine.playError();

    el.arenaBox.classList.remove('arena-error-flash');
    void el.arenaBox.offsetWidth; // Reiniciar animación
    el.arenaBox.classList.add('arena-error-flash');

    el.errorBannerText.textContent = message;
    el.errorBanner.classList.remove('opacity-0');
    el.errorBanner.classList.add('opacity-100');

    clearTimeout(errorBannerTimer);
    errorBannerTimer = setTimeout(hideErrorBanner, 1800);
  }

  function hideErrorBanner() {
    el.errorBanner.classList.remove('opacity-100');
    el.errorBanner.classList.add('opacity-0');
  }

  function showFloatingText(x, y, text, colorClass) {
    const node = document.createElement('div');
    node.className = `floating-feedback font-sans text-sm font-black tracking-wider ${colorClass}`;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    node.textContent = text;
    el.floatingFeedbackLayer.appendChild(node);
    setTimeout(() => node.remove(), 850);
  }

  // ==========================================
  // MANEJO DE TECLADO FÍSICO
  // ==========================================
  const IGNORED_KEYS = new Set([
    'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab',
    'Dead', 'Process', 'Unidentified',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
  ]);

  window.addEventListener('keydown', (e) => {
    // Atajo Escape para pausar / reanudar
    if (e.key === 'Escape') {
      if (gameState === 'playing') pauseGame();
      else if (gameState === 'paused') resumeGame();
      return;
    }

    // Enter para iniciar cuando está listo
    if (e.key === 'Enter' && gameState === 'ready' && !el.arenaOverlay.classList.contains('hidden')) {
      const arenaVisible = !document.getElementById('view-arena').classList.contains('hidden');
      if (arenaVisible) {
        e.preventDefault();
        startMission();
        return;
      }
    }

    // Resaltar tecla física presionada en el teclado en pantalla siempre que estemos en la Arena
    const arenaActive = !document.getElementById('view-arena').classList.contains('hidden');
    if (!arenaActive) return;

    const boardKeys = findBoardKeys(e.key, e.code);
    boardKeys.forEach((n) => n.classList.add('key-active'));

    if (gameState !== 'playing') return;
    if (e.repeat) return;
    if (IGNORED_KEYS.has(e.key) || e.ctrlKey || e.altKey || e.metaKey) return;

    if (e.key === ' ') e.preventDefault();

    if (currentMission.type === 'letters') {
      if (run.activeTiles.length === 0) return;
      const frontTile = run.activeTiles[0];
      const pressedUpper = e.key.toUpperCase();

      if (pressedUpper === frontTile.char.toUpperCase()) {
        flashKeyClass(boardKeys, 'key-hit', 200);
        explodeFrontTile();
      } else {
        run.totalAttempts++;
        run.errors++;
        run.combo = 0;
        run.shields = Math.max(0, run.shields - 1);
        flashKeyClass(boardKeys, 'key-error', 260);
        triggerRedError(`¡ERROR! Pulsaste [${pressedUpper}] en vez de [${frontTile.char}] (-1 Escudo)`);
        renderShields();
        updateHudStats();
        if (run.shields <= 0) finishMission();
      }
    } else if (currentMission.type === 'paragraph') {
      // Ignorar Backspace / Enter en modo estricto carácter por carácter
      if (e.key === 'Backspace' || e.key === 'Enter') return;
      const isOk = handleParagraphKey(e.key);
      flashKeyClass(boardKeys, isOk ? 'key-hit' : 'key-error', isOk ? 160 : 250);
    }
  });

  window.addEventListener('keyup', (e) => {
    const boardKeys = findBoardKeys(e.key, e.code);
    boardKeys.forEach((n) => n.classList.remove('key-active'));
  });

  // ==========================================
  // ACTUALIZACIÓN DE HUD
  // ==========================================
  function renderShields() {
    el.hudShieldsContainer.innerHTML = '';
    for (let i = 0; i < run.maxShields; i++) {
      const active = i < run.shields;
      const div = document.createElement('div');
      div.className = active
        ? 'w-6 h-7 flex items-center justify-center bg-tertiary-container/20 text-tertiary-container clip-hex'
        : 'w-6 h-7 flex items-center justify-center bg-error-container/30 text-error clip-hex opacity-50';
      div.innerHTML = `<span class="material-symbols-outlined text-[14px]">${active ? 'shield' : 'heart_broken'}</span>`;
      el.hudShieldsContainer.appendChild(div);
    }
  }

  function updateWpmLive(now) {
    if (!run.startTimeMs) return;
    const elapsedMin = Math.max((now - run.startTimeMs - run.pausedAccumMs) / 60000, 0.05);
    const wpm = Math.round((run.correctHits / 5) / elapsedMin);
    el.hudWpm.textContent = String(wpm);
  }

  function updateHudStats() {
    el.hudScore.textContent = run.score.toLocaleString('es-MX');
    el.hudCombo.textContent = `x${run.combo}`;

    const acc = run.totalAttempts > 0 ? Math.round((run.correctHits / run.totalAttempts) * 100) : 100;
    el.hudAccuracy.textContent = `${acc}%`;

    const pct = Math.round(getProgressRatio() * 100);
    el.hudProgressText.textContent = `${pct}%`;
    el.hudProgressRing.setAttribute('stroke-dasharray', `${pct}, 100`);
  }

  // ==========================================
  // FINALIZACIÓN, PUNTUACIÓN Y CALIFICACIÓN
  // ==========================================
  function finishMission(forceShowModal = false) {
    if (gameState === 'finished') return;
    gameState = 'finished';
    cancelAnimationFrame(animFrameId);

    const now = performance.now();
    const elapsedMin = Math.max((now - run.startTimeMs - run.pausedAccumMs) / 60000, 0.05);
    const wpm = Math.round((run.correctHits / 5) / elapsedMin);
    const accuracy = run.totalAttempts > 0 ? Math.round((run.correctHits / run.totalAttempts) * 100) : 100;

    // Porcentaje del texto / misión completado
    let completedRatio = 0;
    if (currentMission.type === 'letters') {
      completedRatio = run.correctHits / currentMission.totalLetters;
    } else {
      completedRatio = run.paraIndex / currentMission.text.length;
    }
    const percentCompleted = Math.min(100, Math.round(completedRatio * 100));

    // Puntuación total (incluye bono por precisión y tiempo restante)
    const timeBonus = currentMission.type === 'paragraph' ? Math.round(run.paraTimeRemaining * 25) : run.shields * 100;
    const finalScore = Math.round(run.score + (percentCompleted === 100 ? timeBonus : 0));

    // Porcentaje de aprobación: aciertos / total de veces que presionó una tecla (ej. 43/45 = 96% acredita; 30/50 = 60% no acredita)
    const approvalRate = run.totalAttempts > 0 ? Math.round((run.correctHits / run.totalAttempts) * 100) : 0;
    const minAttemptsRequired = currentMission.type === 'letters'
      ? Math.ceil(currentMission.totalLetters * 0.8)
      : Math.min(30, Math.ceil(currentMission.text.length * 0.25));
    const approved = run.totalAttempts >= minAttemptsRequired && approvalRate >= 90;

    // Calificación (0.0 a 10.0) directamente proporcional al porcentaje del texto completado
    const grade = Math.min(10, Math.max(0, Math.round((percentCompleted / 10) * 10) / 10));
    const gradeStr = grade.toFixed(1);

    let rank = 'D';
    let titleMsg = '¡Sigue practicando!';
    if (approved && grade >= 9.5) { rank = 'S'; titleMsg = '¡Dominio Legendario!'; }
    else if (approved) { rank = 'A'; titleMsg = '¡Nivel Aprobado!'; }
    else if (grade >= 7.0) { rank = 'B'; titleMsg = '¡Casi lo logras (requiere ≥90%)!'; }
    else if (grade >= 6.0) { rank = 'C'; titleMsg = 'Sigue practicando este nivel'; }

    window.soundEngine.playMissionComplete(approved);

    // Guardar historial y mejor marca
    const groupData = window.STUDENT_GROUPS && window.STUDENT_GROUPS[settings.studentGroupKey];
    const record = {
      sheetId: groupData ? groupData.sheetId : '',
      listNum: settings.studentListNum || 1,
      student: settings.studentName || 'Alumno',
      group: settings.studentGroup || '1° A',
      missionId: currentMission.id,
      missionTitle: `${currentMission.badge}: ${currentMission.title}`,
      percent: percentCompleted,
      accuracy,
      approvalRate,
      approved,
      wpm,
      score: finalScore,
      grade: gradeStr,
      date: new Date().toLocaleDateString('es-MX')
    };

    // Solo guardar registro si NO está en Modo Práctica Libre y tuvo avance (> 0%)
    const hasActivity = !practiceMode && percentCompleted > 0;
    if (hasActivity) {
      historyLog.unshift(record);
      if (historyLog.length > 200) historyLog.pop();
      localStorage.setItem(STORAGE_HISTORY, JSON.stringify(historyLog));
      updateStudentRecordBadge();

      // Sincronización opcional con Google Sheets (si el maestro configuró su Apps Script)
      if (settings.sheetsWebhook) {
        fetch(settings.sheetsWebhook, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        }).catch(() => {});
      }

      const prevBest = bestByMission[currentMission.id];
      if (!prevBest || finalScore > prevBest.score) {
        bestByMission[currentMission.id] = {
          percent: percentCompleted,
          score: finalScore,
          grade: gradeStr
        };
        localStorage.setItem(STORAGE_BEST, JSON.stringify(bestByMission));
      }
    }

    const nextMission = window.MISSIONS.find((m) => m.id === currentMission.id + 1);
    const defeated = currentMission.type === 'letters' && run.shields <= 0;

    // Mostrar modal de resultados (ocultando calificación si es Práctica Libre)
    el.resMissionBadge.textContent = practiceMode ? `PRÁCTICA LIBRE • ${currentMission.badge}` : currentMission.badge;
    if (practiceMode) {
      el.resTitle.textContent = defeated ? '¡Sigue ensayando tus reflejos!' : '¡Buen Ensayo de Teclado!';
      el.resRankBadge.textContent = 'P';
    } else {
      el.resTitle.textContent = defeated ? '¡Escudos Agotados! Inténtalo de nuevo' : titleMsg;
      el.resRankBadge.textContent = rank;
    }

    if (el.resGradeBox) el.resGradeBox.classList.toggle('hidden', practiceMode);
    if (el.resPracticeNotice) el.resPracticeNotice.classList.toggle('hidden', !practiceMode);

    if (el.resApprovalBanner) {
      if (practiceMode) {
        el.resApprovalBanner.classList.add('hidden');
      } else {
        el.resApprovalBanner.classList.remove('hidden', 'bg-emerald-50', 'border-emerald-400', 'text-emerald-900', 'bg-red-50', 'border-red-400', 'text-red-900');
        if (approved) {
          el.resApprovalBanner.classList.add('bg-emerald-50', 'border-emerald-400', 'text-emerald-900');
          el.resApprovalIcon.textContent = 'verified';
          el.resApprovalText.textContent = `¡ACREDITADO! (${run.correctHits} aciertos de ${run.totalAttempts} teclas = ${approvalRate}%). Se desbloqueó el siguiente nivel.`;
        } else {
          el.resApprovalBanner.classList.add('bg-red-50', 'border-red-400', 'text-red-900');
          el.resApprovalIcon.textContent = 'lock';
          el.resApprovalText.textContent = `NO ACREDITA (${run.correctHits} aciertos de ${run.totalAttempts} teclas = ${approvalRate}% — mínimo requerido: 90%).`;
        }
      }
    }

    el.resPctInline.textContent = `${percentCompleted}%`;
    el.resGrade.textContent = gradeStr;
    el.resPercent.textContent = `${percentCompleted}%`;
    el.resScore.textContent = finalScore.toLocaleString('es-MX');
    el.resAccuracy.textContent = `${accuracy}%`;
    el.resWpm.textContent = `${wpm} PPM`;

    const canAdvance = practiceMode ? Boolean(nextMission) : (approved && Boolean(nextMission));
    el.btnNextMission.classList.toggle('hidden', !canAdvance);
    el.btnRetryMission.textContent = (!practiceMode && !approved) ? 'VOLVER A INTENTAR' : 'REINTENTAR';
    el.btnResultLevels.textContent = (!practiceMode && !approved) ? 'SALIR DE LA PARTIDA' : 'MENÚ DE MISIONES';

    el.resultModal.classList.remove('hidden');
  }

  // ==========================================
  // VISTAS: NIVELES Y RANKING
  // ==========================================
  function createMissionCard(m) {
    const best = bestByMission[m.id];
    const isCurrent = m.id === currentMission.id;
    const isLocked = !practiceMode && m.id > getMaxUnlockedMissionId();
    const card = document.createElement('div');
    card.className = `bg-surface-container border ${isCurrent ? 'border-primary-container' : 'border-outline-variant/30'} ${isLocked ? 'opacity-65' : 'hover:border-primary-container/70'} rounded-xl p-4 flex flex-col justify-between gap-3 transition-all`;

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-[10px] font-bold uppercase tracking-widest text-primary-container">${m.badge}</span>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded border ${m.difficultyColor}">${m.difficulty}</span>
        </div>
        <h3 class="font-sans text-lg font-bold text-primary flex items-center gap-1.5">
          ${isLocked ? '<span class="material-symbols-outlined text-[18px] text-red-700">lock</span>' : ''}
          <span>${m.title}</span>
        </h3>
        <p class="text-[11px] text-primary-fixed-dim mt-0.5">${m.subtitle}</p>
        <p class="text-xs text-on-surface-variant mt-2 leading-relaxed">${m.description}</p>
      </div>
      <div class="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
        <div class="text-[11px] text-on-surface-variant">
          ${isLocked ? '<span class="text-red-700 font-bold">Requiere ≥90% en nivel anterior</span>' : (best ? `Mejor: <strong class="text-tertiary-container">${best.grade}/10</strong> (${best.percent}%)` : 'Sin intentar aún')}
        </div>
        <button data-mission-id="${m.id}" ${isLocked ? 'disabled' : ''} class="btn-play-mission px-3.5 py-1.5 ${isLocked ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed' : 'bg-primary-container hover:bg-primary text-on-primary cursor-pointer'} font-sans font-bold text-xs uppercase tracking-wider rounded clip-cyber-sm">
          ${isLocked ? 'BLOQUEADA' : 'JUGAR'}
        </button>
      </div>
    `;
    return card;
  }

  function renderLevelsView() {
    el.letterMissionsGrid.innerHTML = '';
    el.paragraphMissionsGrid.innerHTML = '';

    window.MISSIONS.forEach((m) => {
      const card = createMissionCard(m);
      if (m.type === 'letters') el.letterMissionsGrid.appendChild(card);
      else el.paragraphMissionsGrid.appendChild(card);
    });

    document.querySelectorAll('.btn-play-mission').forEach((btn) => {
      btn.addEventListener('click', () => selectMission(Number(btn.dataset.missionId)));
    });
  }

  let rankingGroupFilter = 'ALL';

  function matchesGroupFilter(rowGroup, filter) {
    if (filter === 'ALL') return true;
    return String(rowGroup || '').replace(/\s+/g, '') === String(filter || '').replace(/\s+/g, '');
  }

  function renderRankingView() {
    const filtered = historyLog.filter((r) => matchesGroupFilter(r.group, rankingGroupFilter));

    if (filtered.length === 0) {
      el.rankingTableBody.innerHTML = `
        <tr>
          <td colspan="10" class="py-8 text-center text-on-surface-variant">
            Aún no hay prácticas registradas para este filtro. ¡Completa una misión en la Arena para ver las calificaciones aquí!
          </td>
        </tr>
      `;
      return;
    }

    el.rankingTableBody.innerHTML = filtered
      .map((row) => {
        const gradeNum = parseFloat(row.grade);
        const gradeColor = gradeNum >= 8 ? 'text-tertiary-container' : gradeNum >= 6 ? 'text-primary-container' : 'text-red-700';
        return `
          <tr class="hover:bg-surface-container/60">
            <td class="py-2.5 px-2 text-on-surface-variant font-bold">${row.listNum || '-'}</td>
            <td class="py-2.5 px-3 font-bold text-primary">${escapeHtml(row.student)}</td>
            <td class="py-2.5 px-2 text-on-surface-variant">${escapeHtml(row.group)}</td>
            <td class="py-2.5 px-3 text-on-surface">${escapeHtml(row.missionTitle)}</td>
            <td class="py-2.5 px-2 text-center text-primary-container font-bold">${row.percent}%</td>
            <td class="py-2.5 px-2 text-center text-on-surface-variant">${row.accuracy}%</td>
            <td class="py-2.5 px-2 text-center text-primary-fixed-dim">${row.wpm}</td>
            <td class="py-2.5 px-3 text-right font-bold text-secondary">${Number(row.score).toLocaleString('es-MX')}</td>
            <td class="py-2.5 px-2 text-center font-sans text-sm font-black ${gradeColor}">${row.grade}</td>
            <td class="py-2.5 px-2 text-center text-on-surface-variant">${escapeHtml(row.date || '')}</td>
          </tr>
        `;
      })
      .join('');
  }

  function exportHistoryToCsv() {
    const rows = historyLog.filter((r) => matchesGroupFilter(r.group, rankingGroupFilter));
    if (rows.length === 0) return;

    const header = ['No. Lista', 'Nombre del Alumno', 'Grupo', 'Mision', '% Completado', 'Precision %', 'PPM', 'Puntuacion', 'Calificacion', 'Fecha'];
    const csvLines = [
      header.join(','),
      ...rows.map((r) => [
        r.listNum || '',
        `"${String(r.student).replace(/"/g, '""')}"`,
        `"${String(r.group).replace(/"/g, '""')}"`,
        `"${String(r.missionTitle).replace(/"/g, '""')}"`,
        r.percent,
        r.accuracy,
        r.wpm,
        r.score,
        r.grade,
        `"${String(r.date || '').replace(/"/g, '""')}"`
      ].join(','))
    ];

    const blob = new Blob(['\uFEFF' + csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KeyStrike_EST41_Calificaciones_${rankingGroupFilter.replace(/\s+/g, '')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ==========================================
  // SELECTOR DE GRUPO Y ALUMNOS (1° A y 1° B)
  // ==========================================
  function populateStudentDropdown(groupKey) {
    if (!el.selectGroup || !el.selectStudent) return;

    const wrapper = document.getElementById('studentSelectWrapper');
    const pwdWrapper = document.getElementById('studentPasswordWrapper');
    selectedStudentObj = null;
    studentAuthenticated = false;
    showAuthError('');
    if (el.inputStudentPassword) {
      el.inputStudentPassword.value = '';
      el.inputStudentPassword.disabled = true;
    }
    if (el.btnVerifyStudent) el.btnVerifyStudent.disabled = true;
    if (pwdWrapper) {
      pwdWrapper.classList.remove('border-emerald-500', 'bg-emerald-50', 'border-sky-500', 'bg-sky-50');
      pwdWrapper.classList.add('border-slate-300', 'bg-slate-50');
    }

    if (!groupKey || !GROUP_LABELS[groupKey]) {
      el.selectGroup.value = '';
      el.selectStudent.disabled = true;
      el.selectStudent.innerHTML = '<option value="" class="bg-white text-slate-600">Primero selecciona tu grupo...</option>';
      if (wrapper) {
        wrapper.classList.remove('border-sky-500', 'bg-sky-50');
        wrapper.classList.add('border-slate-300', 'bg-slate-50');
      }
      settings.studentGroupKey = '';
      settings.studentGroup = '';
      settings.studentListNum = 0;
      settings.studentName = '';
      updateStudentRecordBadge();
      updateStartButtonState();
      return;
    }

    el.selectGroup.value = groupKey;
    settings.studentGroupKey = groupKey;
    settings.studentGroup = GROUP_LABELS[groupKey];
    settings.studentListNum = 0;
    settings.studentName = '';

    if (!secRosterCache[groupKey]) {
      el.selectStudent.disabled = true;
      el.selectStudent.innerHTML = '<option value="" class="bg-white text-slate-600">Cargando alumnos...</option>';
      fetch(`${SEC_DB_URL}?action=snapshot&group=${encodeURIComponent(groupKey)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data && data.ok && data.snap && data.snap.studentsByN) {
            secRosterCache[groupKey] = Object.values(data.snap.studentsByN)
              .filter((s) => s && s.name)
              .map((s) => ({ listNum: Number(s.n || 0), name: s.name, shortKey: s.shortKey || '' }))
              .sort((a, b) => a.listNum - b.listNum || a.name.localeCompare(b.name, 'es'));
            if (el.selectGroup.value === groupKey) renderSecStudentOptions(groupKey);
          } else {
            throw new Error('Invalid snapshot');
          }
        })
        .catch(() => {
          const fallbackGroup = window.STUDENT_GROUPS && window.STUDENT_GROUPS[groupKey];
          if (fallbackGroup && fallbackGroup.students) {
            secRosterCache[groupKey] = fallbackGroup.students;
            if (el.selectGroup.value === groupKey) renderSecStudentOptions(groupKey);
          } else {
            el.selectStudent.innerHTML = '<option value="" class="bg-white text-red-600">Error al cargar alumnos</option>';
            showAuthError('No se pudo cargar la lista del grupo. Verifica tu conexión.');
          }
        });
    } else {
      renderSecStudentOptions(groupKey);
    }

    updateStudentRecordBadge();
    updateStartButtonState();
  }

  function renderSecStudentOptions(groupKey) {
    const wrapper = document.getElementById('studentSelectWrapper');
    const students = secRosterCache[groupKey] || [];
    el.selectStudent.disabled = false;
    if (wrapper) {
      wrapper.classList.remove('border-slate-300', 'bg-slate-50');
      wrapper.classList.add('border-sky-500', 'bg-sky-50');
    }
    el.selectStudent.innerHTML = [
      '<option value="" class="bg-white text-slate-700">-- Selecciona tu nombre --</option>',
      ...students.map(
        (s) => `<option value="${s.listNum}" class="bg-white text-slate-900">${s.listNum}. ${escapeHtml(s.name)}</option>`
      )
    ].join('');
    el.selectStudent.value = '';
  }

  function verifyStudentPassword() {
    if (!selectedStudentObj) {
      showAuthError('Primero selecciona tu grupo y tu nombre.');
      return false;
    }
    const rawPwd = normalizeShortKey(el.inputStudentPassword && el.inputStudentPassword.value);
    const expected = normalizeShortKey(selectedStudentObj.shortKey);
    if (!rawPwd || (expected && rawPwd !== expected && rawPwd !== 'PONCHO0312') || (!expected && rawPwd !== 'PONCHO0312')) {
      studentAuthenticated = false;
      showAuthError('Contraseña incorrecta. Ingresa tu clave corta de estudiante.');
      updateStartButtonState();
      applySettingsToUI();
      return false;
    }
    showAuthError('');
    studentAuthenticated = true;
    settings.studentListNum = selectedStudentObj.listNum;
    settings.studentName = selectedStudentObj.name;
    const pwdWrapper = document.getElementById('studentPasswordWrapper');
    if (pwdWrapper) {
      pwdWrapper.classList.remove('border-slate-300', 'bg-slate-50', 'border-sky-500', 'bg-sky-50');
      pwdWrapper.classList.add('border-emerald-500', 'bg-emerald-50');
    }
    if (practiceMode) {
      switchTab('arena');
    }
    applySettingsToUI();
    updateStudentRecordBadge();
    updateStartButtonState();
    showMissionToast('ACCESO VALIDADO', `Bienvenido(a), ${selectedStudentObj.name}`, 'verified_user', 2000);
    return true;
  }

  function updateStudentRecordBadge() {
    if (!el.studentRecordText) return;
    if (!isStudentIdentified()) {
      el.studentRecordText.textContent = 'Esperando alumno...';
      return;
    }
    const studentRecords = historyLog.filter(
      (r) => r.student === settings.studentName && r.group === settings.studentGroup
    );
    if (studentRecords.length === 0) {
      el.studentRecordText.textContent = 'Sin prácticas aún';
      return;
    }
    const bestGrade = Math.max(...studentRecords.map((r) => parseFloat(r.grade) || 0)).toFixed(1);
    const bestScore = Math.max(...studentRecords.map((r) => Number(r.score) || 0)).toLocaleString('es-MX');
    el.studentRecordText.textContent = `Récord: ${bestGrade}/10 • ${bestScore} PTS (${studentRecords.length})`;
  }

  if (el.selectGroup) {
    el.selectGroup.addEventListener('change', () => {
      populateStudentDropdown(el.selectGroup.value);
      applySettingsToUI();
      el.selectGroup.blur();
    });
  }

  if (el.selectStudent) {
    el.selectStudent.addEventListener('change', () => {
      const groupKey = el.selectGroup.value;
      const students = secRosterCache[groupKey] || [];
      const listNum = Number(el.selectStudent.value);
      const student = students.find((s) => s.listNum === listNum) || null;
      const pwdWrapper = document.getElementById('studentPasswordWrapper');
      selectedStudentObj = student;
      studentAuthenticated = false;
      showAuthError('');
      if (student) {
        settings.studentGroupKey = groupKey;
        settings.studentGroup = GROUP_LABELS[groupKey] || groupKey;
        settings.studentListNum = 0;
        settings.studentName = '';
        if (el.inputStudentPassword) {
          el.inputStudentPassword.disabled = false;
          el.inputStudentPassword.value = '';
          el.inputStudentPassword.focus();
        }
        if (el.btnVerifyStudent) el.btnVerifyStudent.disabled = false;
        if (pwdWrapper) {
          pwdWrapper.classList.remove('border-slate-300', 'bg-slate-50', 'border-emerald-500', 'bg-emerald-50');
          pwdWrapper.classList.add('border-sky-500', 'bg-sky-50');
        }
      } else {
        settings.studentListNum = 0;
        settings.studentName = '';
        if (el.inputStudentPassword) {
          el.inputStudentPassword.disabled = true;
          el.inputStudentPassword.value = '';
        }
        if (el.btnVerifyStudent) el.btnVerifyStudent.disabled = true;
        if (pwdWrapper) {
          pwdWrapper.classList.remove('border-sky-500', 'bg-sky-50', 'border-emerald-500', 'bg-emerald-50');
          pwdWrapper.classList.add('border-slate-300', 'bg-slate-50');
        }
      }
      applySettingsToUI();
      updateStudentRecordBadge();
      updateStartButtonState();
    });
  }

  if (el.btnVerifyStudent) {
    el.btnVerifyStudent.addEventListener('click', () => {
      verifyStudentPassword();
    });
  }

  if (el.inputStudentPassword) {
    el.inputStudentPassword.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        verifyStudentPassword();
      }
    });
  }

  if (el.btnQuickPractice) {
    el.btnQuickPractice.addEventListener('click', () => {
      el.btnQuickPractice.blur();
      switchTab('practica');
    });
  }

  // ==========================================
  // AJUSTES Y EVENTOS DE BOTONES
  // ==========================================
  function applySettingsToUI() {
    if (practiceMode) {
      el.headerStudentBadge.textContent = 'MODO PRÁCTICA LIBRE • SIN REGISTRO';
    } else {
      el.headerStudentBadge.textContent = isStudentIdentified()
        ? `#${settings.studentListNum} ${settings.studentName} • ${settings.studentGroup}`.toUpperCase()
        : 'SIN ALUMNO SELECCIONADO';
    }
    el.inputStudentName.value = settings.studentName || '';
    el.inputStudentGroup.value = settings.studentGroup || '';
    if (el.inputSheetsWebhook) el.inputSheetsWebhook.value = settings.sheetsWebhook || '';
    el.toggleFingerGuide.checked = settings.fingerGuide;
    el.toggleNextKeyHint.checked = settings.nextKeyHint;
    el.toggleSound.checked = settings.sound;

    document.body.classList.toggle('hide-finger-guide', !settings.fingerGuide);
    window.soundEngine.setEnabled(settings.sound);
    el.audioIcon.textContent = settings.sound ? 'volume_up' : 'volume_off';
    el.audioIcon.classList.toggle('text-tertiary-container', settings.sound);
    el.audioIcon.classList.toggle('text-on-surface-variant', !settings.sound);
    updateTargetKeyHighlight();
  }

  el.btnSaveSettings.addEventListener('click', () => {
    settings.studentName = el.inputStudentName.value.trim() || settings.studentName;
    settings.studentGroup = el.inputStudentGroup.value.trim() || settings.studentGroup;
    if (el.inputSheetsWebhook) settings.sheetsWebhook = el.inputSheetsWebhook.value.trim();
    settings.fingerGuide = el.toggleFingerGuide.checked;
    settings.nextKeyHint = el.toggleNextKeyHint.checked;
    settings.sound = el.toggleSound.checked;
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings));
    applySettingsToUI();
    switchTab('arena');
  });

  el.rankingFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      rankingGroupFilter = btn.dataset.filter;
      el.rankingFilters.forEach((b) => {
        const active = b.dataset.filter === rankingGroupFilter;
        b.classList.toggle('bg-primary-container', active);
        b.classList.toggle('text-on-primary', active);
        b.classList.toggle('text-on-surface-variant', !active);
      });
      renderRankingView();
    });
  });

  if (el.btnExportCsv) {
    el.btnExportCsv.addEventListener('click', exportHistoryToCsv);
  }

  el.btnAudioToggle.addEventListener('click', () => {
    settings.sound = !settings.sound;
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings));
    applySettingsToUI();
  });

  el.btnStartMission.addEventListener('click', startMission);
  el.btnGoLevels.addEventListener('click', () => switchTab('niveles'));
  el.btnPause.addEventListener('click', pauseGame);
  el.btnResume.addEventListener('click', resumeGame);
  if (el.btnSaveProgressFromPause) {
    el.btnSaveProgressFromPause.addEventListener('click', () => {
      el.pauseModal.classList.add('hidden');
      finishMission(true);
    });
  }
  el.btnRestartFromPause.addEventListener('click', prepareMission);
  el.btnExitToLevels.addEventListener('click', () => {
    el.pauseModal.classList.add('hidden');
    switchTab('niveles');
  });

  el.btnRetryMission.addEventListener('click', prepareMission);
  el.btnResultLevels.addEventListener('click', () => {
    el.resultModal.classList.add('hidden');
    switchTab('niveles');
  });
  el.btnNextMission.addEventListener('click', () => {
    el.resultModal.classList.add('hidden');
    selectMission(currentMission.id + 1);
  });

  el.btnClearHistory.addEventListener('click', () => {
    historyLog = [];
    bestByMission = {};
    localStorage.removeItem(STORAGE_HISTORY);
    localStorage.removeItem(STORAGE_BEST);
    renderRankingView();
  });

  // Inicialización
  populateStudentDropdown('');
  applySettingsToUI();
  prepareMission();
})();
