// Motor interactivo compartido: Accesibilidad (A-/A+/Alto Contraste), Navegación Móvil,
// Reproductor YouTube embebido, Copiado de Prompts y Filtros de Materiales.
(function () {
  const SCALE_KEY = 'portal_text_scale';
  const CONTRAST_KEY = 'portal_high_contrast';
  const SCALES = [100, 115, 130];

  const NAV_ITEMS = [
    { href: 'index.html', label: 'Inicio', icon: 'home' },
    { href: 'secundaria-est41.html', label: 'Secundaria Técnica 41', icon: 'precision_manufacturing' },
    { href: 'aprende-jugando.html', label: 'Aprende Jugando', icon: 'sports_esports' },
    { href: 'primaria-teodoro-olivares.html', label: 'Primaria Teodoro Olivares', icon: 'school' },
    {
      id: 'ciencia-contigo',
      label: 'La ciencia contigo',
      icon: 'science',
      children: [
        { href: 'conociendo-el-universo.html', label: 'Conociendo el universo', icon: 'public' },
        { href: 'dispositivos-por-dentro.html', label: 'Conoce los dispositivos tecnológicos por dentro', icon: 'memory' }
      ]
    },
    {
      id: 'docentes',
      label: 'Docentes',
      icon: 'co_present',
      children: [
        { href: 'google-docentes.html', label: 'Google para Docentes', icon: 'devices' },
        { href: 'ia-docentes.html', label: 'IA para Docentes', icon: 'psychology' },
        { href: 'materiales-docentes.html', label: 'Materiales Docentes', icon: 'folder_open' }
      ]
    }
  ];

  function renderNavHtml(file, prefix) {
    return NAV_ITEMS.map((item) => {
      if (item.children && item.children.length) {
        const hasActiveChild = item.children.some((c) => c.href === file);
        const subId = prefix + '-group-' + item.id;
        const childrenHtml = item.children.map((c) => {
          const cur = c.href === file ? ' aria-current="page"' : '';
          return `<a href="${c.href}"${cur}><span class="material-symbols-outlined" aria-hidden="true" style="font-size:18px;">${c.icon}</span><span>${c.label}</span></a>`;
        }).join('');
        return `
          <div class="portal-nav-group">
            <button type="button" class="portal-nav-toggle${hasActiveChild ? ' is-active-group' : ''}" aria-expanded="${hasActiveChild ? 'true' : 'false'}" aria-controls="${subId}">
              <span class="portal-nav-toggle-left">
                <span class="material-symbols-outlined" aria-hidden="true" style="font-size:20px;">${item.icon}</span>
                <span>${item.label}</span>
              </span>
              <span class="material-symbols-outlined portal-nav-chevron" aria-hidden="true">expand_more</span>
            </button>
            <div id="${subId}" class="portal-nav-submenu"${hasActiveChild ? '' : ' hidden'}>
              ${childrenHtml}
            </div>
          </div>
        `;
      }
      const cur = item.href === file ? ' aria-current="page"' : '';
      return `<a href="${item.href}"${cur}><span class="material-symbols-outlined" aria-hidden="true" style="font-size:20px;">${item.icon}</span><span>${item.label}</span></a>`;
    }).join('');
  }

  function bindNavAccordions(root) {
    if (!root) return;
    root.querySelectorAll('.portal-nav-toggle').forEach((toggleBtn) => {
      toggleBtn.addEventListener('click', () => {
        const targetId = toggleBtn.getAttribute('aria-controls');
        const submenu = targetId ? document.getElementById(targetId) : null;
        if (!submenu) return;
        const nextOpen = toggleBtn.getAttribute('aria-expanded') !== 'true';
        toggleBtn.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
        submenu.hidden = !nextOpen;
      });
    });
  }

  function currentFile() {
    const file = window.location.pathname.split('/').pop();
    return file && file.endsWith('.html') ? file : 'index.html';
  }

  function showToast(msg) {
    let toast = document.getElementById('portal-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'portal-toast';
      toast.className = 'portal-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.hidden = true;
    }, 3200);
  }

  function getSavedScale() {
    const val = parseInt(localStorage.getItem(SCALE_KEY) || '100', 10);
    return SCALES.includes(val) ? val : 100;
  }

  function applyScale(scale) {
    document.documentElement.style.fontSize = scale + '%';
    localStorage.setItem(SCALE_KEY, String(scale));
    document.querySelectorAll('[data-a11y-scale-label]').forEach((el) => {
      el.textContent = scale + '%';
    });
  }

  function applyContrast(enabled) {
    document.documentElement.classList.toggle('high-contrast', enabled);
    localStorage.setItem(CONTRAST_KEY, enabled ? '1' : '0');
    document.querySelectorAll('[data-a11y-contrast]').forEach((btn) => {
      btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    });
  }

  function stepScale(delta) {
    const current = getSavedScale();
    const idx = SCALES.indexOf(current);
    const nextIdx = Math.max(0, Math.min(SCALES.length - 1, idx + delta));
    applyScale(SCALES[nextIdx]);
    showToast('Tamaño de texto: ' + SCALES[nextIdx] + '%');
  }

  function bindAccessibilityControls() {
    applyScale(getSavedScale());
    applyContrast(localStorage.getItem(CONTRAST_KEY) === '1');

    let hasContrastBtn = false;
    document.querySelectorAll('button').forEach((btn) => {
      const txt = (btn.textContent || '').replace(/\s+/g, ' ').trim();
      if (txt === 'A-' || btn.dataset.a11yAction === 'decrease') {
        btn.setAttribute('aria-label', 'Reducir tamaño de texto');
        btn.addEventListener('click', () => stepScale(-1));
      } else if (txt === 'A+' || btn.dataset.a11yAction === 'increase') {
        btn.setAttribute('aria-label', 'Aumentar tamaño de texto');
        btn.addEventListener('click', () => stepScale(1));
      } else if (txt === 'A' || txt === '100%' || btn.dataset.a11yAction === 'reset') {
        btn.setAttribute('data-a11y-scale-label', 'true');
        btn.setAttribute('aria-label', 'Restablecer tamaño de texto al 100%');
        btn.addEventListener('click', () => {
          applyScale(100);
          showToast('Tamaño de texto restablecido al 100%');
        });
      } else if (txt.toLowerCase().includes('contrast') || btn.hasAttribute('data-a11y-contrast')) {
        hasContrastBtn = true;
        btn.setAttribute('data-a11y-contrast', 'true');
        btn.setAttribute('aria-label', 'Activar o desactivar alto contraste');
        btn.addEventListener('click', () => {
          const next = !document.documentElement.classList.contains('high-contrast');
          applyContrast(next);
          showToast(next ? 'Modo Alto Contraste activado' : 'Modo Alto Contraste desactivado');
        });
      }
    });

    if (!hasContrastBtn) {
      const aPlusBtn = Array.from(document.querySelectorAll('header button')).find(
        (b) => (b.textContent || '').trim() === 'A+'
      );
      if (aPlusBtn && aPlusBtn.parentElement) {
        const cBtn = document.createElement('button');
        cBtn.type = 'button';
        cBtn.setAttribute('data-a11y-contrast', 'true');
        cBtn.setAttribute('aria-pressed', localStorage.getItem(CONTRAST_KEY) === '1' ? 'true' : 'false');
        cBtn.setAttribute('aria-label', 'Activar o desactivar alto contraste');
        cBtn.className = 'ml-1 px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-bold hover:bg-slate-100';
        cBtn.textContent = 'Contraste';
        cBtn.addEventListener('click', () => {
          const next = !document.documentElement.classList.contains('high-contrast');
          applyContrast(next);
          showToast(next ? 'Modo Alto Contraste activado' : 'Modo Alto Contraste desactivado');
        });
        aPlusBtn.parentElement.appendChild(cBtn);
      }
    }
  }

  function setupMobileDrawer() {
    const header = document.querySelector('header');
    if (!header) return;
    const container = header.querySelector('div') || header;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'portal-mobile-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menú de navegación');
    btn.innerHTML = '<span aria-hidden="true">☰</span> Menú';
    container.appendChild(btn);

    const drawer = document.createElement('div');
    drawer.className = 'portal-mobile-drawer';
    drawer.hidden = true;
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Menú principal');

    const file = currentFile();
    const navLinksHtml = renderNavHtml(file, 'mobile');

    drawer.innerHTML = `
      <div class="portal-mobile-panel">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <strong style="font-size:1.1rem;">Navegación del Portal</strong>
          <button type="button" data-close-drawer style="min-width:44px;min-height:44px;border-radius:8px;border:1px solid #cbd5e1;font-weight:700;cursor:pointer;">✕</button>
        </div>
        ${navLinksHtml}
      </div>
    `;
    document.body.appendChild(drawer);
    bindNavAccordions(drawer);

    function close() {
      drawer.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }

    btn.addEventListener('click', () => {
      drawer.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      const closeBtn = drawer.querySelector('[data-close-drawer]');
      if (closeBtn) closeBtn.focus();
    });

    drawer.querySelector('[data-close-drawer]').addEventListener('click', close);
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !drawer.hidden) close();
    });
  }

  function openVideoModal(videoId, title, externalUrl, embedUrl, fallbackEmbedUrl) {
    let modal = document.getElementById('portal-video-modal');
    const prevFocus = document.activeElement;
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'portal-video-modal';
      modal.className = 'portal-video-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'portal-video-title');
      modal.innerHTML = `
        <div class="portal-video-dialog">
          <div class="portal-video-head">
            <h2 id="portal-video-title" style="margin:0;font-size:1.05rem;font-weight:700;line-height:1.3;"></h2>
            <button type="button" id="portal-video-close" aria-label="Cerrar reproductor" style="min-width:44px;min-height:44px;flex-shrink:0;border-radius:8px;border:1px solid #cbd5e1;background:#ffffff;font-weight:700;cursor:pointer;">✕</button>
          </div>
          <div class="portal-video-frame-wrap">
            <iframe id="portal-video-iframe" title="Reproductor de video educativo" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>
          </div>
          <div class="portal-video-foot">
            <button type="button" id="portal-video-switch" hidden style="padding:8px 12px;border-radius:8px;border:1px solid #cbd5e1;background:#ffffff;color:#0f172a;font-weight:700;font-size:0.8rem;cursor:pointer;min-height:44px;white-space:nowrap;">Cambiar reproductor</button>
            <a id="portal-video-ext" href="#" target="_blank" rel="noopener noreferrer" style="padding:8px 14px;border-radius:8px;background:#0f172a;color:#ffffff;font-weight:700;font-size:0.85rem;text-decoration:none;min-height:44px;display:inline-flex;align-items:center;white-space:nowrap;flex-shrink:0;margin-left:auto;">Visitar canal de TikTok ↗</a>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeModal = () => {
        modal.hidden = true;
        document.getElementById('portal-video-iframe').src = '';
        if (prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus();
      };
      modal.querySelector('#portal-video-close').addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) closeModal();
      });
    }

    const dialog = modal.querySelector('.portal-video-dialog');
    if (dialog) {
      dialog.classList.toggle('is-vertical', Boolean(embedUrl && embedUrl.indexOf('tiktok.com') !== -1));
    }
    document.getElementById('portal-video-title').textContent = title || 'Video educativo';
    const extBtn = document.getElementById('portal-video-ext');
    extBtn.href = externalUrl || ('https://www.youtube.com/watch?v=' + videoId);
    extBtn.textContent = embedUrl ? 'Visitar canal de TikTok ↗' : 'Abrir en YouTube ↗';
    const iframeEl = document.getElementById('portal-video-iframe');
    iframeEl.src = embedUrl || ('https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1');
    const switchBtn = document.getElementById('portal-video-switch');
    if (switchBtn) {
      if (embedUrl && fallbackEmbedUrl) {
        let usingFallback = false;
        switchBtn.hidden = false;
        switchBtn.textContent = '¿No carga? Reproductor alternativo';
        switchBtn.onclick = () => {
          usingFallback = !usingFallback;
          iframeEl.src = usingFallback ? fallbackEmbedUrl : embedUrl;
          switchBtn.textContent = usingFallback ? 'Volver a reproductor principal' : '¿No carga? Reproductor alternativo';
        };
      } else {
        switchBtn.hidden = true;
        switchBtn.onclick = null;
      }
    }
    modal.hidden = false;
    document.getElementById('portal-video-close').focus();
  }

  function bindVideoTriggers() {
    document.querySelectorAll('[data-video-id], [data-embed-url]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openVideoModal(el.dataset.videoId || '', el.dataset.videoTitle, el.dataset.videoUrl, el.dataset.embedUrl || '', el.dataset.fallbackEmbedUrl || '');
      });
    });

    const knownVideos = [
      { match: 'xavier mitjana', id: 'vqE6pZ84Jq4', title: 'Xavier Mitjana — IA Generativa', url: 'https://www.youtube.com/@XavierMitjana' },
      { match: 'barberá aledo', id: 'H_1h8m1tXj8', title: 'Joaquín Barberá Aledo — IA Educativa', url: 'https://www.youtube.com/@joaquinbarberaaledo' },
      { match: 'alejavi rivera', id: 'rnpsuTgfMT0', title: 'Alejavi Rivera — Flujos con IA', url: 'https://www.youtube.com/@alejavirivera' },
      { match: 'joseph gooding', id: 'B-O7Aq3R08Y', title: 'Joseph Gooding — IA y Programación', url: 'https://www.youtube.com/@JosephGooding' },
      { match: 'méxico lindo', id: 'e1n96JCvEZA', title: 'Documental: México lindo, maestros artesanos', url: 'https://youtu.be/e1n96JCvEZA' }
    ];

    document.querySelectorAll('article, div[class*="rounded-2xl"], div[class*="rounded-xl"]').forEach((card) => {
      const cardText = (card.textContent || '').toLowerCase();
      const found = knownVideos.find((v) => cardText.includes(v.match));
      if (!found) return;
      card.querySelectorAll('button, a').forEach((ctrl) => {
        const label = (ctrl.textContent || '').toLowerCase();
        if (label.includes('reproducir') || label.includes('play_arrow') || label.includes('play_circle')) {
          ctrl.addEventListener('click', (e) => {
            e.preventDefault();
            openVideoModal(found.id, found.title, found.url);
          });
        }
      });
    });
  }

  function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopyText(text));
    }
    return Promise.resolve(fallbackCopyText(text));
  }

  function fallbackCopyText(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  function bindPromptCopyButtons() {
    document.querySelectorAll('button').forEach((btn) => {
      const txt = (btn.textContent || '').trim();
      if (btn.hasAttribute('data-copy-target') || txt.toLowerCase().includes('copiar prompt')) {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-copy-target');
          let codeEl = targetId ? document.getElementById(targetId) : null;
          if (!codeEl) {
            const card = btn.closest('article, div[class*="rounded"]');
            codeEl = card ? (card.querySelector('code, pre, blockquote') || card.querySelector('p')) : null;
          }
          const textToCopy = codeEl ? codeEl.textContent.trim() : txt;
          copyTextToClipboard(textToCopy).then(() => {
            showToast('Prompt copiado al portapapeles');
            const labelSpan = btn.querySelector('span:last-child');
            if (labelSpan && !btn._copyTimer) {
              const orig = labelSpan.textContent;
              labelSpan.textContent = '¡Prompt copiado!';
              btn._copyTimer = setTimeout(() => {
                labelSpan.textContent = orig;
                btn._copyTimer = null;
              }, 2000);
            }
          });
        });
      }
    });
  }

  function bindMaterialFilters() {
    const filterButtons = Array.from(document.querySelectorAll('[data-filter-category]'));
    if (!filterButtons.length) return;
    const cards = Array.from(document.querySelectorAll('[data-material-category]'));

    filterButtons.forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.dataset.filterCategory === 'all' ? 'true' : 'false');
      btn.addEventListener('click', () => {
        const cat = btn.dataset.filterCategory;
        filterButtons.forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
        let visibleCount = 0;
        cards.forEach((card) => {
          const match = cat === 'all' || (card.dataset.materialCategory || '').includes(cat);
          card.style.display = match ? '' : 'none';
          if (match) visibleCount++;
        });
        showToast('Mostrando ' + visibleCount + ' materiales');
      });
    });
  }

  function setupSidebar() {
    if (document.querySelector('.portal-sidebar')) return;
    const file = currentFile();
    const linksHtml = renderNavHtml(file, 'sidebar');

    const aside = document.createElement('aside');
    aside.className = 'portal-sidebar';
    aside.setAttribute('aria-label', 'Menú lateral principal');
    aside.innerHTML = `
      <div>
        <a class="portal-brand" href="index.html">
          <span class="portal-brand-mark" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
          <span>
            <strong style="display:block;font-size:1rem;line-height:1.2;">Portal Estudiantil</strong>
            <small style="display:block;font-size:0.7rem;font-weight:700;color:#1d4ed8;letter-spacing:0.04em;">EST 41 • TEODORO OLIVARES</small>
          </span>
        </a>
        <div class="portal-nav-caption">EXPLORAR</div>
        <nav class="portal-sidebar-nav" aria-label="Secciones del sitio">
          ${linksHtml}
        </nav>
      </div>
      <div class="portal-help-card">
        <div style="font-size:1.1rem;font-weight:800;margin-bottom:4px;">✳ ¿Listo para la misión?</div>
        <p style="font-size:0.85rem;color:#334155;margin:0;line-height:1.4;">Elige tu escuela, contesta tus cuestionarios y avanza a tu ritmo.</p>
        <a class="help-cta" href="secundaria-est41.html#formularios-trimestre">Ir a Cuestionarios ↗</a>
      </div>
    `;
    document.body.insertBefore(aside, document.body.firstChild);
    bindNavAccordions(aside);
    document.body.classList.add('has-portal-sidebar');
  }

  function markActiveNav() {
    const file = currentFile();
    document.querySelectorAll('header nav a').forEach((a) => {
      const href = a.getAttribute('href');
      if (href === file) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  function bindImageZoom() {
    const triggers = document.querySelectorAll('[data-zoom-image]');
    if (!triggers.length) return;

    function openImageModal(src, title) {
      let modal = document.getElementById('portal-image-modal');
      const prevFocus = document.activeElement;
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'portal-image-modal';
        modal.className = 'portal-video-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'portal-image-title');
        modal.innerHTML = `
          <div class="portal-image-dialog">
            <div class="portal-video-head">
              <h2 id="portal-image-title" style="margin:0;font-size:1.05rem;font-weight:700;line-height:1.3;"></h2>
              <button type="button" id="portal-image-close" aria-label="Cerrar imagen ampliada" style="min-width:44px;min-height:44px;flex-shrink:0;border-radius:8px;border:1px solid #cbd5e1;background:#ffffff;font-weight:700;cursor:pointer;">✕</button>
            </div>
            <div class="portal-image-body">
              <img id="portal-image-full" src="" alt="" />
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        const closeModal = () => {
          modal.hidden = true;
          document.getElementById('portal-image-full').src = '';
          if (prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus();
        };
        modal.querySelector('#portal-image-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && !modal.hidden) closeModal();
        });
      }
      document.getElementById('portal-image-title').textContent = title || 'Ejemplo de resultado en IA';
      const img = document.getElementById('portal-image-full');
      img.src = src;
      img.alt = title || 'Ejemplo ampliado de resultado en IA';
      modal.hidden = false;
      document.getElementById('portal-image-close').focus();
    }

    triggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        openImageModal(btn.dataset.zoomImage, btn.dataset.zoomTitle || 'Ejemplo de resultado en IA');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupSidebar();
    bindAccessibilityControls();
    setupMobileDrawer();
    bindVideoTriggers();
    bindPromptCopyButtons();
    bindMaterialFilters();
    bindImageZoom();
    markActiveNav();
  });
})();
