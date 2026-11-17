const original = "https://sites.google.com/view/cursosenlinea2k22";
const page = (path) => `${original}/${path}`;
const external = (url) => url.startsWith("http") ? url : `https://${url}`;
const icons = {
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>',
  courses: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20M8 7h8M8 11h7"/></svg>',
  schools: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 9 9-5 9 5-9 5z"/><path d="M6 11v5c3 3 9 3 12 0v-5M21 9v7"/></svg>',
  code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/></svg>',
  workspace: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 9h8M8 13h5M8 17h8"/></svg>',
  mobile: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10 5h4M11 18.5h2"/></svg>',
  media: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></svg>',
  links: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7"/></svg>',
  ai: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="4"/></svg>',
  faq: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 0 1 4.9.7c0 1.7-2.5 2.1-2.5 3.8M12 17h.01"/></svg>'
};

const schools = [
  {name:"Secundaria Técnica 41", route:"secundaria-t%C3%A9cnica-41", view:"escuela-secundaria", description:"Primer formulario del segundo parcial y normas de convivencia.", number:"01", accent:"#1d4ed8"},
  {name:"Primaria Teodoro 3 A", route:"primaria-teodoro-3-a", view:"escuela-primaria", description:"Instrumentos y material de evaluación de Google Calc.", number:"02", accent:"#0f766e"},
  {name:"CBTA 30 Anita Brenner", route:"cbta-30-anita-brenner", view:"escuela-cbta", description:"Actividades de programación, cultura digital y ofimática.", number:"03", accent:"#4338ca"},
  {name:"BEDR 16", route:"bedr-16", view:"escuela-bedr", description:"Oferta educativa, capacitación y encuestas escolares.", number:"04", accent:"#b45309"}
];
const courseCards = [
  {title:"Programación", text:"Lógica, desarrollo web, bases de datos y Python, con recursos para avanzar paso a paso.", route:"programacion", original:"cursosprogramacion", icon:"code", tint:"#eff6ff", color:"#1d4ed8", tag:"NIVEL INICIAL", xp:"+350 XP", reward:"Insignia 'Lógica Viva' · Web, BD y Python", category:"codigo"},
  {title:"Google Workspace", text:"Aprende a crear, organizar y compartir documentos con herramientas de Google.", route:"workspace", original:"cursosgsuite", icon:"workspace", tint:"#f0fdfa", color:"#0f766e", tag:"PRODUCTIVIDAD", xp:"+250 XP", reward:"Insignia 'Guardián de la Nube' · Docs, Gmail y Drive", category:"herramientas"},
  {title:"Inteligencia Artificial", text:"Canales y videos recomendados en YouTube para aprender sobre IA y herramientas actuales.", route:"ia", icon:"ai", tint:"#fffbeb", color:"#b45309", tag:"¡NUEVA MISIÓN!", xp:"+500 XP", reward:"Insignia 'Mente Creativa IA' · 4 Creadores en YouTube", category:"ia"},
  {title:"Dispositivos móviles", text:"Guías prácticas para usar aplicaciones, almacenamiento y funciones del teléfono.", route:"moviles", original:"cursosdispositivosmoviles", icon:"mobile", tint:"#fff7ed", color:"#c2410c", tag:"GUÍAS PRÁCTICAS", xp:"+200 XP", reward:"Insignia 'Explorador Móvil' · Play Store y CamScanner", category:"herramientas"},
  {title:"Imagen y video", text:"Empieza con GIMP y explora recursos para edición de imagen y video.", route:"media", original:"edici%C3%B3n-de-imagen-y-video", icon:"media", tint:"#fff1f2", color:"#be123c", tag:"CREATIVIDAD", xp:"+250 XP", reward:"Insignia 'Estudio Visual' · Edición con GIMP", category:"herramientas"},
  {title:"Otros cursos", text:"Encuentra canales y sitios externos con más cursos gratuitos de informática.", route:"otros", original:"otroscursos", icon:"links", tint:"#eef2ff", color:"#4338ca", tag:"RECURSOS ABIERTOS", xp:"+150 XP", reward:"Insignia 'Comunidad Abierta' · Canales externos", category:"codigo"}
];
const navItems = [
  ["inicio","Inicio","home"], ["cursos","Cursos","courses"], ["escuelas","Escuelas","schools"],
  ["escuela-secundaria","Secundaria Técnica 41","schools"], ["escuela-primaria","Primaria Teodoro 3 A","schools"],
  ["escuela-cbta","CBTA 30 Anita Brenner","schools"], ["escuela-bedr","BEDR 16","schools"],
  ["programacion","Programación","code"], ["workspace","Google Workspace","workspace"],
  ["moviles","Dispositivos móviles","mobile"], ["media","Imagen y video","media"],
  ["ia","Inteligencia Artificial","ai"], ["otros","Otros cursos","links"], ["faq","Preguntas frecuentes","faq"]
];
const link = (label,url,kind="web") => ({label,url:external(url),kind});
const groupForm = (label,url,badge,description,spritePosition,image) => ({...link(label,url,"form"),badge,tag:"2.º PARCIAL",description,spritePosition,image});
const resources = {
  escuelas: {
    "Secundaria Técnica 41": [
      groupForm("1.er formulario · 1ro A","https://forms.gle/GRem7MsR4fjsiZ59A","1A","Innovación, creatividad y colaboración para mejorar la comunidad.","quiz-art-1a"),
      groupForm("1.er formulario · 1ro B","https://forms.gle/zN1gPQTa5kjB3Fy5A","1B","Innovación y pensamiento crítico para resolver retos comunitarios.","quiz-art-1b"),
      groupForm("1.er formulario · 2do B","https://docs.google.com/forms/d/1KXoWvd8s9PF9zqpddohzqQBbL4acbM8bRaEmaJ7epec/viewform","2B","Tecnología, salud y sociedad: dispositivos médicos, educación y cultura digital.","quiz-art-2b","assets/quiz-tech-health.webp"),
      groupForm("1.er formulario · 3ro C","https://forms.gle/CgyBvaR9DwmM2mTR9","3C","Tecnología sustentable, economía local y cuidado del ambiente.","quiz-art-3c"),
      link("Normas de sana convivencia","https://mrenglish.my.canva.site/sana-convivencia"),
      link("Documental: México lindo, maestros artesanos","https://youtu.be/e1n96JCvEZA","video")
    ],
    "Primaria Teodoro 3 A": [
      link("Diagnóstico de Google Calc","https://forms.gle/pkBN6Z6hje7k27AF8","form"),
      link("Evaluación de seguimiento · Google Calc","https://forms.gle/gP3Ykgvtd97zVca96","form"),
      link("Documento de evaluación · Google Calc","https://docs.google.com/spreadsheets/d/1GDxM4zw9tw2qk_C96qiemfH4zPzuc7v-0SN62YCZfeE/edit?usp=sharing","web")
    ],
    "CBTA 30 Anita Brenner": [
      link("Encuadre del curso · Programación","https://forms.gle/RHMTb1b9BPbc3DcB6","form"),
      link("Encuadre del curso · archivo","https://mega.nz/file/ZgIUTZCY#XpE5MjSYqEFvd0eENSovveSyQMDjpYiOMC5OIIgWsYc","pdf"),
      link("Proyecto transversal · fase 1","https://mega.nz/file/04xRBAqb#yjRM4n_CfLc0i17IxpnTjo_HHCd6_qoCz1oVJjtmyoE","pdf"),
      link("Propósitos formativos · Cultura digital","https://mega.nz/file/o8A1VQiQ#Dut5bSQ0pwsDTKnXMcbBRvEChi10bTGlFGup9MNHg0E","pdf"),
      link("Evaluación diagnóstica · Cultura digital","https://mega.nz/file/o4AzGLCK#YQ8fNkIBsNF58iywdxSeaR7H5Jq3K2C9JBIda4rH2aA","pdf"),
      link("Cultura digital II · Padlet","https://padlet.com/josealfonsoruvalcabaandrade/cultural-digital-ii-71hhx2fubuiqdz3n"),
      link("Video: crear páginas web con IA","https://www.youtube.com/watch?v=wksiOesibKg","video"),
      link("Video: NotebookLM y Antigravity","https://www.youtube.com/watch?v=j5aiRhzV5fs","video")
    ],
    "BEDR 16": [
      link("Oferta EMS · Secundaria Técnica 19","https://forms.gle/3kPGMMZvR88uKdqG7","form"),
      link("Oferta EMS · Telesecundaria 81 Ojo Zarco","https://forms.gle/WZjwx4FkKJkYAp4Z9","form"),
      link("Oferta EMS · Telesecundaria 93 Ojo de Agua del Mezquite","https://forms.gle/BXnDJXqXCr6mSKQY6","form"),
      link("Oferta EMS · Telesecundaria 141 Emiliano Zapata","https://forms.gle/7Ju1EEDx4RcRMEax8","form"),
      link("Encuesta · Secundaria Técnica 19","https://forms.gle/DuJSdnrWsdwKwqHv6","form"),
      link("Encuesta · Telesecundaria 81 Ojo Zarco","https://forms.gle/NsTdsT5pTnM652Dd6","form"),
      link("Encuesta · Telesecundaria 93 Ojo de Agua del Mezquite","https://forms.gle/ZEKSmFYhZ3sGA1bK9","form"),
      link("Encuesta · Telesecundaria 141 Emiliano Zapata","https://forms.gle/YDBpKFeciurQWafG7","form")
    ]
  },
  moviles: [
    {title:"Conociendo mi dispositivo móvil", items:[link("Presentación Sway","https://sway.office.com/k7Fahy17LHDmej8h?ref=Link"),link("Videos del curso","https://www.youtube.com/watch?v=PNqx4-l9XXs&list=PLrCXLZZDdHZLwhtCuuVbLF1-_7DgE8KuF","video"),link("Documento PDF","https://mega.nz/file/hl0mTB4K#AvdfpePPenLTf1ZnCCLfRodpL5RfCYnp4job6uPCEQQ","pdf")]},
    {title:"Play Store de Google", items:[link("Presentación Sway","https://sway.office.com/vZcV27VDO7yK1yAr?ref=Link"),link("Video guía","https://youtu.be/ddM_-P9MAA0","video"),link("Documento PDF","https://mega.nz/file/dsEQ1BzA#v_VGUf9iIuSSWNMzYdmXsVorN91-dnH9YGpkq3K8Gx0","pdf")]},
    {title:"CamScanner", items:[link("Presentación Sway","https://sway.office.com/2mxpFF1cyqOsmoMM?ref=Link"),link("Instalación y uso · video","https://youtu.be/l8bQO5G3WQ8","video"),link("Documento PDF","https://mega.nz/file/xs9xGCZJ#N3XbVdGqvIlpZDt3fFqifiJxSxazf1s9lvK6rMpEAvE","pdf")]},
    {title:"Google Drive", items:[link("Presentación Sway","https://sway.office.com/h4Yk7MsFDd7AZn8E?ref=Link"),link("Introducción a Drive · video","https://youtu.be/5PbuyiDlbbM","video"),link("Crear carpeta y documento","https://youtu.be/kgX5dxLxhO0","video"),link("Escanear documento","https://youtu.be/1o_R2WkLXdM","video"),link("Compartir documento","https://youtu.be/ZXyVraFPDag","video"),link("Manual PDF","https://mega.nz/file/111lEaha#h1hDsuruJPOK6D5ktuJqLm0Sk3j2t8vJyy84q5S6K1U","pdf")]}
  ],
  docs: [
    link("Presentación del curso","https://sway.office.com/BwXY9DZH2QSHFjdX?ref=Link"),
    link("Manual Google Docs · volumen 1","https://mega.nz/file/kwd3DADI#bKqewoABcn0Td7kn_dO4hZ1g4n3m3xISuFxMFbZtCLo","pdf"),
    link("Ejercicio 1 · Crear un documento","https://youtu.be/XUduDhtoYvc","video"),
    link("Ejercicio 1 · Material PDF","https://mega.nz/file/9hETUR5R#mycSH5qLmTD7I3GdbiNkRmWgYq-3ZXD6KZvbk6Vwiho","pdf"),
    link("Ejercicio 2 · Mover un documento","https://youtu.be/b7hbXj9sn7Q","video"),
    link("Ejercicio 2 · Material PDF","https://mega.nz/file/pkkTkZCD#DzxNMULqH0Dr309IKdsho5268ysJzzp5cm4AGaKmZlA","pdf"),
    link("Ejercicio 3 · Modo dictado","https://youtu.be/NwZ6ztTnF_k","video"),
    link("Ejercicio 4 · Insertar imagen o dibujo","https://youtu.be/hACtr6bc0w8","video"),
    link("Ejercicio 5 · Márgenes y marca de agua","https://youtu.be/y3XjjZ_KLsY","video"),
    link("Ejercicio 7 · Insertar tabla","https://youtu.be/qV6iOxjOY8M","video")
  ]
};

let schoolMenuOpen=false;
function navMarkup() {
  const navArt={inicio:0,cursos:8,escuelas:0,"escuela-secundaria":0,"escuela-primaria":1,"escuela-cbta":2,"escuela-bedr":2,programacion:3,workspace:4,moviles:5,media:6,ia:3,otros:8,faq:7};
  const entries=navItems.filter(([id])=>!id.startsWith("escuela-"));
  return entries.map(([id,label,icon])=>{
    if(id==="escuelas") {
      const schoolLinks=navItems.filter(([child])=>child.startsWith("escuela-")).map(([child,name])=>`<a class="nav-item nav-subitem" href="#${child}" data-view="${child}"><span class="nav-subdot" style="--art-image:url('assets/learning-${navArt[child]}.webp')" aria-hidden="true"></span><span>${name}</span></a>`).join("");
      return `<button class="nav-item nav-toggle" type="button" data-menu-toggle="schools" aria-expanded="false" aria-controls="school-subnav"><span class="nav-icon" style="--art-image:url('assets/learning-${navArt.escuelas}.webp')" aria-hidden="true"></span><span>${label}</span><span class="nav-chevron" aria-hidden="true">⌄</span></button><div class="nav-subnav is-collapsed" id="school-subnav" aria-label="Secciones de escuelas" inert><a class="nav-item nav-subitem directory-link" href="#escuelas" data-view="escuelas"><span class="nav-subdot directory-dot" aria-hidden="true">⌂</span><span>Todas las escuelas</span></a>${schoolLinks}</div>`;
    }
    return `<a class="nav-item" href="#${id}" data-view="${id}"><span class="nav-icon" style="--art-image:url('assets/learning-${navArt[id]??8}.webp')" aria-hidden="true"></span><span>${label}</span></a>`;
  }).join("");
}
function setSchoolMenuOpen(open) {
  schoolMenuOpen=Boolean(open);
  const toggle=document.querySelector('[data-menu-toggle="schools"]'),submenu=document.getElementById("school-subnav");
  if(toggle) toggle.setAttribute("aria-expanded",String(schoolMenuOpen));
  if(submenu) { submenu.classList.toggle("is-collapsed",!schoolMenuOpen); submenu.inert=!schoolMenuOpen; }
}
function artTile(i,cls="card-art",href=null,view=null,label="Abrir recurso") {
  const imageStyle=`style="--art-image:url('assets/learning-${i}.webp')"`;
  if(!href) return `<span class="${cls} art-image" ${imageStyle} aria-hidden="true"></span>`;
  const target=href.startsWith("http")?' target="_blank" rel="noopener noreferrer"':"";
  const route=view?` data-view="${view}"`:"";
  return `<a class="${cls} art-image" ${imageStyle} href="${href}"${target}${route} aria-label="${label}"></a>`;
}
function button(label,href,kind="light",art=8) { return `<a class="button ${kind}" href="${href}" target="_blank" rel="noopener noreferrer">${artTile(art,"button-art")}<span>${label}</span><span aria-hidden="true">↗</span></a>`; }
function originalBtn(route,label="Ver página original") { return button(label,page(route),"light small"); }
function titleBlock(eyebrow,title,description) { return `<div class="page-title"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${description}</p></div>`; }
let activeCourseFilter = "todas";
function courseFilterBar() {
  const filters = [["todas", "Todas"], ["codigo", "Código"], ["ia", "IA"], ["herramientas", "Herramientas"]];
  return `<div class="filter-bar" role="group" aria-label="Filtrar misiones por tema">${filters.map(([id, label]) => `<button type="button" class="filter-pill" data-course-filter="${id}" aria-pressed="${activeCourseFilter === id}">${label}</button>`).join("")}</div>`;
}
function filteredCourses(limit = null) {
  const list = activeCourseFilter === "todas" ? courseCards : courseCards.filter(c => c.category === activeCourseFilter);
  return limit ? list.slice(0, limit) : list;
}
function courseCard(c) {
  const originalLink = c.original ? `<a class="mini-cta" href="${page(c.original)}" target="_blank" rel="noopener noreferrer" aria-label="Ver ${c.title} en el sitio original">Original ↗</a>` : "";
  return `<article class="card course-card quest-card" style="--tint:${c.tint};--icon:${c.color};--quest-accent:${c.color}">${artTile(courseArt(c), "card-art", `#${c.route}`, c.route, `Abrir la sección ${c.title}`)}<div class="card-top"><span class="quest-xp">${c.xp || "MISIÓN"}</span><span class="tag">${c.tag}</span></div><h3>${c.title}</h3><p>${c.text}</p>${c.reward ? `<div class="quest-reward"><strong>Recompensa:</strong> ${c.reward}</div>` : ""}<div class="card-foot"><a class="button primary small" href="#${c.route}" data-view="${c.route}">Explorar misión <span aria-hidden="true">→</span></a>${originalLink}</div></article>`;
}
function schoolCard(s) {
  return `<article class="card school-card quest-card" style="--quest-accent:${s.accent || '#1d4ed8'}">${artTile(schoolArt(s), "card-art", `#${s.view}`, s.view, `Ver los recursos de ${s.name}`)}<div class="card-top"><span class="school-level-badge">NIVEL ${s.number}</span><span class="tag">PLANTEL</span></div><h3>${s.name}</h3><p>${s.description}</p><div class="card-foot"><a class="button light small" href="#${s.view}" data-view="${s.view}">Entrar al aula <span aria-hidden="true">→</span></a><a class="mini-cta original-mini" href="${page(s.route)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir página original de ${s.name}">Original ↗</a></div></article>`;
}
function courseArt(c) { return ({code:3,workspace:4,mobile:5,media:6,ai:3,links:8}[c.icon]??8); }
function schoolArt(s) { return s.view==="escuela-primaria"?1:(s.view==="escuela-cbta"||s.view==="escuela-bedr")?2:0; }
function resourceArt(r) { if(r.kind==="form") return 7; if(r.kind==="video") return 8; if(r.kind==="pdf") return 4; const t=r.label.toLowerCase(); return /program|cultura digital|web|python/.test(t)?3:/móvil|drive|app|play store|camscanner/.test(t)?5:/imagen|gimp|fotograf|video/.test(t)?6:/convivencia|escuela|oferta|encuesta|documental/.test(t)?0:4; }
function resourceCard(r) { const cls = r.kind === "video" ? "video" : r.kind === "pdf" ? "pdf" : r.kind === "form" ? "form" : "web"; const letters = r.kind === "video" ? "▶" : r.kind === "pdf" ? "PDF" : r.kind === "form" ? "✓" : "↗"; const art=r.image?`<a class="card-art art-image" style="--art-image:url('${r.image}')" href="${r.url}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${r.label}"></a>`:r.spritePosition?`<a class="card-art art-image quiz-sprite-art ${r.spritePosition}" style="--art-image:url('assets/quiz-groups-sprite.webp')" href="${r.url}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${r.label}"></a>`:artTile(resourceArt(r),"card-art",r.url,null,`Abrir ${r.label}`); const quizClass=r.spritePosition?`quiz-resource ${r.spritePosition}`:""; return `<article class="card resource-card ${quizClass}">${art}<div class="card-top"><span class="resource-icon ${cls}" aria-hidden="true">${r.badge||letters}</span><span class="tag">${r.tag||(r.kind === "video" ? "VIDEO" : r.kind === "pdf" ? "DOCUMENTO" : r.kind === "form" ? "FORMULARIO" : "RECURSO")}</span></div><h3>${r.label}</h3>${r.description?`<p class="resource-description">${r.description}</p>`:""}<div class="card-foot"><span class="external-note">Abre en sitio externo</span><a class="arrow-link" href="${r.url}" target="_blank" rel="noopener noreferrer">Abrir <span aria-hidden="true">↗</span></a></div></article>`; }
function resourcesGrid(items) { return `<div class="grid resource-grid">${items.map(resourceCard).join("")}</div>`; }
function home() {
  return `<div class="page-view"><section class="quest-hero"><div class="quest-hero-copy"><span class="hero-badge">✦ PORTAL ABIERTO · ACCESO SIN REGISTRO</span><p class="hero-kicker">PORTAL ESTUDIANTIL • PRIMARIA Y SECUNDARIA</p><h1>Elige tu misión.<br><span>Aprende creando.</span></h1><p class="lead">Explora cursos, retos de programación, herramientas digitales e inteligencia artificial jugando a tu ritmo, con lectura clara y acceso directo a tu escuela.</p><div class="hero-actions"><a class="button primary" href="#cursos" data-view="cursos"><span aria-hidden="true">▶</span><span>Ver misiones</span><span aria-hidden="true">↗</span></a><a class="button ghost" href="#escuelas" data-view="escuelas"><span aria-hidden="true">⌖</span><span>Explorar escuelas</span></a></div></div><aside class="mission-map-card" aria-label="Mapa de Misiones del Portal"><div class="mission-map-head"><strong>Mapa de Misiones</strong><span class="mission-map-badge">100% LIBRE</span></div><div class="mission-map-list"><a class="mission-map-item" href="#programacion" data-view="programacion"><span class="mission-map-num">1</span><span class="mission-map-text"><strong>Código &amp; Python</strong><small>Web, bases de datos y lógica</small></span><span class="mission-map-arrow" aria-hidden="true">→</span></a><a class="mission-map-item" href="#workspace" data-view="workspace"><span class="mission-map-num">2</span><span class="mission-map-text"><strong>Herramientas Google</strong><small>Docs, Gmail y Drive paso a paso</small></span><span class="mission-map-arrow" aria-hidden="true">→</span></a><a class="mission-map-item" href="#ia" data-view="ia"><span class="mission-map-num">3</span><span class="mission-map-text"><strong>Inteligencia Artificial</strong><small>Videos recomendados de creadores</small></span><span class="mission-map-arrow" aria-hidden="true">→</span></a></div><a class="button primary full-width" href="#cursos" data-view="cursos">Comenzar a explorar <span aria-hidden="true">▶</span></a></aside></section>
    <section class="mission-stats" aria-label="Resumen del portal"><div class="mission-stat"><span class="stat-icon" aria-hidden="true">⌂</span><span><strong>4 Escuelas</strong><small>Actividades por plantel</small></span></div><div class="mission-stat"><span class="stat-icon cyan" aria-hidden="true">✧</span><span><strong>6 Rutas de Misión</strong><small>Temas para explorar</small></span></div><div class="mission-stat"><span class="stat-icon orange" aria-hidden="true">∞</span><span><strong>100% Gratis</strong><small>Aprende a tu ritmo</small></span></div></section>
    
    <section class="section-block mission-section"><div class="section-head"><div><span class="eyebrow">TUS DESAFÍOS DE APRENDIZAJE</span><h2>Misiones Disponibles</h2><p class="intro">Filtra por tema y elige una ruta para desarrollar nuevas habilidades digitales.</p></div>${courseFilterBar()}</div><div class="grid courses">${filteredCourses(3).map(courseCard).join("")}</div></section>
    <section class="section-block school-section"><div class="section-head"><div><span class="eyebrow">ACCESO DIRECTO A TU ESCUELA</span><h2>Tu comunidad te espera</h2><p class="intro">Selecciona tu plantel para entrar a sus formularios, actividades y materiales.</p></div><a class="text-link" href="#escuelas" data-view="escuelas">Ver los 4 planteles <span aria-hidden="true">→</span></a></div><div class="grid schools">${schools.map(schoolCard).join("")}</div></section>
    <section class="seo-overview" aria-labelledby="seo-overview-title"><span class="eyebrow">PORTAL EDUCATIVO</span><h2 id="seo-overview-title">Cursos en línea de tecnología para estudiantes</h2><p>Encuentra cursos, guías y actividades para aprender informática y usar la tecnología en tus proyectos escolares. El portal reúne contenidos de programación, productividad digital, dispositivos móviles, inteligencia artificial y creación de imagen y video.</p><p>También puedes entrar por escuela para consultar evaluaciones, formularios, documentos y videos. Los materiales se abren en sus plataformas de origen; revisa las condiciones de cada recurso.</p><div class="seo-topic-links"><a href="./cursos-en-linea.html">Cursos en línea</a><a href="./programacion-para-estudiantes.html">Programación</a><a href="./actividades-escolares.html">Actividades por escuela</a><a href="./herramientas-digitales-para-estudiantes.html">Herramientas digitales</a></div></section>
    <section class="strip"><div><strong>¿Listo para aprender sobre Inteligencia Artificial?</strong><p>Explora los últimos videos recomendados de creadores especializados en YouTube.</p></div><a class="button light small" href="#ia" data-view="ia">${artTile(3,"button-art")}<span>Ir a Inteligencia Artificial</span> <span aria-hidden="true">→</span></a></section>
  </div>`;
}
function coursesPage() { return `<div class="page-view">${titleBlock("RUTAS DE APRENDIZAJE","Misiones y cursos disponibles","Material organizado para practicar programación, productividad digital, inteligencia artificial, dispositivos móviles y creación de contenido.")}<div class="section-head"><div><span class="eyebrow">FILTRAR POR CATEGORÍA</span></div>${courseFilterBar()}</div><div class="grid courses">${filteredCourses().map(courseCard).join("")}</div><section class="section-block"><div class="section-head"><div><span class="eyebrow">RECURSOS EXTERNOS</span><h2>Plataformas y materiales</h2></div></div><div class="strip"><div><strong>Los materiales originales siguen disponibles</strong><p>Los botones de cada curso abren su página de Google Sites con videos, presentaciones, formularios y documentos.</p></div>${button("Abrir cursos originales",page("cursosprogramacion"),"light small")}</div></section></div>`; }
function schoolsPage() { return `<div class="page-view">${titleBlock("ACTIVIDADES POR PLANTEL","Selecciona tu escuela","Cada plantel tiene ahora su propia página dentro del portal, con acceso directo a sus actividades y materiales.")}<div class="grid schools">${schools.map(schoolCard).join("")}</div><section class="page-banner" style="margin-top:24px"><div><strong>Materiales escolares en un solo lugar</strong><p>Abre una página para ver cuestionarios, documentos, videos y enlaces externos de cada plantel.</p></div><a class="button light small" href="${page("p%C3%A1gina-principal")}" target="_blank" rel="noopener noreferrer">${artTile(0,"button-art")}<span>Google Sites original</span> <span aria-hidden="true">↗</span></a></section></div>`; }
function schoolPage(s) { const items=resources.escuelas[s.name]||[]; const isTech41=s.view==="escuela-secundaria"; return `<div class="page-view">${titleBlock(`ESCUELA · ${s.number}`,s.name,s.description)}<div class="section-head"><div><span class="eyebrow">${isTech41?"SEGUNDO PARCIAL · FORMULARIO 1":"ACTIVIDADES Y MATERIALES"}</span><h2 style="margin-top:8px">${isTech41?"Primer formulario del segundo parcial":"Recursos para este plantel"}</h2><p class="intro">${isTech41?"Elige tu grupo para abrir el cuestionario que te corresponde. Cada imagen tiene una temática y color propios.":"Los enlaces abren los formularios, documentos y videos originales en otra pestaña."}</p></div><a class="text-link" href="#escuelas" data-view="escuelas">← Todas las escuelas</a></div>${resourcesGrid(items)}<section class="page-banner" style="margin-top:24px"><div><strong>Consulta la página original del plantel</strong><p>Allí encontrarás publicaciones y materiales adicionales del Google Site.</p></div>${originalBtn(s.route,"Abrir Google Sites")}</section><section class="strip"><div><strong>¿Quieres explorar otra escuela?</strong><p>Regresa al directorio de planteles del portal.</p></div><a class="button light small" href="#escuelas" data-view="escuelas">${artTile(0,"button-art")}<span>Ver escuelas</span> <span aria-hidden="true">→</span></a></section></div>`; }
function programmingPage() { const entries=[{title:"Aplicaciones web",desc:"Desarrollo de aplicaciones web.",route:"cursosprogramacion/aplicaciones-web"},{title:"Bases de datos",desc:"Almacenamiento y consulta de datos para aplicaciones web.",route:"cursosprogramacion/basesdatos"},{title:"Módulo II · Python",desc:"Metodologías de desarrollo de software con herramientas de programación visual.",route:"cursosprogramacion/modulo-ii-python"}]; return `<div class="page-view">${titleBlock("RUTA DE PROGRAMACIÓN","Construye paso a paso","Explora los contenidos de programación disponibles para estudiantes de bachillerato.")}<div class="grid courses">${entries.map((e,i)=>`<article class="card course-card tilt-card">${artTile(3,"card-art",page(e.route),null,`Abrir ${e.title}`)}<div class="card-top"><span class="icon-tile">${icons.code}</span><span class="tag">MÓDULO 0${i+1}</span></div><h3>${e.title}</h3><p>${e.desc}</p><div class="card-foot"><span></span><a class="arrow-link" href="${page(e.route)}" target="_blank" rel="noopener noreferrer">Abrir contenido <span>↗</span></a></div></article>`).join("")}</div><section class="page-banner" style="margin-top:24px"><div><strong>Abre el programa completo</strong><p>La página original conserva sus lecciones y recursos publicados.</p></div>${originalBtn("cursosprogramacion","Ver curso original")}</section></div>`; }
function workspacePage() { return `<div class="page-view">${titleBlock("PRODUCTIVIDAD DIGITAL","Google Workspace","Cursos y guías para crear documentos, organizar archivos y aprovechar las aplicaciones de Google.")}<div class="grid courses"><article class="card course-card">${artTile(4,"card-art",page("cursosgsuite/cursogoogledocs"),null,"Abrir curso Google Docs")}<div class="card-top"><span class="icon-tile">${icons.workspace}</span><span class="tag">CURSO PRINCIPAL</span></div><h3>Google Docs</h3><p>Presentaciones, manuales y ejercicios sobre creación y edición de documentos.</p><div class="card-foot"><a class="arrow-link" href="${page("cursosgsuite/cursogoogledocs")}" target="_blank" rel="noopener noreferrer">Abrir curso de Docs <span>↗</span></a></div></article><article class="card course-card">${artTile(8,"card-art","https://www.youtube.com/watch?v=PNqx4-l9XXs&list=PLrCXLZZDdHZLwhtCuuVbLF1-_7DgE8KuF",null,"Abrir videos de Gmail y herramientas Google")}<div class="card-top"><span class="resource-icon video">▶</span><span class="tag">LISTA DE VIDEOS</span></div><h3>Gmail y herramientas Google</h3><p>Consulta la lista de videos vinculada desde la página de cursos.</p><div class="card-foot"><a class="arrow-link" href="https://www.youtube.com/watch?v=PNqx4-l9XXs&list=PLrCXLZZDdHZLwhtCuuVbLF1-_7DgE8KuF" target="_blank" rel="noopener noreferrer">Ver videos <span>↗</span></a></div></article><article class="card course-card">${artTile(4,"card-art","https://mega.nz/file/111lEaha#h1hDsuruJPOK6D5ktuJqLm0Sk3j2t8vJyy84q5S6K1U",null,"Abrir manual de Google Drive")}<div class="card-top"><span class="resource-icon pdf">PDF</span><span class="tag">MANUAL</span></div><h3>Google Drive</h3><p>Manual descargable de Google Drive, enlazado desde los recursos del curso.</p><div class="card-foot"><a class="arrow-link" href="https://mega.nz/file/111lEaha#h1hDsuruJPOK6D5ktuJqLm0Sk3j2t8vJyy84q5S6K1U" target="_blank" rel="noopener noreferrer">Abrir manual <span>↗</span></a></div></article></div><section class="section-block"><div class="section-head"><div><span class="eyebrow">CURSO GOOGLE DOCS</span><h2 style="margin-top:8px">Materiales y ejercicios</h2><p class="intro">Los enlaces apuntan a los videos y archivos publicados originalmente.</p></div>${originalBtn("cursosgsuite/cursogoogledocs","Ver página completa")}</div>${resourcesGrid(resources.docs)}</section></div>`; }
function mobilesPage() { return `<div class="page-view">${titleBlock("APRENDE DESDE TU TELÉFONO","Dispositivos móviles","Presentaciones, videos y documentos para aprovechar herramientas que ya usas en tu día a día.")}<div class="grid courses">${resources.moviles.map((block,i)=>`<article class="card">${artTile(i===3?4:5,"card-art",block.items[0].url,null,`Abrir recursos de ${block.title}`)}<div class="card-top"><span class="icon-tile">${i===3?icons.workspace:icons.mobile}</span><span class="tag">GUÍA 0${i+1}</span></div><h3>${block.title}</h3><p>Abre los recursos asociados a esta guía y consulta el material a tu ritmo.</p><div class="resource-list">${block.items.map(r=>`<a class="resource-row" href="${r.url}" target="_blank" rel="noopener noreferrer">${artTile(r.kind==="video"?8:r.kind==="pdf"?4:4,"inline-art art-image")}<span>${r.label}</span><span aria-hidden="true">↗</span></a>`).join("")}</div></article>`).join("")}</div><section class="page-banner"><div><strong>Más materiales y actividades</strong><p>La página original incluye recursos complementarios y videos adicionales.</p></div>${originalBtn("cursosdispositivosmoviles","Abrir página completa")}</section></div>`; }
function mediaPage() { return `<div class="page-view">${titleBlock("CREACIÓN DIGITAL","Imagen y video","Conoce herramientas gratuitas para crear y editar materiales visuales.")}<article class="card course-card" style="max-width:650px">${artTile(6,"card-art","https://www.youtube.com/watch?v=ZwBzDxzELfI",null,"Abrir video de instalación de GIMP")}<div class="card-top"><span class="icon-tile">${icons.media}</span><span class="tag">EDICIÓN DE IMAGEN</span></div><h3>Instalación de GIMP</h3><p>Video con los pasos para instalar GIMP, un editor gratuito de fotografías disponible en distintas plataformas.</p><div class="card-foot"><span></span><a class="arrow-link" href="https://www.youtube.com/watch?v=ZwBzDxzELfI" target="_blank" rel="noopener noreferrer">Ver video <span>↗</span></a></div></article><section class="page-banner" style="margin-top:24px"><div><strong>Regresa a la página original</strong><p>Consulta las actualizaciones y recursos publicados para esta sección.</p></div>${originalBtn("edici%C3%B3n-de-imagen-y-video")}</section></div>`; }
function aiPage() {
  const channels = [
    {
      name: "Xavier Mitjana",
      url: "https://www.youtube.com/@XavierMitjana",
      videoId: "5cbA8azIVSM",
      videoTitle: "Google lanza su MEJOR IA gratuita (y sorprende)",
      published: "16 nov 2026",
      desc: "Cursos, guías prácticas y tutoriales en español sobre inteligencia artificial generativa, productividad y automatización."
    },
    {
      name: "Joaquín Barberá Aledo",
      url: "https://www.youtube.com/@joaquinbarberaaledo",
      videoId: "H_1h8m1tXj8",
      videoTitle: "Gemini Notebook: He creado una FÁBRICA de SKILLS automática (GRATIS)",
      published: "14 nov 2026",
      desc: "Contenidos educativos sobre inteligencia artificial, herramientas digitales y su aplicación práctica para aprender y crear."
    },
    {
      name: "Alejavi Rivera",
      url: "https://www.youtube.com/@alejavirivera",
      videoId: "rnpsuTgfMT0",
      videoTitle: "Cómo usar DeepSeek Mejor que el 99% de las personas (GRATIS)",
      published: "15 nov 2026",
      desc: "Tutoriales claros sobre herramientas de inteligencia artificial, asistentes y flujos de trabajo digitales."
    },
    {
      name: "Joseph Gooding",
      url: "https://www.youtube.com/@JosephGooding",
      videoId: "B-O7Aq3R08Y",
      videoTitle: "Le Di a GPT-6 Astra UNA SOLA INSTRUCCIÓN… y Creó TODO el Video",
      published: "13 nov 2026",
      desc: "Recursos y videos sobre inteligencia artificial, programación y tecnologías emergentes."
    }
  ];
  return `<div class="page-view">${titleBlock("RUTA DE INTELIGENCIA ARTIFICIAL", "Cursos y videos recomendados de IA", "Previsualiza los últimos videos publicados por cada creador sobre el manejo de herramientas de inteligencia artificial. Al abrir los enlaces saldrás del portal hacia YouTube.")}<div class="grid resource-grid">${channels.map((ch) => `<article class="card video-card"><div class="card-top"><span class="resource-icon video" aria-hidden="true">▶</span><span class="tag">YOUTUBE · EXTERNO</span></div><div class="video-preview"><iframe src="https://www.youtube-nocookie.com/embed/${ch.videoId}" title="Vista previa: ${ch.videoTitle} — ${ch.name}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><p class="video-meta">${ch.name} · Publicado el ${ch.published}</p><h3 class="video-title">${ch.videoTitle}</h3><p>${ch.desc}</p><div class="card-foot"><a class="arrow-link" href="https://www.youtube.com/watch?v=${ch.videoId}" target="_blank" rel="noopener noreferrer">Ver en YouTube <span aria-hidden="true">↗</span></a><a class="mini-cta" href="${ch.url}" target="_blank" rel="noopener noreferrer">Ir al canal <span aria-hidden="true">↗</span></a></div></article>`).join("")}</div><div class="callout"><strong>Aviso sobre sitios externos y derechos de autor</strong><p>Los cursos, videos y materiales previsualizados y enlazados en esta sección se encuentran alojados en YouTube (sitio externo) y pertenecen íntegramente a sus respectivos autores y creadores:</p><ol class="callout-list">${channels.map((ch) => `<li><strong>${ch.name}</strong> — Canal oficial en YouTube</li>`).join("")}</ol><p>El Portal Estudiantil únicamente recopila y previsualiza estos enlaces con fines educativos y de orientación; todos los derechos de autor corresponden a sus creadores originales.</p></div><section class="strip"><div><strong>¿Buscas más cursos gratuitos?</strong><p>Visita la sección de otros cursos o regresa al catálogo general de rutas.</p></div><a class="button light small" href="#cursos" data-view="cursos">${artTile(8, "button-art")}<span>Ver todos los cursos</span> <span aria-hidden="true">→</span></a></section></div>`;
}
function otherPage() { const items=[link("Canal Programación ATS","https://www.youtube.com/c/Programaci%C3%B3nATS","video"),link("Aula en la Nube","https://aulaenlanube.com/"),link("AulaClic","https://www.aulaclic.es/"),link("Píldoras Informáticas · YouTube","https://www.youtube.com/channel/UCdulIs-x_xrRd1ezwJZR9ww","video")]; return `<div class="page-view">${titleBlock("AMPLÍA TU APRENDIZAJE","Otros cursos gratuitos","Explora sitios y canales independientes con contenidos de informática. Sus cursos y materiales pertenecen a sus respectivos creadores.")}<div class="grid courses">${items.map((r,i)=>`<article class="card course-card">${artTile(i===0?3:8,"card-art",r.url,null,`Abrir ${r.label}`)}<div class="card-top"><span class="resource-icon ${r.kind==='video'?'video':'web'}">${r.kind==='video'?'▶':'↗'}</span><span class="tag">RECURSO EXTERNO</span></div><h3>${r.label}</h3><p>${["Cursos de programación y tecnología en el canal de ATS.","Cursos de informática para desarrollar habilidades digitales.","Tutoriales y materiales para aprender herramientas informáticas.","Canal con cursos y tutoriales de informática."][i]}</p><div class="card-foot"><span></span><a class="arrow-link" href="${r.url}" target="_blank" rel="noopener noreferrer">Visitar sitio <span>↗</span></a></div></article>`).join("")}</div><div class="callout" style="margin-top:20px"><strong>Sobre los cursos externos</strong>Estos materiales son creados por otras personas o sitios. Si deseas usarlos en actividades académicas, consulta las condiciones y referencias indicadas por cada autor.</div><section class="page-banner" style="margin-top:22px"><div><strong>Ver sección original completa</strong><p>Incluye el acceso histórico a más recursos externos.</p></div>${originalBtn("otroscursos")}</section></div>`; }
function faqPage() { return `<div class="page-view">${titleBlock("INFORMACIÓN","Preguntas frecuentes","Respuestas breves sobre el propósito y los materiales del portal.")}<div class="faq-list"><details><summary>¿Qué es el Portal Estudiantil?</summary><p>Es un sitio para compartir cursos y recursos que ayudan a aprender herramientas informáticas y aplicarlas en el trabajo cotidiano.</p></details><details><summary>¿A quién está dirigido?</summary><p>El portal reúne actividades para estudiantes de primaria y secundaria, además de recursos de bachillerato. Si usas materiales externos, consulta las condiciones y referencias de cada autor.</p></details><details><summary>¿Quién financia el proyecto?</summary><p>El proyecto se mantiene con recursos propios y se actualiza gradualmente.</p></details><details><summary>¿Dónde se abren los documentos, formularios y videos?</summary><p>Los materiales continúan alojados en sus servicios de origen, como Google Forms, Sheets, YouTube, Sway y MEGA. Cada enlace abre el recurso original en otra pestaña.</p></details></div><section class="strip"><div><strong>¿No encuentras una actividad?</strong><p>Abre el sitio Google Sites original para consultar todas sus páginas.</p></div>${button("Abrir sitio original",page("p%C3%A1gina-principal"),"light small")}</section></div>`; }
const views = {inicio:home,cursos:coursesPage,escuelas:schoolsPage,programacion:programmingPage,workspace:workspacePage,moviles:mobilesPage,media:mediaPage,ia:aiPage,otros:otherPage,faq:faqPage};
schools.forEach(s=>views[s.view]=()=>schoolPage(s));
function titleFor(id) { return navItems.find(x=>x[0]===id)?.[1] || "Inicio"; }
function render(moveFocus = false) {
  const id = location.hash.slice(1) || "inicio";
  const view = views[id] ? id : "inicio";
  const sectionTitle = titleFor(view);
  document.getElementById("view-root").innerHTML = views[view]();
  document.getElementById("current-section").textContent = sectionTitle;
  document.title = `Portal Estudiantil | ${sectionTitle}`;
  const schoolView = view === "escuelas" || view.startsWith("escuela-");
  if (schoolView) schoolMenuOpen = true;
  setSchoolMenuOpen(schoolMenuOpen);
  document.querySelectorAll(".nav-item").forEach(a => {
    const active = a.dataset.view === view || (a.classList.contains("nav-toggle") && schoolView);
    a.setAttribute("aria-current", active ? "page" : "false");
  });
  setMenu(false);
  if (moveFocus) {
    window.scrollTo(0, 0);
    const mainEl = document.getElementById("main");
    if (mainEl) mainEl.focus({ preventScroll: true });
  }
}

function applyTextScale(scale) {
  const root = document.documentElement;
  root.classList.remove("text-scale-lg", "text-scale-xl");
  if (scale === "lg") root.classList.add("text-scale-lg");
  if (scale === "xl") root.classList.add("text-scale-xl");
  document.querySelectorAll("[data-text-scale]").forEach(btn => {
    btn.setAttribute("aria-pressed", String(btn.dataset.textScale === scale));
  });
  try { localStorage.setItem("pe_text_scale", scale); } catch {}
}

function applyHighContrast(enabled) {
  document.documentElement.classList.toggle("high-contrast", enabled);
  const btn = document.getElementById("contrast-toggle");
  if (btn) btn.setAttribute("aria-pressed", String(enabled));
  try { localStorage.setItem("pe_high_contrast", enabled ? "1" : "0"); } catch {}
}

function initA11yControls() {
  let savedScale = "base";
  let savedContrast = false;
  try {
    savedScale = localStorage.getItem("pe_text_scale") || "base";
    savedContrast = localStorage.getItem("pe_high_contrast") === "1";
  } catch {}
  applyTextScale(["base", "lg", "xl"].includes(savedScale) ? savedScale : "base");
  applyHighContrast(savedContrast);
}

document.getElementById("primary-nav").innerHTML = navMarkup();
const menu = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const scrim = document.getElementById("menu-scrim");

function setMenu(open) {
  sidebar.classList.toggle("is-open", open);
  scrim.hidden = !open;
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}

document.addEventListener("click", e => {
  const filterBtn = e.target.closest("[data-course-filter]");
  if (filterBtn) {
    activeCourseFilter = filterBtn.dataset.courseFilter;
    render(false);
    return;
  }
  const scaleBtn = e.target.closest("[data-text-scale]");
  if (scaleBtn) {
    applyTextScale(scaleBtn.dataset.textScale);
    return;
  }
  if (e.target.closest("#contrast-toggle")) {
    applyHighContrast(!document.documentElement.classList.contains("high-contrast"));
    return;
  }
  const schoolToggle = e.target.closest('[data-menu-toggle="schools"]');
  if (schoolToggle) {
    e.preventDefault();
    setSchoolMenuOpen(!schoolMenuOpen);
    return;
  }
  const a = e.target.closest("[data-view]");
  if (a) {
    const id = a.dataset.view;
    if (a.tagName === "BUTTON") {
      location.hash = `#${id}`;
      return;
    }
    if (location.hash.slice(1) === id) {
      e.preventDefault();
      render(true);
    }
  }
});

window.addEventListener("hashchange", () => render(true));
menu.addEventListener("click", () => {
  const next = !sidebar.classList.contains("is-open");
  setMenu(next);
  if (next) {
    const firstNav = sidebar.querySelector(".nav-item");
    if (firstNav) firstNav.focus();
  }
});
scrim.addEventListener("click", () => setMenu(false));
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && sidebar.classList.contains("is-open")) {
    setMenu(false);
    menu.focus();
  }
});

initA11yControls();
render(false);
