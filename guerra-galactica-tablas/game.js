/**
 * Guerra Galáctica de las Tablas - Motor principal + Registro en Google Sheets
 */
(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // ID de la hoja de Google Sheets proporcionada
  const SPREADSHEET_ID = '1zXwryfrHm9sgDvmAmGz_OpP6PVxtH-3g2vtk0ib6W2A';
  const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`;
  const STORAGE_SCRIPT_KEY = 'galactic_tables_apps_script_url';
  const DEFAULT_PRIMARIA_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbymWYF39eoixwUbNNRARS5A_YdbCiInO71hJt5dl4U0Y62yG3SAwIfZy03EarwzswfJGQ/exec';

  // Lista de respaldo con los 41 alumnos de la hoja por si no hay conexión al cargar
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
    { no: 41, name: 'Torres Romero Raul Alberto' },
  ];

  // Referencias HUD y Modales
  const elPilot = document.getElementById('hudPilot');
  const elScore = document.getElementById('hudScore');
  const elCombo = document.getElementById('hudCombo');
  const elEquation = document.getElementById('hudEquation');
  const elMissionTag = document.getElementById('hudMissionTag');
  const elTimer = document.getElementById('hudTimer');
  const elSectionSelect = document.getElementById('sectionSelect');
  const elLevelSelect = document.getElementById('levelSelect');
  const elProgressBar = document.getElementById('progressFill');
  const elProgressText = document.getElementById('progressText');
  const elCommanderMsg = document.getElementById('commanderMsg');
  const elShieldIcons = document.querySelectorAll('.shield-icon');

  const btnSound = document.getElementById('btnSound');
  const btnPause = document.getElementById('btnPause');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnExitSave = document.getElementById('btnExitSave');

  // Modales
  const modalStart = document.getElementById('modalStart');
  const modalLevelUp = document.getElementById('modalLevelUp');
  const modalPause = document.getElementById('modalPause');
  const modalGameOver = document.getElementById('modalGameOver');
  const modalConfig = document.getElementById('modalConfig');
  const modalHangar = document.getElementById('modalHangar');

  const studentSelect = document.getElementById('studentSelect');
  const sectionTabs = document.querySelectorAll('.section-tab');
  const startLevelLabel = document.getElementById('startLevelLabel');
  const startLevelChips = document.getElementById('startLevelChips');
  const btnStartGame = document.getElementById('btnStartGame');
  const btnStartFullscreen = document.getElementById('btnStartFullscreen');
  const btnOpenHangar = document.getElementById('btnOpenHangar');
  const btnHudHangar = document.getElementById('btnHudHangar');
  const btnCloseHangar = document.getElementById('btnCloseHangar');
  const hangarShipsGrid = document.getElementById('hangarShipsGrid');
  const hangarThemesRow = document.getElementById('hangarThemesRow');
  const shipPreviewCanvas = document.getElementById('shipPreviewCanvas');
  const previewShipName = document.getElementById('previewShipName');
  const inputShipPrimary = document.getElementById('inputShipPrimary');
  const inputShipAccent = document.getElementById('inputShipAccent');
  const btnResetShipColors = document.getElementById('btnResetShipColors');
  const btnConfigSheet = document.getElementById('btnConfigSheet');
  const btnNextLevel = document.getElementById('btnNextLevel');
  const btnExitFromLevelUp = document.getElementById('btnExitFromLevelUp');
  const btnResume = document.getElementById('btnResume');
  const btnExitFromPause = document.getElementById('btnExitFromPause');
  const btnRestartFromPause = document.getElementById('btnRestartFromPause');
  const btnRetryLevel = document.getElementById('btnRetryLevel');
  const btnRestartAll = document.getElementById('btnRestartAll');
  const btnDownloadCsv = document.getElementById('btnDownloadCsv');
  const inputScriptUrl = document.getElementById('inputScriptUrl');
  const btnSaveConfig = document.getElementById('btnSaveConfig');
  const btnCloseConfig = document.getElementById('btnCloseConfig');

  // Secciones de entrenamiento: Tablas de multiplicar, Sumas (2-3 cifras) y Restas (1-3 cifras)
  const SECTIONS = {
    MUL: {
      id: 'MUL',
      title: 'Tablas de Multiplicar',
      promptLabel: 'ELIGE NIVEL DE INICIO (POR DEFECTO: TABLA DEL 2)',
      levels: [
        { level: 1, table: 2, chip: 'Tabla 2', name: 'Sector Nebulosa 2', target: 16, enemies: 3, speed: 22, sway: 0, tightness: 1 },
        { level: 2, table: 3, chip: 'Tabla 3', name: 'Órbita Lunar 3', target: 16, enemies: 3, speed: 25, sway: 8, tightness: 1 },
        { level: 3, table: 4, chip: 'Tabla 4', name: 'Cinturón Asteroides 4', target: 18, enemies: 4, speed: 28, sway: 14, tightness: 2 },
        { level: 4, table: 5, chip: 'Tabla 5', name: 'Estación Titán 5', target: 18, enemies: 4, speed: 32, sway: 18, tightness: 2 },
        { level: 5, table: 6, chip: 'Tabla 6', name: 'Puerta Hiperespacial 6', target: 20, enemies: 4, speed: 35, sway: 22, tightness: 2 },
        { level: 6, table: 7, chip: 'Tabla 7', name: 'Nebulosa Carmesí 7', target: 20, enemies: 4, speed: 38, sway: 26, tightness: 3 },
        { level: 7, table: 8, chip: 'Tabla 8', name: 'Flota Imperial 8', target: 22, enemies: 5, speed: 42, sway: 30, tightness: 3 },
        { level: 8, table: 9, chip: 'Tabla 9', name: 'Núcleo Estelar 9', target: 22, enemies: 5, speed: 45, sway: 34, tightness: 3 },
        { level: 9, table: 10, chip: 'Tabla 10', name: 'Vórtice Galáctico 10', target: 22, enemies: 5, speed: 48, sway: 38, tightness: 3 },
        { level: 10, table: 11, chip: 'Tabla 11', name: 'Base Estrella 11', target: 24, enemies: 5, speed: 52, sway: 42, tightness: 4 },
        { level: 11, table: 12, chip: 'Tabla 12', name: 'Fortaleza Final 12', target: 24, enemies: 5, speed: 55, sway: 46, tightness: 4 },
        { level: 12, table: 'MIX', chip: 'Mixtas', name: 'Desafío Maestro (2-12)', target: 25, enemies: 5, speed: 58, sway: 50, tightness: 4 },
      ],
    },
    ADD: {
      id: 'ADD',
      title: 'Sumas Galácticas',
      promptLabel: 'ELIGE NIVEL DE SUMAS (2 Y 3 CIFRAS)',
      levels: [
        { level: 1, mode: '2d_no_carry', chip: '2C Básica', name: 'Sumas 2 Cifras (Sin llevar)', target: 15, enemies: 3, speed: 22, sway: 0, tightness: 1 },
        { level: 2, mode: '2d_carry', chip: '2C Llevada', name: 'Sumas 2 Cifras (Con llevada)', target: 16, enemies: 4, speed: 26, sway: 8, tightness: 2 },
        { level: 3, mode: '3d_2d', chip: '3C + 2C', name: 'Sumas 3 Cifras + 2 Cifras', target: 18, enemies: 4, speed: 30, sway: 14, tightness: 2 },
        { level: 4, mode: '3d_no_carry', chip: '3C Básica', name: 'Sumas 3 Cifras (Sin llevar)', target: 18, enemies: 4, speed: 34, sway: 20, tightness: 3 },
        { level: 5, mode: '3d_carry', chip: '3C Llevada', name: 'Sumas 3 Cifras (Con llevada)', target: 20, enemies: 5, speed: 38, sway: 26, tightness: 3 },
        { level: 6, mode: 'mix', chip: 'Maestro', name: 'Desafío Sumas (2 y 3 Cifras)', target: 22, enemies: 5, speed: 44, sway: 32, tightness: 4 },
      ],
    },
    SUB: {
      id: 'SUB',
      title: 'Restas Galácticas',
      promptLabel: 'ELIGE NIVEL DE RESTAS (1, 2 Y 3 CIFRAS)',
      levels: [
        { level: 1, mode: '1d_2d_no_borrow', chip: '1-2C Básica', name: 'Restas 1 y 2 Cifras (Sin prestar)', target: 15, enemies: 3, speed: 22, sway: 0, tightness: 1 },
        { level: 2, mode: '2d_1d_borrow', chip: '2C - 1C', name: 'Restas 2 Cifras - 1 Cifra (Préstamo)', target: 16, enemies: 3, speed: 26, sway: 8, tightness: 2 },
        { level: 3, mode: '2d_2d_no_borrow', chip: '2C Básica', name: 'Restas 2 Cifras (Sin prestar)', target: 16, enemies: 4, speed: 30, sway: 14, tightness: 2 },
        { level: 4, mode: '2d_2d_borrow', chip: '2C Préstamo', name: 'Restas 2 Cifras (Con préstamo)', target: 18, enemies: 4, speed: 34, sway: 20, tightness: 3 },
        { level: 5, mode: '3d_no_borrow', chip: '3C Básica', name: 'Restas 3 Cifras (Sin prestar)', target: 18, enemies: 5, speed: 38, sway: 26, tightness: 3 },
        { level: 6, mode: '3d_borrow', chip: '3C Maestro', name: 'Restas 3 Cifras (Con préstamo)', target: 20, enemies: 5, speed: 44, sway: 32, tightness: 4 },
      ],
    },
    DIV: {
      id: 'DIV',
      title: 'Divisiones Galácticas',
      promptLabel: 'ELIGE NIVEL DE DIVISIONES EXACTAS (1 A 3 CIFRAS)',
      levels: [
        { level: 1, mode: '1d_1d', chip: '1C ÷ 1C', name: 'Divisiones 1 Cifra', target: 15, enemies: 3, speed: 22, sway: 0, tightness: 1 },
        { level: 2, mode: '2d_1d_easy', chip: '2C ÷ (2-5)', name: 'Divisiones 2 Cifras (2 al 5)', target: 16, enemies: 3, speed: 26, sway: 8, tightness: 1 },
        { level: 3, mode: '2d_1d_hard', chip: '2C ÷ (6-9)', name: 'Divisiones 2 Cifras (6 al 9)', target: 18, enemies: 4, speed: 30, sway: 14, tightness: 2 },
        { level: 4, mode: '2d_1d_q2', chip: 'Cociente 2C', name: 'Divisiones 2 Cifras (Exactas)', target: 18, enemies: 4, speed: 34, sway: 20, tightness: 3 },
        { level: 5, mode: '3d_1d', chip: '3C ÷ 1C', name: 'Divisiones 3 Cifras ÷ 1 Cifra', target: 20, enemies: 5, speed: 38, sway: 26, tightness: 3 },
        { level: 6, mode: 'mix', chip: 'Maestro', name: 'Desafío Maestro Divisiones', target: 22, enemies: 5, speed: 44, sway: 32, tightness: 4 },
      ],
    },
  };

  // 7 Naves seleccionables en el Hangar
  const SHIPS = [
    { id: 'xwing', name: 'Ala-X Rebelde', desc: 'Cian equilibrado', color: '#00f0ff', accent: '#7df4ff' },
    { id: 'falcon', name: 'Halcón Estelar', desc: 'Carguero rápido', color: '#38bdf8', accent: '#e2e8f0' },
    { id: 'phoenix', name: 'Interceptor Fénix', desc: 'Alas de fuego', color: '#ff8a00', accent: '#ffe600' },
    { id: 'emerald', name: 'Caza Esmeralda', desc: 'Doble cañón verde', color: '#00ffa3', accent: '#a7f3d0' },
    { id: 'specter', name: 'Espectro Violeta', desc: 'Sigilo espacial', color: '#c084fc', accent: '#f0abfc' },
    { id: 'ywing', name: 'Ala-Y Pesada', desc: 'Doble turbina oro', color: '#ffe600', accent: '#fde047' },
    { id: 'jedi', name: 'Estrella Jedi', desc: 'Élite hiperespacial', color: '#f8fafc', accent: '#00f0ff' },
  ];

  // Temáticas de fondo espacial
  const THEMES = [
    { id: 'AUTO', name: 'Automática por Nivel', bg: '#050814', neb1: 'rgba(121, 40, 202, 0.16)', neb2: 'rgba(0, 240, 255, 0.10)' },
    { id: 'DEEP', name: 'Espacio Profundo', bg: '#050814', neb1: 'rgba(30, 64, 175, 0.16)', neb2: 'rgba(0, 240, 255, 0.08)' },
    { id: 'NEBULA', name: 'Nebulosa Púrpura', bg: '#0b0418', neb1: 'rgba(168, 85, 247, 0.22)', neb2: 'rgba(236, 72, 153, 0.12)' },
    { id: 'SOLAR', name: 'Cinturón Solar', bg: '#130706', neb1: 'rgba(249, 115, 22, 0.18)', neb2: 'rgba(234, 179, 8, 0.10)' },
    { id: 'EMERALD', name: 'Vacío Esmeralda', bg: '#03120e', neb1: 'rgba(16, 185, 129, 0.18)', neb2: 'rgba(6, 182, 212, 0.10)' },
    { id: 'HYPER', name: 'Sector Hiperespacial', bg: '#040b1a', neb1: 'rgba(56, 189, 248, 0.20)', neb2: 'rgba(99, 102, 241, 0.14)' },
  ];

  function getLevels() {
    return SECTIONS[state.section].levels;
  }

  // Dimensiones lógicas y escala HiDPI (píxeles por pulgada)
  let logicalWidth = 1280;
  let logicalHeight = 720;
  let dpr = Math.min(window.devicePixelRatio || 1, 3);

  // Estado del juego
  const state = {
    mode: 'START', // START, PLAYING, PAUSED, LEVEL_UP, GAME_OVER, VICTORY
    section: 'MUL', // MUL, ADD, SUB
    levelIndex: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    shields: 3,
    progress: 0,
    correctHits: 0,
    totalShots: 0,
    currentQuestion: null,
    recentQuestions: [],
    waveCount: 0,
    selectedStartLevel: 0,
    selectedShip: localStorage.getItem('galactic_ship') || 'xwing',
    shipPrimaryColor: localStorage.getItem('galactic_ship_primary') || '',
    shipAccentColor: localStorage.getItem('galactic_ship_accent') || '',
    selectedTheme: localStorage.getItem('galactic_theme') || 'AUTO',
    shakeTime: 0,
    hyperspaceBoost: 0,
    students: [],
    currentStudent: null, // { no, name }
    tableStats: {}, // { '2': { correct: 0, attempts: 0 }, ... }
    sectionStats: {}, // { 'MUL_2': { label, correct, attempts }, 'ADD_1': ... }
    questionStartTime: 0,
    pauseStartTime: 0,
    responseTimes: [],
    questionLog: [],
    currentWaveErrors: 0,
    lastReport: null,
  };

  // Entidades del canvas
  const player = {
    x: 0,
    y: 0,
    targetX: null,
    width: 64,
    height: 54,
    speed: 520,
    cooldown: 0,
  };

  let stars = [];
  let stations = [];
  let asteroids = [];
  let enemies = [];
  let lasers = [];
  let particles = [];
  let floatingTexts = [];

  const keys = {
    left: false,
    right: false,
    shoot: false,
  };

  // Cargar lista de alumnos desde Google Sheets (CSV) con respaldo local
  async function loadStudents() {
    let list = FALLBACK_STUDENTS;
    try {
      const resp = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
      if (resp.ok) {
        const csvText = await resp.text();
        const parsed = parseStudentsCsv(csvText);
        if (parsed.length > 0) {
          list = parsed;
        }
      }
    } catch {
      // Usar respaldo local si falla la red o CORS
    }

    state.students = list;
    studentSelect.innerHTML = '<option value="">-- Elige tu nombre de la lista --</option>';
    list.forEach((st) => {
      const opt = document.createElement('option');
      opt.value = String(st.no);
      opt.textContent = `${st.no}. ${st.name}`;
      studentSelect.appendChild(opt);
    });
  }

  function parseStudentsCsv(text) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const commaIdx = line.indexOf(',');
      if (commaIdx === -1) continue;
      const no = line.slice(0, commaIdx).trim().replace(/^"|"$/g, '');
      const name = line.slice(commaIdx + 1).trim().replace(/^"|"$/g, '');
      if (name) {
        result.push({ no: Number(no) || i, name });
      }
    }
    return result;
  }

  // Inicializar selector de secciones y niveles en HUD y modal de inicio
  function renderLevelOptions() {
    const levels = getLevels();
    const sec = SECTIONS[state.section];
    elLevelSelect.innerHTML = '';
    startLevelChips.innerHTML = '';
    if (startLevelLabel) {
      startLevelLabel.textContent = sec.promptLabel;
    }

    levels.forEach((lvl, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = `Nv.${lvl.level}: ${lvl.chip}`;
      elLevelSelect.appendChild(opt);

      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'lvl-chip' + (idx === state.selectedStartLevel ? ' active' : '');
      chip.textContent = lvl.chip;
      chip.addEventListener('click', () => {
        state.selectedStartLevel = idx;
        document.querySelectorAll('.lvl-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
      });
      startLevelChips.appendChild(chip);
    });
  }

  function initLevelSelectors() {
    renderLevelOptions();

    sectionTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const secId = tab.dataset.section;
        if (!secId || !SECTIONS[secId]) return;
        state.section = secId;
        state.selectedStartLevel = 0;
        sectionTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        if (elSectionSelect) elSectionSelect.value = secId;
        renderLevelOptions();
      });
    });

    if (elSectionSelect) {
      elSectionSelect.addEventListener('change', (e) => {
        const secId = e.target.value;
        if (SECTIONS[secId]) {
          state.section = secId;
          state.selectedStartLevel = 0;
          sectionTabs.forEach((t) => t.classList.toggle('active', t.dataset.section === secId));
          renderLevelOptions();
          startLevel(0, false);
        }
      });
    }

    elLevelSelect.addEventListener('change', (e) => {
      const idx = parseInt(e.target.value, 10);
      if (!Number.isNaN(idx)) {
        startLevel(idx, false);
      }
    });
  }

  // Redimensionar canvas en alta densidad de píxeles (HiDPI / Retina)
  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    logicalWidth = Math.max(320, Math.floor(rect.width));
    logicalHeight = Math.max(240, Math.floor(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 3);

    canvas.width = Math.floor(logicalWidth * dpr);
    canvas.height = Math.floor(logicalHeight * dpr);
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;

    player.y = logicalHeight - 86;
    if (player.x === 0 || player.x > logicalWidth - 40) {
      player.x = logicalWidth / 2;
    }
    positionStations();
    initStars();
  }

  function initStations() {
    stations = [0.16, 0.38, 0.62, 0.84].map((rx, idx) => ({
      id: idx,
      rx,
      x: logicalWidth * rx,
      y: logicalHeight - 26,
      hp: 2,
      maxHp: 2,
      hitFlash: 0,
      repairFlash: 0,
    }));
  }

  function positionStations() {
    if (stations.length === 0) {
      initStations();
      return;
    }
    stations.forEach((st) => {
      st.x = logicalWidth * st.rx;
      st.y = logicalHeight - 26;
    });
  }

  function initStars() {
    const count = Math.min(220, Math.floor((logicalWidth * logicalHeight) / 5200));
    stars = [];
    for (let i = 0; i < count; i++) {
      const layer = Math.random();
      stars.push({
        x: Math.random() * logicalWidth,
        y: Math.random() * logicalHeight,
        size: layer < 0.6 ? 0.9 : layer < 0.9 ? 1.6 : 2.3,
        speed: layer < 0.6 ? 18 : layer < 0.9 ? 36 : 62,
        alpha: layer < 0.6 ? 0.35 : layer < 0.9 ? 0.65 : 0.95,
        tint: Math.random() < 0.18 ? '#7df4ff' : Math.random() < 0.1 ? '#dbb8ff' : '#e2f1ff',
      });
    }
  }

  // Registrar intento por tabla (para Sheets) y por sección/nivel
  function recordAttempt(q, isCorrect) {
    if (!q) return;
    if (q.section === 'MUL' && q.tableNum) {
      const tKey = String(q.tableNum);
      if (!state.tableStats[tKey]) {
        state.tableStats[tKey] = { correct: 0, attempts: 0 };
      }
      state.tableStats[tKey].attempts++;
      if (isCorrect) state.tableStats[tKey].correct++;
    }

    const sKey = q.statKey;
    if (!state.sectionStats[sKey]) {
      state.sectionStats[sKey] = { label: q.statLabel, correct: 0, attempts: 0 };
    }
    state.sectionStats[sKey].attempts++;
    if (isCorrect) state.sectionStats[sKey].correct++;
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function buildMultiplication(cfg) {
    const table = cfg.table === 'MIX' ? randInt(2, 12) : cfg.table;
    const b = randInt(1, 12);
    return {
      section: 'MUL',
      tableNum: table,
      a: table,
      b,
      op: '×',
      answer: table * b,
      statKey: `MUL_${table}`,
      statLabel: `TABLA ${table}`,
    };
  }

  function buildAddition(cfg) {
    let mode = cfg.mode;
    if (mode === 'mix') {
      const pool = ['2d_no_carry', '2d_carry', '3d_2d', '3d_no_carry', '3d_carry'];
      mode = pool[randInt(0, pool.length - 1)];
    }

    let a, b;
    if (mode === '2d_no_carry') {
      const a1 = randInt(1, 7), a0 = randInt(1, 8);
      const b1 = randInt(1, 9 - a1), b0 = randInt(0, 9 - a0);
      a = a1 * 10 + a0;
      b = b1 * 10 + b0;
    } else if (mode === '2d_carry') {
      const a1 = randInt(1, 8), a0 = randInt(2, 9);
      const b1 = randInt(1, 8), b0 = randInt(10 - a0, 9);
      a = a1 * 10 + a0;
      b = b1 * 10 + b0;
    } else if (mode === '3d_2d') {
      a = randInt(105, 899);
      b = randInt(12, 98);
    } else if (mode === '3d_no_carry') {
      const a2 = randInt(1, 7), a1 = randInt(1, 7), a0 = randInt(1, 8);
      const b2 = randInt(1, 9 - a2), b1 = randInt(0, 9 - a1), b0 = randInt(0, 9 - a0);
      a = a2 * 100 + a1 * 10 + a0;
      b = b2 * 100 + b1 * 10 + b0;
    } else {
      // 3d_carry
      a = randInt(135, 799);
      b = randInt(125, 699);
    }

    return {
      section: 'ADD',
      a,
      b,
      op: '+',
      answer: a + b,
      statKey: `ADD_${cfg.level}`,
      statLabel: `SUMA NV.${cfg.level}`,
    };
  }

  function buildSubtraction(cfg) {
    let mode = cfg.mode;
    let a, b;

    if (mode === '1d_2d_no_borrow') {
      if (Math.random() < 0.45) {
        // 1 cifra - 1 cifra
        a = randInt(3, 9);
        b = randInt(1, a - 1);
      } else {
        // 2 cifras - 1 cifra sin prestar
        const a1 = randInt(1, 8), a0 = randInt(2, 9);
        b = randInt(1, a0);
        a = a1 * 10 + a0;
      }
    } else if (mode === '2d_1d_borrow') {
      const a1 = randInt(2, 9), a0 = randInt(0, 7);
      b = randInt(a0 + 1, 9);
      a = a1 * 10 + a0;
    } else if (mode === '2d_2d_no_borrow') {
      const a1 = randInt(2, 9), a0 = randInt(2, 9);
      const b1 = randInt(1, a1 - 1), b0 = randInt(1, a0);
      a = a1 * 10 + a0;
      b = b1 * 10 + b0;
    } else if (mode === '2d_2d_borrow') {
      const a1 = randInt(3, 9), a0 = randInt(0, 7);
      const b1 = randInt(1, a1 - 1), b0 = randInt(a0 + 1, 9);
      a = a1 * 10 + a0;
      b = b1 * 10 + b0;
    } else if (mode === '3d_no_borrow') {
      const a2 = randInt(2, 9), a1 = randInt(2, 9), a0 = randInt(2, 9);
      const b2 = Math.random() < 0.35 ? 0 : randInt(1, a2 - 1);
      const b1 = randInt(1, a1), b0 = randInt(1, a0);
      a = a2 * 100 + a1 * 10 + a0;
      b = b2 * 100 + b1 * 10 + b0;
    } else {
      // 3d_borrow (3 cifras con préstamo contra 2 o 3 cifras)
      a = randInt(210, 950);
      const minB = Math.random() < 0.3 ? 25 : 105;
      b = randInt(minB, a - 15);
    }

    return {
      section: 'SUB',
      a,
      b,
      op: '−',
      answer: a - b,
      statKey: `SUB_${cfg.level}`,
      statLabel: `RESTA NV.${cfg.level}`,
    };
  }

  function buildDivision(cfg) {
    let mode = cfg.mode;
    if (mode === 'mix') {
      const pool = ['1d_1d', '2d_1d_easy', '2d_1d_hard', '2d_1d_q2', '3d_1d'];
      mode = pool[randInt(0, pool.length - 1)];
    }

    let divisor, quotient;
    if (mode === '1d_1d') {
      divisor = randInt(1, 3);
      quotient = randInt(1, Math.floor(9 / divisor));
    } else if (mode === '2d_1d_easy') {
      divisor = randInt(2, 5);
      quotient = randInt(Math.ceil(10 / divisor), 10);
    } else if (mode === '2d_1d_hard') {
      divisor = randInt(6, 9);
      quotient = randInt(Math.ceil(10 / divisor), 10);
    } else if (mode === '2d_1d_q2') {
      divisor = randInt(2, 6);
      quotient = randInt(10, Math.floor(99 / divisor));
    } else {
      // 3d_1d
      divisor = randInt(2, 9);
      quotient = randInt(Math.ceil(100 / divisor), Math.min(120, Math.floor(990 / divisor)));
    }

    const dividend = divisor * quotient;
    return {
      section: 'DIV',
      a: dividend,
      b: divisor,
      op: '÷',
      answer: quotient,
      statKey: `DIV_${cfg.level}`,
      statLabel: `DIV NV.${cfg.level}`,
    };
  }

  // Generación aleatoria sin repetición reciente + distractores inteligentes
  function generateQuestion() {
    const cfg = getLevels()[state.levelIndex];
    let q;
    let sig;
    let guard = 0;

    do {
      if (state.section === 'ADD') q = buildAddition(cfg);
      else if (state.section === 'SUB') q = buildSubtraction(cfg);
      else if (state.section === 'DIV') q = buildDivision(cfg);
      else q = buildMultiplication(cfg);

      sig = `${q.a}${q.op}${q.b}`;
      guard++;
    } while (state.recentQuestions.includes(sig) && guard < 18);

    state.recentQuestions.push(sig);
    if (state.recentQuestions.length > 10) {
      state.recentQuestions.shift();
    }

    const answer = q.answer;
    const options = new Set([answer]);

    while (options.size < cfg.enemies) {
      let fake;
      const r = Math.random();
      if (q.section === 'MUL' && cfg.tightness >= 2 && r < 0.45) {
        const offset = (Math.random() < 0.5 ? -1 : 1) * randInt(1, 2);
        fake = q.a * Math.max(1, q.b + offset);
      } else if (r < 0.8) {
        const deltas = answer >= 100
          ? [-100, -20, -10, -2, -1, 1, 2, 10, 20, 100]
          : [-10, -4, -2, -1, 1, 2, 4, 10];
        fake = answer + deltas[randInt(0, deltas.length - 1)];
      } else {
        const spread = answer >= 100 ? 35 : Math.max(6, Math.floor(answer * 0.25));
        fake = answer + randInt(-spread, spread);
      }

      if (fake >= 0 && fake !== answer) {
        options.add(fake);
      }
    }

    const shuffled = Array.from(options).sort(() => Math.random() - 0.5);
    state.currentQuestion = q;
    state.questionStartTime = performance.now();
    state.currentWaveErrors = 0;

    elEquation.textContent = `${q.a} ${q.op} ${q.b} = ?`;
    spawnWave(shuffled, cfg);
  }

  function computeBasePointsBySpeed(elapsedSec) {
    if (elapsedSec <= 2.0) return 150;
    if (elapsedSec <= 4.0) return 125;
    if (elapsedSec <= 6.5) return 100;
    return Math.max(40, Math.round(100 - (elapsedSec - 6.5) * 10));
  }

  function getProgressSpeedFactor() {
    const cfg = getLevels()[state.levelIndex];
    const ratio = cfg.target > 0 ? state.progress / cfg.target : 0;
    return 1 + ratio * 0.75; // Acelera progresivamente de 1.00x a 1.75x dentro del nivel
  }

  function spawnWave(values, cfg) {
    enemies = [];
    state.waveCount++;
    const hasDamagedStation = stations.some((s) => s.hp < s.maxHp);
    const isBonusWave = state.waveCount % 5 === 0 || (hasDamagedStation && Math.random() < 0.25);

    const count = values.length;
    const marginX = Math.max(70, logicalWidth * 0.1);
    const usableW = logicalWidth - marginX * 2;
    const step = count > 1 ? usableW / (count - 1) : 0;
    const speedFactor = getProgressSpeedFactor();

    values.forEach((val, i) => {
      const baseX = count === 1 ? logicalWidth / 2 : marginX + step * i;
      const yOffset = (i % 2) * -32 - 35;
      const isCorrect = val === state.currentQuestion.answer;
      enemies.push({
        baseX,
        x: baseX,
        y: yOffset,
        radius: 34,
        value: val,
        isCorrect,
        isBonus: isCorrect && isBonusWave,
        speed: (cfg.speed + Math.random() * 6) * speedFactor,
        swayAmp: cfg.sway,
        phase: Math.random() * Math.PI * 2,
        shieldTimer: 0,
      });
    });
  }

  function ensureStudentSelected() {
    const val = studentSelect.value;
    if (!val) {
      alert('Por favor, selecciona tu nombre de la lista antes de iniciar la misión.');
      studentSelect.focus();
      return false;
    }
    const found = state.students.find((s) => String(s.no) === val);
    state.currentStudent = found || { no: val, name: studentSelect.options[studentSelect.selectedIndex].textContent };
    elPilot.textContent = `👤 ${state.currentStudent.name}`;
    return true;
  }

  function startLevel(index, resetScore = false) {
    const levels = getLevels();
    state.levelIndex = Math.max(0, Math.min(levels.length - 1, index));
    if (resetScore) {
      state.score = 0;
      state.streak = 0;
      state.maxStreak = 0;
      state.shields = 4;
      state.correctHits = 0;
      state.totalShots = 0;
      state.tableStats = {};
      state.sectionStats = {};
      state.recentQuestions = [];
      state.waveCount = 0;
      state.responseTimes = [];
      state.questionLog = [];
      initStations();
    }
    state.progress = 0;
    state.mode = 'PLAYING';
    state.hyperspaceBoost = 1.2;

    lasers = [];
    particles = [];
    floatingTexts = [];
    player.x = logicalWidth / 2;
    player.targetX = null;
    initAsteroids();

    hideAllModals();
    if (elSectionSelect) elSectionSelect.value = state.section;
    elLevelSelect.value = String(state.levelIndex);
    updateHUD();
    setCommanderMsg('¡Despegue! Esquiva asteroides y destruye la respuesta correcta.', false);
    generateQuestion();
  }

  function initAsteroids() {
    // Cantidad progresiva de obstáculos según el nivel (2 en Nv.1 hasta 9 en niveles altos)
    const count = Math.min(9, 2 + state.levelIndex);
    const types = ['rock', 'crystal', 'magma', 'iron'];
    asteroids = [];

    for (let i = 0; i < count; i++) {
      const kind = types[i % types.length];
      const r = kind === 'crystal' ? randInt(16, 24) : randInt(18, 29);
      const pts = [];
      const verts = kind === 'iron' ? 5 : kind === 'crystal' ? 6 : 9;

      for (let v = 0; v < verts; v++) {
        const ang = (v / verts) * Math.PI * 2;
        let rad = r;
        if (kind === 'crystal') {
          rad = v % 2 === 0 ? r * 1.25 : r * 0.58; // Puntas cristalinas afiladas
        } else if (kind === 'iron') {
          rad = r * (0.7 + (v % 2) * 0.4); // Placa angular
        } else {
          rad = r * (0.72 + Math.random() * 0.36); // Forma orgánica irregular
        }
        pts.push({ x: Math.cos(ang) * rad, y: Math.sin(ang) * rad });
      }

      asteroids.push({
        kind,
        x: randInt(70, Math.max(120, logicalWidth - 70)),
        y: randInt(Math.floor(logicalHeight * 0.34), Math.floor(logicalHeight * 0.70)),
        vx: (Math.random() < 0.5 ? -1 : 1) * randInt(32 + state.levelIndex * 3, 72 + state.levelIndex * 5),
        vy: (Math.random() - 0.5) * (20 + state.levelIndex * 3),
        radius: r,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 1.9,
        pts,
      });
    }
  }

  function hideAllModals() {
    modalStart.classList.add('hidden');
    modalLevelUp.classList.add('hidden');
    modalPause.classList.add('hidden');
    modalGameOver.classList.add('hidden');
    modalConfig.classList.add('hidden');
    if (modalHangar) modalHangar.classList.add('hidden');
  }

  function updateHUD() {
    const cfg = getLevels()[state.levelIndex];
    elScore.textContent = state.score.toLocaleString('es-MX');

    if (state.streak >= 2) {
      const mult = Math.min(5, 1 + Math.floor(state.streak / 3));
      elCombo.textContent = `RACHA x${state.streak} (×${mult} PTS)`;
      elCombo.classList.remove('inactive');
    } else {
      elCombo.textContent = `RACHA x${state.streak}`;
      elCombo.classList.add('inactive');
    }

    const speedFactor = getProgressSpeedFactor().toFixed(1);
    elMissionTag.textContent = `NIVEL ${cfg.level} • ${cfg.name.toUpperCase()} • VEL ${speedFactor}x`;

    const pct = Math.min(100, Math.round((state.progress / cfg.target) * 100));
    elProgressBar.style.width = `${pct}%`;
    elProgressText.textContent = `${state.progress} / ${cfg.target} NAVES`;

    elShieldIcons.forEach((icon, i) => {
      const st = stations[i];
      const hp = st ? st.hp : 0;
      icon.classList.remove('damaged', 'lost');
      if (hp === 1) icon.classList.add('damaged');
      else if (hp <= 0) icon.classList.add('lost');
    });
  }

  function setCommanderMsg(msg, isWarn = false) {
    elCommanderMsg.textContent = msg;
    elCommanderMsg.classList.toggle('warn', isWarn);
  }

  // Disparo del jugador
  function fireLaser() {
    if (state.mode !== 'PLAYING' || player.cooldown > 0) return;
    player.cooldown = 0.22;
    state.totalShots++;

    lasers.push({
      x: player.x,
      y: player.y - 26,
      vx: 0,
      vy: -760,
      bounced: false,
      life: 2.0,
    });

    window.spaceAudio.playLaser();
  }

  function createExplosion(x, y, color, count = 24) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 220 + 50;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color,
        life: 0.55 + Math.random() * 0.25,
        maxLife: 0.8,
      });
    }
  }

  function addFloatingText(x, y, text, color) {
    floatingTexts.push({
      x,
      y,
      text,
      color,
      life: 1.05,
      maxLife: 1.05,
    });
  }

  // Bucle de actualización
  function update(dt) {
    const starMult = state.hyperspaceBoost > 0 ? 5.5 : 1;
    if (state.hyperspaceBoost > 0) {
      state.hyperspaceBoost = Math.max(0, state.hyperspaceBoost - dt);
    }

    for (const s of stars) {
      s.y += s.speed * starMult * dt;
      if (s.y > logicalHeight) {
        s.y = -4;
        s.x = Math.random() * logicalWidth;
      }
    }

    if (state.mode !== 'PLAYING') return;

    // Actualizar cronómetro de rapidez en vivo
    if (state.questionStartTime > 0 && elTimer) {
      const elapsedSec = Math.max(0, (performance.now() - state.questionStartTime) / 1000);
      const basePts = computeBasePointsBySpeed(elapsedSec);
      elTimer.textContent = `⏱ ${elapsedSec.toFixed(1)}s • ${basePts} PTS BASE`;
      elTimer.classList.remove('mid', 'slow');
      if (elapsedSec > 6.5) elTimer.classList.add('slow');
      else if (elapsedSec > 2.5) elTimer.classList.add('mid');
    }

    if (state.shakeTime > 0) {
      state.shakeTime = Math.max(0, state.shakeTime - dt);
    }

    if (player.cooldown > 0) {
      player.cooldown = Math.max(0, player.cooldown - dt);
    }

    if (keys.left) {
      player.x -= player.speed * dt;
      player.targetX = null;
    } else if (keys.right) {
      player.x += player.speed * dt;
      player.targetX = null;
    } else if (player.targetX !== null) {
      const diff = player.targetX - player.x;
      if (Math.abs(diff) > 2) {
        player.x += diff * Math.min(1, dt * 14);
      } else {
        player.x = player.targetX;
      }
    }

    player.x = Math.max(42, Math.min(logicalWidth - 42, player.x));

    if (keys.shoot) {
      fireLaser();
    }

    // Mover obstáculos (asteroides)
    for (const ast of asteroids) {
      ast.x += ast.vx * dt;
      ast.y += ast.vy * dt;
      ast.rot += ast.rotSpeed * dt;
      if (ast.x < ast.radius + 15 || ast.x > logicalWidth - ast.radius - 15) ast.vx *= -1;
      if (ast.y < logicalHeight * 0.32 || ast.y > logicalHeight * 0.72) ast.vy *= -1;
    }

    for (let i = lasers.length - 1; i >= 0; i--) {
      const l = lasers[i];
      l.x += l.vx * dt;
      l.y += l.vy * dt;
      l.life -= dt;

      if (l.y < -30 || l.y > logicalHeight + 30 || l.x < -30 || l.x > logicalWidth + 30 || l.life <= 0) {
        lasers.splice(i, 1);
        continue;
      }

      if (l.bounced) continue;

      // Colisión láser vs asteroides (obstáculo bloquea el disparo)
      let hitAsteroid = false;
      for (const ast of asteroids) {
        if (Math.hypot(l.x - ast.x, l.y - ast.y) <= ast.radius + 4) {
          createExplosion(l.x, l.y, '#ff8a00', 8);
          lasers.splice(i, 1);
          hitAsteroid = true;
          break;
        }
      }
      if (hitAsteroid) continue;

      for (let j = enemies.length - 1; j >= 0; j--) {
        const e = enemies[j];
        const dx = l.x - e.x;
        const dy = l.y - e.y;
        const dist = Math.hypot(dx, dy);

        if (dist <= e.radius + 10) {
          if (e.isCorrect) {
            lasers.splice(i, 1);
            handleCorrectHit(e);
            break;
          } else {
            recordAttempt(state.currentQuestion, false);
            state.currentWaveErrors++;
            e.shieldTimer = 0.55;
            l.bounced = true;
            l.vy = 420;
            l.vx = (dx >= 0 ? 1 : -1) * (160 + Math.random() * 120);
            l.life = 0.42;

            state.streak = 0;
            updateHUD();
            window.spaceAudio.playShieldBounce();
            createExplosion(l.x, l.y, '#00f0ff', 10);
            addFloatingText(e.x, e.y - 38, 'ESCUDO INTACTO - SIN DAÑO', '#00f0ff');
            const q = state.currentQuestion;
            setCommanderMsg(`¡Escudo enemigo intacto! ${q.a} ${q.op} ${q.b} no es ${e.value}.`, true);
            break;
          }
        }
      }
    }

    let breach = false;
    const defenseLine = logicalHeight - 54;

    for (const st of stations) {
      if (st.hitFlash > 0) st.hitFlash = Math.max(0, st.hitFlash - dt);
      if (st.repairFlash > 0) st.repairFlash = Math.max(0, st.repairFlash - dt);
    }

    for (const e of enemies) {
      e.y += e.speed * dt;
      e.phase += dt * 2.1;
      e.x = e.baseX + Math.sin(e.phase) * e.swayAmp;
      e.x = Math.max(44, Math.min(logicalWidth - 44, e.x));

      if (e.shieldTimer > 0) {
        e.shieldTimer = Math.max(0, e.shieldTimer - dt);
      }

      if (e.y + e.radius >= defenseLine) {
        breach = true;
      }
    }

    if (breach) {
      handleDefenseBreach();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y -= 36 * dt;
      ft.life -= dt;
      if (ft.life <= 0) {
        floatingTexts.splice(i, 1);
      }
    }
  }

  function handleCorrectHit(enemy) {
    const cfg = getLevels()[state.levelIndex];
    const q = state.currentQuestion;
    recordAttempt(q, true);
    state.streak++;
    state.maxStreak = Math.max(state.maxStreak, state.streak);
    state.correctHits++;
    state.progress++;

    const elapsedSec = state.questionStartTime > 0
      ? Math.max(0.1, (performance.now() - state.questionStartTime) / 1000)
      : 3.0;
    state.responseTimes.push(elapsedSec);
    state.questionLog.push({
      tema: q.statLabel,
      op: `${q.a} ${q.op} ${q.b}`,
      answer: q.answer,
      timeSec: elapsedSec.toFixed(1),
      errors: state.currentWaveErrors,
      status: 'Correcto',
    });

    const basePts = computeBasePointsBySpeed(elapsedSec);
    const mult = Math.min(5, 1 + Math.floor(state.streak / 3));
    const bonusPts = enemy.isBonus ? 150 : 0;
    const pts = basePts * mult + bonusPts;
    state.score += pts;

    let repairedMsg = '';
    if (enemy.isBonus) {
      // Buscar la estación más dañada (primero hp === 1, si no hp === 0)
      const damaged = stations.find((s) => s.hp === 1) || stations.find((s) => s.hp === 0);
      if (damaged) {
        damaged.hp = Math.min(damaged.maxHp, damaged.hp + 1);
        damaged.repairFlash = 0.9;
        repairedMsg = ' • ★ ¡Estación reparada!';
        addFloatingText(damaged.x, damaged.y - 34, '★ ¡ESTACIÓN REPARADA!', '#ffe600');
      }
      window.spaceAudio.playBonusRepair();
    } else {
      window.spaceAudio.playExplosion();
    }

    const speedLabel = enemy.isBonus
      ? '★ ¡NAVE BONUS!'
      : elapsedSec <= 2.0
      ? '⚡ ¡RELÁMPAGO!'
      : elapsedSec <= 4.0
      ? '🚀 ¡RÁPIDO!'
      : '✔ ¡BIEN!';

    createExplosion(enemy.x, enemy.y, enemy.isBonus ? '#ffe600' : '#00ffa3', 28);
    createExplosion(enemy.x, enemy.y, '#ffe600', 14);
    addFloatingText(enemy.x, enemy.y - 20, `${speedLabel} +${pts} (${elapsedSec.toFixed(1)}s)`, enemy.isBonus ? '#ffe600' : '#00ffa3');
    setCommanderMsg(`${speedLabel} ${q.a} ${q.op} ${q.b} = ${enemy.value} en ${elapsedSec.toFixed(1)}s (+${pts} pts)${repairedMsg}`, false);

    enemies = [];
    updateHUD();

    if (state.progress >= cfg.target) {
      handleLevelComplete();
    } else {
      generateQuestion();
    }
  }

  function handleDefenseBreach() {
    if (state.currentQuestion) {
      const q = state.currentQuestion;
      recordAttempt(q, false);
      const elapsedSec = state.questionStartTime > 0
        ? Math.max(0.1, (performance.now() - state.questionStartTime) / 1000)
        : 0;
      state.questionLog.push({
        tema: q.statLabel,
        op: `${q.a} ${q.op} ${q.b}`,
        answer: q.answer,
        timeSec: elapsedSec.toFixed(1),
        errors: state.currentWaveErrors + 1,
        status: 'No resuelta (impacto a base)',
      });
    }

    const aliveStations = stations.filter((s) => s.hp > 0);
    if (aliveStations.length > 0) {
      const targetStation = aliveStations[Math.floor(Math.random() * aliveStations.length)];
      targetStation.hp--;
      targetStation.hitFlash = 0.7;
      createExplosion(targetStation.x, targetStation.y - 12, '#ff4b4b', 26);
      const statusTxt = targetStation.hp === 0 ? '¡ESTACIÓN DESTRUIDA!' : '¡ESTACIÓN DAÑADA!';
      addFloatingText(targetStation.x, targetStation.y - 38, statusTxt, '#ff4b4b');
      setCommanderMsg(`¡Impacto enemigo! ${statusTxt} Destruye la respuesta antes de que lleguen a la base.`, true);
    }

    state.shields = stations.filter((s) => s.hp > 0).length;
    state.streak = 0;
    state.shakeTime = 0.38;
    window.spaceAudio.playPlayerHit();
    updateHUD();

    if (state.shields <= 0) {
      finishAndRecord('GAME_OVER');
    } else {
      generateQuestion();
    }
  }

  function handleLevelComplete() {
    window.spaceAudio.playLevelUp();
    const levels = getLevels();

    if (state.levelIndex >= levels.length - 1) {
      finishAndRecord('VICTORY');
      return;
    }

    state.mode = 'LEVEL_UP';
    const currentCfg = levels[state.levelIndex];
    const nextCfg = levels[state.levelIndex + 1];

    document.getElementById('lvlUpBadge').textContent = `NIVEL ${currentCfg.level} COMPLETADO`;
    document.getElementById('lvlUpTitle').textContent = `¡${currentCfg.name} Despejado!`;
    document.getElementById('lvlUpSubtitle').textContent =
      `Siguiente misión: ${nextCfg.name} (${nextCfg.target} operaciones, ${nextCfg.enemies} naves enemigas).`;
    document.getElementById('lvlUpScore').textContent = state.score.toLocaleString('es-MX');
    document.getElementById('lvlUpStreak').textContent = `x${state.maxStreak}`;
    document.getElementById('lvlUpNextTable').textContent = nextCfg.chip;

    // Botones para cambiar a otro tipo de misión conservando el avance
    const otherRow = document.getElementById('lvlUpOtherMissions');
    if (otherRow) {
      otherRow.innerHTML = '';
      const missionMeta = [
        { id: 'MUL', label: '✖ Multiplicaciones' },
        { id: 'ADD', label: '➕ Sumas (2-3C)' },
        { id: 'SUB', label: '➖ Restas (1-3C)' },
        { id: 'DIV', label: '➗ Divisiones' },
      ];
      missionMeta
        .filter((m) => m.id !== state.section)
        .forEach((m) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'hud-btn';
          btn.textContent = m.label;
          btn.addEventListener('click', () => {
            state.section = m.id;
            state.selectedStartLevel = 0;
            sectionTabs.forEach((t) => t.classList.toggle('active', t.dataset.section === m.id));
            renderLevelOptions();
            startLevel(0, false);
          });
          otherRow.appendChild(btn);
        });
    }

    modalLevelUp.classList.remove('hidden');
  }

  // Construye el reporte de calificaciones, lo muestra y lo envía a Google Sheets
  function finishAndRecord(reason) {
    state.mode = reason;
    hideAllModals();

    const levels = getLevels();
    const currentCfg = levels[state.levelIndex] || levels[0];
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    const tableGrades = {};
    for (let t = 2; t <= 12; t++) {
      const tStat = state.tableStats[String(t)];
      if (tStat && tStat.attempts > 0) {
        tableGrades[String(t)] = Math.round((tStat.correct / tStat.attempts) * 100) / 10;
      }
    }

    const sectionEntries = Object.values(state.sectionStats).filter((s) => s.attempts > 0);
    const detailParts = [];
    let sumGrades = 0;

    sectionEntries.forEach((s) => {
      const grade = Math.round((s.correct / s.attempts) * 100) / 10;
      sumGrades += grade;
      detailParts.push(`${s.label}:${s.correct}/${s.attempts}(${grade.toFixed(1)})`);
    });

    const overallGrade = sectionEntries.length > 0 ? Math.round((sumGrades / sectionEntries.length) * 10) / 10 : 0;
    const avgTime = state.responseTimes.length > 0
      ? (state.responseTimes.reduce((a, b) => a + b, 0) / state.responseTimes.length).toFixed(1)
      : '—';
    const studentNo = state.currentStudent ? state.currentStudent.no : '';
    const studentName = state.currentStudent ? state.currentStudent.name : 'Invitado';

    const report = {
      date: dateStr,
      time: timeStr,
      studentNo,
      studentName,
      levelReached: `${SECTIONS[state.section].title} Nv.${currentCfg.level}`,
      score: state.score,
      overallGrade,
      avgTime,
      correctHits: state.correctHits,
      sectionEntries,
      questionLog: [...state.questionLog],
      tableGrades,
      details: `Prom: ${avgTime}s` + (detailParts.length ? ` | ${detailParts.join(' | ')}` : ''),
    };
    state.lastReport = report;

    // Actualizar UI del modal
    const isVictory = reason === 'VICTORY';
    const isVoluntary = reason === 'VOLUNTARY_EXIT';

    document.getElementById('goBadge').textContent = isVictory
      ? 'MISIÓN GALÁCTICA CUMPLIDA'
      : isVoluntary
      ? 'PARTIDA FINALIZADA POR EL ALUMNO'
      : 'ESCUDOS AGOTADOS';

    document.getElementById('goTitle').textContent = isVictory
      ? '¡Maestro Jedi del Cálculo Mental!'
      : `Reporte de ${studentName}`;

    document.getElementById('goSubtitle').textContent = `${SECTIONS[state.section].title} (Nv.${currentCfg.level}) • Naves: ${state.correctHits} • Rapidez prom: ${avgTime}s`;
    document.getElementById('goGrade').textContent = overallGrade.toFixed(1);
    document.getElementById('goScore').textContent = state.score.toLocaleString('es-MX');
    document.getElementById('goDateTime').textContent = `${dateStr} ${timeStr}`;

    // Renderizar tarjetas por cada tabla o nivel contestado
    const grid = document.getElementById('goTableGrades');
    grid.innerHTML = '';
    if (sectionEntries.length === 0) {
      grid.innerHTML = '<div class="table-grade-chip" style="grid-column:1/-1;"><div class="t-name">SIN RESPUESTAS REGISTRADAS AÚN</div></div>';
    } else {
      sectionEntries.forEach((s) => {
        const grade = Math.round((s.correct / s.attempts) * 100) / 10;
        const chip = document.createElement('div');
        chip.className = 'table-grade-chip';
        chip.innerHTML = `
          <div class="t-name">${s.label}</div>
          <div class="t-score">${grade.toFixed(1)}</div>
          <div class="t-detail">${s.correct}/${s.attempts} aciertos</div>
        `;
        grid.appendChild(chip);
      });
    }

    btnRetryLevel.style.display = isVictory ? 'none' : 'inline-flex';
    modalGameOver.classList.remove('hidden');

    sendReportToSheet(report);
  }

  async function sendReportToSheet(report) {
    const syncEl = document.getElementById('goSyncStatus');
    const url = ((localStorage.getItem(STORAGE_SCRIPT_KEY) || '').trim()) || DEFAULT_PRIMARIA_SCRIPT_URL;

    if (!url) {
      syncEl.className = 'sync-status warn';
      syncEl.textContent = '⚠ Falta configurar la URL de Apps Script (botón "⚙ Configurar Hoja" en inicio). Puedes descargar el CSV mientras tanto.';
      return;
    }

    syncEl.className = 'sync-status';
    syncEl.textContent = '📡 Guardando calificación en Google Sheets...';

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(report),
      });
      syncEl.className = 'sync-status ok';
      syncEl.textContent = '✅ Calificación enviada a la hoja de cálculo de Google Sheets.';
    } catch {
      syncEl.className = 'sync-status warn';
      syncEl.textContent = '⚠ No se pudo conectar con Google Sheets. Usa "📥 Descargar CSV" para guardar el respaldo.';
    }
  }

  function getPerformanceLabel(grade) {
    if (grade >= 9.0) return 'Sobresaliente';
    if (grade >= 7.5) return 'Satisfactorio';
    if (grade >= 6.0) return 'En Proceso';
    return 'Requiere Apoyo';
  }

  function csvCell(val) {
    const s = String(val ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }

  function downloadCsvReport() {
    if (!state.lastReport) return;
    const r = state.lastReport;
    const lines = [];
    const pushRow = (arr) => lines.push(arr.map(csvCell).join(','));

    // Bloque 1: Encabezado y Resumen General del Alumno
    pushRow(['REPORTE DE EVALUACION DOCENTE - CALCULO MENTAL']);
    pushRow([]);
    pushRow(['DATOS GENERALES DEL ALUMNO']);
    pushRow(['No. de Lista', r.studentNo]);
    pushRow(['Nombre del Alumno', r.studentName]);
    pushRow(['Fecha', r.date]);
    pushRow(['Hora de Termino', r.time]);
    pushRow(['Ultima Mision / Nivel', r.levelReached]);
    pushRow(['Puntuacion Total', r.score]);
    pushRow(['Naves Destruidas (Aciertos)', r.correctHits]);
    pushRow(['Rapidez Promedio (seg)', r.avgTime]);
    pushRow(['Calificacion General (0-10)', r.overallGrade.toFixed(1)]);
    pushRow(['Nivel de Desempeno', getPerformanceLabel(r.overallGrade)]);
    pushRow([]);

    // Bloque 2: Desglose por Tema / Operación Trabajada
    pushRow(['DESGLOSE POR OPERACION Y NIVEL']);
    pushRow(['Tema / Nivel', 'Aciertos', 'Intentos Totales', 'Errores', 'Porcentaje de Logro', 'Calificacion (0-10)', 'Valoracion']);
    if (r.sectionEntries && r.sectionEntries.length > 0) {
      r.sectionEntries.forEach((s) => {
        const errors = Math.max(0, s.attempts - s.correct);
        const pct = s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0;
        const grade = s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) / 10 : 0;
        pushRow([s.label, s.correct, s.attempts, errors, `${pct}%`, grade.toFixed(1), getPerformanceLabel(grade)]);
      });
    } else {
      pushRow(['Sin operaciones contestadas', 0, 0, 0, '0%', '0.0', 'Sin datos']);
    }
    pushRow([]);

    // Bloque 3: Registro Detallado de cada Operación (para análisis de pensamiento matemático)
    pushRow(['HISTORIAL DETALLADO DE OPERACIONES']);
    pushRow(['#', 'Tema', 'Operacion', 'Resultado Correcto', 'Tiempo (seg)', 'Disparos Fallidos', 'Estado']);
    if (r.questionLog && r.questionLog.length > 0) {
      r.questionLog.forEach((q, idx) => {
        pushRow([idx + 1, q.tema, q.op, q.answer, q.timeSec, q.errors, q.status]);
      });
    } else {
      pushRow(['-', 'Sin operaciones registradas']);
    }

    const csv = '\uFEFF' + lines.join('\r\n') + '\r\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `reporte_${r.studentName.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function getActiveTheme() {
    if (state.selectedTheme === 'AUTO') {
      const pool = THEMES.slice(1);
      return pool[state.levelIndex % pool.length];
    }
    return THEMES.find((t) => t.id === state.selectedTheme) || THEMES[1];
  }

  // Renderizado en Canvas en alta densidad (HiDPI)
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.save();

    if (state.shakeTime > 0) {
      const mag = 7 * (state.shakeTime / 0.35);
      ctx.translate((Math.random() - 0.5) * mag * 2, (Math.random() - 0.5) * mag * 2);
    }

    const theme = getActiveTheme();
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    // Nebulosas sutiles de fondo según temática
    const neb1 = ctx.createRadialGradient(logicalWidth * 0.25, logicalHeight * 0.3, 10, logicalWidth * 0.25, logicalHeight * 0.3, logicalWidth * 0.45);
    neb1.addColorStop(0, theme.neb1);
    neb1.addColorStop(1, 'rgba(5, 8, 20, 0)');
    ctx.fillStyle = neb1;
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    const neb2 = ctx.createRadialGradient(logicalWidth * 0.78, logicalHeight * 0.65, 10, logicalWidth * 0.78, logicalHeight * 0.65, logicalWidth * 0.4);
    neb2.addColorStop(0, theme.neb2);
    neb2.addColorStop(1, 'rgba(5, 8, 20, 0)');
    ctx.fillStyle = neb2;
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    // Estrellas multicapa
    for (const s of stars) {
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.tint || '#e2f1ff';
      if (state.hyperspaceBoost > 0) {
        ctx.fillRect(s.x, s.y, s.size, s.size * 8);
      } else {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    const defY = logicalHeight - 54;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.16)';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(20, defY);
    ctx.lineTo(logicalWidth - 20, defY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Estaciones Espaciales Rebeldes en la base (estilo TuxMath)
    drawStations();

    // Obstáculos espaciales (asteroides)
    drawAsteroids();

    // Láseres con núcleo blanco brillante + aura neón
    for (const l of lasers) {
      ctx.save();
      const color = l.bounced ? '#ff4b4b' : '#00ffa3';
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 16;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(l.x, l.y);
      ctx.lineTo(l.x - l.vx * 0.028, l.y - l.vy * 0.028);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(l.x, l.y);
      ctx.lineTo(l.x - l.vx * 0.022, l.y - l.vy * 0.022);
      ctx.stroke();
      ctx.restore();
    }

    for (const e of enemies) {
      drawEnemyShip(e);
    }

    if (state.mode === 'PLAYING' || state.mode === 'PAUSED' || state.mode === 'LEVEL_UP') {
      drawPlayerShip(player.x, player.y);
    }

    for (const p of particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (const ft of floatingTexts) {
      const alpha = Math.max(0, ft.life / ft.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = '700 15px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 10;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore();
  }

  function drawStations() {
    for (const st of stations) {
      ctx.save();
      ctx.translate(st.x, st.y);

      if (st.hp <= 0) {
        // Estación destruida (ruinas oscuras)
        ctx.fillStyle = '#141926';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-32, 16);
        ctx.lineTo(-22, 4);
        ctx.lineTo(-8, 10);
        ctx.lineTo(6, 2);
        ctx.lineTo(24, 9);
        ctx.lineTo(32, 16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        continue;
      }

      const isDamaged = st.hp === 1;
      const accent = st.repairFlash > 0 ? '#ffe600' : st.hitFlash > 0 ? '#ff4b4b' : isDamaged ? '#ff8a00' : '#00f0ff';

      // Cúpula de energía protectora
      ctx.strokeStyle = accent;
      ctx.fillStyle = isDamaged ? 'rgba(255, 138, 0, 0.14)' : 'rgba(0, 240, 255, 0.14)';
      ctx.shadowColor = accent;
      ctx.shadowBlur = st.repairFlash > 0 ? 22 : 12;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 12, 34, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Base metálica de la estación
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-36, 16);
      ctx.lineTo(-26, 2);
      ctx.lineTo(26, 2);
      ctx.lineTo(36, 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Antena central y luz de estado
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.lineTo(0, -10);
      ctx.stroke();

      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(0, -12, 3, 0, Math.PI * 2);
      ctx.fill();

      // Grietas visuales si está dañada
      if (isDamaged) {
        ctx.strokeStyle = '#ff4b4b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-12, -12);
        ctx.lineTo(-4, -2);
        ctx.lineTo(-9, 6);
        ctx.moveTo(14, -10);
        ctx.lineTo(8, 1);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  function drawEnemyShip(e) {
    ctx.save();
    ctx.translate(e.x, e.y);

    // Paneles solares estilo TIE Interceptor con gradiente metálico (o dorado si es Nave Bonus)
    const wingGrad = ctx.createLinearGradient(-34, -22, -18, 22);
    wingGrad.addColorStop(0, e.isBonus ? '#422006' : '#1e293b');
    wingGrad.addColorStop(0.5, e.isBonus ? '#1c1917' : '#0f172a');
    wingGrad.addColorStop(1, e.isBonus ? '#713f12' : '#334155');

    ctx.strokeStyle = e.isBonus ? '#ffe600' : '#7dd3fc';
    ctx.fillStyle = wingGrad;
    ctx.lineWidth = e.isBonus ? 2.2 : 1.6;

    // Ala izquierda
    ctx.beginPath();
    ctx.moveTo(-30, -22);
    ctx.lineTo(-37, 0);
    ctx.lineTo(-30, 22);
    ctx.lineTo(-21, 15);
    ctx.lineTo(-21, -15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ala derecha
    ctx.beginPath();
    ctx.moveTo(30, -22);
    ctx.lineTo(37, 0);
    ctx.lineTo(30, 22);
    ctx.lineTo(21, 15);
    ctx.lineTo(21, -15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Líneas internas de circuitos en alas
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-29, -12);
    ctx.lineTo(-24, -12);
    ctx.moveTo(-29, 12);
    ctx.lineTo(-24, 12);
    ctx.moveTo(29, -12);
    ctx.lineTo(24, -12);
    ctx.moveTo(29, 12);
    ctx.lineTo(24, 12);
    ctx.stroke();

    // Eje conector
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-21, 0);
    ctx.lineTo(21, 0);
    ctx.stroke();

    // Cabina esférica con gradiente radial
    const coreGrad = ctx.createRadialGradient(-5, -6, 3, 0, 0, 22);
    coreGrad.addColorStop(0, e.isBonus ? '#854d0e' : '#334155');
    coreGrad.addColorStop(1, e.isBonus ? '#1c1917' : '#0b1120');
    ctx.fillStyle = coreGrad;
    ctx.strokeStyle = e.isBonus ? '#ffe600' : '#00f0ff';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = e.isBonus ? 'rgba(255, 230, 0, 0.7)' : 'rgba(0, 240, 255, 0.45)';
    ctx.shadowBlur = e.isBonus ? 16 : 10;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (e.isBonus) {
      ctx.fillStyle = '#ffe600';
      ctx.font = '700 10px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('★ BONUS', 0, -30);
    }

    // Número de respuesta nítido
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 20px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = e.isBonus ? '#ffe600' : '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.fillText(String(e.value), 0, 1);
    ctx.shadowBlur = 0;

    if (e.shieldTimer > 0) {
      const alpha = Math.min(1, e.shieldTimer / 0.3);
      ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
      ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.22})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(0, 0, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawAsteroids() {
    for (const ast of asteroids) {
      ctx.save();
      ctx.translate(ast.x, ast.y);
      ctx.rotate(ast.rot);

      if (ast.kind === 'crystal') {
        ctx.fillStyle = 'rgba(14, 116, 144, 0.72)';
        ctx.strokeStyle = '#67e8f9';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
      } else if (ast.kind === 'magma') {
        ctx.fillStyle = '#291512';
        ctx.strokeStyle = '#f97316';
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 10;
      } else if (ast.kind === 'iron') {
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#cbd5e1';
      } else {
        ctx.fillStyle = '#292524';
        ctx.strokeStyle = '#a8a29e';
      }

      ctx.lineWidth = 2;
      ctx.beginPath();
      ast.pts.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (ast.kind === 'magma') {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-ast.radius * 0.4, -ast.radius * 0.2);
        ctx.lineTo(0, 2);
        ctx.lineTo(ast.radius * 0.35, -ast.radius * 0.3);
        ctx.stroke();
      } else if (ast.kind === 'crystal') {
        ctx.strokeStyle = 'rgba(207, 250, 254, 0.65)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -ast.radius * 0.8);
        ctx.lineTo(0, ast.radius * 0.8);
        ctx.moveTo(-ast.radius * 0.6, 0);
        ctx.lineTo(ast.radius * 0.6, 0);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.arc(-ast.radius * 0.25, -ast.radius * 0.15, ast.radius * 0.22, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function getShipColors() {
    const base = SHIPS.find((s) => s.id === state.selectedShip) || SHIPS[0];
    return {
      ship: base,
      color: state.shipPrimaryColor || base.color,
      accent: state.shipAccentColor || base.accent,
    };
  }

  function drawPlayerShip(x, y) {
    const { ship, color, accent } = getShipColors();
    drawShipModel(ctx, x, y, ship.id, color, accent, 1);
  }

  function drawShipModel(targetCtx, x, y, shipId, primaryColor, accentColor, scale = 1) {
    targetCtx.save();
    targetCtx.translate(x, y);
    targetCtx.scale(scale, scale);

    // Estelas de propulsores
    const flicker = 12 + Math.random() * 9;
    const thrustGrad = targetCtx.createLinearGradient(0, 16, 0, 24 + flicker);
    thrustGrad.addColorStop(0, '#ffffff');
    thrustGrad.addColorStop(0.35, primaryColor);
    thrustGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    targetCtx.fillStyle = thrustGrad;
    targetCtx.shadowColor = primaryColor;
    targetCtx.shadowBlur = 16;
    targetCtx.beginPath();
    targetCtx.ellipse(-12, 24, 4.2, flicker, 0, 0, Math.PI * 2);
    targetCtx.ellipse(12, 24, 4.2, flicker, 0, 0, Math.PI * 2);
    targetCtx.fill();
    targetCtx.shadowBlur = 0;

    const bodyGrad = targetCtx.createLinearGradient(0, -28, 0, 22);
    bodyGrad.addColorStop(0, '#1e293b');
    bodyGrad.addColorStop(1, '#090f1f');
    targetCtx.strokeStyle = primaryColor;
    targetCtx.fillStyle = bodyGrad;
    targetCtx.lineWidth = 2;

    if (shipId === 'falcon') {
      targetCtx.beginPath();
      targetCtx.arc(0, 2, 22, 0, Math.PI * 2);
      targetCtx.fill();
      targetCtx.stroke();
      targetCtx.beginPath();
      targetCtx.moveTo(-12, -16);
      targetCtx.lineTo(-8, -30);
      targetCtx.lineTo(-2, -18);
      targetCtx.moveTo(12, -16);
      targetCtx.lineTo(8, -30);
      targetCtx.lineTo(2, -18);
      targetCtx.stroke();
    } else if (shipId === 'phoenix') {
      targetCtx.beginPath();
      targetCtx.moveTo(0, -24);
      targetCtx.lineTo(10, -2);
      targetCtx.lineTo(30, -14);
      targetCtx.lineTo(26, 16);
      targetCtx.lineTo(8, 20);
      targetCtx.lineTo(-8, 20);
      targetCtx.lineTo(-26, 16);
      targetCtx.lineTo(-30, -14);
      targetCtx.lineTo(-10, -2);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();
    } else if (shipId === 'emerald') {
      targetCtx.beginPath();
      targetCtx.moveTo(-8, -28);
      targetCtx.lineTo(-3, -10);
      targetCtx.lineTo(3, -10);
      targetCtx.lineTo(8, -28);
      targetCtx.lineTo(14, -4);
      targetCtx.lineTo(34, 14);
      targetCtx.lineTo(16, 20);
      targetCtx.lineTo(-16, 20);
      targetCtx.lineTo(-34, 14);
      targetCtx.lineTo(-14, -4);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();
    } else if (shipId === 'specter') {
      targetCtx.beginPath();
      targetCtx.moveTo(0, -30);
      targetCtx.lineTo(34, 18);
      targetCtx.lineTo(10, 12);
      targetCtx.lineTo(0, 22);
      targetCtx.lineTo(-10, 12);
      targetCtx.lineTo(-34, 18);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();
    } else if (shipId === 'ywing') {
      targetCtx.beginPath();
      targetCtx.moveTo(0, -28);
      targetCtx.lineTo(8, 12);
      targetCtx.lineTo(-8, 12);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();
      targetCtx.fillRect(-26, -4, 10, 26);
      targetCtx.strokeRect(-26, -4, 10, 26);
      targetCtx.fillRect(16, -4, 10, 26);
      targetCtx.strokeRect(16, -4, 10, 26);
    } else if (shipId === 'jedi') {
      targetCtx.strokeStyle = accentColor;
      targetCtx.lineWidth = 1.4;
      targetCtx.beginPath();
      targetCtx.arc(0, 4, 26, 0, Math.PI * 2);
      targetCtx.stroke();
      targetCtx.strokeStyle = primaryColor;
      targetCtx.lineWidth = 2;
      targetCtx.beginPath();
      targetCtx.moveTo(0, -30);
      targetCtx.lineTo(20, 18);
      targetCtx.lineTo(0, 10);
      targetCtx.lineTo(-20, 18);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();
    } else {
      targetCtx.strokeStyle = accentColor;
      targetCtx.lineWidth = 2.4;
      targetCtx.beginPath();
      targetCtx.moveTo(-31, 14);
      targetCtx.lineTo(-31, 0);
      targetCtx.moveTo(31, 14);
      targetCtx.lineTo(31, 0);
      targetCtx.stroke();

      targetCtx.strokeStyle = primaryColor;
      targetCtx.lineWidth = 2;
      targetCtx.beginPath();
      targetCtx.moveTo(0, -28);
      targetCtx.lineTo(10, -4);
      targetCtx.lineTo(33, 12);
      targetCtx.lineTo(31, 19);
      targetCtx.lineTo(11, 12);
      targetCtx.lineTo(7, 22);
      targetCtx.lineTo(-7, 22);
      targetCtx.lineTo(-11, 12);
      targetCtx.lineTo(-31, 19);
      targetCtx.lineTo(-33, 12);
      targetCtx.lineTo(-10, -4);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.stroke();
    }

    targetCtx.fillStyle = accentColor;
    targetCtx.shadowColor = primaryColor;
    targetCtx.shadowBlur = 8;
    targetCtx.beginPath();
    targetCtx.moveTo(0, -14);
    targetCtx.lineTo(5, 2);
    targetCtx.lineTo(-5, 2);
    targetCtx.closePath();
    targetCtx.fill();

    targetCtx.restore();
  }

  function renderShipPreview() {
    if (!shipPreviewCanvas || (modalHangar && modalHangar.classList.contains('hidden'))) return;
    const pCtx = shipPreviewCanvas.getContext('2d');
    const w = shipPreviewCanvas.width;
    const h = shipPreviewCanvas.height;
    pCtx.clearRect(0, 0, w, h);

    const { ship, color, accent } = getShipColors();
    if (previewShipName) previewShipName.textContent = ship.name;
    drawShipModel(pCtx, w / 2, h / 2 - 4, ship.id, color, accent, 1.45);
  }

  let lastTime = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    update(dt);
    draw();
    renderShipPreview();
    requestAnimationFrame(loop);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  document.addEventListener('fullscreenchange', () => {
    const isFs = Boolean(document.fullscreenElement);
    btnFullscreen.textContent = isFs ? '⛶ Salir' : '⛶ Pantalla Completa';
    setTimeout(resizeCanvas, 60);
  });

  window.addEventListener('keydown', (e) => {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT')) {
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      if (state.mode === 'PLAYING') {
        e.preventDefault();
        keys.shoot = true;
      }
    }
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
      if (state.mode === 'PLAYING') pauseGame();
      else if (state.mode === 'PAUSED') resumeGame();
    }
    if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.shoot = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (state.mode !== 'PLAYING') return;
    const rect = canvas.getBoundingClientRect();
    player.targetX = e.clientX - rect.left;
  });

  canvas.addEventListener('mousedown', (e) => {
    if (state.mode !== 'PLAYING') return;
    const rect = canvas.getBoundingClientRect();
    player.x = Math.max(42, Math.min(logicalWidth - 42, e.clientX - rect.left));
    player.targetX = player.x;
    fireLaser();
  });

  canvas.addEventListener('touchstart', (e) => {
    if (state.mode !== 'PLAYING') return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    player.x = Math.max(42, Math.min(logicalWidth - 42, touch.clientX - rect.left));
    player.targetX = player.x;
    fireLaser();
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    if (state.mode !== 'PLAYING') return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    player.targetX = touch.clientX - rect.left;
  }, { passive: false });

  function pauseGame() {
    if (state.mode !== 'PLAYING') return;
    state.pauseStartTime = performance.now();
    state.mode = 'PAUSED';
    modalPause.classList.remove('hidden');
  }

  function resumeGame() {
    if (state.mode !== 'PAUSED') return;
    if (state.pauseStartTime > 0 && state.questionStartTime > 0) {
      state.questionStartTime += performance.now() - state.pauseStartTime;
    }
    state.pauseStartTime = 0;
    state.mode = 'PLAYING';
    modalPause.classList.add('hidden');
  }

  // Botones UI
  btnStartGame.addEventListener('click', () => {
    if (!ensureStudentSelected()) return;
    window.spaceAudio.init();
    startLevel(state.selectedStartLevel, true);
  });

  btnStartFullscreen.addEventListener('click', () => {
    if (!ensureStudentSelected()) return;
    window.spaceAudio.init();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    startLevel(state.selectedStartLevel, true);
  });

  btnNextLevel.addEventListener('click', () => startLevel(state.levelIndex + 1, false));
  btnExitFromLevelUp.addEventListener('click', () => finishAndRecord('VOLUNTARY_EXIT'));

  btnExitSave.addEventListener('click', () => {
    if (state.mode === 'START') return;
    finishAndRecord('VOLUNTARY_EXIT');
  });

  btnPause.addEventListener('click', () => {
    if (state.mode === 'PLAYING') pauseGame();
    else if (state.mode === 'PAUSED') resumeGame();
  });

  btnResume.addEventListener('click', resumeGame);
  btnExitFromPause.addEventListener('click', () => finishAndRecord('VOLUNTARY_EXIT'));
  btnRestartFromPause.addEventListener('click', () => startLevel(0, true));

  btnRetryLevel.addEventListener('click', () => {
    state.shields = 4;
    initStations();
    startLevel(state.levelIndex, false);
  });

  btnRestartAll.addEventListener('click', () => {
    hideAllModals();
    state.mode = 'START';
    modalStart.classList.remove('hidden');
  });

  btnDownloadCsv.addEventListener('click', downloadCsvReport);

  function initHangar() {
    if (!hangarShipsGrid || !hangarThemesRow) return;
    hangarShipsGrid.innerHTML = '';
    SHIPS.forEach((ship) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'ship-card' + (ship.id === state.selectedShip ? ' active' : '');
      card.innerHTML = `
        <span class="ship-dot" style="background:${ship.color}; box-shadow:0 0 10px ${ship.color};"></span>
        <span class="ship-name">${ship.name}</span>
        <span class="ship-desc">${ship.desc}</span>
      `;
      card.addEventListener('click', () => {
        state.selectedShip = ship.id;
        state.shipPrimaryColor = '';
        state.shipAccentColor = '';
        localStorage.setItem('galactic_ship', ship.id);
        localStorage.removeItem('galactic_ship_primary');
        localStorage.removeItem('galactic_ship_accent');
        hangarShipsGrid.querySelectorAll('.ship-card').forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        syncColorInputs();
      });
      hangarShipsGrid.appendChild(card);
    });

    function syncColorInputs() {
      const { color, accent } = getShipColors();
      if (inputShipPrimary) inputShipPrimary.value = color;
      if (inputShipAccent) inputShipAccent.value = accent;
      renderShipPreview();
    }
    syncColorInputs();

    if (inputShipPrimary) {
      inputShipPrimary.oninput = (e) => {
        state.shipPrimaryColor = e.target.value;
        localStorage.setItem('galactic_ship_primary', state.shipPrimaryColor);
        renderShipPreview();
      };
    }

    if (inputShipAccent) {
      inputShipAccent.oninput = (e) => {
        state.shipAccentColor = e.target.value;
        localStorage.setItem('galactic_ship_accent', state.shipAccentColor);
        renderShipPreview();
      };
    }

    if (btnResetShipColors) {
      btnResetShipColors.onclick = () => {
        state.shipPrimaryColor = '';
        state.shipAccentColor = '';
        localStorage.removeItem('galactic_ship_primary');
        localStorage.removeItem('galactic_ship_accent');
        syncColorInputs();
      };
    }

    hangarThemesRow.innerHTML = '';
    THEMES.forEach((th) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'lvl-chip' + (th.id === state.selectedTheme ? ' active' : '');
      chip.textContent = th.name;
      chip.addEventListener('click', () => {
        state.selectedTheme = th.id;
        localStorage.setItem('galactic_theme', th.id);
        hangarThemesRow.querySelectorAll('.lvl-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
      });
      hangarThemesRow.appendChild(chip);
    });
  }

  let hangarReturnMode = 'START';
  function openHangar() {
    hangarReturnMode = state.mode;
    if (state.mode === 'PLAYING') {
      state.pauseStartTime = performance.now();
      state.mode = 'PAUSED';
    }
    initHangar();
    if (modalHangar) modalHangar.classList.remove('hidden');
  }

  if (btnOpenHangar) btnOpenHangar.addEventListener('click', openHangar);
  if (btnHudHangar) btnHudHangar.addEventListener('click', openHangar);
  if (btnCloseHangar) {
    btnCloseHangar.addEventListener('click', () => {
      if (modalHangar) modalHangar.classList.add('hidden');
      if (hangarReturnMode === 'PLAYING') {
        if (state.pauseStartTime > 0 && state.questionStartTime > 0) {
          state.questionStartTime += performance.now() - state.pauseStartTime;
        }
        state.pauseStartTime = 0;
        state.mode = 'PLAYING';
      }
    });
  }

  btnConfigSheet.addEventListener('click', () => {
    inputScriptUrl.value = localStorage.getItem(STORAGE_SCRIPT_KEY) || '';
    modalConfig.classList.remove('hidden');
  });

  btnSaveConfig.addEventListener('click', () => {
    localStorage.setItem(STORAGE_SCRIPT_KEY, inputScriptUrl.value.trim());
    modalConfig.classList.add('hidden');
  });

  btnCloseConfig.addEventListener('click', () => modalConfig.classList.add('hidden'));

  btnSound.addEventListener('click', () => {
    const muted = window.spaceAudio.toggleMute();
    btnSound.textContent = muted ? '🔇 Silencio' : '🔊 Sonido';
  });

  btnFullscreen.addEventListener('click', toggleFullscreen);
  window.addEventListener('resize', resizeCanvas);

  // Arranque
  loadStudents();
  initLevelSelectors();
  initHangar();
  resizeCanvas();
  updateHUD();
  requestAnimationFrame(loop);
})();
