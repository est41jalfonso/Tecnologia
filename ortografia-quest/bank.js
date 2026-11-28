// Banco de Textos Ilustrados NEM: Primaria 3.º Grado ("Mi amigo el ajolote" y proyectos) y Secundaria 1.º Grado (Lenguajes)
(function () {
  const SCENES = {
    ajolote: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg"><rect width="220" height="140" rx="18" fill="#E0F2FE"/><path d="M0 98 Q55 88 110 98 T220 98 V140 H0 Z" fill="#7DD3FC"/><path d="M24 135 Q28 100 38 92 Q40 112 36 135 Z" fill="#10B981"/><path d="M184 135 Q180 96 192 86 Q198 108 194 135 Z" fill="#059669"/><ellipse cx="112" cy="82" rx="38" ry="22" fill="#F9A8D4" stroke="#BE185D" stroke-width="2.5"/><circle cx="80" cy="76" r="18" fill="#FBCFE8" stroke="#BE185D" stroke-width="2.5"/><path d="M64 68 L52 60 M62 76 L48 76 M64 84 L52 92" stroke="#EC4899" stroke-width="4" stroke-linecap="round"/><circle cx="74" cy="72" r="3" fill="#0F172A"/><circle cx="86" cy="72" r="3" fill="#0F172A"/><path d="M74 82 Q80 87 86 82" fill="none" stroke="#9D174D" stroke-width="2" stroke-linecap="round"/><path d="M148 82 Q174 72 182 84 Q170 96 148 86 Z" fill="#F9A8D4" stroke="#BE185D" stroke-width="2"/></svg>`,
    entrevista: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg"><rect width="220" height="140" rx="18" fill="#F3E8FF"/><circle cx="64" cy="54" r="18" fill="#FDE68A" stroke="#0F172A" stroke-width="2.5"/><rect x="44" y="76" width="40" height="44" rx="12" fill="#0284C7"/><circle cx="156" cy="54" r="18" fill="#FDBA74" stroke="#0F172A" stroke-width="2.5"/><rect x="136" y="76" width="40" height="44" rx="12" fill="#7C3AED"/><rect x="104" y="64" width="12" height="24" rx="6" fill="#0F172A"/><line x1="110" y1="88" x2="110" y2="110" stroke="#475569" stroke-width="4"/><rect x="86" y="24" width="48" height="22" rx="10" fill="#FFFFFF" stroke="#7C3AED" stroke-width="2"/><text x="110" y="39" text-anchor="middle" font-size="13" font-weight="bold" fill="#7C3AED">¿ ... ?</text></svg>`,
    cartel: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg"><rect width="220" height="140" rx="18" fill="#ECFDF5"/><rect x="44" y="16" width="132" height="108" rx="10" fill="#FFFFFF" stroke="#059669" stroke-width="3"/><rect x="58" y="28" width="104" height="16" rx="4" fill="#A7F3D0"/><circle cx="88" cy="78" r="22" fill="#FBCFE8" stroke="#BE185D" stroke-width="2"/><line x1="120" y1="64" x2="160" y2="64" stroke="#0F172A" stroke-width="4" stroke-linecap="round"/><line x1="120" y1="78" x2="156" y2="78" stroke="#64748B" stroke-width="4" stroke-linecap="round"/><line x1="120" y1="92" x2="150" y2="92" stroke="#64748B" stroke-width="4" stroke-linecap="round"/></svg>`,
    receta: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg"><rect width="220" height="140" rx="18" fill="#FEF3C7"/><circle cx="72" cy="78" r="28" fill="#EF4444" stroke="#991B1B" stroke-width="2.5"/><path d="M72 50 Q76 38 86 40" stroke="#16A34A" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="144" cy="82" r="24" fill="#F59E0B" stroke="#B45309" stroke-width="2.5"/><rect x="116" y="22" width="64" height="36" rx="6" fill="#FFFFFF" stroke="#D97706" stroke-width="2.5"/><line x1="124" y1="34" x2="170" y2="34" stroke="#0F172A" stroke-width="3"/><line x1="124" y1="46" x2="162" y2="46" stroke="#64748B" stroke-width="3"/></svg>`,
    agua: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg"><rect width="220" height="140" rx="18" fill="#EFF6FF"/><path d="M110 20 C84 56, 76 74, 76 90 A34 34 0 0 0 144 90 C144 74, 136 56, 110 20 Z" fill="#38BDF8" stroke="#0284C7" stroke-width="3"/><path d="M96 92 A14 14 0 0 0 112 108" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/></svg>`,
    periodico: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg"><rect width="220" height="140" rx="18" fill="#F1F5F9"/><rect x="34" y="18" width="152" height="104" rx="8" fill="#FFFFFF" stroke="#0F172A" stroke-width="3"/><rect x="46" y="28" width="128" height="18" rx="3" fill="#0284C7"/><rect x="46" y="56" width="56" height="52" rx="4" fill="#BAE6FD"/><line x1="112" y1="60" x2="172" y2="60" stroke="#0F172A" stroke-width="4"/><line x1="112" y1="74" x2="172" y2="74" stroke="#64748B" stroke-width="3.5"/><line x1="112" y1="88" x2="160" y2="88" stroke="#64748B" stroke-width="3.5"/><line x1="112" y1="102" x2="166" y2="102" stroke="#64748B" stroke-width="3.5"/></svg>`,
    ciencia: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg"><rect width="220" height="140" rx="18" fill="#EEF2FF"/><polygon points="94,24 126,24 120,56 146,110 74,110 100,56" fill="#FFFFFF" stroke="#4F46E5" stroke-width="3"/><polygon points="84,88 136,88 144,108 76,108" fill="#38BDF8"/><circle cx="106" cy="76" r="5" fill="#7C3AED"/><circle cx="118" cy="64" r="4" fill="#10B981"/></svg>`,
    cultura: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg"><rect width="220" height="140" rx="18" fill="#FDF2F8"/><polygon points="110,24 174,114 46,114" fill="#F59E0B" stroke="#B45309" stroke-width="3"/><rect x="64" y="92" width="92" height="22" fill="#D97706"/><rect x="80" y="68" width="60" height="24" fill="#FBBF24"/><rect x="96" y="44" width="28" height="24" fill="#FDE68A"/></svg>`,
    libro: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg"><rect width="220" height="140" rx="18" fill="#EFF6FF"/><path d="M36 28 Q74 22 110 34 Q146 22 184 28 V112 Q146 100 110 112 Q74 100 36 112 Z" fill="#FFFFFF" stroke="#0284C7" stroke-width="3"/><line x1="110" y1="34" x2="110" y2="112" stroke="#0284C7" stroke-width="2.5"/><text x="72" y="76" text-anchor="middle" font-size="22" font-weight="bold" fill="#7C3AED">¿Aa?</text><text x="148" y="76" text-anchor="middle" font-size="22" font-weight="bold" fill="#059669">¡. ,!</text></svg>`
  };

  // ==================== PRIMARIA 3.º GRADO (NEM: Mi amigo el ajolote y proyectos de 3.º) ====================
  const PRIMARIA_ITEMS = [
    // Misión 1: Mayúsculas
    {
      mission: 1, scene: 'ajolote', project: 'Proyecto: Mi amigo el ajolote',
      text: 'El ajolote mexicano vive en los canales de [___]ochimilco.',
      options: ['X', 'x'], answer: 'X',
      rule: 'Los nombres propios de lugares como Xochimilco siempre inician con mayúscula.'
    },
    {
      mission: 1, scene: 'ajolote', project: 'Proyecto: Mi amigo el ajolote',
      text: '[___]i amigo el ajolote necesita agua limpia para sobrevivir.',
      options: ['M', 'm'], answer: 'M',
      rule: 'Al iniciar una oración o título siempre se escribe con letra mayúscula.'
    },
    {
      mission: 1, scene: 'cartel', project: 'Proyecto: Mi amigo el ajolote',
      text: 'En la escuela, [___]aría y [___]uan hicieron un cartel del ajolote.',
      options: ['M / J', 'm / j', 'M / j'], answer: 'M / J',
      rule: 'Los nombres propios de personas (María y Juan) llevan mayúscula inicial.'
    },
    {
      mission: 1, scene: 'ajolote', project: 'Proyecto: Mi amigo el ajolote',
      text: 'El ajolote es un símbolo muy querido en [___]éxico.',
      options: ['M', 'm'], answer: 'M',
      rule: 'Los nombres propios de países como México se escriben con mayúscula.'
    },
    {
      mission: 1, scene: 'entrevista', project: 'Proyecto: Mi amigo el ajolote',
      text: 'Ayer entrevistamos al biólogo. [___]os explicó cómo cuidar las chinampas.',
      options: ['N', 'n'], answer: 'N',
      rule: 'Después de un punto y seguido siempre se escribe con mayúscula.'
    },
    {
      mission: 1, scene: 'cartel', project: 'Proyectos Escolares 3.º',
      text: 'Los alumnos de la Primaria [___]eodoro [___]livares cuidan la naturaleza.',
      options: ['T / O', 't / o', 'T / o'], answer: 'T / O',
      rule: 'Los nombres propios de escuelas llevan mayúscula en sus palabras principales.'
    },
    {
      mission: 1, scene: 'agua', project: 'Proyectos Comunitarios 3.º',
      text: 'En [___]guascalientes ahorramos agua todos los días en casa.',
      options: ['A', 'a'], answer: 'A',
      rule: 'Los nombres de estados y ciudades como Aguascalientes van con mayúscula.'
    },
    {
      mission: 1, scene: 'receta', project: 'Proyectos de Aula 3.º',
      text: 'Mi mamá [___]osa prepara ensalada fresca con jitomate y limón.',
      options: ['R', 'r'], answer: 'R',
      rule: 'Los nombres propios de personas como Rosa se escriben con mayúscula.'
    },
    {
      mission: 1, scene: 'cultura', project: 'Múltiples Lenguajes 3.º',
      text: 'La palabra ajolote viene del náhuatl axólotl. [___]ignifica monstruo de agua.',
      options: ['S', 's'], answer: 'S',
      rule: 'Después de un punto y seguido se inicia con mayúscula.'
    },
    {
      mission: 1, scene: 'entrevista', project: 'Proyectos Comunitarios 3.º',
      text: 'Mi compañero [___]ablo anotó las respuestas de la entrevista en su libreta.',
      options: ['P', 'p'], answer: 'P',
      rule: 'Pablo es un nombre propio de persona y debe iniciar con mayúscula.'
    },

    // Misión 2: Punto y Coma
    {
      mission: 2, scene: 'cartel', project: 'Proyecto: Mi amigo el ajolote',
      text: 'Para hacer la escultura del ajolote usamos plastilina[___] cartón, pintura y pegamento.',
      options: [',', '.', ';'], answer: ',',
      rule: 'Se usa coma (,) para separar los elementos de una enumeración.'
    },
    {
      mission: 2, scene: 'ajolote', project: 'Proyecto: Mi amigo el ajolote',
      text: 'El ajolote puede regenerar sus patitas y su cola[___]',
      options: ['.', ',', '?'], answer: '.',
      rule: 'Al terminar una oración enunciativa se coloca punto final (.).'
    },
    {
      mission: 2, scene: 'receta', project: 'Proyectos de Aula 3.º',
      text: 'En la lonchera saludable llevo manzana[___] plátano, nueces y agua natural.',
      options: [',', '.', '!'], answer: ',',
      rule: 'La coma separa los alimentos en una lista o enumeración.'
    },
    {
      mission: 2, scene: 'agua', project: 'Proyectos Comunitarios 3.º',
      text: 'Cuidar el agua protege a los peces[___] También ayuda a todas las plantas.',
      options: ['.', ',', '?'], answer: '.',
      rule: 'Se usa punto y seguido (.) antes de iniciar otra oración con mayúscula.'
    },
    {
      mission: 2, scene: 'cartel', project: 'Proyecto: Mi amigo el ajolote',
      text: 'Los carteles informativos tienen título[___] imágenes llamativas y mensajes claros.',
      options: [',', '.', '¿'], answer: ',',
      rule: 'Usamos coma (,) para enumerar las partes del cartel informativo.'
    },
    {
      mission: 2, scene: 'entrevista', project: 'Proyecto: Mi amigo el ajolote',
      text: 'Primero saludamos al entrevistado[___] luego le hicimos cinco preguntas.',
      options: [',', '.', '!'], answer: ',',
      rule: 'La coma separa dos acciones breves relacionadas dentro de la oración.'
    },
    {
      mission: 2, scene: 'cultura', project: 'Múltiples Lenguajes 3.º',
      text: 'En México existen muchas especies únicas[___] Debemos respetarlas y cuidarlas.',
      options: ['.', ',', '¿'], answer: '.',
      rule: 'El punto y seguido separa dos ideas completas.'
    },
    {
      mission: 2, scene: 'receta', project: 'Proyectos Escolares 3.º',
      text: 'Lava bien tus manos antes de comer[___]',
      options: ['.', ',', '¿'], answer: '.',
      rule: 'Toda oración completa que afirma o indica algo termina en punto (.).'
    },

    // Misión 3: Signos de Interrogación y Admiración
    {
      mission: 3, scene: 'entrevista', project: 'Proyecto: Mi amigo el ajolote',
      text: '[___]Por qué está en peligro de extinción el ajolote[___]',
      options: ['¿ ... ?', '¡ ... !', '. ... .'], answer: '¿ ... ?',
      rule: 'Las preguntas directas en una entrevista llevan signos de interrogación (¿ ?).'
    },
    {
      mission: 3, scene: 'ajolote', project: 'Proyecto: Mi amigo el ajolote',
      text: '[___]Qué increíble es que el ajolote pueda regenerar sus patitas[___]',
      options: ['¡ ... !', '¿ ... ?', ', ... .'], answer: '¡ ... !',
      rule: 'Para expresar sorpresa, alegría o admiración se usan los signos (¡ !).'
    },
    {
      mission: 3, scene: 'entrevista', project: 'Proyecto: Mi amigo el ajolote',
      text: '[___]Qué acciones podemos hacer en la comunidad para ayudarlo[___]',
      options: ['¿ ... ?', '¡ ... !', '. ... ,'], answer: '¿ ... ?',
      rule: 'Cuando formulamos una pregunta se colocan signos de interrogación al inicio y al final.'
    },
    {
      mission: 3, scene: 'cartel', project: 'Proyecto: Mi amigo el ajolote',
      text: '[___]Cuidemos juntos los canales donde vive nuestro amigo el ajolote[___]',
      options: ['¡ ... !', '¿ ... ?', ', ... ?'], answer: '¡ ... !',
      rule: 'Los llamados entusiastas en un cartel llevan signos de admiración (¡ !).'
    },
    {
      mission: 3, scene: 'entrevista', project: 'Proyectos Comunitarios 3.º',
      text: '[___]Cómo era el lago hace treinta años[___]',
      options: ['¿ ... ?', '¡ ... !', '. ... .'], answer: '¿ ... ?',
      rule: 'Es una pregunta de entrevista, por lo que requiere signos de interrogación (¿ ?).'
    },
    {
      mission: 3, scene: 'agua', project: 'Proyectos Escolares 3.º',
      text: '[___]Cierra la llave mientras te enjabonas las manos[___]',
      options: ['¡ ... !', '¿ ... ?', '. ... ?'], answer: '¡ ... !',
      rule: 'Las indicaciones enfáticas o llamadas de atención usan signos de admiración (¡ !).'
    },
    {
      mission: 3, scene: 'receta', project: 'Proyectos de Aula 3.º',
      text: '[___]Cuántas frutas recomendó el plato del bien comer[___]',
      options: ['¿ ... ?', '¡ ... !', ', ... .'], answer: '¿ ... ?',
      rule: 'Al preguntar una cantidad ("Cuántas") se usan signos de interrogación (¿ ?).'
    },
    {
      mission: 3, scene: 'cultura', project: 'Múltiples Lenguajes 3.º',
      text: '[___]Qué hermosa quedó la exposición de esculturas de la escuela[___]',
      options: ['¡ ... !', '¿ ... ?', '. ... ,'], answer: '¡ ... !',
      rule: 'Expresa alegría y entusiasmo, por eso lleva signos de admiración (¡ !).'
    },

    // Misión 4: Ortografía e Integral 3.º
    {
      mission: 4, scene: 'ajolote', project: 'Proyecto: Mi amigo el ajolote',
      text: 'El ajolote ha[___]ita en aguas tranquilas y frescas.',
      options: ['b', 'v'], answer: 'b',
      rule: 'El verbo "habita" (de habitar) siempre se escribe con b.'
    },
    {
      mission: 4, scene: 'ajolote', project: 'Proyecto: Mi amigo el ajolote',
      text: 'El a[___]olote respira por sus branquias externas.',
      options: ['j', 'g'], answer: 'j',
      rule: 'La palabra "ajolote" se escribe con j.'
    },
    {
      mission: 4, scene: 'cartel', project: 'Proyecto: Mi amigo el ajolote',
      text: 'Debemos conser[___]ar limpias las aguas de nuestro país.',
      options: ['v', 'b'], answer: 'v',
      rule: 'El verbo "conservar" se escribe con v.'
    },
    {
      mission: 4, scene: 'agua', project: 'Proyectos Comunitarios 3.º',
      text: 'No tirar [___]asura en los ríos protege a los animales.',
      options: ['b', 'v'], answer: 'b',
      rule: 'La palabra "basura" se escribe con b.'
    },
    {
      mission: 4, scene: 'entrevista', project: 'Proyecto: Mi amigo el ajolote',
      text: 'Es importante [___]acer buenas preguntas en nuestra entrevista.',
      options: ['h', 'sin h'], answer: 'h',
      rule: 'El verbo "hacer" y todas sus formas llevan h inicial.'
    },
    {
      mission: 4, scene: 'receta', project: 'Proyectos de Aula 3.º',
      text: 'Las verduras aportan muchas [___]itaminas para crecer sanos.',
      options: ['v', 'b'], answer: 'v',
      rule: 'La palabra "vitaminas" se escribe con v.'
    },
    {
      mission: 4, scene: 'cultura', project: 'Múltiples Lenguajes 3.º',
      text: 'En [___]exico celebramos nuestras tradiciones con respeto.',
      options: ['M', 'm'], answer: 'M',
      rule: 'México es nombre propio de país y lleva mayúscula inicial.'
    },
    {
      mission: 4, scene: 'cartel', project: 'Proyecto: Mi amigo el ajolote',
      text: 'Un cartel necesita letras grandes[___] colores vivos y buena ortografía.',
      options: [',', '.', '¿'], answer: ',',
      rule: 'Usamos coma (,) para separar los elementos de la lista.'
    }
  ];

  // ==================== SECUNDARIA 1.º GRADO (NEM: Campo Formativo Lenguajes - Ximhai) ====================
  const SECUNDARIA_ITEMS = [
    // Misión 1: Mayúsculas en Géneros Periodísticos y Lenguajes
    {
      mission: 1, scene: 'periodico', project: 'Lenguajes 1.º · Géneros Periodísticos',
      text: 'El diario escolar de la [___]ecundaria [___]écnica N° 41 publicó una crónica comunitaria.',
      options: ['S / T', 's / t', 'S / t'], answer: 'S / T',
      rule: 'Los nombres oficiales de instituciones educativas llevan mayúscula inicial.'
    },
    {
      mission: 1, scene: 'cultura', project: 'Lenguajes 1.º · Diversidad Lingüística',
      text: 'En México se hablan 68 lenguas indígenas; el [___]áhuatl y el [___]aya son de las más extendidas.',
      options: ['n / m', 'N / M', 'N / m'], answer: 'n / m',
      rule: 'En español, los nombres de lenguas e idiomas (náhuatl, maya, español) se escriben con minúscula.'
    },
    {
      mission: 1, scene: 'ciencia', project: 'Lenguajes 1.º · Divulgación Científica',
      text: 'La [___]rganización de las [___]aciones [___]nidas impulsa el cuidado de los ecosistemas.',
      options: ['O / N / U', 'o / n / u', 'O / n / u'], answer: 'O / N / U',
      rule: 'Los nombres propios de organismos internacionales llevan mayúscula en sus palabras significativas.'
    },
    {
      mission: 1, scene: 'libro', project: 'Lenguajes 1.º · Colección Ximhai',
      text: 'Leímos una reseña del libro [___]l principito en el taller de lectura.',
      options: ['E', 'e'], answer: 'E',
      rule: 'La primera palabra del título de un libro o una obra siempre lleva mayúscula.'
    },
    {
      mission: 1, scene: 'periodico', project: 'Lenguajes 1.º · Crónica Escolar',
      text: 'El [___]unes realizaremos el debate. [___]odos los equipos presentarán sus argumentos.',
      options: ['l / T', 'L / T', 'L / t'], answer: 'l / T',
      rule: 'Los días de la semana (lunes) van en minúscula, pero después de punto (Todos) va mayúscula.'
    },
    {
      mission: 1, scene: 'cultura', project: 'Lenguajes 1.º · Identidad Cultural',
      text: 'Los alumnos [___]exicanos valoran la diversidad cultural de [___]mérica Latina.',
      options: ['m / A', 'M / A', 'm / a'], answer: 'm / A',
      rule: 'Los gentilicios (mexicanos) se escriben con minúscula; los nombres propios geográficos (América) con mayúscula.'
    },
    {
      mission: 1, scene: 'ciencia', project: 'Lenguajes 1.º · Textos Expositivos',
      text: 'El telescopio espacial [___]ames [___]ebb captó galaxias muy lejanas.',
      options: ['J / W', 'j / w', 'J / w'], answer: 'J / W',
      rule: 'Los nombres propios de personas o instrumentos nombrados en su honor llevan mayúscula.'
    },
    {
      mission: 1, scene: 'entrevista', project: 'Lenguajes 1.º · Entrevista Formal',
      text: 'Estimada [___]ra. [___]ópez: agradecemos su tiempo para esta entrevista.',
      options: ['D / L', 'd / l', 'D / l'], answer: 'D / L',
      rule: 'Las abreviaturas de tratamiento (Dra.) y los apellidos (López) se escriben con mayúscula inicial.'
    },

    // Misión 2: Puntuación Avanzada (Coma explicativa, Punto y coma, Dos puntos)
    {
      mission: 2, scene: 'ciencia', project: 'Lenguajes 1.º · Textos de Divulgación',
      text: 'El ajolote[___] un anfibio endémico del valle de México[___] es clave en la investigación científica.',
      options: [', ... ,', '. ... .', '; ... ;'], answer: ', ... ,',
      rule: 'La coma explicativa encierra aclaraciones o incisos dentro de una oración.'
    },
    {
      mission: 2, scene: 'periodico', project: 'Lenguajes 1.º · Géneros Periodísticos',
      text: 'Los tres elementos de la noticia son[___] qué ocurrió, quién participó y dónde sucedió.',
      options: [':', ';', '?'], answer: ':',
      rule: 'Los dos puntos (:) anuncian una enumeración o explicación anunciada previamente.'
    },
    {
      mission: 2, scene: 'cultura', project: 'Lenguajes 1.º · Diversidad Lingüística',
      text: 'En el norte se hablan lenguas yutoaztecas[___] en el sur predominan las lenguas mayenses.',
      options: [';', '¿', '!'], answer: ';',
      rule: 'El punto y coma (;) separa proposiciones relacionadas que ya tienen sentido completo o contraste.'
    },
    {
      mission: 2, scene: 'entrevista', project: 'Lenguajes 1.º · Cita Textual',
      text: 'La investigadora afirmó[___] "La lectura crítica transforma nuestra comunidad".',
      options: [':', ',', ';'], answer: ':',
      rule: 'Antes de reproducir una cita textual entre comillas se colocan dos puntos (:).'
    },
    {
      mission: 2, scene: 'libro', project: 'Lenguajes 1.º · Reseña Literaria',
      text: 'Sin embargo[___] el desenlace de la novela sorprendió a todos los lectores.',
      options: [',', ':', '¡'], answer: ',',
      rule: 'Los conectores discursivos al inicio (Sin embargo, Por lo tanto, Además) van seguidos de coma.'
    },
    {
      mission: 2, scene: 'ciencia', project: 'Lenguajes 1.º · Informe Científico',
      text: 'La energía solar es renovable[___] limpia y cada vez más accesible[___]',
      options: [', ... .', '. ... ,', '; ... ?'], answer: ', ... .',
      rule: 'Coma para separar adjetivos en serie y punto final al cerrar el enunciado.'
    },
    {
      mission: 2, scene: 'periodico', project: 'Lenguajes 1.º · Crónica Comunitaria',
      text: 'Al caer la tarde[___] los vecinos se reunieron en la plaza para el festival cultural.',
      options: [',', '.', ':'], answer: ',',
      rule: 'Cuando un complemento de tiempo va al inicio de la oración se separa con coma (,).'
    },
    {
      mission: 2, scene: 'entrevista', project: 'Lenguajes 1.º · Carta Formal',
      text: 'Estimado Director[___] Por medio de la presente solicitamos apoyo para la biblioteca.',
      options: [':', ',', '.'], answer: ':',
      rule: 'En español, después del vocativo o saludo en cartas formales se usan dos puntos (:).'
    },

    // Misión 3: Interrogación y Admiración en Secundaria (Directas vs Indirectas y Énfasis)
    {
      mission: 3, scene: 'entrevista', project: 'Lenguajes 1.º · Entrevista Periodística',
      text: '[___]Cuál considera que es el mayor reto de la juventud actual[___]',
      options: ['¿ ... ?', '¡ ... !', 'Sin signos'], answer: '¿ ... ?',
      rule: 'Las preguntas directas llevan obligatoriamente signo de apertura (¿) y cierre (?).'
    },
    {
      mission: 3, scene: 'libro', project: 'Lenguajes 1.º · Lenguaje Literario',
      text: 'El reportero preguntó [___]cómo lograremos preservar las lenguas originarias[___]',
      options: ['sin ¿ ?', '¿ ... ?', '¡ ... !'], answer: 'sin ¿ ?',
      rule: 'Las preguntas indirectas ("preguntó cómo...") NO llevan signos de interrogación, aunque "cómo" lleve tilde.'
    },
    {
      mission: 3, scene: 'cultura', project: 'Lenguajes 1.º · Textos Comunitarios',
      text: '[___]Qué riqueza tan extraordinaria poseen los relatos tradicionales de nuestro pueblo[___]',
      options: ['¡ ... !', '¿ ... ?', '; ... .'], answer: '¡ ... !',
      rule: 'Las expresiones enfáticas o admirativas requieren signos de exclamación al principio y al final (¡ !).'
    },
    {
      mission: 3, scene: 'periodico', project: 'Lenguajes 1.º · Debate Escolar',
      text: 'Si no cuidamos el entorno ahora, [___]cuándo actuaremos[___]',
      options: ['¿ ... ?', '¡ ... !', ', ... .'], answer: '¿ ... ?',
      rule: 'Cuando la pregunta inicia a mitad de la oración, el signo "¿" se abre justo donde empieza la pregunta.'
    },
    {
      mission: 3, scene: 'entrevista', project: 'Lenguajes 1.º · Diálogo Escrito',
      text: '[___]Felicidades por haber ganado el concurso estatal de oratoria[___]',
      options: ['¡ ... !', '¿ ... ?', ': ... .'], answer: '¡ ... !',
      rule: 'Las felicitaciones y expresiones emotivas se escriben entre signos de admiración (¡ !).'
    },
    {
      mission: 3, scene: 'ciencia', project: 'Lenguajes 1.º · Divulgación',
      text: 'No sabemos [___]qué impacto tendrá esa tecnología en veinte años[___]',
      options: ['sin ¿ ?', '¿ ... ?', '¡ ... !'], answer: 'sin ¿ ?',
      rule: 'Es una oración enunciativa con interrogativa indirecta ("No sabemos qué..."), por lo que no lleva ¿ ?.'
    },

    // Misión 4: Ortografía y Acentuación Diacrítica 1.º Secundaria
    {
      mission: 4, scene: 'periodico', project: 'Lenguajes 1.º · Redacción',
      text: 'No sé [___]é opinas sobre la noticia de hoy.',
      options: ['qu', 'c', 'k'], answer: 'qu',
      rule: 'En preguntas directas o indirectas, "qué" lleva tilde y se escribe con qu.'
    },
    {
      mission: 4, scene: 'libro', project: 'Lenguajes 1.º · Ortografía',
      text: 'La crónica de[___]e incluir datos reales, fecha y lugar de los hechos.',
      options: ['b', 'v'], answer: 'b',
      rule: 'El verbo "deber" ("debe") siempre se escribe con b.'
    },
    {
      mission: 4, scene: 'ciencia', project: 'Lenguajes 1.º · Divulgación',
      text: 'La in[___]estigación científica requiere observación y análisis.',
      options: ['v', 'b'], answer: 'v',
      rule: 'La palabra "investigación" se escribe con v.'
    },
    {
      mission: 4, scene: 'cultura', project: 'Lenguajes 1.º · Lenguajes',
      text: 'El diálogo respetuoso fortalece la con[___]ivencia escolar.',
      options: ['v', 'b'], answer: 'v',
      rule: 'Después de "n" (convivencia) siempre se escribe v, nunca b.'
    },
    {
      mission: 4, scene: 'entrevista', project: 'Lenguajes 1.º · Entrevista',
      text: 'El entrevistado respondió con mucha [___]abilidad y claridad.',
      options: ['h', 'sin h'], answer: 'h',
      rule: 'La palabra "habilidad" (y hábil) se escribe con h inicial.'
    },
    {
      mission: 4, scene: 'periodico', project: 'Lenguajes 1.º · Puntuación y Ortografía',
      text: 'El texto expositivo ex[___]lica un fenómeno con lenguaje claro y objetivo.',
      options: ['p', 'b'], answer: 'p',
      rule: 'El verbo "explicar" ("explica") se escribe con p.'
    }
  ];

  window.ORTOGRAFIA_QUEST_DATA = {
    scenes: SCENES,
    primaria: PRIMARIA_ITEMS,
    secundaria: SECUNDARIA_ITEMS
  };
})();
