// Motor de OrtografíaQuest (Primaria 3.º Grado NEM & Secundaria 1.º Grado Lenguajes)
(function () {
  const data = window.ORTOGRAFIA_QUEST_DATA || { scenes: {}, primaria: [], secundaria: [] };
  const $ = (id) => document.getElementById(id);

  const PRIMARIA_CSV_URL = 'https://docs.google.com/spreadsheets/d/1zXwryfrHm9sgDvmAmGz_OpP6PVxtH-3g2vtk0ib6W2A/export?format=csv';
  const STORAGE_SCRIPT_KEY = 'galactic_tables_apps_script_url';
  const DEFAULT_PRIMARIA_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbymWYF39eoixwUbNNRARS5A_YdbCiInO71hJt5dl4U0Y62yG3SAwIfZy03EarwzswfJGQ/exec';

  const FALLBACK_3A = [
    { no: 1, name: 'Alvarez Reyes Maura Esmeralda' }, { no: 2, name: 'Arroyo Esparza Luna Guadalupe' },
    { no: 3, name: 'Barron Gutierrez Diana' }, { no: 4, name: 'Bustos Esparza Keily Daniela' },
    { no: 5, name: 'Calvillo Mendez Erick Daniel' }, { no: 6, name: 'Calzada Gonzalez Iker Gael' },
    { no: 7, name: 'Carreon Palos Jose Pablo' }, { no: 8, name: 'Chavez Jaime Victoria Guadalupe' },
    { no: 9, name: 'Dondiego Candelas Sofia' }, { no: 10, name: 'Esparza Ortega Yunuen Leonardo' },
    { no: 11, name: 'Espino Esparza Julieta Isabel' }, { no: 12, name: 'Ferrel Avendaño Cesar Alejandro' },
    { no: 13, name: 'Gaona Silva Ashley Valentina' }, { no: 14, name: 'Gonzalez Galaviz Itzel Guadalupe' },
    { no: 15, name: 'Gonzalez Macias Juan Carlos' }, { no: 16, name: 'Gonzalez Velazquez Maya' },
    { no: 17, name: 'Hernandez Barranco Johan Santiago' }, { no: 18, name: 'Hernandez Mendez Donnovan Dariel' },
    { no: 19, name: 'Ibarra Loera Victoria' }, { no: 20, name: 'Jimenez Rodriguez Dylan Isaac' },
    { no: 21, name: 'Leyva Bernal Sofia Isabella' }, { no: 22, name: 'Lira Rodriguez Lian Maximiliano' },
    { no: 23, name: 'Lucio Araujo Victor Camilo' }, { no: 24, name: 'Luevano Dondiego Vania Victoria' },
    { no: 25, name: 'Lujan Ramirez Jairo Camilo' }, { no: 26, name: 'Martin Olivares Mauricio Damian' },
    { no: 27, name: 'Martinez Espinoza Hector Damian' }, { no: 28, name: 'Martinez Reyes Arturo Damian' },
    { no: 29, name: 'Medina Zacarias Alexa Miranda' }, { no: 30, name: 'Mendez Narvaez Julian' },
    { no: 31, name: 'Monsivais Escalante Hinata Eliette' }, { no: 32, name: 'Morales Villalobos Katia Paula' },
    { no: 33, name: 'Murillo Lopez Emma Valentina' }, { no: 34, name: 'Navarro Romero Carlos Gabriel' },
    { no: 35, name: 'Puga Castañeda Lia Maria' }, { no: 36, name: 'Resendis Perez John Emmanuel' },
    { no: 37, name: 'Reyes Alonso Alanna Sofia' }, { no: 38, name: 'Reyna Ibarra Adrian Ali' },
    { no: 39, name: 'Romo Cruz Yarenzy Ailyn' }, { no: 40, name: 'Torres Candelas Renata Nikole' },
    { no: 41, name: 'Torres Romero Raul Alberto' }
  ];

  let gradeLevel = 'primaria';
  let studentsList = FALLBACK_3A;
  let currentStudent = null;
  let pHits = 0;
  let pCurrent = null;
  let pLocked = false;

  const MISSION_DEFS = [
    { id: 1, title: 'Misión 1: Mayúsculas', desc: 'Nombres propios, lugares e inicio de oración', timePerQ: 25, count: 20 },
    { id: 2, title: 'Misión 2: Punto y Coma', desc: 'Enumeraciones, punto seguido, dos puntos y final', timePerQ: 25, count: 20 },
    { id: 3, title: 'Misión 3: ¿ ? y ¡ !', desc: 'Signos de interrogación y admiración en contexto', timePerQ: 25, count: 20 },
    { id: 4, title: 'Misión 4: Ortografía Integral', desc: 'Uso de b/v, h, j/g, acentuación y puntuación', timePerQ: 25, count: 20 }
  ];

  let mState = { missionIdx: 0, questions: [], qIndex: 0, hits: 0, errors: 0, timeouts: 0, timeLeft: 25, clock: null, locked: false };

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function formatSentenceHtml(text, fillVal, status) {
    const cls = status === 'ok' ? 'blank-pill is-filled-ok' : (status === 'err' ? 'blank-pill is-filled-err' : 'blank-pill');
    const inner = fillVal ? fillVal : '___';
    return text.replace(/\[___\]/g, `<span class="${cls}">${inner}</span>`);
  }

  function setGradeLevel(lvl) {
    gradeLevel = lvl === 'secundaria' ? 'secundaria' : 'primaria';
    document.querySelectorAll('.grade-btn').forEach((b) => {
      const active = b.getAttribute('data-grade') === gradeLevel;
      b.className = active
        ? 'grade-btn px-5 py-2.5 rounded-xl font-extrabold text-sm bg-emerald-600 text-white shadow-sm cursor-pointer'
        : 'grade-btn px-5 py-2.5 rounded-xl font-extrabold text-sm text-slate-700 hover:bg-white cursor-pointer';
    });
    $('headerLevelBadge').textContent = gradeLevel === 'primaria' ? 'PRIMARIA 3.º' : 'SECUNDARIA 1.º';
    $('backPortalLink').href = gradeLevel === 'primaria' ? '../primaria-teodoro-olivares.html' : '../aprende-jugando.html';
    $('primariaStudentBox').classList.toggle('hidden', gradeLevel !== 'primaria');
    $('secundariaStudentBox').classList.toggle('hidden', gradeLevel !== 'secundaria');
    $('missionsHeading').textContent = gradeLevel === 'primaria'
      ? 'Misiones Primaria 3.º Grado (Proyectos NEM)'
      : 'Misiones Secundaria 1.º Grado (Lenguajes Ximhai)';
    currentStudent = null;
    $('headerStudentName').textContent = 'Sin alumno';
    loadPracticeQuestion();
    renderMissionsList();
  }

  function switchTab(tab) {
    stopMissionClock();
    document.querySelectorAll('.nav-tab').forEach((b) => {
      const t = b.getAttribute('data-tab');
      if (t === tab) {
        b.className = 'nav-tab px-3.5 py-2 text-xs tracking-wider uppercase rounded-lg font-bold transition-all bg-purple-600 text-white shadow-sm cursor-pointer';
      } else if (t === 'missions') {
        b.className = 'nav-tab px-3.5 py-2 text-xs tracking-wider uppercase rounded-lg font-bold transition-all text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-300 cursor-pointer';
      } else {
        b.className = 'nav-tab px-3.5 py-2 text-xs tracking-wider uppercase rounded-lg font-bold transition-all text-slate-700 hover:text-emerald-700 hover:bg-slate-100 cursor-pointer';
      }
    });
    $('tabWelcome').classList.toggle('hidden', tab !== 'welcome');
    $('tabPractice').classList.toggle('hidden', tab !== 'practice');
    $('tabMissions').classList.toggle('hidden', tab !== 'missions');
  }

  // ==================== SECCIÓN DE PRUEBA ====================
  function loadPracticeQuestion() {
    const topic = $('practiceTopicSelect').value;
    const bank = data[gradeLevel] || [];
    const pool = topic === 'all' ? bank : bank.filter((x) => String(x.mission) === topic);
    if (!pool.length) return;
    pCurrent = shuffle(pool)[0];
    pLocked = false;

    $('pSceneBox').innerHTML = data.scenes[pCurrent.scene] || '';
    $('pProjectBadge').textContent = pCurrent.project;
    $('pSentenceBox').innerHTML = formatSentenceHtml(pCurrent.text, '', 'idle');
    $('pFeedbackBox').classList.add('hidden');

    const box = $('pOptionsBox');
    box.innerHTML = '';
    shuffle(pCurrent.options).forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bg-white hover:bg-sky-50 rounded-2xl border-2 border-slate-300 hover:border-sky-500 py-4 px-5 font-display font-extrabold text-xl text-slate-900 shadow-xs cursor-pointer transition-all';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        if (pLocked) return;
        pLocked = true;
        const ok = opt === pCurrent.answer;
        if (ok) pHits++;
        $('pStatHits').textContent = String(pHits);
        $('pSentenceBox').innerHTML = formatSentenceHtml(pCurrent.text, pCurrent.answer, ok ? 'ok' : 'err');
        btn.className = ok
          ? 'bg-emerald-50 rounded-2xl border-4 border-emerald-500 py-4 px-5 font-display font-extrabold text-xl text-emerald-900'
          : 'bg-rose-50 rounded-2xl border-4 border-rose-500 py-4 px-5 font-display font-extrabold text-xl text-rose-900';
        const fb = $('pFeedbackBox');
        fb.classList.remove('hidden');
        fb.className = ok
          ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-950 rounded-2xl px-4 py-3 text-sm font-bold'
          : 'bg-rose-100 border-2 border-rose-400 text-rose-950 rounded-2xl px-4 py-3 text-sm font-bold';
        fb.textContent = (ok ? '¡Correcto! ' : `Respuesta correcta: "${pCurrent.answer}". `) + pCurrent.rule;
      });
      box.appendChild(btn);
    });
  }

  // ==================== MISIONES CONTRARRELOJ (20 PREGUNTAS, 1 INTENTO) ====================
  function stopMissionClock() {
    if (mState.clock) {
      clearInterval(mState.clock);
      mState.clock = null;
    }
  }

  function renderMissionsList() {
    const grid = $('missionsCardsGrid');
    grid.innerHTML = MISSION_DEFS.map((m, idx) => `
      <button type="button" data-m-idx="${idx}" class="text-left bg-slate-50 hover:bg-white rounded-2xl border-2 border-slate-200 hover:border-purple-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 cursor-pointer">
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-extrabold uppercase">${m.count} Preguntas</span>
            <span class="text-xs font-extrabold text-amber-700">${m.timePerQ}s/preg</span>
          </div>
          <h3 class="font-display font-extrabold text-lg text-slate-900">${m.title}</h3>
          <p class="text-xs text-slate-600 font-medium">${m.desc}</p>
        </div>
        <span class="inline-flex items-center gap-1 text-xs font-extrabold text-purple-700">Iniciar Misión →</span>
      </button>
    `).join('');
    grid.querySelectorAll('[data-m-idx]').forEach((b) => {
      b.addEventListener('click', () => startMission(Number(b.getAttribute('data-m-idx'))));
    });
  }

  function startMission(idx) {
    stopMissionClock();
    const def = MISSION_DEFS[idx] || MISSION_DEFS[0];
    const bank = data[gradeLevel] || [];
    const pool = bank.filter((x) => x.mission === def.id);
    const picked = [];
    while (picked.length < def.count) {
      for (const item of shuffle(pool)) {
        if (picked.length < def.count) picked.push(item);
      }
    }
    mState = { missionIdx: idx, questions: picked, qIndex: 0, hits: 0, errors: 0, timeouts: 0, timeLeft: def.timePerQ, clock: null, locked: false };
    $('missionSelectPanel').classList.add('hidden');
    $('missionResultBox').classList.add('hidden');
    $('missionPlayArea').classList.remove('hidden');
    renderMissionQuestion();
  }

  function updateMissionHud() {
    const def = MISSION_DEFS[mState.missionIdx];
    $('mStatProgress').textContent = (mState.qIndex + 1) + ' / ' + def.count;
    $('mStatHits').textContent = String(mState.hits);
    $('mStatErrors').textContent = String(mState.errors);
    $('mStatGrade').textContent = ((mState.hits / def.count) * 10).toFixed(1) + ' / 10';
  }

  function updateClockUi() {
    const def = MISSION_DEFS[mState.missionIdx];
    const pct = Math.max(0, Math.round((mState.timeLeft / def.timePerQ) * 100));
    $('mStatClock').textContent = mState.timeLeft + ' s';
    const bar = $('mTimeBar');
    bar.style.width = pct + '%';
    bar.className = pct > 50 ? 'h-full bg-emerald-500 transition-all duration-300' : (pct > 25 ? 'h-full bg-amber-500 transition-all duration-300' : 'h-full bg-rose-600 transition-all duration-300');
  }

  function renderMissionQuestion() {
    stopMissionClock();
    const def = MISSION_DEFS[mState.missionIdx];
    const q = mState.questions[mState.qIndex];
    mState.timeLeft = def.timePerQ;
    mState.locked = false;

    $('mSceneBox').innerHTML = data.scenes[q.scene] || '';
    $('mProjectBadge').textContent = q.project;
    $('mSentenceBox').innerHTML = formatSentenceHtml(q.text, '', 'idle');
    $('mFeedbackBox').classList.add('hidden');

    const box = $('mOptionsBox');
    box.innerHTML = '';
    shuffle(q.options).forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bg-white hover:bg-sky-50 rounded-2xl border-2 border-slate-300 hover:border-purple-500 py-4 px-5 font-display font-extrabold text-xl text-slate-900 shadow-xs cursor-pointer transition-all';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleMissionAnswer(opt, btn));
      box.appendChild(btn);
    });

    updateMissionHud();
    updateClockUi();
    mState.clock = setInterval(() => {
      mState.timeLeft--;
      updateClockUi();
      if (mState.timeLeft <= 0) {
        stopMissionClock();
        handleMissionTimeout();
      }
    }, 1000);
  }

  function handleMissionAnswer(opt, btn) {
    if (mState.locked) return;
    stopMissionClock();
    mState.locked = true;
    const q = mState.questions[mState.qIndex];
    Array.from($('mOptionsBox').children).forEach((el) => { el.disabled = true; });

    const ok = opt === q.answer;
    if (ok) {
      mState.hits++;
      btn.className = 'bg-emerald-50 rounded-2xl border-4 border-emerald-500 py-4 px-5 font-display font-extrabold text-xl text-emerald-900';
      $('mSentenceBox').innerHTML = formatSentenceHtml(q.text, q.answer, 'ok');
      showMissionFeedback('ok', '¡Correcto! ' + q.rule);
    } else {
      mState.errors++;
      btn.className = 'bg-rose-100 rounded-2xl border-4 border-rose-600 py-4 px-5 font-display font-extrabold text-xl text-rose-900';
      $('mSentenceBox').innerHTML = formatSentenceHtml(q.text, q.answer, 'err');
      showMissionFeedback('err', `Error. La respuesta correcta era "${q.answer}". ${q.rule}`);
    }
    updateMissionHud();
    setTimeout(advanceMission, 1400);
  }

  function handleMissionTimeout() {
    if (mState.locked) return;
    mState.locked = true;
    mState.errors++;
    mState.timeouts++;
    Array.from($('mOptionsBox').children).forEach((el) => { el.disabled = true; });
    const q = mState.questions[mState.qIndex];
    $('mSentenceBox').innerHTML = formatSentenceHtml(q.text, q.answer, 'err');
    showMissionFeedback('err', `¡Tiempo agotado! Se registró como error. Respuesta: "${q.answer}".`);
    updateMissionHud();
    setTimeout(advanceMission, 1500);
  }

  function showMissionFeedback(kind, text) {
    const fb = $('mFeedbackBox');
    fb.classList.remove('hidden');
    fb.className = kind === 'ok'
      ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-950 rounded-2xl px-4 py-3 text-sm font-bold'
      : 'bg-rose-100 border-2 border-rose-400 text-rose-950 rounded-2xl px-4 py-3 text-sm font-bold';
    fb.textContent = text;
  }

  function advanceMission() {
    const def = MISSION_DEFS[mState.missionIdx];
    mState.qIndex++;
    if (mState.qIndex < def.count) renderMissionQuestion();
    else finishMission();
  }

  async function finishMission() {
    stopMissionClock();
    const def = MISSION_DEFS[mState.missionIdx];
    const finalGrade = ((mState.hits / def.count) * 10).toFixed(1);
    $('missionPlayArea').classList.add('hidden');
    $('missionResultBox').classList.remove('hidden');

    const stuLabel = currentStudent ? `${currentStudent.no ? '#' + currentStudent.no + ' · ' : ''}${currentStudent.name}` : 'Alumno invitado';
    $('mResultStudent').textContent = `Alumno(a) (${gradeLevel === 'primaria' ? 'Primaria 3.º' : 'Secundaria 1.º'}): ${stuLabel}`;
    $('mResultTitle').textContent = `Calificación: ${finalGrade} / 10`;
    $('mResultDetail').textContent = `En ${def.title}: ${mState.hits} aciertos y ${mState.errors} errores de ${def.count} preguntas (${mState.timeouts} por tiempo agotado).`;
    const now = new Date();
    $('mResultDate').textContent = 'Fecha de evaluación: ' + now.toLocaleString('es-MX');

    if (gradeLevel === 'primaria' && currentStudent) {
      const syncEl = $('mSyncStatus');
      syncEl.classList.remove('hidden');
      syncEl.className = 'text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 rounded-xl px-3 py-2';
      syncEl.textContent = '📡 Guardando calificación en Base de Datos Maestra...';
      try {
        const url = ((localStorage.getItem(STORAGE_SCRIPT_KEY) || '').trim()) || DEFAULT_PRIMARIA_SCRIPT_URL;
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            game: 'operaciones',
            date: now.toLocaleDateString('es-MX'),
            time: now.toLocaleTimeString('es-MX'),
            studentNo: currentStudent.no || '',
            studentName: currentStudent.name,
            levelReached: 'OrtografíaQuest ' + def.title,
            overallGrade: Number(finalGrade),
            score: mState.hits * 100,
            correctHits: mState.hits,
            errorCount: mState.errors,
            details: `OrtografíaQuest ${def.title}: ${mState.hits}/${def.count} aciertos, ${mState.errors} errores`
          })
        });
        syncEl.className = 'text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2';
        syncEl.textContent = '✅ Resultado guardado en la Base de Datos Maestra de Primaria 3.º A.';
      } catch (_) {
        syncEl.className = 'text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2';
        syncEl.textContent = '⚠ No se pudo conectar con Google Sheets.';
      }
    } else {
      $('mSyncStatus').classList.add('hidden');
    }
  }

  async function loadPrimariaStudents() {
    let list = FALLBACK_3A;
    try {
      const resp = await fetch(PRIMARIA_CSV_URL, { cache: 'no-store' });
      if (resp.ok) {
        const lines = (await resp.text()).split(/\r?\n/).filter((l) => l.trim().length > 0);
        const parsed = [];
        for (let i = 1; i < lines.length; i++) {
          const ci = lines[i].indexOf(',');
          if (ci === -1) continue;
          const no = lines[i].slice(0, ci).trim().replace(/^"|"$/g, '');
          const name = lines[i].slice(ci + 1).trim().replace(/^"|"$/g, '');
          if (name) parsed.push({ no: Number(no) || i, name });
        }
        if (parsed.length) list = parsed;
      }
    } catch (_) {}
    studentsList = list;
    const sel = $('welcomeStudentSelect');
    sel.innerHTML = '<option value="">-- Elige tu nombre --</option>';
    list.forEach((s) => {
      const opt = document.createElement('option');
      opt.value = String(s.no);
      opt.textContent = `${s.no}. ${s.name}`;
      sel.appendChild(opt);
    });
  }

  function init() {
    const params = new URLSearchParams(window.location.search);
    const paramGrade = params.get('nivel');
    setGradeLevel(paramGrade === 'secundaria' ? 'secundaria' : 'primaria');
    loadPrimariaStudents();

    document.querySelectorAll('.grade-btn').forEach((b) => {
      b.addEventListener('click', () => setGradeLevel(b.getAttribute('data-grade')));
    });
    document.querySelectorAll('.nav-tab').forEach((b) => {
      b.addEventListener('click', () => {
        const t = b.getAttribute('data-tab');
        if (t === 'missions' && !currentStudent) {
          switchTab('welcome');
          $('welcomeStudentErr').classList.remove('hidden');
          return;
        }
        switchTab(t);
      });
    });

    $('welcomeStudentSelect').addEventListener('change', (e) => {
      const val = e.target.value;
      currentStudent = studentsList.find((s) => String(s.no) === val) || null;
      $('headerStudentName').textContent = currentStudent ? `#${currentStudent.no} · ${currentStudent.name}` : 'Sin alumno';
      if (currentStudent) $('welcomeStudentErr').classList.add('hidden');
    });

    $('goPracticeBtn').addEventListener('click', () => switchTab('practice'));
    $('goMissionsBtn').addEventListener('click', () => {
      if (gradeLevel === 'secundaria') {
        const nm = ($('secNameInput').value || '').trim();
        const grp = $('secGroupSelect').value;
        if (!nm) {
          $('welcomeStudentErr').classList.remove('hidden');
          $('secNameInput').focus();
          return;
        }
        currentStudent = { no: grp, name: nm };
        $('headerStudentName').textContent = `${grp} · ${nm}`;
      } else if (!currentStudent) {
        $('welcomeStudentErr').classList.remove('hidden');
        $('welcomeStudentSelect').focus();
        return;
      }
      $('welcomeStudentErr').classList.add('hidden');
      switchTab('missions');
    });

    $('practiceTopicSelect').addEventListener('change', loadPracticeQuestion);
    $('pNextBtn').addEventListener('click', loadPracticeQuestion);
    $('mPrintBtn').addEventListener('click', () => window.print());
    $('mRetryBtn').addEventListener('click', () => startMission(mState.missionIdx));
    $('mBackListBtn').addEventListener('click', () => {
      stopMissionClock();
      $('missionResultBox').classList.add('hidden');
      $('missionPlayArea').classList.add('hidden');
      $('missionSelectPanel').classList.remove('hidden');
    });
  }

  init();
})();
