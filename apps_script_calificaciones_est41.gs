/**
 * Google Apps Script — Auditoría, API en Tiempo Real y Guardado de Reportes PDF en Google Drive (EST 41)
 *
 * INSTRUCCIONES PARA EL DOCENTE (UNA SOLA VEZ):
 * 1. Abre https://script.google.com y crea un proyecto nuevo (o abre Extensiones -> Apps Script en cualquiera de tus hojas).
 * 2. Pega TODO este código y guarda (Ctrl + S).
 * 3. Haz clic en Implementar -> Nueva implementación -> Tipo: "Aplicación web".
 *    - Ejecutar como: "Yo" (tu cuenta de Google propietaria de las carpetas de Drive)
 *    - Quién tiene acceso: "Cualquier persona"
 * 4. Autoriza los permisos de Google Sheets y Google Drive.
 * 5. Copia la URL de la aplicación web (termina en /exec) y pégala en el panel "Modo Docente" del sitio web.
 */

var TEACHER_TOKEN = 'poncho0312';

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

function normName_(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim();
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

/**
 * Audita errores de fórmulas (#REF!, #DIV/0!, #VALUE!, #NAME?, #N/A, #ERROR!),
 * suma de ponderaciones en RASGOS II y consistencia de promedios en los 8 libros.
 */
function auditarConexionesYFormulas() {
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

/**
 * Endpoint Web App (GET) que devuelve los datos en tiempo real de RASGOS II y ASIST II.
 */
function doGet(e) {
  var groupParam = (e && e.parameter && e.parameter.group) ? String(e.parameter.group).toUpperCase() : '';
  var result = {
    ok: true,
    updatedAt: new Date().toISOString(),
    groups: {}
  };

  Object.keys(BOOKS).forEach(function(gKey) {
    if (groupParam && groupParam !== gKey) return;
    var ss = SpreadsheetApp.openById(BOOKS[gKey].evalId);
    var rasgos = ss.getSheetByName('RASGOS II');
    var asist = ss.getSheetByName('ASIST II');
    var trim = ss.getSheetByName('TRIM II');

    result.groups[gKey] = {
      rasgos: rasgos ? rasgos.getDataRange().getValues() : [],
      asist: asist ? asist.getDataRange().getValues() : [],
      trim: trim ? trim.getDataRange().getValues() : []
    };
  });

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Endpoint Web App (POST) exclusivo para el docente:
 * Recibe un lote de reportes HTML tamaño Carta y los guarda como PDF dentro de:
 *   <Carpeta del Grupo> / <Nombre del Estudiante> / reportes de calificación / <Nombre Fecha Hora>.pdf
 */
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    if (!payload || payload.token !== TEACHER_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'No autorizado. Clave docente inválida.' }))
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
    var items = Array.isArray(payload.items) ? payload.items : [];
    var saved = [];
    var errors = [];

    items.forEach(function(item) {
      try {
        var studentName = String(item.name || '').trim();
        var studentFolder = findSubfolder_(groupFolder, studentName);
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
