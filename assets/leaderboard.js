/**
 * PortalLeaderboard — Panel Top 5 de Logros (0 a 5 estrellas) para Primaria y Secundaria
 * Combina registros locales de misiones con la Base Maestra de Secundaria EST 41.
 */
(function () {
  const STORAGE_KEY = 'est41_leaderboard_records_v1';
  const SEC_DB_URL = 'https://script.google.com/macros/s/AKfycbz3BqG3ZjnbU82z1VC2jw4ZMQVWs5Fmudb_0y0dPQ7Frr5_91CRnLtCHjSBFypCp30d/exec';
  const SEC_GROUPS = ['1A', '1B', '2B', '3C'];
  const GROUP_LABELS = { '1A': '1.º A', '1B': '1.º B', '2B': '2.º B', '3C': '3.º C', '3A': '3.º A' };
  const secCache = {};

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  function gradeToStars(grade) {
    const g = Number(grade) || 0;
    if (g >= 9.2) return 5;
    if (g >= 8.0) return 4;
    if (g >= 6.8) return 3;
    if (g >= 5.5) return 2;
    if (g > 0) return 1;
    return 0;
  }

  function renderStarsHtml(stars, dark) {
    const s = Math.max(0, Math.min(5, Math.round(Number(stars) || 0)));
    const filled = '★'.repeat(s);
    const empty = '☆'.repeat(5 - s);
    const filledColor = dark ? '#fbbf24' : '#f59e0b';
    const emptyColor = dark ? '#475569' : '#cbd5e1';
    return `<span aria-label="${s} de 5 estrellas" style="letter-spacing:1px;font-size:0.95rem;line-height:1;">` +
      `<span style="color:${filledColor};">${filled}</span>` +
      `<span style="color:${emptyColor};">${empty}</span>` +
      `</span>`;
  }

  function loadLocalRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveLocalRecords(records) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(-400)));
    } catch {
      // Ignorar si localStorage está lleno
    }
  }

  function recordAchievement(entry) {
    if (!entry || !entry.studentName) return;
    const scope = entry.scope === 'secundaria' ? 'secundaria' : 'primaria';
    const grade = Math.max(0, Math.min(10, Number(entry.grade) || 0));
    const stars = entry.stars != null ? Math.max(0, Math.min(5, Number(entry.stars))) : gradeToStars(grade);
    const records = loadLocalRecords();
    records.push({
      scope,
      gameId: String(entry.gameId || 'general'),
      gameName: String(entry.gameName || 'Misión'),
      studentName: String(entry.studentName).trim(),
      group: String(entry.group || (scope === 'primaria' ? '3A' : '')).trim(),
      grade: Math.round(grade * 10) / 10,
      stars,
      score: Number(entry.score) || 0,
      ts: Date.now()
    });
    saveLocalRecords(records);
  }

  async function fetchSecGroup(groupCode) {
    if (secCache[groupCode]) return secCache[groupCode];
    const resp = await fetch(`${SEC_DB_URL}?action=snapshot&group=${encodeURIComponent(groupCode)}`, { cache: 'no-store' });
    const data = await resp.json();
    if (data && data.ok && data.snap && data.snap.studentsByN) {
      const list = Object.values(data.snap.studentsByN)
        .filter((s) => s && s.name)
        .map((s) => ({
          name: String(s.name).trim(),
          group: groupCode,
          average: Number(s.average || s.finalGrade || 0),
          projectsDone: Array.isArray(s.projects) ? s.projects.filter((p) => p && p.score != null).length : 0
        }));
      secCache[groupCode] = list;
      return list;
    }
    return [];
  }

  function aggregateLocalByStudent(scope, groupFilter) {
    const records = loadLocalRecords().filter((r) => r.scope === scope);
    // También incluir historial de KeyStrike si estamos en secundaria
    if (scope === 'secundaria') {
      try {
        const ksRaw = localStorage.getItem('keystrike_est41_history_v1');
        const ksList = ksRaw ? JSON.parse(ksRaw) : [];
        if (Array.isArray(ksList)) {
          ksList.forEach((k) => {
            if (k && k.student && k.student !== 'Práctica Libre') {
              const gMatch = String(k.group || '').replace(/[^0-9A-Za-z]/g, '').toUpperCase();
              records.push({
                scope: 'secundaria',
                gameId: 'keystrike',
                gameName: 'KeyStrike',
                studentName: k.student,
                group: gMatch || k.group || '',
                grade: Number(k.grade) || 0,
                stars: gradeToStars(k.grade),
                score: Number(k.score) || 0,
                ts: 0
              });
            }
          });
        }
      } catch {
        // Ignorar errores de parseo
      }
    }

    const map = new Map();
    records.forEach((r) => {
      if (groupFilter && groupFilter !== 'ALL' && r.group && r.group.toUpperCase() !== groupFilter.toUpperCase()) return;
      const key = `${r.studentName.toUpperCase()}|${(r.group || '').toUpperCase()}`;
      if (!map.has(key)) {
        map.set(key, {
          name: r.studentName,
          group: r.group || (scope === 'primaria' ? '3A' : ''),
          totalGrade: 0,
          count: 0,
          bestGrade: 0,
          totalScore: 0,
          games: new Set()
        });
      }
      const acc = map.get(key);
      acc.totalGrade += Number(r.grade) || 0;
      acc.count += 1;
      acc.bestGrade = Math.max(acc.bestGrade, Number(r.grade) || 0);
      acc.totalScore += Number(r.score) || 0;
      acc.games.add(r.gameName || r.gameId);
    });
    return map;
  }

  async function buildTop5(scope, groupFilter) {
    const localMap = aggregateLocalByStudent(scope, groupFilter);

    if (scope === 'primaria') {
      const list = Array.from(localMap.values()).map((item) => {
        const avg = item.count > 0 ? item.totalGrade / item.count : 0;
        const stars = gradeToStars(avg);
        return {
          name: item.name,
          group: '3.º A',
          stars,
          grade: Math.round(avg * 10) / 10,
          missions: item.count,
          score: item.totalScore,
          detail: `${item.count} misión${item.count === 1 ? '' : 'es'} • Prom: ${avg.toFixed(1)}`
        };
      });
      list.sort((a, b) => b.stars - a.stars || b.grade - a.grade || b.missions - a.missions || b.score - a.score);
      return list.slice(0, 5);
    }

    // Secundaria: consultar Base Maestra de los grupos seleccionados
    const targetGroups = groupFilter && groupFilter !== 'ALL' ? [groupFilter] : SEC_GROUPS;
    const groupResults = await Promise.all(targetGroups.map((g) => fetchSecGroup(g).catch(() => [])));
    const merged = new Map();

    groupResults.flat().forEach((st) => {
      const key = `${st.name.toUpperCase()}|${st.group.toUpperCase()}`;
      const local = localMap.get(key);
      const localAvg = local && local.count > 0 ? local.totalGrade / local.count : 0;
      const combinedGrade = local && local.count > 0
        ? Math.max(st.average, (st.average * 0.6) + (localAvg * 0.4))
        : st.average;
      const stars = gradeToStars(combinedGrade);
      merged.set(key, {
        name: st.name,
        group: GROUP_LABELS[st.group] || st.group,
        stars,
        grade: Math.round(combinedGrade * 10) / 10,
        missions: (local ? local.count : 0) + st.projectsDone,
        score: local ? local.totalScore : Math.round(combinedGrade * 100),
        detail: local && local.count > 0
          ? `Base: ${st.average.toFixed(1)} • ${local.count} misión(es)`
          : `Base Maestra: ${st.average.toFixed(1)}/10`
      });
    });

    // Incluir también registros locales que no hayan coincidido exactamente con la base
    localMap.forEach((item, key) => {
      if (!merged.has(key)) {
        const avg = item.count > 0 ? item.totalGrade / item.count : 0;
        merged.set(key, {
          name: item.name,
          group: GROUP_LABELS[item.group] || item.group || 'EST 41',
          stars: gradeToStars(avg),
          grade: Math.round(avg * 10) / 10,
          missions: item.count,
          score: item.totalScore,
          detail: `${item.count} misión(es) • Prom: ${avg.toFixed(1)}`
        });
      }
    });

    const list = Array.from(merged.values());
    list.sort((a, b) => b.stars - a.stars || b.grade - a.grade || b.missions - a.missions || b.score - a.score);
    return list.slice(0, 5);
  }

  async function renderTop5Panel(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scope = options.scope === 'secundaria' ? 'secundaria' : 'primaria';
    const dark = options.theme === 'dark';
    let currentGroup = options.defaultGroup || 'ALL';

    const cardBg = dark
      ? 'background:rgba(15,23,42,0.85);border:1px solid rgba(56,189,248,0.35);color:#f8fafc;'
      : 'background:#ffffff;border:2px solid #fde68a;color:#0f172a;';
    const subColor = dark ? '#94a3b8' : '#475569';
    const rowBg = dark ? 'background:rgba(30,41,59,0.75);border:1px solid rgba(148,163,184,0.2);' : 'background:#fffbeb;border:1px solid #fde68a;';
    const selectStyle = dark
      ? 'background:#1e293b;color:#f8fafc;border:1px solid #475569;border-radius:8px;padding:4px 8px;font-size:0.75rem;font-weight:700;'
      : 'background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;border-radius:8px;padding:4px 8px;font-size:0.75rem;font-weight:700;';

    container.innerHTML = `
      <div style="${cardBg}border-radius:18px;padding:14px 16px;text-align:left;box-shadow:0 4px 14px rgba(15,23,42,0.06);">
        <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;">
          <div>
            <div style="font-weight:800;font-size:0.95rem;display:flex;align-items:center;gap:6px;">
              <span>🏆</span>
              <span>Top 5 Mejores Logros • ${scope === 'secundaria' ? 'Secundaria EST 41' : 'Primaria 3.º A'}</span>
            </div>
            <div style="font-size:0.75rem;color:${subColor};font-weight:600;margin-top:2px;">
              Avance de misiones y base de datos (0 a 5 estrellas ★)
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            ${scope === 'secundaria' ? `
              <select data-lb-group style="${selectStyle}" aria-label="Filtrar Top 5 por grupo">
                <option value="ALL">Todos los grupos</option>
                <option value="1A">1.º A</option>
                <option value="1B">1.º B</option>
                <option value="2B">2.º B</option>
                <option value="3C">3.º C</option>
              </select>
            ` : ''}
            <button type="button" data-lb-refresh style="${selectStyle}cursor:pointer;" title="Actualizar ranking">↻</button>
          </div>
        </div>
        <div data-lb-list style="display:flex;flex-direction:column;gap:6px;">
          <div style="font-size:0.8rem;color:${subColor};padding:8px 0;">Cargando Top 5 de logros…</div>
        </div>
      </div>
    `;

    const listEl = container.querySelector('[data-lb-list]');
    const groupSel = container.querySelector('[data-lb-group]');
    const refreshBtn = container.querySelector('[data-lb-refresh]');
    if (groupSel) groupSel.value = currentGroup;

    async function refresh() {
      if (listEl) listEl.innerHTML = `<div style="font-size:0.8rem;color:${subColor};padding:6px 0;">Consultando base de datos…</div>`;
      const top5 = await buildTop5(scope, currentGroup);
      if (!listEl) return;
      if (!top5.length) {
        listEl.innerHTML = `
          <div style="${rowBg}border-radius:12px;padding:10px 12px;font-size:0.8rem;color:${subColor};font-weight:600;">
            Aún no hay misiones evaluadas registradas en este dispositivo. ¡Completa una misión para ganar hasta 5 estrellas ★★★★★ y aparecer en el Top 5!
          </div>
        `;
        return;
      }
      const medals = ['🥇', '🥈', '🥉', '4°', '5°'];
      listEl.innerHTML = top5.map((st, idx) => `
        <div style="${rowBg}border-radius:12px;padding:8px 11px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">
            <span style="font-size:1rem;font-weight:800;min-width:24px;text-align:center;">${medals[idx] || (idx + 1) + '°'}</span>
            <div style="min-width:0;">
              <div style="font-weight:800;font-size:0.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(st.name)}</div>
              <div style="font-size:0.7rem;color:${subColor};font-weight:600;">${escapeHtml(st.group)} • ${escapeHtml(st.detail)}</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
            ${renderStarsHtml(st.stars, dark)}
            <span style="font-weight:800;font-size:0.78rem;padding:2px 7px;border-radius:999px;background:${dark ? 'rgba(56,189,248,0.2)' : '#fef3c7'};color:${dark ? '#7dd3fc' : '#92400e'};">
              ${st.grade.toFixed(1)}
            </span>
          </div>
        </div>
      `).join('');
    }

    if (groupSel) {
      groupSel.addEventListener('change', (e) => {
        currentGroup = e.target.value;
        refresh();
      });
    }
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        if (scope === 'secundaria') {
          Object.keys(secCache).forEach((k) => delete secCache[k]);
        }
        refresh();
      });
    }

    refresh();
  }

  window.PortalLeaderboard = {
    gradeToStars,
    recordAchievement,
    renderTop5Panel
  };
})();
