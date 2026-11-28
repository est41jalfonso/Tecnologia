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

  function initTabs() {
    document.querySelectorAll('.nav-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        document.querySelectorAll('.nav-tab').forEach((b) => {
          b.className = 'nav-tab px-4 py-2 text-xs tracking-wider uppercase rounded-lg font-bold transition-all text-slate-700 hover:text-emerald-700 hover:bg-slate-100 cursor-pointer';
        });
        btn.className = 'nav-tab px-4 py-2 text-xs tracking-wider uppercase rounded-lg font-bold transition-all bg-emerald-600 text-white shadow-sm cursor-pointer';
        $('tabPlay').classList.toggle('hidden', tab !== 'play');
        $('tabCatalog').classList.toggle('hidden', tab !== 'catalog');
      });
    });
  }

  function init() {
    populateLevels();
    initTabs();
    renderCatalog();
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
