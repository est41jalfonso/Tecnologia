// Motor del videojuego FraccionesPairs (Primaria Teodoro Olivares)
(function () {
  const bank = window.FRACTIONS_PAIRS_BANK || [];
  const $ = (id) => document.getElementById(id);

  let soundEnabled = true;
  let audioCtx = null;
  let deck = [];
  let flippedIndices = [];
  let matchedIds = new Set();
  let lockBoard = false;
  let attempts = 0;
  let totalPairs = 8;
  let xp = 0;
  let timerSeconds = 0;
  let timerHandle = null;
  let started = false;

  function playTone(freq, dur, type = 'sine') {
    if (!soundEnabled) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (_) {}
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return m + ':' + s;
  }

  function stopTimer() {
    if (timerHandle) {
      clearInterval(timerHandle);
      timerHandle = null;
    }
  }

  function startTimerIfNeeded() {
    if (started) return;
    started = true;
    stopTimer();
    timerHandle = setInterval(() => {
      timerSeconds++;
      $('statTimer').textContent = formatTime(timerSeconds);
    }, 1000);
  }

  function updateStats() {
    $('statMatches').textContent = matchedIds.size + ' / ' + totalPairs;
    $('statAttempts').textContent = String(attempts);
    const acc = attempts > 0 ? Math.round((matchedIds.size / attempts) * 100) : 100;
    $('statAccuracy').textContent = acc + '%';
    $('statXp').textContent = xp + ' XP';
  }

  function setFeedback(kind, html) {
    const box = $('feedbackBanner');
    const txt = $('feedbackText');
    if (kind === 'ok') {
      box.className = 'bg-emerald-50 border-2 border-emerald-300 rounded-2xl px-4 py-3 flex items-center gap-3 text-sm font-semibold text-emerald-950';
    } else if (kind === 'err') {
      box.className = 'bg-rose-50 border-2 border-rose-300 rounded-2xl px-4 py-3 flex items-center gap-3 text-sm font-semibold text-rose-950';
    } else {
      box.className = 'bg-sky-50 border-2 border-sky-200 rounded-2xl px-4 py-3 flex items-center gap-3 text-sm font-semibold text-slate-800';
    }
    txt.innerHTML = html;
  }

  let levelsList = [];

  function populateLevels() {
    levelsList = [...new Set(bank.map((c) => c.level))];
    const sel = $('levelSelect');
    const catSel = $('catalogLevel');
    levelsList.forEach((lv, idx) => {
      const count = bank.filter((c) => c.level === lv).length;
      const opt1 = document.createElement('option');
      opt1.value = lv;
      opt1.textContent = lv + ' (' + count + ' fracciones)';
      if (idx === 0) opt1.selected = true; // Iniciar siempre con Nivel 1 (fracciones sencillas)
      sel.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = lv;
      opt2.textContent = lv + ' (' + count + ')';
      catSel.appendChild(opt2);
    });
  }

  function buildNewRound() {
    stopTimer();
    started = false;
    timerSeconds = 0;
    $('statTimer').textContent = '00:00';
    attempts = 0;
    matchedIds = new Set();
    flippedIndices = [];
    lockBoard = false;
    $('winModal').classList.add('hidden');

    const lv = $('levelSelect').value;
    const pool = lv === 'all' ? bank : bank.filter((c) => c.level === lv);
    const desiredPairs = Number($('difficultySelect').value) || 8;
    totalPairs = Math.min(desiredPairs, pool.length);

    const chosen = shuffle(pool).slice(0, totalPairs);
    const cards = [];
    chosen.forEach((item) => {
      cards.push({ uid: item.id + '-term', id: item.id, kind: 'term', item });
      cards.push({ uid: item.id + '-image', id: item.id, kind: 'image', item });
    });
    deck = shuffle(cards);

    renderBoard();
    updateStats();
    setFeedback('info', 'Selecciona dos cartas: une cada <strong>fracción escrita</strong> con el <strong>dibujo que muestra sus partes iluminadas</strong>.');
  }

  function renderBoard() {
    const board = $('boardGrid');
    const openMode = $('modeSelect').value === 'open';
    board.innerHTML = '';

    deck.forEach((card, idx) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'pair-card text-left ' + (card.kind === 'term' ? 'type-term' : 'type-image') + (openMode ? ' is-flipped' : '');
      el.setAttribute('data-idx', String(idx));

      const frontContent =
        card.kind === 'term'
          ? `
            <span class="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-[10px] font-extrabold uppercase tracking-wider mb-2">
              Fracción
            </span>
            <div class="frac-display" aria-label="${card.item.label}">
              <span class="frac-num">${card.item.num}</span>
              <span class="frac-bar"></span>
              <span class="frac-den">${card.item.den}</span>
            </div>
            <span class="text-xs font-bold text-slate-600 mt-1.5">${card.item.num} de ${card.item.den}</span>
          `
          : `
            <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wider mb-1">
              Pastel
            </span>
            <div class="svg-wrap">${card.item.svg}</div>
            <span class="mt-1 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-300 font-display font-extrabold text-base text-slate-900">${card.item.label}</span>
          `;

      el.innerHTML = `
        <div class="pair-card-inner">
          <div class="pair-card-face pair-card-back">
            <span class="material-symbols-outlined text-[34px] mb-1 opacity-95">pie_chart</span>
            <span class="font-display font-extrabold text-xs uppercase tracking-widest opacity-90">FRACCIONES</span>
          </div>
          <div class="pair-card-face pair-card-front">
            ${frontContent}
          </div>
        </div>
      `;

      el.addEventListener('click', () => handleCardClick(idx, el));
      board.appendChild(el);
    });
  }

  function handleCardClick(idx, el) {
    if (lockBoard) return;
    const card = deck[idx];
    if (!card || matchedIds.has(card.id)) return;
    if (flippedIndices.includes(idx)) return;

    startTimerIfNeeded();
    playTone(520, 0.06, 'triangle');

    el.classList.add('is-flipped');
    flippedIndices.push(idx);

    if (flippedIndices.length < 2) return;

    attempts++;
    const [i1, i2] = flippedIndices;
    const c1 = deck[i1];
    const c2 = deck[i2];
    const el1 = $('boardGrid').children[i1];
    const el2 = $('boardGrid').children[i2];

    if (c1.id === c2.id && c1.kind !== c2.kind) {
      matchedIds.add(c1.id);
      xp += 25;
      el1.classList.add('is-matched');
      el2.classList.add('is-matched');
      flippedIndices = [];
      playTone(660, 0.12, 'sine');
      setTimeout(() => playTone(880, 0.16, 'sine'), 90);

      setFeedback('ok', '¡Acierto! <strong>' + c1.item.label + '</strong>: ' + c1.item.hint);
      updateStats();

      if (matchedIds.size === totalPairs) {
        stopTimer();
        const acc = Math.round((matchedIds.size / attempts) * 100);
        $('winSummary').textContent = `Completaste ${totalPairs} pares de fracciones en ${attempts} intentos (${acc}% de precisión) y un tiempo de ${formatTime(timerSeconds)}.`;
        const curLv = $('levelSelect').value;
        const curIdx = levelsList.indexOf(curLv);
        const nextBtn = $('nextLevelBtn');
        if (nextBtn) {
          if (curIdx !== -1 && curIdx + 1 < levelsList.length) {
            nextBtn.classList.remove('hidden');
            nextBtn.textContent = 'Subir a ' + levelsList[curIdx + 1].split('·')[0].trim() + ' →';
          } else {
            nextBtn.classList.add('hidden');
          }
        }
        setTimeout(() => $('winModal').classList.remove('hidden'), 350);
      }
    } else {
      lockBoard = true;
      el1.classList.add('is-wrong');
      el2.classList.add('is-wrong');
      playTone(220, 0.18, 'sawtooth');
      setFeedback('err', 'No coinciden. Cuenta cuántas partes están iluminadas y cuántas partes totales tiene el dibujo.');
      updateStats();

      const openMode = $('modeSelect').value === 'open';
      setTimeout(() => {
        el1.classList.remove('is-wrong');
        el2.classList.remove('is-wrong');
        if (!openMode) {
          el1.classList.remove('is-flipped');
          el2.classList.remove('is-flipped');
        }
        flippedIndices = [];
        lockBoard = false;
      }, 850);
    }
  }

  function renderCatalog() {
    const q = ($('catalogSearch').value || '').trim().toLowerCase();
    const lv = $('catalogLevel').value;
    const filtered = bank.filter((c) => {
      if (lv !== 'all' && c.level !== lv) return false;
      if (q && !c.label.toLowerCase().includes(q) && !c.hint.toLowerCase().includes(q)) return false;
      return true;
    });

    const grid = $('catalogGrid');
    grid.innerHTML = filtered
      .slice(0, 120)
      .map(
        (c) => `
      <article class="bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-xs flex flex-col items-center text-center gap-2">
        <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold">${c.level}</span>
        <div class="svg-wrap">${c.svg}</div>
        <div class="font-display font-extrabold text-2xl text-slate-900">${c.label}</div>
        <p class="text-xs text-slate-600 font-medium">${c.hint}</p>
      </article>
    `
      )
      .join('') + (filtered.length > 120 ? `<div class="col-span-full text-center text-xs font-bold text-slate-500 py-2">Mostrando 120 de ${filtered.length} fracciones. Usa el buscador (ej. "3/8" o "15/20") para filtrar más rápido.</div>` : '');
  }

  // ==================== MISIONES CONTRARRELOJ (20 PREGUNTAS C/U) ====================
  const MISSIONS = [
    { id: 1, title: 'Misión 1: Primeros Pasos', desc: 'Fracciones simples (1/2, 2/3, 1/4, 3/5)', minDen: 2, maxDen: 6, timePerQ: 20, count: 20, color: 'emerald' },
    { id: 2, title: 'Misión 2: Explorador', desc: 'Séptimos, octavos, novenos y décimos', minDen: 5, maxDen: 10, timePerQ: 18, count: 20, color: 'sky' },
    { id: 3, title: 'Misión 3: Desafío Medio', desc: 'Denominadores medianos (9 a 16)', minDen: 9, maxDen: 16, timePerQ: 16, count: 20, color: 'purple' },
    { id: 4, title: 'Misión 4: Maestro', desc: 'Fracciones más grandes (15 a 26)', minDen: 15, maxDen: 26, timePerQ: 15, count: 20, color: 'amber' },
    { id: 5, title: 'Misión 5: Súper Reto', desc: 'Hasta centésimos (20 a 100)', minDen: 18, maxDen: 100, timePerQ: 14, count: 20, color: 'rose' }
  ];

  let mState = {
    missionIdx: 0,
    questions: [],
    qIndex: 0,
    qAttempts: 0,
    scoreSum: 0,
    firstTryCount: 0,
    timeoutCount: 0,
    clockHandle: null,
    timeLeft: 20,
    locked: false
  };

  function stopMissionClock() {
    if (mState.clockHandle) {
      clearInterval(mState.clockHandle);
      mState.clockHandle = null;
    }
  }

  function buildQuestionPrompt(item, qIdx) {
    const n = item.num;
    const d = item.den;
    const templates = [
      `¿Qué pastel representa la relación de ${n} partes iluminadas de ${d} partes iguales (${item.label})?`,
      `Observa el numerador (${n}) y el denominador (${d}) de ${item.label}: ¿cuál dibujo muestra esa fracción?`,
      `Si divides un pastel en ${d} rebanadas iguales e iluminas ${n}, ¿qué dibujo corresponde a ${item.label}?`,
      `¿En cuál de las tres figuras la relación entre lo iluminado y el total equivale exactamente a ${item.label}?`
    ];
    return templates[qIdx % templates.length];
  }

  function renderMissionsList() {
    const grid = $('missionsCardsGrid');
    if (!grid) return;
    grid.innerHTML = MISSIONS.map((m, idx) => `
      <button type="button" data-mission-idx="${idx}" class="text-left bg-slate-50 hover:bg-white rounded-2xl border-2 border-slate-200 hover:border-purple-400 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 cursor-pointer">
        <div class="space-y-1.5">
          <div class="flex items-center justify-between gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-extrabold uppercase">${m.count} Preguntas</span>
            <span class="text-xs font-extrabold text-amber-700">${m.timePerQ}s/preg</span>
          </div>
          <h3 class="font-display font-extrabold text-base text-slate-900">${m.title}</h3>
          <p class="text-xs text-slate-600 font-medium">${m.desc}</p>
        </div>
        <span class="inline-flex items-center gap-1 text-xs font-extrabold text-purple-700">
          <span>Iniciar Misión</span>
          <span class="material-symbols-outlined text-[16px]">play_arrow</span>
        </span>
      </button>
    `).join('');

    grid.querySelectorAll('[data-mission-idx]').forEach((btn) => {
      btn.addEventListener('click', () => startMission(Number(btn.getAttribute('data-mission-idx'))));
    });
  }

  function startMission(idx) {
    stopMissionClock();
    const m = MISSIONS[idx] || MISSIONS[0];
    const pool = bank.filter((c) => c.den >= m.minDen && c.den <= m.maxDen);
    const picked = [];
    while (picked.length < m.count) {
      const batch = shuffle(pool);
      for (const it of batch) {
        if (picked.length < m.count) picked.push(it);
      }
    }

    mState = {
      missionIdx: idx,
      questions: picked,
      qIndex: 0,
      qAttempts: 0,
      scoreSum: 0,
      firstTryCount: 0,
      timeoutCount: 0,
      clockHandle: null,
      timeLeft: m.timePerQ,
      locked: false
    };

    $('missionSelectPanel').classList.add('hidden');
    $('missionResultBox').classList.add('hidden');
    $('missionPlayArea').classList.remove('hidden');
    renderMissionQuestion();
  }

  function updateMissionHud() {
    const m = MISSIONS[mState.missionIdx];
    $('mStatProgress').textContent = (mState.qIndex + 1) + ' / ' + m.count;
    $('mStatFirstTry').textContent = String(mState.firstTryCount);
    const currentGrade = (mState.scoreSum / m.count) * 10;
    $('mStatGrade').textContent = currentGrade.toFixed(1) + ' / 10';
  }

  function renderMissionQuestion() {
    stopMissionClock();
    const m = MISSIONS[mState.missionIdx];
    const target = mState.questions[mState.qIndex];
    mState.qAttempts = 0;
    mState.timeLeft = m.timePerQ;
    mState.locked = false;

    $('mMissionBadge').textContent = m.title;
    $('mQuestionText').textContent = buildQuestionPrompt(target, mState.qIndex);
    $('mTargetFraction').innerHTML = `
      <span class="frac-num">${target.num}</span>
      <span class="frac-bar"></span>
      <span class="frac-den">${target.den}</span>
    `;
    $('mFeedbackBox').classList.add('hidden');

    // Elegir 2 distractores distintos del mismo rango de dificultad
    const distractorPool = shuffle(bank.filter((c) => c.id !== target.id && c.den >= m.minDen && c.den <= m.maxDen));
    const options = shuffle([target, distractorPool[0], distractorPool[1]]);

    const grid = $('mOptionsGrid');
    grid.innerHTML = '';
    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mission-option-card bg-white/95 rounded-3xl border-3 border-slate-200 hover:border-sky-400 p-5 shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer';
      btn.innerHTML = `
        <div class="pointer-events-none">${opt.svg}</div>
        <span class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Seleccionar dibujo</span>
      `;
      btn.addEventListener('click', () => handleMissionAnswer(opt, btn));
      grid.appendChild(btn);
    });

    updateMissionHud();
    updateClockUi();
    mState.clockHandle = setInterval(() => {
      mState.timeLeft--;
      updateClockUi();
      if (mState.timeLeft <= 0) {
        stopMissionClock();
        handleMissionTimeout();
      }
    }, 1000);
  }

  function updateClockUi() {
    const m = MISSIONS[mState.missionIdx];
    const pct = Math.max(0, Math.round((mState.timeLeft / m.timePerQ) * 100));
    $('mStatClock').textContent = mState.timeLeft + ' s';
    const bar = $('mTimeBar');
    bar.style.width = pct + '%';
    if (pct > 50) bar.className = 'h-full bg-emerald-500 transition-all duration-300';
    else if (pct > 25) bar.className = 'h-full bg-amber-500 transition-all duration-300';
    else bar.className = 'h-full bg-rose-600 transition-all duration-300';
  }

  function handleMissionAnswer(opt, btn) {
    if (mState.locked) return;
    const target = mState.questions[mState.qIndex];
    mState.qAttempts++;

    if (opt.id === target.id) {
      stopMissionClock();
      mState.locked = true;
      let earned = 0;
      let msg = '';
      if (mState.qAttempts === 1) {
        earned = 1;
        mState.firstTryCount++;
        msg = `¡Correcto a la primera! (${target.label}: ${target.hint}) +100%`;
      } else if (mState.qAttempts === 2) {
        earned = 0.5;
        msg = `Correcto en 2.º intento (${target.label}). Calificación reducida al 50%.`;
      } else {
        earned = 0;
        msg = `Correcto en ${mState.qAttempts}.º intento (${target.label}). Sin puntos en esta pregunta.`;
      }
      mState.scoreSum += earned;
      btn.className = 'mission-option-card bg-emerald-50 rounded-3xl border-4 border-emerald-500 p-5 shadow-md flex flex-col items-center justify-center gap-2';
      playTone(660, 0.1, 'sine');
      setTimeout(() => playTone(880, 0.14, 'sine'), 80);
      showMissionFeedback('ok', msg);
      updateMissionHud();
      setTimeout(advanceMissionQuestion, 1100);
    } else {
      btn.disabled = true;
      btn.className = 'mission-option-card bg-rose-50 rounded-3xl border-4 border-rose-400 p-5 opacity-60 flex flex-col items-center justify-center gap-2';
      playTone(220, 0.16, 'sawtooth');
      showMissionFeedback('err', 'Ese dibujo no corresponde a ' + target.label + '. Tu calificación bajará si ocupas más intentos, ¡elige otro rápido!');
    }
  }

  function handleMissionTimeout() {
    if (mState.locked) return;
    mState.locked = true;
    mState.timeoutCount++;
    const target = mState.questions[mState.qIndex];
    playTone(180, 0.25, 'sawtooth');
    showMissionFeedback('err', '¡Tiempo agotado! La respuesta correcta correspondía a ' + target.label + ' (' + target.hint + ').');
    updateMissionHud();
    setTimeout(advanceMissionQuestion, 1400);
  }

  function showMissionFeedback(kind, text) {
    const box = $('mFeedbackBox');
    box.classList.remove('hidden');
    if (kind === 'ok') {
      box.className = 'bg-emerald-100 border-2 border-emerald-400 text-emerald-950 rounded-2xl px-4 py-3 text-sm font-bold flex items-center gap-2';
    } else {
      box.className = 'bg-rose-100 border-2 border-rose-400 text-rose-950 rounded-2xl px-4 py-3 text-sm font-bold flex items-center gap-2';
    }
    box.textContent = text;
  }

  function advanceMissionQuestion() {
    const m = MISSIONS[mState.missionIdx];
    mState.qIndex++;
    if (mState.qIndex < m.count) {
      renderMissionQuestion();
    } else {
      finishMission();
    }
  }

  function finishMission() {
    stopMissionClock();
    const m = MISSIONS[mState.missionIdx];
    const finalGrade = ((mState.scoreSum / m.count) * 10).toFixed(1);
    $('missionPlayArea').classList.add('hidden');
    $('missionResultBox').classList.remove('hidden');
    $('mResultTitle').textContent = `Calificación: ${finalGrade} / 10`;
    $('mResultDetail').textContent = `En ${m.title}: acertaste ${mState.firstTryCount} de ${m.count} preguntas a la primera (${mState.timeoutCount} por tiempo agotado).`;
    const nextBtn = $('mNextMissionBtn');
    if (mState.missionIdx + 1 < MISSIONS.length) {
      nextBtn.classList.remove('hidden');
    } else {
      nextBtn.classList.add('hidden');
    }
  }

  function initTabs() {
    document.querySelectorAll('.nav-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab !== 'missions') stopMissionClock();
        document.querySelectorAll('.nav-tab').forEach((b) => {
          b.className = 'nav-tab px-4 py-2 text-xs tracking-wider uppercase rounded-lg font-bold transition-all text-slate-700 hover:text-emerald-700 hover:bg-slate-100 cursor-pointer';
        });
        btn.className = 'nav-tab px-4 py-2 text-xs tracking-wider uppercase rounded-lg font-bold transition-all bg-emerald-600 text-white shadow-sm cursor-pointer';
        $('tabPlay').classList.toggle('hidden', tab !== 'play');
        $('tabMissions').classList.toggle('hidden', tab !== 'missions');
        $('tabCatalog').classList.toggle('hidden', tab !== 'catalog');
      });
    });
  }

  function init() {
    populateLevels();
    initTabs();
    renderCatalog();
    renderMissionsList();
    buildNewRound();

    $('newGameBtn').addEventListener('click', buildNewRound);
    $('levelSelect').addEventListener('change', buildNewRound);
    $('difficultySelect').addEventListener('change', buildNewRound);
    $('modeSelect').addEventListener('change', buildNewRound);
    $('playAgainBtn').addEventListener('click', buildNewRound);
    $('nextLevelBtn')?.addEventListener('click', () => {
      const curIdx = levelsList.indexOf($('levelSelect').value);
      if (curIdx !== -1 && curIdx + 1 < levelsList.length) {
        $('levelSelect').value = levelsList[curIdx + 1];
      }
      buildNewRound();
    });
    $('closeWinBtn').addEventListener('click', () => $('winModal').classList.add('hidden'));
    $('mNextMissionBtn')?.addEventListener('click', () => startMission(mState.missionIdx + 1));
    $('mRetryMissionBtn')?.addEventListener('click', () => startMission(mState.missionIdx));
    $('mBackListBtn')?.addEventListener('click', () => {
      stopMissionClock();
      $('missionResultBox').classList.add('hidden');
      $('missionPlayArea').classList.add('hidden');
      $('missionSelectPanel').classList.remove('hidden');
    });
    $('catalogSearch').addEventListener('input', renderCatalog);
    $('catalogLevel').addEventListener('change', renderCatalog);
    $('soundToggleBtn').addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      $('soundIcon').textContent = soundEnabled ? 'volume_up' : 'volume_off';
      $('soundLabel').textContent = soundEnabled ? 'Sonido' : 'Silencio';
    });
  }

  init();
})();
