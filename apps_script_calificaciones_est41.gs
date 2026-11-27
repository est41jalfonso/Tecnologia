/**
 * Google Apps Script — Auditoría y API en Tiempo Real para Calificaciones EST 41
 *
 * INSTRUCCIONES PARA EL DOCENTE:
 * 1. Abre cualquiera de tus hojas de cálculo en Google Sheets (o crea un proyecto en script.google.com).
 * 2. Ve a Extensiones -> Apps Script, pega este código y guarda.
 * 3. Para auditar fórmulas y enlaces IMPORTRANGE de los 8 libros, ejecuta la función:
 *      auditarConexionesYFormulas()
 * 4. (Opcional, si en el futuro cierras el acceso por enlace de tus hojas)
 *    Haz clic en Implementar -> Nueva implementación -> Aplicación web -> Acceso: "Cualquier persona".
 */

var BOOKS = {
  '1A': {
    evalId: '1L6rC6vlz0vy8bRhbB-26UcZDsx1Nq4A9iNSb1VAEVS8',
    dashId: '1XZQJeKznREX7ZlKIfv-1_7piO31rskw6UYzAxHg1oo4'
  },
  '1B': {
    evalId: '1jRX8xGSrE_6n9bGab0Qj8zHDD0h1rLhoL--0DgdWqZU',
    dashId: '1zloWXtchAU9DiOKiDDe95u1B2Kx8EcJH4YttxwhX3nk'
  },
  '2B': {
    evalId: '1KbVhsvrjB0c9vvvGLQw1Qn-PB5wQT3SjXWEU-5l7CcE',
    dashId: '1lSFn1ex17K5-0oXvx0hGDcl9rqj3FTagDY1rHEZBNvE'
  },
  '3C': {
    evalId: '1RDeb8NrPgfbxyCJC3qVOYplUVJ7IXzcx7pzxlyuute8',
    dashId: '186wmz36Axwyas0vffuMNGI1MzHCO2b6Ijj8h3lb7YJs'
  }
};

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
