// Motor del videojuego FraccionesPairs (Primaria Teodoro Olivares)
(function () {
  const bank = window.FRACTIONS_PAIRS_BANK || [];
  const equivFamilies = window.EQUIVALENT_FAMILIES || [];
  const decBank = window.DECIMAL_FRACTIONS_BANK || [];
  const $ = (id) => document.getElementById(id);

  const SPREADSHEET_ID = '1zXwryfrHm9sgDvmAmGz_OpP6PVxtH-3g2vtk0ib6W2A';
  const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`;
  const STORAGE_SCRIPT_KEY = 'galactic_tables_apps_script_url';
  const DEFAULT_PRIMARIA_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbymWYF39eoixwUbNNRARS5A_YdbCiInO71hJt5dl4U0Y62yG3SAwIfZy03EarwzswfJGQ/exec';
  const FALLBACK_STUDENTS = [
    { no: 1, name: 'Alvarez Reyes Maura Esmeralda' },
    { no: 2, name: 'Arroyo Esparza Luna Guadalupe' },
    { no: 3, name: 'Barron Gutierrez Diana' },
    { no: 4, name: 'Bustos Esparza Keily Daniela' },
    { no: 5, name: 'Calvillo Mendez Erick Daniel' },
    { no: 6, name: 'Calzada Gonzalez Iker Gael' },
    { no: 7, name: 'Carreon Palos Jose Pablo' },
    { no: 8, name: 'Chavez Jaime Victoria Guadalupe' },
    { no: 9, name: 'Dondiego Candelas Sofia' },
    { no: 10, name: 'Esparza Ortega Yunuen Leonardo' },
    { no: 11, name: 'Espino Esparza Julieta Isabel' },
    { no: 12, name: 'Ferrel Avendaño Cesar Alejandro' },
    { no: 13, name: 'Gaona Silva Ashley Valentina' },
    { no: 14, name: 'Gonzalez Galaviz Itzel Guadalupe' },
    { no: 15, name: 'Gonzalez Macias Juan Carlos' },
    { no: 16, name: 'Gonzalez Velazquez Maya' },
    { no: 17, name: 'Hernandez Barranco Johan Santiago' },
    { no: 18, name: 'Hernandez Mendez Donnovan Dariel' },
    { no: 19, name: 'Ibarra Loera Victoria' },
    { no: 20, name: 'Jimenez Rodriguez Dylan Isaac' },
    { no: 21, name: 'Leyva Bernal Sofia Isabella' },
    { no: 22, name: 'Lira Rodriguez Lian Maximiliano' },
    { no: 23, name: 'Lucio Araujo Victor Camilo' },
    { no: 24, name: 'Luevano Dondiego Vania Victoria' },
    { no: 25, name: 'Lujan Ramirez Jairo Camilo' },
    { no: 26, name: 'Martin Olivares Mauricio Damian' },
    { no: 27, name: 'Martinez Espinoza Hector Damian' },
    { no: 28, name: 'Martinez Reyes Arturo Damian' },
    { no: 29, name: 'Medina Zacarias Alexa Miranda' },
    { no: 30, name: 'Mendez Narvaez Julian' },
    { no: 31, name: 'Monsivais Escalante Hinata Eliette' },
    { no: 32, name: 'Morales Villalobos Katia Paula' },
    { no: 33, name: 'Murillo Lopez Emma Valentina' },
    { no: 34, name: 'Navarro Romero Carlos Gabriel' },
    { no: 35, name: 'Puga Castañeda Lia Maria' },
    { no: 36, name: 'Resendis Perez John Emmanuel' },
    { no: 37, name: 'Reyes Alonso Alanna Sofia' },
    { no: 38, name: 'Reyna Ibarra Adrian Ali' },
    { no: 39, name: 'Romo Cruz Yarenzy Ailyn' },
    { no: 40, name: 'Torres Candelas Renata Nikole' },
    { no: 41, name: 'Torres Romero Raul Alberto' }
  ];
  let studentsList = FALLBACK_STUDENTS;
  let currentStudent = null;

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
    const baseLevels = [...new Set(bank.map((c) => c.level))];
    const equivLevels = [
      'Equivalentes · Nivel A (1/2, 1/3, 1/4)',
      'Equivalentes · Nivel B (Quintos, Sextos, Octavos)',
      'Decimales ↔ Fracciones (0.5, 0.25, 0.75…)'
    ];
    levelsList = baseLevels.concat(equivLevels);
    const sel = $('levelSelect');
    const catSel = $('catalogLevel');
    baseLevels.forEach((lv, idx) => {
      const count = bank.filter((c) => c.level === lv).length;
      const opt1 = document.createElement('option');
      opt1.value = lv;
      opt1.textContent = lv + ' (' + count + ' fracciones)';
      if (idx === 0) opt1.selected = true;
      sel.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = lv;
      opt2.textContent = lv + ' (' + count + ')';
      catSel.appendChild(opt2);
    });
    equivLevels.forEach((elv) => {
      const opt = document.createElement('option');
      opt.value = elv;
      opt.textContent = elv;
      sel.appendChild(opt);
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
    if (lv.startsWith('Decimales')) {
      const desiredPairs = Number($('difficultySelect').value) || 8;
      totalPairs = Math.min(desiredPairs, decBank.length);
      const chosen = shuffle(decBank).slice(0, totalPairs);
      const cards = [];
      chosen.forEach((d) => {
        cards.push({
          uid: d.id + '-frac',
          id: d.id,
          kind: 'image',
          item: { num: d.num, den: d.den, label: d.label, svg: d.svg, hint: `${d.label} = ${d.dec} (${d.step})`, term: d.label }
        });
        cards.push({
          uid: d.id + '-dec',
          id: d.id,
          kind: 'term',
          item: { num: d.dec, den: 'decimal', label: d.dec, isDecimalCard: true, hint: `${d.decToFrac}`, term: d.dec }
        });
      });
      deck = shuffle(cards);
      renderBoard();
      updateStats();
      setFeedback('info', 'Modo Decimales: une cada <strong>fracción con su pastel</strong> con el <strong>número decimal</strong> equivalente.');
      return;
    }
    if (lv.startsWith('Equivalentes · Nivel')) {
      const grp = lv.includes('Nivel A') ? 'A' : 'B';
      const famPool = equivFamilies.filter((f) => f.group === grp);
      const eqPairs = [];
      famPool.forEach((fam) => {
        fam.equivalents.forEach((eq) => {
          const pid = fam.id + '-x' + eq.mult;
          eqPairs.push({
            id: pid,
            base: fam.base,
            eq: eq,
            hint: `${fam.base.label} es equivalente a ${eq.label} (×${eq.mult} arriba y abajo).`
          });
        });
      });
      const desiredPairs = Number($('difficultySelect').value) || 8;
      totalPairs = Math.min(desiredPairs, eqPairs.length);
      const chosen = shuffle(eqPairs).slice(0, totalPairs);
      const cards = [];
      chosen.forEach((p) => {
        cards.push({
          uid: p.id + '-base',
          id: p.id,
          kind: 'term',
          item: { num: p.base.num, den: p.base.den, label: p.base.label, svg: p.base.svg, hint: p.hint, term: p.base.label }
        });
        cards.push({
          uid: p.id + '-eq',
          id: p.id,
          kind: 'image',
          item: { num: p.eq.num, den: p.eq.den, label: p.eq.label, svg: p.eq.svg, hint: p.hint, term: p.eq.label }
        });
      });
      deck = shuffle(cards);
      renderBoard();
      updateStats();
      setFeedback('info', 'Modo Equivalentes: une cada <strong>fracción base</strong> con su <strong>fracción equivalente</strong> (representan la misma parte del pastel).');
      return;
    }

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
          ? (card.item.isDecimalCard
            ? `
              <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                Número Decimal
              </span>
              <div class="font-display font-extrabold text-4xl text-slate-900 my-2">${card.item.label}</div>
              <span class="text-xs font-bold text-slate-600">Valor decimal</span>
            `
            : `
              <span class="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                Fracción
              </span>
              <div class="frac-display" aria-label="${card.item.label}">
                <span class="frac-num">${card.item.num}</span>
                <span class="frac-bar"></span>
                <span class="frac-den">${card.item.den}</span>
              </div>
              <span class="text-xs font-bold text-slate-600 mt-1.5">${card.item.num} de ${card.item.den}</span>
            `)
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
    { id: 1, section: 'Representación Gráfica', title: 'Misión 1: Primeros Pasos', desc: 'Fracciones simples (1/2, 2/3, 1/4, 3/5)', minDen: 2, maxDen: 6, timePerQ: 20, count: 20 },
    { id: 2, section: 'Representación Gráfica', title: 'Misión 2: Explorador', desc: 'Séptimos, octavos, novenos y décimos', minDen: 5, maxDen: 10, timePerQ: 18, count: 20 },
    { id: 3, section: 'Representación Gráfica', title: 'Misión 3: Desafío Medio', desc: 'Denominadores medianos (9 a 16)', minDen: 9, maxDen: 16, timePerQ: 16, count: 20 },
    { id: 4, section: 'Representación Gráfica', title: 'Misión 4: Maestro', desc: 'Fracciones más grandes (15 a 26)', minDen: 15, maxDen: 26, timePerQ: 15, count: 20 },
    { id: 5, section: 'Representación Gráfica', title: 'Misión 5: Súper Reto', desc: 'Hasta centésimos (20 a 100)', minDen: 18, maxDen: 100, timePerQ: 14, count: 20 },
    { id: 6, section: 'Fracciones Equivalentes', title: 'Misión 6: Equivalentes Básicas', desc: 'Equivalencias de 1/2, 1/3, 2/3, 1/4 y 3/4', isEquiv: true, eqGroup: 'A', timePerQ: 18, count: 20 },
    { id: 7, section: 'Fracciones Equivalentes', title: 'Misión 7: Equivalentes Avanzadas', desc: 'Quintos, sextos y octavos equivalentes', isEquiv: true, eqGroup: 'B', timePerQ: 18, count: 20 },
    { id: 8, section: 'Fracciones y Números Decimales', title: 'Misión 8: Fracción a Decimal', desc: 'Convierte fracciones (1/2, 3/4, 2/5) a decimal', decMode: 'fracToDec', timePerQ: 18, count: 20 },
    { id: 9, section: 'Fracciones y Números Decimales', title: 'Misión 9: Decimal a Fracción', desc: 'Convierte decimales (0.5, 0.25, 0.6) a fracción', decMode: 'decToFrac', timePerQ: 18, count: 20 }
  ];

  let mState = {
    missionIdx: 0,
    questions: [],
    qIndex: 0,
    scoreSum: 0,
    firstTryCount: 0,
    errorCount: 0,
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
    const sections = [...new Set(MISSIONS.map((m) => m.section))];
    grid.innerHTML = sections.map((secName) => {
      const items = MISSIONS.map((m, idx) => ({ m, idx })).filter((x) => x.m.section === secName);
      return `
        <div class="space-y-2.5">
          <h3 class="font-display font-extrabold text-sm uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">${secName}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            ${items.map(({ m, idx }) => `
              <button type="button" data-mission-idx="${idx}" class="text-left bg-slate-50 hover:bg-white rounded-2xl border-2 border-slate-200 hover:border-purple-400 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 cursor-pointer">
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between gap-2">
                    <span class="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-extrabold uppercase">${m.count} Preguntas</span>
                    <span class="text-xs font-extrabold text-amber-700">${m.timePerQ}s/preg</span>
                  </div>
                  <h4 class="font-display font-extrabold text-base text-slate-900">${m.title}</h4>
                  <p class="text-xs text-slate-600 font-medium">${m.desc}</p>
                </div>
                <span class="inline-flex items-center gap-1 text-xs font-extrabold text-purple-700">
                  <span>Iniciar Misión</span>
                  <span class="material-symbols-outlined text-[16px]">play_arrow</span>
                </span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('[data-mission-idx]').forEach((btn) => {
      btn.addEventListener('click', () => startMission(Number(btn.getAttribute('data-mission-idx'))));
    });
  }

  function startMission(idx) {
    if (!currentStudent) {
      $('missionStudentErr')?.classList.remove('hidden');
      $('missionStudentSelect')?.focus();
      return;
    }
    $('missionStudentErr')?.classList.add('hidden');
    stopMissionClock();
    const m = MISSIONS[idx] || MISSIONS[0];
    const picked = [];
    if (m.decMode) {
      while (picked.length < m.count) {
        for (const d of shuffle(decBank)) {
          if (picked.length < m.count) picked.push(d);
        }
      }
    } else if (m.isEquiv) {
      const equivQuestions = [];
      equivFamilies.filter((f) => !m.eqGroup || f.group === m.eqGroup).forEach((fam) => {
        fam.equivalents.forEach((eq) => {
          equivQuestions.push({
            id: eq.label,
            num: fam.base.num,
            den: fam.base.den,
            label: fam.base.label,
            hint: `${fam.base.label} = ${eq.label} (se multiplicó por ${eq.mult} el numerador y el denominador).`,
            correctEq: eq,
            familyId: fam.id
          });
        });
      });
      while (picked.length < m.count) {
        for (const q of shuffle(equivQuestions)) {
          if (picked.length < m.count) picked.push(q);
        }
      }
    } else {
      const pool = bank.filter((c) => c.den >= m.minDen && c.den <= m.maxDen);
      while (picked.length < m.count) {
        const batch = shuffle(pool);
        for (const it of batch) {
          if (picked.length < m.count) picked.push(it);
        }
      }
    }

    mState = {
      missionIdx: idx,
      questions: picked,
      qIndex: 0,
      scoreSum: 0,
      firstTryCount: 0,
      errorCount: 0,
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
    if ($('mStatErrors')) $('mStatErrors').textContent = String(mState.errorCount);
    const currentGrade = (mState.scoreSum / m.count) * 10;
    $('mStatGrade').textContent = currentGrade.toFixed(1) + ' / 10';
  }

  function renderMissionQuestion() {
    stopMissionClock();
    const m = MISSIONS[mState.missionIdx];
    const target = mState.questions[mState.qIndex];
    mState.timeLeft = m.timePerQ;
    mState.locked = false;

    $('mMissionBadge').textContent = m.title;
    if (m.decMode === 'fracToDec') {
      $('mQuestionText').textContent = `Convierte la fracción ${target.label} a número decimal (${target.num} ÷ ${target.den}):`;
      $('mTargetFraction').innerHTML = `
        <span class="frac-num">${target.num}</span>
        <span class="frac-bar"></span>
        <span class="frac-den">${target.den}</span>
      `;
    } else if (m.decMode === 'decToFrac') {
      $('mQuestionText').textContent = `¿Qué fracción con su pastel representa exactamente el número decimal ${target.dec}?`;
      $('mTargetFraction').innerHTML = `<span class="font-display font-extrabold text-4xl text-slate-900 py-2">${target.dec}</span>`;
    } else if (m.isEquiv) {
      $('mQuestionText').textContent = `¿Cuál de las 3 opciones es una fracción EQUIVALENTE a ${target.label} (ocupa exactamente la misma parte del pastel)?`;
      $('mTargetFraction').innerHTML = `
        <span class="frac-num">${target.num}</span>
        <span class="frac-bar"></span>
        <span class="frac-den">${target.den}</span>
      `;
    } else {
      $('mQuestionText').textContent = buildQuestionPrompt(target, mState.qIndex);
      $('mTargetFraction').innerHTML = `
        <span class="frac-num">${target.num}</span>
        <span class="frac-bar"></span>
        <span class="frac-den">${target.den}</span>
      `;
    }
    $('mFeedbackBox').classList.add('hidden');

    let options;
    if (m.decMode === 'fracToDec') {
      const dist = shuffle(decBank.filter((d) => d.id !== target.id));
      options = shuffle([
        { id: target.id, label: target.dec, isTextOnly: true, hint: target.step },
        { id: dist[0].id, label: dist[0].dec, isTextOnly: true, hint: dist[0].step },
        { id: dist[1].id, label: dist[1].dec, isTextOnly: true, hint: dist[1].step }
      ]);
    } else if (m.decMode === 'decToFrac') {
      const dist = shuffle(decBank.filter((d) => d.id !== target.id));
      options = shuffle([
        { id: target.id, label: target.label, svg: target.svg, hint: target.decToFrac },
        { id: dist[0].id, label: dist[0].label, svg: dist[0].svg, hint: dist[0].decToFrac },
        { id: dist[1].id, label: dist[1].label, svg: dist[1].svg, hint: dist[1].decToFrac }
      ]);
    } else if (m.isEquiv) {
      const targetVal = target.num / target.den;
      const distPool = shuffle(
        bank.filter((c) => Math.abs(c.num / c.den - targetVal) > 0.04 && c.den >= 4 && c.den <= 20)
      );
      const correctOpt = { id: target.id, label: target.correctEq.label, svg: target.correctEq.svg };
      options = shuffle([
        correctOpt,
        { id: distPool[0].id, label: distPool[0].label, svg: distPool[0].svg },
        { id: distPool[1].id, label: distPool[1].label, svg: distPool[1].svg }
      ]);
    } else {
      const distractorPool = shuffle(bank.filter((c) => c.id !== target.id && c.den >= m.minDen && c.den <= m.maxDen));
      options = shuffle([target, distractorPool[0], distractorPool[1]]);
    }

    const grid = $('mOptionsGrid');
    grid.innerHTML = '';
    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mission-option-card bg-white/95 rounded-3xl border-3 border-slate-200 hover:border-sky-400 p-5 shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer';
      if (opt.isTextOnly) {
        btn.innerHTML = `
          <span class="px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase">Número Decimal</span>
          <span class="font-display font-extrabold text-4xl text-slate-900 my-4">${opt.label}</span>
          <span class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Seleccionar</span>
        `;
      } else {
        btn.innerHTML = `
          <div class="pointer-events-none">${opt.svg}</div>
          ${(m.isEquiv || m.decMode === 'decToFrac')
            ? `<span class="px-3 py-0.5 rounded-full bg-sky-100 border border-sky-300 font-display font-extrabold text-base text-slate-900">${opt.label}</span>`
            : `<span class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Seleccionar dibujo</span>`}
        `;
      }
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
    stopMissionClock();
    mState.locked = true;
    const target = mState.questions[mState.qIndex];

    // Deshabilitar todas las opciones para impedir otro intento en la misma pregunta
    Array.from($('mOptionsGrid').children).forEach((el) => {
      el.disabled = true;
    });

    if (opt.id === target.id) {
      mState.scoreSum += 1;
      mState.firstTryCount++;
      btn.className = 'mission-option-card bg-emerald-50 rounded-3xl border-4 border-emerald-500 p-5 shadow-md flex flex-col items-center justify-center gap-2';
      playTone(660, 0.1, 'sine');
      setTimeout(() => playTone(880, 0.14, 'sine'), 80);
      showMissionFeedback('ok', `¡Acierto! (${target.label}: ${target.hint})`);
    } else {
      mState.errorCount++;
      btn.className = 'mission-option-card bg-rose-100 rounded-3xl border-4 border-rose-600 p-5 shadow-md flex flex-col items-center justify-center gap-2';
      playTone(220, 0.18, 'sawtooth');
      showMissionFeedback('err', `Error: ese dibujo corresponde a ${opt.label}, no a ${target.label}.`);
    }

    updateMissionHud();
    setTimeout(advanceMissionQuestion, 1300);
  }

  function handleMissionTimeout() {
    if (mState.locked) return;
    mState.locked = true;
    mState.errorCount++;
    mState.timeoutCount++;
    Array.from($('mOptionsGrid').children).forEach((el) => {
      el.disabled = true;
    });
    const target = mState.questions[mState.qIndex];
    playTone(180, 0.25, 'sawtooth');
    showMissionFeedback('err', '¡Tiempo agotado! Se registró como error. La fracción era ' + target.label + '.');
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

  async function sendFractionResultToMasterDb(payload) {
    const el = $('mSyncStatus');
    const url = ((localStorage.getItem(STORAGE_SCRIPT_KEY) || '').trim()) || DEFAULT_PRIMARIA_SCRIPT_URL;
    if (!url) {
      if (el) {
        el.className = 'text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2';
        el.textContent = '⚠ Falta configurar la URL de la Base Maestra de Primaria (botón "⚙ Configurar BD").';
      }
      return;
    }
    if (el) {
      el.className = 'text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 rounded-xl px-3 py-2';
      el.textContent = '📡 Guardando calificación en Base de Datos Maestra...';
    }
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      if (el) {
        el.className = 'text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2';
        el.textContent = '✅ Calificación registrada en la Base de Datos Maestra de 3.º A.';
      }
    } catch (_) {
      if (el) {
        el.className = 'text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2';
        el.textContent = '⚠ No se pudo conectar con Google Sheets.';
      }
    }
  }

  function finishMission() {
    stopMissionClock();
    const m = MISSIONS[mState.missionIdx];
    const finalGrade = ((mState.scoreSum / m.count) * 10).toFixed(1);
    $('missionPlayArea').classList.add('hidden');
    $('missionResultBox').classList.remove('hidden');
    const stuLabel = currentStudent ? `#${currentStudent.no} · ${currentStudent.name}` : 'Alumno invitado';
    if ($('mResultStudent')) $('mResultStudent').textContent = 'Alumno(a): ' + stuLabel;
    $('mResultTitle').textContent = `Calificación: ${finalGrade} / 10`;
    $('mResultDetail').textContent = `En ${m.title}: ${mState.firstTryCount} aciertos y ${mState.errorCount} errores de ${m.count} preguntas (${mState.timeoutCount} por tiempo agotado).`;
    const now = new Date();
    if ($('mResultDate')) {
      $('mResultDate').textContent = 'Fecha de evaluación: ' + now.toLocaleString('es-MX');
    }
    sendFractionResultToMasterDb({
      game: 'fracciones',
      date: now.toLocaleDateString('es-MX'),
      time: now.toLocaleTimeString('es-MX'),
      studentNo: currentStudent ? currentStudent.no : '',
      studentName: currentStudent ? currentStudent.name : 'Invitado',
      missionId: m.id,
      missionTitle: m.title,
      grade: Number(finalGrade),
      correctHits: mState.firstTryCount,
      errorCount: mState.errorCount,
      timeoutCount: mState.timeoutCount,
      totalQuestions: m.count
    });
    const nextBtn = $('mNextMissionBtn');
    if (mState.missionIdx + 1 < MISSIONS.length) {
      nextBtn.classList.remove('hidden');
    } else {
      nextBtn.classList.add('hidden');
    }
  }

  let selectedEquivIdx = 0;

  function renderEquivalentsExplorer() {
    const chips = $('equivSelectorChips');
    const area = $('equivDisplayArea');
    if (!chips || !area || !equivFamilies.length) return;

    chips.innerHTML = equivFamilies.map((f, idx) => `
      <button type="button" data-eq-idx="${idx}" class="px-4 py-2 rounded-full font-display font-extrabold text-sm transition-all cursor-pointer ${idx === selectedEquivIdx ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-800 hover:bg-sky-50 border border-slate-300'}">
        ${f.base.label}
      </button>
    `).join('');

    chips.querySelectorAll('[data-eq-idx]').forEach((b) => {
      b.addEventListener('click', () => {
        selectedEquivIdx = Number(b.getAttribute('data-eq-idx'));
        renderEquivalentsExplorer();
      });
    });

    const fam = equivFamilies[selectedEquivIdx] || equivFamilies[0];
    area.innerHTML = `
      <div class="bg-white/95 rounded-2xl border-2 border-sky-200 p-4 sm:p-5 text-center space-y-1">
        <span class="text-xs font-extrabold uppercase tracking-wider text-sky-800">Regla de Equivalencia</span>
        <p class="text-sm sm:text-base font-semibold text-slate-700">
          Si multiplicas el <strong>numerador</strong> y el <strong>denominador</strong> de <strong class="text-sky-700">${fam.base.label}</strong> por el mismo número, obtienes una fracción equivalente que ilumina exactamente la misma parte del pastel:
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <article class="bg-white rounded-3xl border-4 border-sky-400 p-5 shadow-md flex flex-col items-center text-center gap-3">
          <span class="px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-extrabold uppercase">Fracción Base</span>
          <div class="svg-wrap">${fam.base.svg}</div>
          <div class="font-display font-extrabold text-3xl text-slate-900">${fam.base.label}</div>
          <span class="text-xs font-bold text-slate-600">${fam.base.num} parte(s) de ${fam.base.den}</span>
        </article>
        ${fam.equivalents.map((eq) => `
          <article class="bg-white rounded-3xl border-2 border-emerald-300 p-5 shadow-sm flex flex-col items-center text-center gap-3">
            <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-extrabold uppercase">Equivalente (×${eq.mult})</span>
            <div class="svg-wrap">${eq.svg}</div>
            <div class="font-display font-extrabold text-3xl text-slate-900">${fam.base.label} = ${eq.label}</div>
            <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              (${fam.base.num}×${eq.mult}) / (${fam.base.den}×${eq.mult})
            </span>
          </article>
        `).join('')}
      </div>
    `;
  }

  function renderDecimalsExplorer() {
    const grid = $('decimalsDisplayGrid');
    if (!grid || !decBank.length) return;
    grid.innerHTML = decBank.map((d) => `
      <article class="bg-white rounded-3xl border-2 border-amber-200 p-5 shadow-sm flex flex-col items-center text-center gap-3">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-extrabold">${d.label}</span>
          <span class="text-slate-400 font-extrabold">=</span>
          <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">${d.dec}</span>
        </div>
        <div class="svg-wrap">${d.svg}</div>
        <div class="font-display font-extrabold text-2xl text-slate-900">${d.label} = ${d.dec}</div>
        <div class="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full">
          <div>Fracción → Decimal: <strong class="text-sky-700">${d.step}</strong></div>
          <div>Decimal → Fracción: <strong class="text-emerald-700">${d.decToFrac}</strong></div>
        </div>
      </article>
    `).join('');
  }

  function switchTab(tab) {
    if (tab !== 'missions') stopMissionClock();
    document.querySelectorAll('.nav-tab').forEach((b) => {
      const t = b.getAttribute('data-tab');
      if (t === tab) {
        b.className = 'nav-tab px-3.5 py-2 text-xs tracking-wider uppercase rounded-lg font-bold transition-all bg-emerald-600 text-white shadow-sm cursor-pointer';
      } else if (t === 'missions') {
        b.className = 'nav-tab px-3.5 py-2 text-xs tracking-wider uppercase rounded-lg font-bold transition-all text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-300 cursor-pointer';
      } else if (t === 'equivalents') {
        b.className = 'nav-tab px-3.5 py-2 text-xs tracking-wider uppercase rounded-lg font-bold transition-all text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-300 cursor-pointer';
      } else if (t === 'decimals') {
        b.className = 'nav-tab px-3.5 py-2 text-xs tracking-wider uppercase rounded-lg font-bold transition-all text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 cursor-pointer';
      } else {
        b.className = 'nav-tab px-3.5 py-2 text-xs tracking-wider uppercase rounded-lg font-bold transition-all text-slate-700 hover:text-emerald-700 hover:bg-slate-100 cursor-pointer';
      }
    });
    $('tabWelcome')?.classList.toggle('hidden', tab !== 'welcome');
    $('tabEquivalents')?.classList.toggle('hidden', tab !== 'equivalents');
    $('tabDecimals')?.classList.toggle('hidden', tab !== 'decimals');
    $('tabPlay').classList.toggle('hidden', tab !== 'play');
    $('tabMissions').classList.toggle('hidden', tab !== 'missions');
    $('tabCatalog').classList.toggle('hidden', tab !== 'catalog');
  }

  function syncStudentSelection(val) {
    const found = studentsList.find((s) => String(s.no) === String(val)) || null;
    currentStudent = found;
    if ($('welcomeStudentSelect')) $('welcomeStudentSelect').value = val || '';
    if ($('missionStudentSelect')) $('missionStudentSelect').value = val || '';
    if ($('headerStudentName')) {
      $('headerStudentName').textContent = found ? `#${found.no} · ${found.name}` : 'Sin alumno';
    }
    if (found) {
      $('welcomeStudentErr')?.classList.add('hidden');
      $('missionStudentErr')?.classList.add('hidden');
    }
  }

  async function loadStudents() {
    let list = FALLBACK_STUDENTS;
    try {
      const resp = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
      if (resp.ok) {
        const csvText = await resp.text();
        const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
        const parsed = [];
        for (let i = 1; i < lines.length; i++) {
          const commaIdx = lines[i].indexOf(',');
          if (commaIdx === -1) continue;
          const no = lines[i].slice(0, commaIdx).trim().replace(/^"|"$/g, '');
          const name = lines[i].slice(commaIdx + 1).trim().replace(/^"|"$/g, '');
          if (name) parsed.push({ no: Number(no) || i, name });
        }
        if (parsed.length > 0) list = parsed;
      }
    } catch (_) {}

    studentsList = list;
    [$('welcomeStudentSelect'), $('missionStudentSelect')].forEach((sel) => {
      if (!sel) return;
      sel.innerHTML = '<option value="">-- Elige tu nombre de la lista --</option>';
      list.forEach((st) => {
        const opt = document.createElement('option');
        opt.value = String(st.no);
        opt.textContent = `${st.no}. ${st.name}`;
        sel.appendChild(opt);
      });
    });
  }

  function initTabs() {
    document.querySelectorAll('.nav-tab').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
    });
  }

  function init() {
    populateLevels();
    initTabs();
    switchTab('welcome');
    loadStudents();
    renderCatalog();
    renderEquivalentsExplorer();
    renderDecimalsExplorer();
    renderMissionsList();
    buildNewRound();

    $('welcomeStudentSelect')?.addEventListener('change', (e) => syncStudentSelection(e.target.value));
    $('missionStudentSelect')?.addEventListener('change', (e) => syncStudentSelection(e.target.value));
    $('goTestModeBtn')?.addEventListener('click', () => switchTab('play'));
    $('eqToMemoryBtn')?.addEventListener('click', () => {
      $('levelSelect').value = 'Equivalentes · Nivel A (1/2, 1/3, 1/4)';
      buildNewRound();
      switchTab('play');
    });
    $('eqToMissionBtn')?.addEventListener('click', () => {
      switchTab('missions');
      if (currentStudent) startMission(5);
    });
    $('decToMemoryBtn')?.addEventListener('click', () => {
      $('levelSelect').value = 'Decimales ↔ Fracciones (0.5, 0.25, 0.75…)';
      buildNewRound();
      switchTab('play');
    });
    $('decToMissionBtn')?.addEventListener('click', () => {
      switchTab('missions');
      if (currentStudent) startMission(7);
    });
    $('goMissionsModeBtn')?.addEventListener('click', () => {
      if (!currentStudent) {
        $('welcomeStudentErr')?.classList.remove('hidden');
        $('welcomeStudentSelect')?.focus();
        return;
      }
      switchTab('missions');
    });
    $('mPrintReportBtn')?.addEventListener('click', () => window.print());
    $('configPrimariaDbBtn')?.addEventListener('click', () => {
      const cur = localStorage.getItem(STORAGE_SCRIPT_KEY) || DEFAULT_PRIMARIA_SCRIPT_URL || '';
      const next = prompt('Pega la URL /exec de la Base de Datos Maestra de Primaria (se comparte con Guerra Galáctica):', cur);
      if (next !== null) {
        localStorage.setItem(STORAGE_SCRIPT_KEY, next.trim());
      }
    });

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
