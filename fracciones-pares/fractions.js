// Generador de 340+ fracciones únicas con ilustraciones SVG exactas (partes iluminadas vs sin iluminar)
(function () {
  const PALETTE = ['#0284C7', '#7C3AED', '#059669', '#D97706'];

  function renderCircleSvg(num, den, color) {
    const cx = 60, cy = 60, r = 55;
    const sw = den <= 12 ? 2.4 : (den <= 26 ? 1.6 : (den <= 50 ? 1.1 : 0.7));
    let slices = '';
    for (let i = 0; i < den; i++) {
      const a0 = (-90 + (360 * i) / den) * (Math.PI / 180);
      const a1 = (-90 + (360 * (i + 1)) / den) * (Math.PI / 180);
      const x0 = (cx + r * Math.cos(a0)).toFixed(2);
      const y0 = (cy + r * Math.sin(a0)).toFixed(2);
      const x1 = (cx + r * Math.cos(a1)).toFixed(2);
      const y1 = (cy + r * Math.sin(a1)).toFixed(2);
      const largeArc = 360 / den > 180 ? 1 : 0;
      const fill = i < num ? color : '#FFFFFF';
      slices += `<path d="M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1} Z" fill="${fill}" stroke="#0F172A" stroke-width="${sw}" stroke-linejoin="round"/>`;
    }
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <circle cx="60" cy="60" r="57" fill="#F8FAFC"/>
      ${slices}
    </svg>`;
  }

  function renderBarSvg(num, den, color) {
    const xStart = 4, yStart = 20, totalW = 112, h = 80;
    const segW = totalW / den;
    let rects = '';
    for (let i = 0; i < den; i++) {
      const x = (xStart + i * segW).toFixed(2);
      const fill = i < num ? color : '#FFFFFF';
      rects += `<rect x="${x}" y="${yStart}" width="${segW.toFixed(2)}" height="${h}" fill="${fill}" stroke="#0F172A" stroke-width="${den > 16 ? 1.5 : 2.4}"/>`;
    }
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <rect x="2" y="16" width="116" height="88" rx="8" fill="#F8FAFC"/>
      ${rects}
    </svg>`;
  }

  function getGridDims(den) {
    const map = {
      6: [2, 3], 8: [2, 4], 9: [3, 3], 10: [2, 5], 12: [3, 4],
      14: [2, 7], 15: [3, 5], 16: [4, 4], 18: [3, 6], 20: [4, 5],
      21: [3, 7], 22: [2, 11], 24: [4, 6], 25: [5, 5], 26: [2, 13],
      30: [5, 6], 36: [6, 6], 40: [5, 8], 50: [5, 10], 100: [10, 10]
    };
    return map[den] || null;
  }

  function renderGridSvg(num, den, color) {
    const dims = getGridDims(den);
    if (!dims) return renderBarSvg(num, den, color);
    const [rows, cols] = dims;
    const pad = 5, size = 110;
    const cw = size / cols, ch = size / rows;
    let cells = '';
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const fill = idx < num ? color : '#FFFFFF';
        cells += `<rect x="${(pad + c * cw).toFixed(2)}" y="${(pad + r * ch).toFixed(2)}" width="${cw.toFixed(2)}" height="${ch.toFixed(2)}" fill="${fill}" stroke="#0F172A" stroke-width="${den >= 36 ? 1.2 : 2}"/>`;
        idx++;
      }
    }
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <rect x="2" y="2" width="116" height="116" rx="8" fill="#F8FAFC"/>
      ${cells}
    </svg>`;
  }

  function levelForDen(den) {
    if (den <= 6) return 'Básico (2 a 6)';
    if (den <= 12) return 'Intermedio (7 a 12)';
    if (den <= 20) return 'Avanzado (13 a 20)';
    return 'Reto (21 a 100)';
  }

  const FRACTIONS = [];
  let colorIdx = 0;

  // 1. Todas las fracciones propias con denominadores de 2 a 26 -> 325 fracciones únicas en formato pastel redondo
  for (let den = 2; den <= 26; den++) {
    for (let num = 1; num < den; num++) {
      const color = PALETTE[colorIdx % PALETTE.length];
      colorIdx++;
      FRACTIONS.push({
        id: `f-${num}-${den}`,
        num,
        den,
        label: `${num}/${den}`,
        level: levelForDen(den),
        hint: `${num} ${num === 1 ? 'parte iluminada' : 'partes iluminadas'} de ${den} partes iguales.`,
        svg: renderCircleSvg(num, den, color)
      });
    }
  }

  // 2. Fracciones adicionales en formato pastel redondo (denominadores 30, 36, 40, 50, 100 -> +20 fracciones, total 345)
  const extraPairs = [
    [7, 30], [11, 30], [17, 30], [23, 30],
    [5, 36], [11, 36], [19, 36], [25, 36],
    [9, 40], [15, 40], [27, 40], [33, 40],
    [7, 50], [19, 50], [31, 50], [43, 50],
    [10, 100], [25, 100], [50, 100], [75, 100]
  ];
  extraPairs.forEach(([num, den]) => {
    const color = PALETTE[colorIdx % PALETTE.length];
    colorIdx++;
    FRACTIONS.push({
      id: `f-${num}-${den}`,
      num,
      den,
      label: `${num}/${den}`,
      level: levelForDen(den),
      hint: `${num} partes iluminadas de ${den} partes iguales.`,
      svg: renderCircleSvg(num, den, color)
    });
  });

  window.FRACTIONS_PAIRS_BANK = FRACTIONS;
})();
