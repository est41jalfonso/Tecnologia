/**
 * Google Apps Script — Base de Datos Maestra Unificada, Auditoría, API Rápida y Guardado de PDF en Drive (EST 41)
 *
 * INSTRUCCIONES PARA EL DOCENTE (UNA SOLA VEZ):
 * 1. Abre https://script.google.com y abre tu proyecto actual (o crea uno nuevo).
 * 2. Pega TODO este código y guarda (Ctrl + S).
 * 3. En el menú superior de funciones, selecciona `inicializarBaseDeDatosMaestra` y haz clic en "Ejecutar".
 *    - Esto creará automáticamente el libro "EST41_Base_Datos_Maestra" en tu Google Drive con las pestañas
 *      ALUMNOS_DB, GRUPOS_META y SINCRONIZACION_LOG, y hará la primera carga unificada de evalId + dashId.
 *    - (Opcional) Si ya tienes un Google Sheet creado para la base maestra, pega su ID en MASTER_DB_ID abajo.
 * 4. Selecciona `instalarSincronizacionAutomatica` y haz clic en "Ejecutar" para que se actualice cada 15 min.
 * 5. Haz clic en Implementar -> Administrar implementaciones -> Editar (lápiz) -> Nueva versión -> Implementar.
 *    (O Nueva implementación -> Aplicación web -> Ejecutar como: "Yo" -> Acceso: "Cualquier persona").
 */

var TEACHER_TOKEN = 'poncho0312';

// Opcional: pega aquí el ID de tu Google Sheet Maestro si deseas usar uno específico.
// Si se deja vacío (''), `inicializarBaseDeDatosMaestra()` creará uno automáticamente y guardará su ID.
var MASTER_DB_ID = '';

var CACHE_TTL_SECONDS = 21600; // 6 horas en CacheService

var BOOKS = {
  '1A': {
    evalId: '1L6rC6vlz0vy8bRhbB-26UcZDsx1Nq4A9iNSb1VAEVS8',
    dashId: '1XZQJeKznREX7ZlKIfv-1_7piO31rskw6UYzAxHg1oo4',
    driveFolderId: '1EOO8q6U_li4_KAOR5PSryaPJelW_TLnv'
  },
  '1B': {
    evalId: '1jRX8xGSrE_6n9bGab0Qj8zHDD0h1rLhoL--0DgdWqZU',
    dashId: '1zloWXtchAU9DiOKiDDe95u1B2Kx8EcJH4YttxwhX3nk',
    driveFolderId: '1hhUqGxqR28bjjMOmvjcwkSEPrJ20d6py'
  },
  '2B': {
    evalId: '1KbVhsvrjB0c9vvvGLQw1Qn-PB5wQT3SjXWEU-5l7CcE',
    dashId: '1lSFn1ex17K5-0oXvx0hGDcl9rqj3FTagDY1rHEZBNvE',
    driveFolderId: '1fFQuS9f35C-QeG_gqtDKeaLnp8zLzWSK'
  },
  '3C': {
    evalId: '1RDeb8NrPgfbxyCJC3qVOYplUVJ7IXzcx7pzxlyuute8',
    dashId: '186wmz36Axwyas0vffuMNGI1MzHCO2b6Ijj8h3lb7YJs',
    driveFolderId: '1CdW4GGgFWiv-WNkg9HJPSfLGKEoe3iij'
  }
};

var DB_SHEETS = {
  ALUMNOS: 'ALUMNOS_DB',
  GRUPOS: 'GRUPOS_META',
  LOG: 'SINCRONIZACION_LOG'
};

var ALUMNOS_HEADERS = [
  'id_unico',
  'grupo',
  'n',
  'clave_corta',
  'nombre',
  'trabajos',
  'practicas',
  'cuestionarios',
  'proyectos',
  'cuadernillo',
  'promedio',
  'calificacion_final',
  'nivel',
  'observaciones',
  'asistencias',
  'faltas',
  'total_sesiones',
  'asistencia_semanal_json',
  'proyectos_json',
  'dashboard_json',
  'actualizado_en'
];

var GRUPOS_HEADERS = [
  'grupo',
  'ponderaciones_json',
  'semanas_json',
  'total_presentes',
  'total_faltas',
  'promedio_grupo',
  'desviacion_estandar',
  'actualizado_en'
];

var LOG_HEADERS = [
  'fecha_hora',
  'origen',
  'grupos',
  'alumnos_actualizados',
  'duracion_ms',
  'estado',
  'detalle'
];

function normName_(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim();
}

function spanishCompare_(a, b) {
  var sa = String(a || '').trim();
  var sb = String(b || '').trim();
  try {
    return sa.localeCompare(sb, 'es', { sensitivity: 'base' });
  } catch (_) {
    var na = normName_(sa);
    var nb = normName_(sb);
    return na < nb ? -1 : (na > nb ? 1 : 0);
  }
}

function numOrNull_(v) {
  if (v === null || v === undefined || v === '') return null;
  var n = Number(v);
  return isFinite(n) ? n : null;
}

function pad2_(n) {
  var num = Number(n) || 0;
  return num < 10 ? '0' + num : String(num);
}

function buildDefaultShortKey_(name, groupCode, listNum) {
  var parts = normName_(name).split(/\s+/).filter(Boolean);
  var initials = parts.slice(0, 3).map(function(p) { return p.charAt(0); }).join('');
  return initials + String(groupCode || '').toUpperCase() + pad2_(listNum);
}

function deriveLevelFromGrade_(finalGrade, average) {
  var g = finalGrade !== null ? finalGrade : (average !== null ? Math.round(average) : null);
  if (g === null) return '';
  if (g >= 10) return 'IV';
  if (g >= 8) return 'III';
  if (g >= 6) return 'II';
  return 'I';
}

function deriveStatusFromLevel_(level, finalGrade, average) {
  var g = finalGrade !== null && finalGrade !== undefined ? finalGrade : (average !== null && average !== undefined ? Math.round(average) : null);
  if (g !== null && isFinite(g)) {
    if (g >= 10) return 'Sobresaliente';
    if (g >= 9) return 'Bueno';
    if (g >= 7) return 'En desarrollo';
    return 'Requiere apoyo';
  }
  var lv = String(level || '').trim().toUpperCase();
  if (lv === 'IV') return 'Sobresaliente';
  if (lv === 'III') return 'Bueno';
  if (lv === 'II') return 'En desarrollo';
  if (lv === 'I') return 'Requiere apoyo';
  return '';
}

function findSubfolder_(parentFolder, targetName) {
  var targetNorm = normName_(targetName);
  var it = parentFolder.getFolders();
  var bestFallback = null;
  while (it.hasNext()) {
    var f = it.next();
    var fn = normName_(f.getName());
    if (fn === targetNorm) return f;
    if (!bestFallback && (fn.indexOf(targetNorm) !== -1 || targetNorm.indexOf(fn) !== -1)) {
      bestFallback = f;
    }
  }
  return bestFallback;
}

function getOrCreateReportsFolder_(studentFolder) {
  var existing = findSubfolder_(studentFolder, 'reportes de calificacion');
  if (existing) return existing;
  return studentFolder.createFolder('reportes de calificación');
}

function limpiarCeldaRefSiAplica_(sh, a1) {
  if (!sh) return false;
  var rng = sh.getRange(a1);
  var val = String(rng.getDisplayValue() || '').trim();
  var frm = String(rng.getFormula() || '');
  if (/^#REF!/i.test(val) || frm.indexOf('#REF!') !== -1) {
    if (rng.isPartOfMerge()) {
      rng.breakApart();
    }
    rng.clearContent();
    return true;
  }
  return false;
}

function getMasterDbId_() {
  if (MASTER_DB_ID && String(MASTER_DB_ID).trim() !== '') {
    return String(MASTER_DB_ID).trim();
  }
  var propId = PropertiesService.getScriptProperties().getProperty('MASTER_DB_ID');
  return propId ? String(propId).trim() : '';
}

function ensureSheetWithHeaders_(ss, sheetName, headers, headerColor) {
  var sh = ss.getSheetByName(sheetName);
  if (!sh) {
    sh = ss.insertSheet(sheetName);
  }
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.getRange(1, 1, 1, headers.length)
      .setBackground(headerColor || '#0c4a6e')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

/**
 * Crea (si no existe) el Google Sheet Maestro unificado con sus 3 pestañas
 * y ejecuta la primera sincronización de los libros fuente (evalId + dashId).
 * Ejecuta esta función UNA SOLA VEZ desde el editor de Apps Script.
 */
function inicializarBaseDeDatosMaestra() {
  var dbId = getMasterDbId_();
  var ss;

  if (dbId) {
    ss = SpreadsheetApp.openById(dbId);
  } else {
    ss = SpreadsheetApp.create('EST41_Base_Datos_Maestra');
    dbId = ss.getId();
    PropertiesService.getScriptProperties().setProperty('MASTER_DB_ID', dbId);

    // Renombrar la hoja inicial por defecto a ALUMNOS_DB
    var firstSheet = ss.getSheets()[0];
    if (firstSheet) {
      firstSheet.setName(DB_SHEETS.ALUMNOS);
    }
  }

  ensureSheetWithHeaders_(ss, DB_SHEETS.ALUMNOS, ALUMNOS_HEADERS, '#0c4a6e');
  ensureSheetWithHeaders_(ss, DB_SHEETS.GRUPOS, GRUPOS_HEADERS, '#065f46');
  ensureSheetWithHeaders_(ss, DB_SHEETS.LOG, LOG_HEADERS, '#334155');

  Logger.log('Base de Datos Maestra lista. ID: ' + dbId);
  Logger.log('URL del libro maestro: ' + ss.getUrl());

  return sincronizarBaseDeDatos('', 'inicializacion');
}

/**
 * Extrae datos del libro Dashboard (dashId) para enriquecer claves cortas y metadatos por número de lista.
 */
function extractDashByListNum_(dashId, groupCode) {
  var byN = {};
  if (!dashId) return byN;
  try {
    var ssDash = SpreadsheetApp.openById(dashId);
    var sheets = ssDash.getSheets();
    var shortKeyRe = /\b[A-Z]{2,5}\d[A-Z]\d{2}\b/;

    sheets.forEach(function(sh) {
      var vals = sh.getDataRange().getValues();
      if (!vals || vals.length < 2) return;

      var headers = vals[0].map(function(h) { return normName_(h); });
      for (var r = 0; r < vals.length; r++) {
        var row = vals[r];
        var listNum = numOrNull_(row[0]);
        if (listNum === null || listNum < 1 || listNum > 80) continue;

        var foundKey = '';
        var extra = {};
        for (var c = 0; c < row.length; c++) {
          var cellStr = String(row[c] === null || row[c] === undefined ? '' : row[c]).trim();
          if (!foundKey && shortKeyRe.test(cellStr.toUpperCase())) {
            var m = cellStr.toUpperCase().match(shortKeyRe);
            if (m) foundKey = m[0];
          }
          var hName = headers[c] || ('COL_' + (c + 1));
          if (cellStr !== '' && c >= 2 && c <= 15) {
            extra[hName] = row[c];
          }
        }

        if (!byN[listNum]) {
          byN[listNum] = { shortKey: foundKey, extra: extra, sheet: sh.getName() };
        } else {
          if (foundKey && !byN[listNum].shortKey) byN[listNum].shortKey = foundKey;
        }
      }
    });
  } catch (err) {
    Logger.log('Aviso al leer dashId de ' + groupCode + ': ' + err.message);
  }
  return byN;
}

/**
 * Lee y unifica los datos de un grupo desde sus dos libros fuente (evalId + dashId).
 */
function buildUnifiedGroupData_(groupCode) {
  var book = BOOKS[groupCode];
  if (!book) throw new Error('Grupo no encontrado: ' + groupCode);

  var ssEval = SpreadsheetApp.openById(book.evalId);
  var rasgos = ssEval.getSheetByName('RASGOS II');
  var asist = ssEval.getSheetByName('ASIST II');
  var trim = ssEval.getSheetByName('TRIM II');

  var dashByN = extractDashByListNum_(book.dashId, groupCode);

  var weights = [10, 10, 30, 30, 20];
  var studentsByN = {};

  if (rasgos) {
    var rVals = rasgos.getDataRange().getValues();
    for (var r = 0; r < rVals.length; r++) {
      var row = rVals[r];
      var a = row[0];
      var b = row[1];
      var c2 = numOrNull_(row[2]);
      var c3 = numOrNull_(row[3]);
      var c4 = numOrNull_(row[4]);

      if (a === '' && b === '' && c2 !== null && c2 > 0 && c2 <= 1 && c3 !== null) {
        weights = [c2, c3, c4, numOrNull_(row[5]), numOrNull_(row[6])].map(function(x) {
          return Math.round((x || 0) * 100);
        });
      }

      var listNum = numOrNull_(a);
      if (listNum !== null && listNum >= 1 && typeof b === 'string' && b.trim() !== '' && !/nombre/i.test(b)) {
        var studentName = b.trim();
        var dashInfo = dashByN[listNum] || {};
        var shortKey = dashInfo.shortKey || buildDefaultShortKey_(studentName, groupCode, listNum);

        var avgVal = numOrNull_(row[12]);
        var finalVal = numOrNull_(row[13]);
        var rawLevel = row[14] !== '' && row[14] !== null ? String(row[14]).trim() : '';
        var finalLevel = rawLevel || deriveLevelFromGrade_(finalVal, avgVal);
        var rawStatus = row[15] !== '' && row[15] !== null ? String(row[15]).trim() : '';
        var finalStatus = rawStatus || deriveStatusFromLevel_(finalLevel, finalVal, avgVal);

        var stuObj = {
          n: listNum,
          nOrigen: listNum,
          shortKey: shortKey,
          name: studentName,
          traits: {
            trabajos: numOrNull_(row[2]),
            practicas: numOrNull_(row[3]),
            cuestionarios: numOrNull_(row[4]),
            proyectos: numOrNull_(row[5]),
            cuadernillo: numOrNull_(row[6])
          },
          average: avgVal,
          finalGrade: finalVal,
          level: finalLevel || null,
          status: finalStatus || null,
          attendance: { present: 0, absent: 0, total: 0 },
          weeklyAttendance: [],
          projects: [],
          dashboard: dashInfo.extra || {}
        };
        studentsByN[listNum] = stuObj;
      }
    }
  }

  // Índice auxiliar por nombre normalizado para garantizar correspondencia exacta entre hojas
  var studentsByNormName = {};
  Object.keys(studentsByN).forEach(function(k) {
    var s = studentsByN[k];
    studentsByNormName[normName_(s.name)] = s;
  });

  function resolveStudent_(listNum, rawName) {
    var nKey = normName_(rawName);
    var byN = listNum !== null ? studentsByN[listNum] : null;
    if (byN && (!nKey || normName_(byN.name) === nKey)) return byN;
    if (nKey && studentsByNormName[nKey]) return studentsByNormName[nKey];
    return byN || null;
  }

  var weekCols = [];
  var faltasCol = -1;
  var groupPresent = 0;
  var groupAbsent = 0;
  var weekTotals = [];

  if (asist) {
    var aVals = asist.getDataRange().getDisplayValues();
    var aRaw = asist.getDataRange().getValues();
    var weekDateRe = /(\d{1,2}\s*(?:[a-z]{3}\s*)?[-–]\s*\d{1,2}\s+[a-z]{3})/i;

    for (var ar = 0; ar < Math.min(10, aVals.length); ar++) {
      for (var ac = 2; ac < aVals[ar].length; ac++) {
        var lbl = String(aVals[ar][ac] || '').trim();
        var mWeek = lbl.match(weekDateRe);
        if (mWeek) {
          weekCols.push({ startCol: ac, label: mWeek[1].replace(/\s+/g, ' ').trim() });
        } else if (/faltas/i.test(lbl)) {
          faltasCol = ac;
        }
      }
      if (weekCols.length > 0) break;
    }

    weekTotals = weekCols.map(function() { return { p: 0, a: 0, students: 0 }; });

    for (var rr = 0; rr < aRaw.length; rr++) {
      var ln = numOrNull_(aRaw[rr][0]);
      var nb = aRaw[rr][1];
      var stu = (typeof nb === 'string' && nb.trim() !== '') ? resolveStudent_(ln, nb) : null;
      if (stu) {
        var totP = 0;
        var totA = 0;
        stu.weeklyAttendance = weekCols.map(function(wc, wi) {
          var nextStart = wi + 1 < weekCols.length
            ? weekCols[wi + 1].startCol
            : (faltasCol > wc.startCol ? faltasCol : wc.startCol + 5);
          var endCol = Math.min(nextStart, wc.startCol + 5);
          var p = 0, a = 0, hasAny = false;
          for (var ci = wc.startCol; ci < endCol; ci++) {
            var v = numOrNull_(aRaw[rr][ci]);
            if (v === 1) { p++; totP++; groupPresent++; hasAny = true; }
            else if (v === 0) { a++; totA++; groupAbsent++; hasAny = true; }
          }
          if (hasAny) {
            weekTotals[wi].p += p;
            weekTotals[wi].a += a;
            weekTotals[wi].students++;
            return { present: p, absent: a };
          }
          return null;
        });
        stu.attendance = { present: totP, absent: totA, total: totP + totA };
      }
    }
  }

  if (trim) {
    var tVals = trim.getDataRange().getValues();
    var titleRow = null;
    for (var tr = 0; tr < Math.min(10, tVals.length); tr++) {
      if (/proyecto/i.test(String(tVals[tr][2] || ''))) {
        titleRow = tVals[tr];
        break;
      }
    }
    var projectCols = [
      { col: 2, fallback: 'Proyecto 1' },
      { col: 7, fallback: 'Proyecto 2' },
      { col: 12, fallback: 'Proyecto 3' },
      { col: 17, fallback: 'Proyecto 4' },
      { col: 22, fallback: 'Proyecto 5' },
      { col: 27, fallback: 'Proyecto 6' }
    ];
    var projectLabels = projectCols.map(function(pc) {
      return String(titleRow && titleRow[pc.col] ? titleRow[pc.col] : pc.fallback).trim();
    });

    for (var r2 = 0; r2 < tVals.length; r2++) {
      var ln2 = numOrNull_(tVals[r2][0]);
      var nb2 = tVals[r2][1];
      var stu2 = (typeof nb2 === 'string' && nb2.trim() !== '') ? resolveStudent_(ln2, nb2) : null;
      if (stu2) {
        var projs = [];
        projectCols.forEach(function(pc, pi) {
          var sc = numOrNull_(tVals[r2][pc.col]);
          if (sc !== null || projectLabels[pi]) {
            projs.push({
              label: projectLabels[pi],
              score: sc,
              status: sc === null ? 'Pendiente' : 'Evaluado'
            });
          }
        });
        if (projs.length > 0) stu2.projects = projs;
      }
    }
  }

  // Ordenar ortográficamente (español) y renumerar consecutivamente 1..N sin huecos
  var orderedList = Object.keys(studentsByN).map(function(k) { return studentsByN[k]; });
  orderedList.sort(function(a, b) {
    return spanishCompare_(a.name, b.name);
  });
  var compactedByN = {};
  orderedList.forEach(function(stu, idx) {
    var newN = idx + 1;
    stu.n = newN;
    if (!stu.dashboard) stu.dashboard = {};
    stu.dashboard.n_origen = stu.nOrigen;
    compactedByN[newN] = stu;
  });
  studentsByN = compactedByN;

  // Calcular promedio y desviación estándar del grupo
  var avgs = [];
  Object.keys(studentsByN).forEach(function(k) {
    var av = studentsByN[k].average;
    if (av !== null) avgs.push(av);
  });
  var groupAvg = null;
  var groupSd = null;
  if (avgs.length > 0) {
    var sum = avgs.reduce(function(acc, x) { return acc + x; }, 0);
    groupAvg = Math.round((sum / avgs.length) * 100) / 100;
    var sqDiff = avgs.reduce(function(acc, x) { return acc + Math.pow(x - groupAvg, 2); }, 0);
    groupSd = Math.round(Math.sqrt(sqDiff / avgs.length) * 100) / 100;
  }

  return {
    ts: Date.now(),
    group: groupCode,
    weights: weights,
    studentsByN: studentsByN,
    weekCols: weekCols,
    weekTotals: weekTotals,
    groupPresent: groupPresent,
    groupAbsent: groupAbsent,
    groupAverage: groupAvg,
    groupSd: groupSd
  };
}

function saveGroupSnapshotToCache_(groupCode, snap) {
  try {
    var cache = CacheService.getScriptCache();
    cache.put('est41_snap_' + groupCode, JSON.stringify(snap), CACHE_TTL_SECONDS);
  } catch (err) {
    Logger.log('No se pudo guardar caché para ' + groupCode + ': ' + err.message);
  }
}

function readGroupSnapshotFromMasterDb_(groupCode) {
  var dbId = getMasterDbId_();
  if (!dbId) return null;

  var ss = SpreadsheetApp.openById(dbId);
  var shAlumnos = ss.getSheetByName(DB_SHEETS.ALUMNOS);
  var shGrupos = ss.getSheetByName(DB_SHEETS.GRUPOS);
  if (!shAlumnos || !shGrupos) return null;

  var gRows = shGrupos.getDataRange().getValues();
  var meta = null;
  for (var i = 1; i < gRows.length; i++) {
    if (String(gRows[i][0] || '').toUpperCase() === groupCode) {
      var semanasObj = {};
      try { semanasObj = JSON.parse(gRows[i][2] || '{}'); } catch (_) {}
      meta = {
        weights: JSON.parse(gRows[i][1] || '[10,10,30,30,20]'),
        weekCols: semanasObj.weekCols || [],
        weekTotals: semanasObj.weekTotals || [],
        groupPresent: Number(gRows[i][3]) || 0,
        groupAbsent: Number(gRows[i][4]) || 0,
        groupAverage: numOrNull_(gRows[i][5]),
        groupSd: numOrNull_(gRows[i][6])
      };
      break;
    }
  }
  if (!meta) return null;

  var aRows = shAlumnos.getDataRange().getValues();
  var studentsByN = {};
  for (var r = 1; r < aRows.length; r++) {
    var row = aRows[r];
    if (String(row[1] || '').toUpperCase() !== groupCode) continue;
    var n = numOrNull_(row[2]);
    if (n === null) continue;

    var weekly = [];
    var projs = [];
    var dash = {};
    try { weekly = JSON.parse(row[17] || '[]'); } catch (_) {}
    try { projs = JSON.parse(row[18] || '[]'); } catch (_) {}
    try { dash = JSON.parse(row[19] || '{}'); } catch (_) {}

    studentsByN[n] = {
      n: n,
      shortKey: String(row[3] || ''),
      name: String(row[4] || ''),
      traits: {
        trabajos: numOrNull_(row[5]),
        practicas: numOrNull_(row[6]),
        cuestionarios: numOrNull_(row[7]),
        proyectos: numOrNull_(row[8]),
        cuadernillo: numOrNull_(row[9])
      },
      average: numOrNull_(row[10]),
      finalGrade: numOrNull_(row[11]),
      level: row[12] !== '' && row[12] !== null ? String(row[12]) : null,
      status: row[13] !== '' && row[13] !== null ? String(row[13]) : null,
      attendance: {
        present: Number(row[14]) || 0,
        absent: Number(row[15]) || 0,
        total: Number(row[16]) || 0
      },
      weeklyAttendance: weekly,
      projects: projs,
      dashboard: dash
    };
  }

  var snap = {
    ts: Date.now(),
    group: groupCode,
    weights: meta.weights,
    studentsByN: studentsByN,
    weekCols: meta.weekCols,
    weekTotals: meta.weekTotals,
    groupPresent: meta.groupPresent,
    groupAbsent: meta.groupAbsent,
    groupAverage: meta.groupAverage,
    groupSd: meta.groupSd
  };
  saveGroupSnapshotToCache_(groupCode, snap);
  return snap;
}

/**
 * Sincroniza los libros fuente (evalId + dashId) hacia la Base de Datos Maestra
 * y actualiza la caché en memoria (CacheService) para consultas rápidas.
 */
function sincronizarBaseDeDatos(groupFilter, origen) {
  var startMs = Date.now();
  var dbId = getMasterDbId_();
  if (!dbId) {
    return inicializarBaseDeDatosMaestra();
  }

  var ssDb = SpreadsheetApp.openById(dbId);
  var shAlumnos = ensureSheetWithHeaders_(ssDb, DB_SHEETS.ALUMNOS, ALUMNOS_HEADERS, '#0c4a6e');
  var shGrupos = ensureSheetWithHeaders_(ssDb, DB_SHEETS.GRUPOS, GRUPOS_HEADERS, '#065f46');
  var shLog = ensureSheetWithHeaders_(ssDb, DB_SHEETS.LOG, LOG_HEADERS, '#334155');

  var targetGroup = groupFilter ? String(groupFilter).toUpperCase().trim() : '';
  var groupKeys = Object.keys(BOOKS).filter(function(g) {
    return !targetGroup || g === targetGroup;
  });

  var nowIso = new Date().toISOString();
  var snapsByGroup = {};
  var totalStudents = 0;

  groupKeys.forEach(function(gKey) {
    var snap = buildUnifiedGroupData_(gKey);
    snapsByGroup[gKey] = snap;
    saveGroupSnapshotToCache_(gKey, snap);
    totalStudents += Object.keys(snap.studentsByN).length;
  });

  // Actualizar ALUMNOS_DB conservando otros grupos si se filtró uno solo
  var existingAlumnos = shAlumnos.getDataRange().getValues();
  var keptAlumnos = [];
  for (var i = 1; i < existingAlumnos.length; i++) {
    var rowGroup = String(existingAlumnos[i][1] || '').toUpperCase();
    if (!snapsByGroup[rowGroup]) {
      keptAlumnos.push(existingAlumnos[i]);
    }
  }

  var newAlumnosRows = [];
  Object.keys(BOOKS).forEach(function(gKey) {
    if (!snapsByGroup[gKey]) return;
    var snap = snapsByGroup[gKey];
    var nums = Object.keys(snap.studentsByN).map(Number).sort(function(a, b) { return a - b; });
    nums.forEach(function(n) {
      var s = snap.studentsByN[n];
      newAlumnosRows.push([
        gKey + '-' + pad2_(n),
        gKey,
        n,
        s.shortKey || '',
        s.name,
        s.traits.trabajos,
        s.traits.practicas,
        s.traits.cuestionarios,
        s.traits.proyectos,
        s.traits.cuadernillo,
        s.average,
        s.finalGrade,
        s.level || '',
        s.status || '',
        s.attendance.present,
        s.attendance.absent,
        s.attendance.total,
        JSON.stringify(s.weeklyAttendance || []),
        JSON.stringify(s.projects || []),
        JSON.stringify(s.dashboard || {}),
        nowIso
      ]);
    });
  });

  var finalAlumnos = keptAlumnos.concat(newAlumnosRows);
  if (shAlumnos.getLastRow() > 1) {
    shAlumnos.getRange(2, 1, shAlumnos.getLastRow() - 1, ALUMNOS_HEADERS.length).clearContent();
  }
  if (finalAlumnos.length > 0) {
    shAlumnos.getRange(2, 1, finalAlumnos.length, ALUMNOS_HEADERS.length).setValues(finalAlumnos);
  }

  // Actualizar GRUPOS_META
  var existingGrupos = shGrupos.getDataRange().getValues();
  var gruposMap = {};
  for (var gi = 1; gi < existingGrupos.length; gi++) {
    var gg = String(existingGrupos[gi][0] || '').toUpperCase();
    if (gg) gruposMap[gg] = existingGrupos[gi];
  }
  groupKeys.forEach(function(gKey) {
    var snap = snapsByGroup[gKey];
    gruposMap[gKey] = [
      gKey,
      JSON.stringify(snap.weights),
      JSON.stringify({ weekCols: snap.weekCols, weekTotals: snap.weekTotals }),
      snap.groupPresent,
      snap.groupAbsent,
      snap.groupAverage,
      snap.groupSd,
      nowIso
    ];
  });

  var finalGrupos = Object.keys(BOOKS).map(function(gKey) { return gruposMap[gKey]; }).filter(Boolean);
  if (shGrupos.getLastRow() > 1) {
    shGrupos.getRange(2, 1, shGrupos.getLastRow() - 1, GRUPOS_HEADERS.length).clearContent();
  }
  if (finalGrupos.length > 0) {
    shGrupos.getRange(2, 1, finalGrupos.length, GRUPOS_HEADERS.length).setValues(finalGrupos);
  }

  var integrityErrors = [];
  groupKeys.forEach(function(gKey) {
    integrityErrors = integrityErrors.concat(verificarIntegridadGrupo_(gKey, snapsByGroup[gKey]));
  });

  var durationMs = Date.now() - startMs;
  shLog.insertRowAfter(1);
  shLog.getRange(2, 1, 1, LOG_HEADERS.length).setValues([[
    nowIso,
    origen || 'manual',
    groupKeys.join(', '),
    totalStudents,
    durationMs,
    integrityErrors.length === 0 ? 'OK' : 'ADVERTENCIA',
    integrityErrors.length === 0
      ? 'Sincronización ordenada alfabéticamente sin huecos y verificada (0 discrepancias).'
      : ('Hallazgos: ' + integrityErrors.slice(0, 5).join(' | '))
  ]]);

  return {
    ok: true,
    masterDbId: dbId,
    groups: groupKeys,
    studentsCount: totalStudents,
    integrityErrors: integrityErrors,
    durationMs: durationMs,
    updatedAt: nowIso
  };
}

function verificarIntegridadGrupo_(groupCode, snap) {
  var errs = [];
  if (!snap || !snap.studentsByN) return ['[' + groupCode + '] Snapshot vacío.'];
  var nums = Object.keys(snap.studentsByN).map(Number).sort(function(a, b) { return a - b; });
  for (var i = 0; i < nums.length; i++) {
    if (nums[i] !== i + 1) {
      errs.push('[' + groupCode + '] Hueco en numeración: esperado #' + (i + 1) + ', encontrado #' + nums[i]);
      break;
    }
    if (i > 0) {
      var prev = snap.studentsByN[nums[i - 1]];
      var curr = snap.studentsByN[nums[i]];
      if (spanishCompare_(prev.name, curr.name) > 0) {
        errs.push('[' + groupCode + '] Desorden ortográfico: ' + prev.name + ' > ' + curr.name);
      }
    }
  }
  return errs;
}

/**
 * Evalúa y verifica por triplicado la integridad entre los libros origen (evalId)
 * y la Base de Datos Maestra (ALUMNOS_DB): orden ortográfico, cero huecos y
 * correspondencia exacta de calificaciones y asistencias por nombre de alumno.
 */
function verificarIntegridadCompleta() {
  var dbId = getMasterDbId_();
  if (!dbId) throw new Error('Base de Datos Maestra no inicializada.');
  var report = [];

  Object.keys(BOOKS).forEach(function(gKey) {
    var dbSnap = readGroupSnapshotFromMasterDb_(gKey);
    var origSnap = buildUnifiedGroupData_(gKey);
    var errs = verificarIntegridadGrupo_(gKey, dbSnap);

    var dbList = dbSnap ? Object.keys(dbSnap.studentsByN).map(function(k) { return dbSnap.studentsByN[k]; }) : [];
    var origByNorm = {};
    Object.keys(origSnap.studentsByN).forEach(function(k) {
      var s = origSnap.studentsByN[k];
      origByNorm[normName_(s.name)] = s;
    });

    if (dbList.length !== Object.keys(origSnap.studentsByN).length) {
      errs.push('[' + gKey + '] Conteo distinto: DB=' + dbList.length + ' vs Origen=' + Object.keys(origSnap.studentsByN).length);
    }

    dbList.forEach(function(ds) {
      var os = origByNorm[normName_(ds.name)];
      if (!os) {
        errs.push('[' + gKey + '] Alumno en DB no encontrado en origen: ' + ds.name);
        return;
      }
      if (ds.average !== os.average || ds.finalGrade !== os.finalGrade) {
        errs.push('[' + gKey + '] Promedio distinto para ' + ds.name + ': DB=' + ds.average + ' vs Origen=' + os.average);
      }
      if (ds.attendance.present !== os.attendance.present || ds.attendance.absent !== os.attendance.absent) {
        errs.push('[' + gKey + '] Asistencia distinta para ' + ds.name);
      }
    });

    if (errs.length === 0) {
      report.push('[' + gKey + '] OK (' + dbList.length + ' alumnos, 0 huecos, orden ortográfico exacto, 100% correspondencia).');
    } else {
      report = report.concat(errs);
    }
  });

  Logger.log('VERIFICACIÓN DE INTEGRIDAD:\n' + report.join('\n'));
  return report;
}

/**
 * Crea un activador automático cada 15 minutos para mantener la Base de Datos Maestra actualizada
 * conforme el docente captura calificaciones y asistencias en sus libros de Google Sheets.
 */
function instalarSincronizacionAutomatica() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) {
    if (t.getHandlerFunction() === 'sincronizarAutomaticaTrigger_') {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger('sincronizarAutomaticaTrigger_')
    .timeBased()
    .everyMinutes(15)
    .create();

  Logger.log('Sincronización automática instalada: cada 15 minutos.');
}

function sincronizarAutomaticaTrigger_() {
  sincronizarBaseDeDatos('', 'trigger_15min');
}

/**
 * Audita errores de fórmulas (#REF!, #DIV/0!, #VALUE!, #NAME?, #N/A, #ERROR!),
 * suma de ponderaciones en RASGOS II y consistencia de promedios en los 8 libros.
 * Limpia automáticamente los #REF! residuales conocidos en 1B (TRIM II!AI1 y Prácticas II!A4).
 */
function auditarConexionesYFormulas() {
  var ss1B = SpreadsheetApp.openById(BOOKS['1B'].evalId);
  var fixedTrim = limpiarCeldaRefSiAplica_(ss1B.getSheetByName('TRIM II'), 'AI1');
  var fixedPract = limpiarCeldaRefSiAplica_(ss1B.getSheetByName('Prácticas II'), 'A4');
  if (fixedTrim || fixedPract) {
    SpreadsheetApp.flush();
    Logger.log('AUTO-REPARACIÓN 1B: ' +
      (fixedTrim ? 'TRIM II!AI1 limpiado. ' : '') +
      (fixedPract ? 'Prácticas II!A4 limpiado.' : ''));
  }

  var report = [];
  var errRegex = /^#(REF!|DIV\/0!|VALUE!|NAME\?|N\/A|ERROR!|NUM!)/;

  Object.keys(BOOKS).forEach(function(groupKey) {
    ['evalId', 'dashId'].forEach(function(kind) {
      var id = BOOKS[groupKey][kind];
      var ss = SpreadsheetApp.openById(id);
      var sheets = ss.getSheets();
      sheets.forEach(function(sh) {
        var name = sh.getName();
        var values = sh.getDataRange().getDisplayValues();
        var errors = [];
        for (var r = 0; r < values.length; r++) {
          for (var c = 0; c < values[r].length; c++) {
            var v = String(values[r][c] || '').trim();
            if (errRegex.test(v)) {
              errors.push(sh.getRange(r + 1, c + 1).getA1Notation() + '=' + v);
            }
          }
        }
        if (errors.length > 0) {
          report.push('[' + groupKey + ' ' + kind + ' -> ' + name + '] ERRORES (' + errors.length + '): ' + errors.slice(0, 10).join(', '));
        }
      });

      if (kind === 'evalId') {
        var rasgos = ss.getSheetByName('RASGOS II');
        if (rasgos) {
          var weights = rasgos.getRange('C10:G10').getValues()[0];
          var sumW = weights.reduce(function(acc, n) { return acc + (Number(n) || 0); }, 0);
          if (Math.abs(sumW - 1) > 0.001) {
            report.push('[' + groupKey + ' RASGOS II] ADVERTENCIA: La suma de ponderaciones C10:G10 es ' + (sumW * 100).toFixed(1) + '% (debe ser 100%).');
          }
        }
      }
    });
  });

  if (report.length === 0) {
    Logger.log('AUDITORÍA OK: 0 errores de fórmulas y ponderaciones al 100% en los 8 libros.');
  } else {
    Logger.log('HALLAZGOS DE AUDITORÍA:\n' + report.join('\n'));
  }
  return report;
}

/**
 * Crea (o reemplaza) un activador (Trigger) diario entre las 8:00 p.m. y las 9:00 p.m.
 * para ejecutar automáticamente auditarConexionesYFormulas().
 * Ejecuta esta función UNA SOLA VEZ desde el editor de Apps Script.
 */
function instalarActivadorNocturno() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) {
    if (t.getHandlerFunction() === 'auditarConexionesYFormulas') {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger('auditarConexionesYFormulas')
    .timeBased()
    .everyDays(1)
    .atHour(20)
    .create();

  Logger.log('Activador nocturno instalado: auditarConexionesYFormulas se ejecutará todos los días entre 8:00 p.m. y 9:00 p.m.');
}

/**
 * Repara los errores #REF! detectados en el libro de 1B (TRIM II!AI1 y Prácticas II!A4)
 * y vuelve a ejecutar la auditoría completa para confirmar 0 errores.
 */
function repararErrores1B() {
  var ss1B = SpreadsheetApp.openById(BOOKS['1B'].evalId);
  var cambios = [];

  var trim = ss1B.getSheetByName('TRIM II');
  if (trim) {
    var ai1 = trim.getRange('AI1');
    var vAi1 = String(ai1.getDisplayValue() || '').trim();
    var fAi1 = ai1.getFormula();
    if (/^#REF!/i.test(vAi1) || (fAi1 && fAi1.indexOf('#REF!') !== -1)) {
      cambios.push('TRIM II!AI1 limpiado (antes valor="' + vAi1 + '", fórmula="' + fAi1 + '")');
      ai1.clearContent();
    }
  }

  var pract = ss1B.getSheetByName('Prácticas II');
  if (pract) {
    var a4 = pract.getRange('A4');
    var vA4 = String(a4.getDisplayValue() || '').trim();
    var fA4 = a4.getFormula();
    if (/^#REF!/i.test(vA4) || (fA4 && fA4.indexOf('#REF!') !== -1)) {
      cambios.push('Prácticas II!A4 limpiado (antes valor="' + vA4 + '", fórmula="' + fA4 + '")');
      a4.clearContent();
    }
  }

  SpreadsheetApp.flush();
  Logger.log(cambios.length ? 'REPARACIONES EN 1B:\n' + cambios.join('\n') : 'Sin #REF! pendientes en TRIM II!AI1 ni Prácticas II!A4.');
  return auditarConexionesYFormulas();
}

function buildGetResponse_(obj, callbackName) {
  var json = JSON.stringify(obj);
  if (callbackName && /^[a-zA-Z_$][a-zA-Z0-9_$.]*$/.test(callbackName)) {
    return ContentService
      .createTextOutput(callbackName + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Endpoint Web App (GET) rápido:
 * - ?action=ping -> Verifica disponibilidad
 * - ?action=sync&token=...&group=1A -> Sincroniza Base Maestra y caché (solo docente)
 * - ?action=snapshot&group=1A -> Devuelve snapshot unificado desde CacheService o Base Maestra
 * - ?action=student&group=1A&n=1 -> Devuelve solo el alumno solicitado + métricas del grupo
 */
function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  var action = params.action ? String(params.action).toLowerCase() : 'snapshot';
  var callback = params.callback ? String(params.callback).trim() : '';

  if (action === 'ping') {
    return buildGetResponse_({
      ok: true,
      status: 'ready',
      service: 'EST41 Base Maestra & Reportes Drive',
      masterDbConfigured: Boolean(getMasterDbId_()),
      updatedAt: new Date().toISOString()
    }, callback);
  }

  if (action === 'sync') {
    if (params.token !== TEACHER_TOKEN) {
      return buildGetResponse_({ ok: false, error: 'No autorizado. Clave docente inválida.' }, callback);
    }
    var syncRes = sincronizarBaseDeDatos(params.group || '', 'web_manual');
    return buildGetResponse_(syncRes, callback);
  }

  var groupParam = params.group ? String(params.group).toUpperCase().trim() : '';
  if (!groupParam || !BOOKS[groupParam]) {
    return buildGetResponse_({ ok: false, error: 'Especifica un grupo válido (1A, 1B, 2B, 3C).' }, callback);
  }

  // 1. Intentar lectura ultrarrápida desde CacheService
  var snap = null;
  var source = 'cache';
  try {
    var cachedStr = CacheService.getScriptCache().get('est41_snap_' + groupParam);
    if (cachedStr) {
      snap = JSON.parse(cachedStr);
    }
  } catch (_) {}

  // 2. Si no está en caché, leer de la Base de Datos Maestra (1 solo libro)
  if (!snap) {
    source = 'master_db';
    snap = readGroupSnapshotFromMasterDb_(groupParam);
  }

  // 3. Fallback si aún no se inicializa la Base de Datos Maestra
  if (!snap) {
    source = 'live_books_fallback';
    snap = buildUnifiedGroupData_(groupParam);
    saveGroupSnapshotToCache_(groupParam, snap);
  }

  if (action === 'student') {
    var nParam = numOrNull_(params.n);
    var stu = nParam !== null && snap.studentsByN ? snap.studentsByN[nParam] : null;
    if (!stu) {
      return buildGetResponse_({ ok: false, error: 'Alumno no encontrado en el grupo ' + groupParam }, callback);
    }
    return buildGetResponse_({
      ok: true,
      source: source,
      group: groupParam,
      weights: snap.weights,
      weekCols: snap.weekCols,
      weekTotals: snap.weekTotals,
      groupPresent: snap.groupPresent,
      groupAbsent: snap.groupAbsent,
      groupAverage: snap.groupAverage,
      groupSd: snap.groupSd,
      student: stu
    }, callback);
  }

  return buildGetResponse_({
    ok: true,
    source: source,
    snap: snap
  }, callback);
}

/**
 * Endpoint Web App (POST) exclusivo para el docente:
 * - action: 'sync' -> Sincroniza Base Maestra
 * - por defecto -> Recibe un lote de reportes HTML tamaño Carta y los guarda como PDF en Drive
 */
function doPost(e) {
  try {
    var rawBody = (e && e.postData && e.postData.contents) ? e.postData.contents : (e && e.parameter && e.parameter.payload ? e.parameter.payload : '');
    if (!rawBody) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Solicitud vacía (sin postData).' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var payload = JSON.parse(rawBody);
    if (payload && payload.action === 'ortografia') {
      var dbIdOrto = getMasterDbId_();
      if (!dbIdOrto) dbIdOrto = inicializarBaseDeDatosMaestra().masterDbId;
      var ssOrto = SpreadsheetApp.openById(dbIdOrto);
      var shOrto = ensureSheetWithHeaders_(ssOrto, 'HISTORIAL_ORTOGRAFIA', [
        'fecha', 'hora', 'grupo', 'no_lista', 'nombre', 'mision', 'calificacion', 'aciertos', 'errores', 'tiempo_agotado', 'total_preguntas', 'registrado_en'
      ], '#7c3aed');
      shOrto.appendRow([
        payload.date || new Date().toLocaleDateString('es-MX'),
        payload.time || new Date().toLocaleTimeString('es-MX'),
        String(payload.group || '').toUpperCase(),
        payload.studentNo || '',
        String(payload.studentName || ''),
        String(payload.missionTitle || ''),
        Number(payload.grade),
        Number(payload.correctHits) || 0,
        Number(payload.errorCount) || 0,
        Number(payload.timeoutCount) || 0,
        Number(payload.totalQuestions) || 20,
        new Date().toISOString()
      ]);
      return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
    }
    if (!payload || payload.token !== TEACHER_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'No autorizado. Clave docente inválida.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (payload.action === 'sync') {
      var syncRes = sincronizarBaseDeDatos(payload.group || '', 'web_post');
      return ContentService
        .createTextOutput(JSON.stringify(syncRes))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var groupCode = String(payload.group || '').toUpperCase();
    var book = BOOKS[groupCode];
    if (!book || !book.driveFolderId) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Grupo no válido: ' + groupCode }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var groupFolder = DriveApp.getFolderById(book.driveFolderId);
    var folderEntries = [];
    var itFolders = groupFolder.getFolders();
    while (itFolders.hasNext()) {
      var f = itFolders.next();
      folderEntries.push({ folder: f, norm: normName_(f.getName()) });
    }
    function resolveStudentFolder_(targetName) {
      var t = normName_(targetName);
      for (var i = 0; i < folderEntries.length; i++) {
        if (folderEntries[i].norm === t) return folderEntries[i].folder;
      }
      for (var j = 0; j < folderEntries.length; j++) {
        var fn = folderEntries[j].norm;
        if (fn.indexOf(t) !== -1 || t.indexOf(fn) !== -1) return folderEntries[j].folder;
      }
      return null;
    }

    var items = Array.isArray(payload.items) ? payload.items : [];
    var saved = [];
    var errors = [];

    items.forEach(function(item) {
      try {
        var studentName = String(item.name || '').trim();
        var studentFolder = resolveStudentFolder_(studentName);
        if (!studentFolder) {
          errors.push({ name: studentName, error: 'No se encontró carpeta del alumno en ' + groupCode });
          return;
        }
        var reportsFolder = getOrCreateReportsFolder_(studentFolder);
        var safeFileName = String(item.fileName || (studentName + '.pdf')).replace(/[\\/:*?"<>|]/g, '-');
        if (!/\.pdf$/i.test(safeFileName)) safeFileName += '.pdf';

        var htmlBlob = Utilities.newBlob(String(item.html || ''), 'text/html', safeFileName.replace(/\.pdf$/i, '.html'));
        var pdfBlob = htmlBlob.getAs('application/pdf').setName(safeFileName);
        var file = reportsFolder.createFile(pdfBlob);

        saved.push({
          n: item.n,
          name: studentName,
          fileName: safeFileName,
          fileId: file.getId(),
          url: file.getUrl()
        });
      } catch (itemErr) {
        errors.push({ name: item.name || 'Desconocido', error: itemErr.message });
      }
    });

    var unifiedResults = saved.map(function(s) {
      return { ok: true, n: s.n, name: s.name, fileName: s.fileName, fileId: s.fileId, url: s.url };
    }).concat(errors.map(function(er) {
      return { ok: false, name: er.name, error: er.error };
    }));

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        group: groupCode,
        savedCount: saved.length,
        saved: saved,
        errors: errors,
        results: unifiedResults
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
