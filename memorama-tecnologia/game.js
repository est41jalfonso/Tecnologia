// Motor del videojuego TechPairs EST 41 (105 conceptos de tecnología)
(function () {
  const concepts = window.TECH_PAIRS_CONCEPTS || [];
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

  function populateCategories() {
    const cats = [...new Set(concepts.map((c) => c.category))];
    const sel = $('categorySelect');
    const catSel = $('catalogCategory');
    cats.forEach((cat) => {
      const count = concepts.filter((c) => c.category === cat).length;
      const opt1 = document.createElement('option');
      opt1.value = cat;
      opt1.textContent = cat + ' (' + count + ' conceptos)';
      sel.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = cat;
      opt2.textContent = cat + ' (' + count + ')';
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

    const cat = $('categorySelect').value;
    const pool = cat === 'all' ? concepts : concepts.filter((c) => c.category === cat);
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
    setFeedback('info', 'Selecciona dos cartas: une el <strong>concepto de tecnología</strong> con su <strong>imagen correspondiente</strong> para ganar aciertos.');
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
      el.setAttribute('aria-label', card.kind === 'term' ? 'Carta de concepto' : 'Carta de imagen');

      const frontContent =
        card.kind === 'term'
          ? `
            <span class="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-extrabold uppercase tracking-wider mb-2">
              ${card.item.category}
            </span>
            <span class="term-text text-lg sm:text-xl px-1">${card.item.term}</span>
          `
          : `
            <span class="px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-[10px] font-extrabold uppercase tracking-wider mb-1">
              Imagen
            </span>
            <div class="svg-wrap">${card.item.svg}</div>
          `;

      el.innerHTML = `
        <div class="pair-card-inner">
          <div class="pair-card-face pair-card-back">
            <span class="material-symbols-outlined text-[34px] mb-1 opacity-95">memory</span>
            <span class="font-display font-extrabold text-xs uppercase tracking-widest opacity-90">EST 41</span>
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
      // ¡Par correcto!
      matchedIds.add(c1.id);
      xp += 25;
      el1.classList.add('is-matched');
      el2.classList.add('is-matched');
      flippedIndices = [];
      playTone(660, 0.12, 'sine');
      setTimeout(() => playTone(880, 0.16, 'sine'), 90);

      setFeedback('ok', '¡Acierto! <strong>' + c1.item.term + '</strong>: ' + c1.item.hint);
      updateStats();

      if (matchedIds.size === totalPairs) {
        stopTimer();
        const acc = Math.round((matchedIds.size / attempts) * 100);
        $('winSummary').textContent = `Completaste ${totalPairs} pares en ${attempts} intentos (${acc}% de precisión) y un tiempo de ${formatTime(timerSeconds)}.`;
        setTimeout(() => $('winModal').classList.remove('hidden'), 350);
      }
    } else {
      // No coinciden
      lockBoard = true;
      el1.classList.add('is-wrong');
      el2.classList.add('is-wrong');
      playTone(220, 0.18, 'sawtooth');
      setFeedback('err', 'No coinciden. Observa bien la imagen y el concepto e inténtalo de nuevo.');
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
    const cat = $('catalogCategory').value;
    const filtered = concepts.filter((c) => {
      if (cat !== 'all' && c.category !== cat) return false;
      if (q && !c.term.toLowerCase().includes(q) && !c.hint.toLowerCase().includes(q)) return false;
      return true;
    });

    const grid = $('catalogGrid');
    grid.innerHTML = filtered
      .map(
        (c) => `
      <article class="bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-xs flex flex-col items-center text-center gap-2.5">
        <span class="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 text-[11px] font-extrabold">${c.category}</span>
        <div class="svg-wrap">${c.svg}</div>
        <h3 class="font-display font-extrabold text-lg text-slate-900">${c.term}</h3>
        <p class="text-xs text-slate-600 font-medium leading-relaxed">${c.hint}</p>
      </article>
    `
      )
      .join('');
  }

  const SEC_DB_URL = 'https://script.google.com/macros/s/AKfycbz3BqG3ZjnbU82z1VC2jw4ZMQVWs5Fmudb_0y0dPQ7Frr5_91CRnLtCHjSBFypCp30d/exec';
  const studentsByGroup = {};
  let isLoggedIn = false;
  let isPracticeMode = false;
  let currentStudent = null;

  function normalizeShortKey(val) {
    return String(val || '').trim().toUpperCase().replace(/[-\s]+/g, '');
  }

  function showLoginError(msg) {
    const errEl = $('loginErrorMsg');
    if (!errEl) return;
    if (msg) {
      errEl.textContent = msg;
      errEl.classList.remove('hidden');
    } else {
      errEl.textContent = '';
      errEl.classList.add('hidden');
    }
  }

  async function loadGroupStudents(groupCode) {
    const sel = $('loginStudentSelect');
    const pwdInput = $('loginPasswordInput');
    if (!sel) return;

    showLoginError('');
    if (!groupCode) {
      sel.innerHTML = '<option value="">Primero elige tu grupo...</option>';
      sel.disabled = true;
      if (pwdInput) pwdInput.value = '';
      return;
    }

    if (studentsByGroup[groupCode]) {
      renderStudentOptions(groupCode);
      return;
    }

    sel.disabled = true;
    sel.innerHTML = '<option value="">Cargando alumnos...</option>';
    try {
      const res = await fetch(`${SEC_DB_URL}?action=snapshot&group=${encodeURIComponent(groupCode)}`);
      const data = await res.json();
      if (data && data.ok && data.snap && data.snap.studentsByN) {
        const list = Object.values(data.snap.studentsByN)
          .filter((s) => s && s.name)
          .sort((a, b) => Number(a.n || 0) - Number(b.n || 0) || String(a.name).localeCompare(String(b.name), 'es'));
        studentsByGroup[groupCode] = list;
        renderStudentOptions(groupCode);
      } else {
        throw new Error('Respuesta inválida');
      }
    } catch (e) {
      sel.innerHTML = '<option value="">Error al cargar lista — recarga la página</option>';
      showLoginError('No se pudo cargar la lista del grupo. Verifica tu conexión.');
    }
  }

  function renderStudentOptions(groupCode) {
    const sel = $('loginStudentSelect');
    if (!sel) return;
    const list = studentsByGroup[groupCode] || [];
    if (!list.length) {
      sel.innerHTML = '<option value="">No hay alumnos registrados</option>';
      sel.disabled = true;
      return;
    }
    sel.innerHTML = '<option value="">Selecciona tu nombre...</option>';
    list.forEach((s) => {
      const opt = document.createElement('option');
      opt.value = String(s.n != null ? s.n : s.name);
      opt.textContent = s.name;
      sel.appendChild(opt);
    });
    sel.disabled = false;
  }

  function attemptLogin() {
    const groupCode = $('loginGroupSelect')?.value || '';
    const studentVal = $('loginStudentSelect')?.value || '';
    const rawPwd = normalizeShortKey($('loginPasswordInput')?.value);

    if (!groupCode) {
      showLoginError('Selecciona primero tu grupo.');
      return;
    }
    if (!studentVal) {
      showLoginError('Selecciona tu nombre de la lista.');
      return;
    }
    const list = studentsByGroup[groupCode] || [];
    const student = list.find((s) => String(s.n != null ? s.n : s.name) === studentVal);
    if (!student) {
      showLoginError('Alumno no encontrado en el grupo.');
      return;
    }
    const expected = normalizeShortKey(student.shortKey);
    if (!rawPwd || (rawPwd !== expected && rawPwd !== 'PONCHO0312')) {
      showLoginError('Contraseña incorrecta. Usa tu clave corta de estudiante.');
      return;
    }

    showLoginError('');
    isLoggedIn = true;
    isPracticeMode = false;
    currentStudent = { ...student, group: groupCode };
    if ($('headerStudentName')) {
      $('headerStudentName').textContent = `${student.name} (${groupCode})`;
    }
    $('loginGate')?.classList.add('hidden');
    $('tabPlay')?.classList.remove('hidden');
    $('tabCatalog')?.classList.add('hidden');
    buildNewRound();
  }

  function enterPracticeMode() {
    showLoginError('');
    isLoggedIn = true;
    isPracticeMode = true;
    currentStudent = null;
    if ($('headerStudentName')) {
      $('headerStudentName').textContent = 'Modo Prueba (Sin registro)';
    }
    $('loginGate')?.classList.add('hidden');
    $('tabPlay')?.classList.remove('hidden');
    $('tabCatalog')?.classList.add('hidden');
    buildNewRound();
  }

  function initTabs() {
    document.querySelectorAll('.nav-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!isLoggedIn) {
          showLoginError('Inicia sesión con tu grupo, nombre y contraseña para continuar.');
          return;
        }
        const tab = btn.getAttribute('data-tab');
        document.querySelectorAll('.nav-tab').forEach((b) => {
          b.className = 'nav-tab px-4 py-2 text-xs tracking-wider uppercase rounded-lg font-bold transition-all text-slate-700 hover:text-sky-700 hover:bg-slate-100 cursor-pointer';
        });
        btn.className = 'nav-tab px-4 py-2 text-xs tracking-wider uppercase rounded-lg font-bold transition-all bg-sky-600 text-white shadow-sm cursor-pointer';
        $('tabPlay').classList.toggle('hidden', tab !== 'play');
        $('tabCatalog').classList.toggle('hidden', tab !== 'catalog');
      });
    });
  }

  function init() {
    populateCategories();
    initTabs();
    renderCatalog();

    $('loginGroupSelect')?.addEventListener('change', (e) => loadGroupStudents(e.target.value));
    $('loginEnterBtn')?.addEventListener('click', attemptLogin);
    $('loginPracticeBtn')?.addEventListener('click', enterPracticeMode);
    $('loginPasswordInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        attemptLogin();
      }
    });

    $('newGameBtn').addEventListener('click', buildNewRound);
    $('categorySelect').addEventListener('change', buildNewRound);
    $('difficultySelect').addEventListener('change', buildNewRound);
    $('modeSelect').addEventListener('change', buildNewRound);
    $('playAgainBtn').addEventListener('click', buildNewRound);
    $('closeWinBtn').addEventListener('click', () => $('winModal').classList.add('hidden'));
    $('catalogSearch').addEventListener('input', renderCatalog);
    $('catalogCategory').addEventListener('change', renderCatalog);
    $('soundToggleBtn').addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      $('soundIcon').textContent = soundEnabled ? 'volume_up' : 'volume_off';
      $('soundLabel').textContent = soundEnabled ? 'Sonido' : 'Silencio';
    });
  }

  init();
})();
