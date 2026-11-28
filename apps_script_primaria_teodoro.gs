/**
 * Google Apps Script — Base de Datos Maestra de Primaria Teodoro Olivares (3.º A)
 * Almacena y consolida los resultados de:
 *   1) Guerra Galáctica de las Tablas (Sumas, Restas, Multiplicaciones, Divisiones)
 *   2) FraccionesPairs (Misiones Contrarreloj de Fracciones)
 *
 * INSTRUCCIONES PARA EL DOCENTE (UNA SOLA VEZ):
 * 1. Abre https://script.google.com y crea un proyecto nuevo (ej. "PrimariaTeodoro_BaseMaestra").
 * 2. Pega TODO este código y guarda (Ctrl + S).
 * 3. En el menú de funciones arriba, elige `inicializarBaseDeDatosPrimaria` y haz clic en "Ejecutar".
 *    - Se creará automáticamente el Google Sheet "Primaria_Teodoro_3A_Base_Datos_Maestra" en tu Drive
 *      con los 41 alumnos de 3.º A precargados y las pestañas de historial.
 * 4. Haz clic en Implementar -> Nueva implementación -> Tipo: "Aplicación web".
 *    - Ejecutar como: "Yo"
 *    - Quién tiene acceso: "Cualquier persona"
 * 5. Copia la URL terminada en /exec y pégala en el botón "⚙ Configurar" de ambos videojuegos
 *    (o pégala en DEFAULT_PRIMARIA_SCRIPT_URL en el código del sitio).
 */

var MASTER_PRIMARIA_DB_ID = '1Exi6YOT1iVp7F-v7lEggqhO-LH9TWYeh86zyccMRwT4';
var SOURCE_ROSTER_SHEET_ID = '1zXwryfrHm9sgDvmAmGz_OpP6PVxtH-3g2vtk0ib6W2A';

var PRIMARIA_SHEETS = {
  RESUMEN: 'ALUMNOS_3A_RESUMEN',
  OPERACIONES: 'HISTORIAL_OPERACIONES',
  FRACCIONES: 'HISTORIAL_FRACCIONES',
  LOG: 'REGISTRO_LOG'
};

var RESUMEN_HEADERS = [
  'no_lista',
  'grupo',
  'nombre',
  'operaciones_intentos',
  'operaciones_ultimo_nivel',
  'operaciones_ultima_calif',
  'operaciones_promedio',
  'operaciones_mejor_calif',
  'fracciones_misiones',
  'fracciones_ultima_mision',
  'fracciones_ultima_calif',
  'fracciones_promedio',
  'fracciones_mejor_calif',
  'promedio_general',
  'nivel_desempeno',
  'ultima_actividad'
];

var OPERACIONES_HEADERS = [
  'fecha',
  'hora',
  'no_lista',
  'nombre',
  'mision_nivel',
  'calificacion',
  'puntaje',
  'aciertos',
  'tiempo_promedio_seg',
  'detalles',
  'registrado_en'
];

var FRACCIONES_HEADERS = [
  'fecha',
  'hora',
  'no_lista',
  'nombre',
  'mision',
  'calificacion',
  'aciertos',
  'errores',
  'tiempo_agotado',
  'total_preguntas',
  'registrado_en'
];

var LOG_HEADERS = ['fecha_hora', 'evento', 'alumno', 'detalle'];

var FALLBACK_3A_STUDENTS = [
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

function normText_(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim();
}

function getMasterPrimariaId_() {
  if (MASTER_PRIMARIA_DB_ID && String(MASTER_PRIMARIA_DB_ID).trim() !== '') {
    return String(MASTER_PRIMARIA_DB_ID).trim();
  }
  var prop = PropertiesService.getScriptProperties().getProperty('MASTER_PRIMARIA_DB_ID');
  return prop ? String(prop).trim() : '';
}

function ensurePrimariaSheet_(ss, name, headers, color) {
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.getRange(1, 1, 1, headers.length)
      .setBackground(color || '#065f46')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function loadSource3ARoster_() {
  try {
    var src = SpreadsheetApp.openById(SOURCE_ROSTER_SHEET_ID);
    var sh = src.getSheets()[0];
    var vals = sh.getDataRange().getValues();
    var list = [];
    for (var i = 1; i < vals.length; i++) {
      var no = Number(vals[i][0]);
      var name = String(vals[i][1] || '').trim();
      if (name) list.push({ no: isFinite(no) && no > 0 ? no : i, name: name });
    }
    if (list.length > 0) return list;
  } catch (_) {}
  return FALLBACK_3A_STUDENTS;
}

function performanceLabel_(grade) {
  if (grade === '' || grade === null || grade === undefined) return '';
  var g = Number(grade);
  if (!isFinite(g)) return '';
  if (g >= 9.0) return 'Sobresaliente';
  if (g >= 7.5) return 'Satisfactorio';
  if (g >= 6.0) return 'En Proceso';
  return 'Requiere Apoyo';
}

/**
 * Crea el Google Sheet Maestro de Primaria (3.º A) y precarga los 41 alumnos.
 * Ejecutar UNA SOLA VEZ desde el editor de Apps Script.
 */
function inicializarBaseDeDatosPrimaria() {
  var dbId = getMasterPrimariaId_();
  var ss;
  if (dbId) {
    ss = SpreadsheetApp.openById(dbId);
  } else {
    ss = SpreadsheetApp.create('Primaria_Teodoro_3A_Base_Datos_Maestra');
    dbId = ss.getId();
    PropertiesService.getScriptProperties().setProperty('MASTER_PRIMARIA_DB_ID', dbId);
    var first = ss.getSheets()[0];
    if (first) first.setName(PRIMARIA_SHEETS.RESUMEN);
  }

  var shRes = ensurePrimariaSheet_(ss, PRIMARIA_SHEETS.RESUMEN, RESUMEN_HEADERS, '#065f46');
  ensurePrimariaSheet_(ss, PRIMARIA_SHEETS.OPERACIONES, OPERACIONES_HEADERS, '#0284c7');
  ensurePrimariaSheet_(ss, PRIMARIA_SHEETS.FRACCIONES, FRACCIONES_HEADERS, '#7c3aed');
  ensurePrimariaSheet_(ss, PRIMARIA_SHEETS.LOG, LOG_HEADERS, '#334155');

  if (shRes.getLastRow() <= 1) {
    var roster = loadSource3ARoster_();
    var rows = roster.map(function(st) {
      return [st.no, '3A', st.name, 0, '', '', '', '', 0, '', '', '', '', '', '', ''];
    });
    shRes.getRange(2, 1, rows.length, RESUMEN_HEADERS.length).setValues(rows);
  }

  Logger.log('Base Maestra Primaria lista. ID: ' + dbId);
  Logger.log('URL: ' + ss.getUrl());
  return { ok: true, masterDbId: dbId, url: ss.getUrl() };
}

function actualizarResumenAlumno_(ss, studentNo, studentName) {
  var shRes = ensurePrimariaSheet_(ss, PRIMARIA_SHEETS.RESUMEN, RESUMEN_HEADERS, '#065f46');
  var shOp = ensurePrimariaSheet_(ss, PRIMARIA_SHEETS.OPERACIONES, OPERACIONES_HEADERS, '#0284c7');
  var shFr = ensurePrimariaSheet_(ss, PRIMARIA_SHEETS.FRACCIONES, FRACCIONES_HEADERS, '#7c3aed');

  var targetNorm = normText_(studentName);
  var resVals = shRes.getDataRange().getValues();
  var rowIdx = -1;
  for (var i = 1; i < resVals.length; i++) {
    var rNo = Number(resVals[i][0]);
    var rNorm = normText_(resVals[i][2]);
    if ((studentNo && rNo === Number(studentNo)) || (targetNorm && rNorm === targetNorm)) {
      rowIdx = i + 1;
      break;
    }
  }
  if (rowIdx === -1) {
    shRes.appendRow([studentNo || '', '3A', studentName, 0, '', '', '', '', 0, '', '', '', '', '', '', '']);
    rowIdx = shRes.getLastRow();
  }

  function matchStudent_(rowNo, rowName) {
    if (studentNo && Number(rowNo) === Number(studentNo)) return true;
    return targetNorm && normText_(rowName) === targetNorm;
  }

  // Estadísticas de Operaciones
  var opVals = shOp.getDataRange().getValues();
  var opGrades = [];
  var opLastLevel = '';
  var opLastGrade = '';
  for (var oi = 1; oi < opVals.length; oi++) {
    if (matchStudent_(opVals[oi][2], opVals[oi][3])) {
      var g = Number(opVals[oi][5]);
      if (isFinite(g)) opGrades.push(g);
      opLastLevel = String(opVals[oi][4] || '');
      opLastGrade = isFinite(g) ? g : '';
    }
  }
  var opAvg = opGrades.length ? Math.round((opGrades.reduce(function(a, b) { return a + b; }, 0) / opGrades.length) * 10) / 10 : '';
  var opBest = opGrades.length ? Math.max.apply(null, opGrades) : '';

  // Estadísticas de Fracciones
  var frVals = shFr.getDataRange().getValues();
  var frGrades = [];
  var frLastMission = '';
  var frLastGrade = '';
  for (var fi = 1; fi < frVals.length; fi++) {
    if (matchStudent_(frVals[fi][2], frVals[fi][3])) {
      var fg = Number(frVals[fi][5]);
      if (isFinite(fg)) frGrades.push(fg);
      frLastMission = String(frVals[fi][4] || '');
      frLastGrade = isFinite(fg) ? fg : '';
    }
  }
  var frAvg = frGrades.length ? Math.round((frGrades.reduce(function(a, b) { return a + b; }, 0) / frGrades.length) * 10) / 10 : '';
  var frBest = frGrades.length ? Math.max.apply(null, frGrades) : '';

  var bothAvgs = [];
  if (opAvg !== '') bothAvgs.push(opAvg);
  if (frAvg !== '') bothAvgs.push(frAvg);
  var generalAvg = bothAvgs.length ? Math.round((bothAvgs.reduce(function(a, b) { return a + b; }, 0) / bothAvgs.length) * 10) / 10 : '';
  var nowStr = new Date().toLocaleString('es-MX');

  shRes.getRange(rowIdx, 4, 1, 13).setValues([[
    opGrades.length,
    opLastLevel,
    opLastGrade,
    opAvg,
    opBest,
    frGrades.length,
    frLastMission,
    frLastGrade,
    frAvg,
    frBest,
    generalAvg,
    performanceLabel_(generalAvg),
    nowStr
  ]]);
}

function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  var action = params.action ? String(params.action).toLowerCase() : 'ping';
  var dbId = getMasterPrimariaId_();

  if (action === 'ping') {
    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      service: 'Primaria Teodoro Olivares 3A - Base Maestra',
      masterDbConfigured: Boolean(dbId),
      updatedAt: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'resumen' && dbId) {
    var ss = SpreadsheetApp.openById(dbId);
    var sh = ensurePrimariaSheet_(ss, PRIMARIA_SHEETS.RESUMEN, RESUMEN_HEADERS, '#065f46');
    var rows = sh.getDataRange().getValues();
    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      headers: rows[0] || [],
      rows: rows.slice(1)
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Acción no válida o base no inicializada.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var rawBody = (e && e.postData && e.postData.contents) ? e.postData.contents : (e && e.parameter && e.parameter.payload ? e.parameter.payload : '');
    if (!rawBody) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Solicitud vacía.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var payload = JSON.parse(rawBody);
    var dbId = getMasterPrimariaId_();
    if (!dbId) {
      var initRes = inicializarBaseDeDatosPrimaria();
      dbId = initRes.masterDbId;
    }

    var ss = SpreadsheetApp.openById(dbId);
    var nowIso = new Date().toISOString();
    var nowDate = payload.date || new Date().toLocaleDateString('es-MX');
    var nowTime = payload.time || new Date().toLocaleTimeString('es-MX');
    var stuNo = payload.studentNo || '';
    var stuName = String(payload.studentName || 'Invitado').trim();

    if (payload.game === 'fracciones') {
      var shFr = ensurePrimariaSheet_(ss, PRIMARIA_SHEETS.FRACCIONES, FRACCIONES_HEADERS, '#7c3aed');
      shFr.appendRow([
        nowDate,
        nowTime,
        stuNo,
        stuName,
        payload.missionTitle || ('Misión ' + (payload.missionId || '')),
        Number(payload.grade),
        Number(payload.correctHits) || 0,
        Number(payload.errorCount) || 0,
        Number(payload.timeoutCount) || 0,
        Number(payload.totalQuestions) || 20,
        nowIso
      ]);
      actualizarResumenAlumno_(ss, stuNo, stuName);
    } else {
      var shOp = ensurePrimariaSheet_(ss, PRIMARIA_SHEETS.OPERACIONES, OPERACIONES_HEADERS, '#0284c7');
      shOp.appendRow([
        nowDate,
        nowTime,
        stuNo,
        stuName,
        payload.levelReached || '',
        Number(payload.overallGrade),
        Number(payload.score) || 0,
        Number(payload.correctHits) || 0,
        payload.avgTime || '',
        payload.details || '',
        nowIso
      ]);
      actualizarResumenAlumno_(ss, stuNo, stuName);
    }

    var shLog = ensurePrimariaSheet_(ss, PRIMARIA_SHEETS.LOG, LOG_HEADERS, '#334155');
    shLog.insertRowAfter(1);
    shLog.getRange(2, 1, 1, LOG_HEADERS.length).setValues([[
      nowIso,
      payload.game === 'fracciones' ? 'Misión Fracciones' : 'Misión Operaciones',
      (stuNo ? '#' + stuNo + ' ' : '') + stuName,
      'Calificación: ' + (payload.game === 'fracciones' ? payload.grade : payload.overallGrade)
    ]]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true, masterDbId: dbId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
