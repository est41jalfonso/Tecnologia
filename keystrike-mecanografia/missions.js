// KeyStrike EST 41 - Catálogo de Misiones y Guía de Digitación

window.MISSIONS = [
  // ==========================================
  // BLOQUE 1: LETRAS ALEATORIAS (VELOCIDAD PROGRESIVA Y DOMINIO DEL TECLADO)
  // ==========================================
  {
    id: 1,
    type: 'letters',
    badge: 'MISIÓN 01',
    title: 'Fila Guía: Despegue',
    subtitle: 'Letras aleatorias (A, S, D, F, G, H, J, K, L, Ñ) • Velocidad Ágil',
    description: 'Domina la fila central del teclado sin mirar las teclas. Requiere mínimo 90% de aciertos para acreditar y desbloquear la Misión 02.',
    difficulty: 'Inicial',
    difficultyColor: 'text-tertiary-container border-tertiary-container/40 bg-tertiary-container/10',
    chars: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    totalLetters: 50,
    baseSpeed: 120,      // px por segundo iniciales
    maxSpeed: 170,       // px por segundo al final de la misión
    spawnIntervalMs: 1300,
    minSpawnMs: 900,
    shields: 6
  },
  {
    id: 2,
    type: 'letters',
    badge: 'MISIÓN 02',
    title: 'Fila Superior + Guía',
    subtitle: '55 letras distribuidas (Q–P + A–Ñ) • Velocidad Media',
    description: 'Combina la fila superior con la fila guía alternando mano izquierda y derecha. Requiere ≥90% para avanzar.',
    difficulty: 'Media',
    difficultyColor: 'text-primary-container border-primary-container/40 bg-primary-container/10',
    chars: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'J', 'K', 'L', 'Ñ'],
    totalLetters: 55,
    baseSpeed: 145,
    maxSpeed: 205,
    spawnIntervalMs: 1120,
    minSpawnMs: 760,
    shields: 6
  },
  {
    id: 3,
    type: 'letters',
    badge: 'MISIÓN 03',
    title: 'Todo el Abecedario (3 Filas)',
    subtitle: '60 letras distribuidas A–Z + Ñ • Velocidad Alta',
    description: 'Recorre las tres filas de letras del teclado español manteniendo ≥90% de aciertos.',
    difficulty: 'Alta',
    difficultyColor: 'text-secondary border-secondary/40 bg-secondary/10',
    chars: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split(''),
    totalLetters: 60,
    baseSpeed: 170,
    maxSpeed: 235,
    spawnIntervalMs: 980,
    minSpawnMs: 660,
    shields: 6
  },
  {
    id: 4,
    type: 'letters',
    badge: 'MISIÓN 04',
    title: 'Teclado Completo + Puntuación',
    subtitle: '60 teclas A–Z, Ñ y signos (, . -) • Velocidad Rápida',
    description: 'Dominio integral de todas las letras y signos básicos de puntuación a gran velocidad.',
    difficulty: 'Rápida',
    difficultyColor: 'text-amber-800 border-amber-400 bg-amber-100',
    chars: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ,.-'.split(''),
    totalLetters: 60,
    baseSpeed: 195,
    maxSpeed: 265,
    spawnIntervalMs: 850,
    minSpawnMs: 560,
    shields: 6
  },
  {
    id: 5,
    type: 'letters',
    badge: 'MISIÓN 05',
    title: 'Desafío Turbo: Teclado Total',
    subtitle: '65 teclas A–Z, Ñ, números 0–9 y signos • Velocidad Extrema',
    description: 'Prueba máxima de reflejos y ubicación exacta en todo el teclado antes de pasar a los párrafos contrarreloj.',
    difficulty: 'Extrema',
    difficultyColor: 'text-red-800 border-red-400 bg-red-100',
    chars: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789,.-'.split(''),
    totalLetters: 65,
    baseSpeed: 220,
    maxSpeed: 300,
    spawnIntervalMs: 740,
    minSpawnMs: 490,
    shields: 6
  },

  // ==========================================
  // BLOQUE 2: PÁRRAFOS CONTRARRELOJ (MÁXIMO 1 MINUTO)
  // Conceptos verificados de Tecnología e Informática
  // ==========================================
  {
    id: 6,
    type: 'paragraph',
    badge: 'MISIÓN 06',
    title: 'Párrafo 1: Sistema Técnico (NEM)',
    subtitle: 'Contrarreloj 60s • ~147 caracteres (~23 palabras)',
    description: 'Concepto clave del campo De lo Humano y lo Comunitario. Escribe el párrafo en máximo 1 minuto.',
    difficulty: 'Párrafo 1',
    difficultyColor: 'text-tertiary-container border-tertiary-container/40 bg-tertiary-container/10',
    timeLimitSec: 60,
    text: 'Un sistema técnico articula personas, energía, materiales y herramientas informáticas para transformar datos y resolver necesidades de la comunidad.'
  },
  {
    id: 7,
    type: 'paragraph',
    badge: 'MISIÓN 07',
    title: 'Párrafo 2: Hardware y Software',
    subtitle: 'Contrarreloj 60s • ~181 caracteres (~31 palabras)',
    description: 'Distingue los componentes físicos y lógicos de la computadora aumentando la extensión del texto.',
    difficulty: 'Párrafo 2',
    difficultyColor: 'text-primary-container border-primary-container/40 bg-primary-container/10',
    timeLimitSec: 60,
    text: 'El hardware es la parte física de la computadora que podemos tocar, como el teclado y el monitor. El software son los programas y las instrucciones lógicas que le indican qué hacer.'
  },
  {
    id: 8,
    type: 'paragraph',
    badge: 'MISIÓN 08',
    title: 'Párrafo 3: La Memoria RAM',
    subtitle: 'Contrarreloj 60s • ~224 caracteres (~40 palabras)',
    description: 'Aprende cómo funciona la memoria de trabajo temporal (volátil) mientras aumentas tu velocidad.',
    difficulty: 'Párrafo 3',
    difficultyColor: 'text-primary-container border-primary-container/40 bg-primary-container/10',
    timeLimitSec: 60,
    text: 'La memoria RAM es la memoria de trabajo temporal donde se cargan los programas que usas en el momento. Es volátil porque su contenido se borra al apagar el equipo, y tener más gigabytes evita que la computadora se vuelva lenta.'
  },
  {
    id: 9,
    type: 'paragraph',
    badge: 'MISIÓN 09',
    title: 'Párrafo 4: El Procesador (CPU y GHz)',
    subtitle: 'Contrarreloj 60s • ~256 caracteres (~42 palabras)',
    description: 'Comprende el papel del cerebro de la computadora, sus núcleos y su frecuencia en gigahercios.',
    difficulty: 'Párrafo 4',
    difficultyColor: 'text-secondary border-secondary/40 bg-secondary/10',
    timeLimitSec: 60,
    text: 'El procesador o CPU es el cerebro de la computadora encargado de ejecutar operaciones lógicas y matemáticas. Su velocidad se mide en gigahercios y sus núcleos permiten realizar varias tareas al mismo tiempo, como navegar, escribir documentos y reproducir audio.'
  },
  {
    id: 10,
    type: 'paragraph',
    badge: 'MISIÓN 10',
    title: 'Párrafo 5: Capacidades (Bit, Byte, GB y TB)',
    subtitle: 'Contrarreloj 60s • ~277 caracteres (~45 palabras)',
    description: 'Domina las unidades de medida digital desde el bit hasta el terabyte en 60 segundos.',
    difficulty: 'Párrafo 5',
    difficultyColor: 'text-secondary border-secondary/40 bg-secondary/10',
    timeLimitSec: 60,
    text: 'Toda información digital se guarda en bits que representan ceros o unos. Ocho bits forman un byte, equivalente a una letra. Mil veinticuatro megabytes forman un gigabyte y mil veinticuatro gigabytes forman un terabyte, unidad común para medir discos duros y memorias modernas.'
  },
  {
    id: 11,
    type: 'paragraph',
    badge: 'MISIÓN 11',
    title: 'Párrafo 6: Almacenamiento HDD vs SSD',
    subtitle: 'Contrarreloj 60s • ~339 caracteres (~56 palabras)',
    description: 'Compara los discos duros magnéticos (HDD) y las unidades de estado sólido (SSD) de alta velocidad.',
    difficulty: 'Párrafo 6',
    difficultyColor: 'text-amber-800 border-amber-400 bg-amber-100',
    timeLimitSec: 60,
    text: 'A diferencia de la memoria RAM, los discos duros HDD y las unidades de estado sólido SSD guardan tus archivos de forma permanente. Los discos HDD usan platos magnéticos giratorios y ofrecen gran capacidad a bajo costo, mientras que las unidades SSD usan chips de memoria flash sin piezas móviles, logrando arranques y cargas mucho más rápidas.'
  },
  {
    id: 12,
    type: 'paragraph',
    badge: 'MISIÓN 12',
    title: 'Párrafo 7: Sistema Operativo y EST 41',
    subtitle: 'Contrarreloj 60s • ~363 caracteres (~58 palabras)',
    description: 'Reto maestro final de velocidad y comprensión tecnológica para obtener calificación de excelencia.',
    difficulty: 'Párrafo Maestro',
    difficultyColor: 'text-red-800 border-red-400 bg-red-100',
    timeLimitSec: 60,
    text: 'El sistema operativo actúa como director de orquesta entre el hardware, la memoria y tus aplicaciones en la Escuela Secundaria Técnica número 41. Administrar bien nuestros archivos, proteger los datos personales en línea y dominar el teclado con rapidez y precisión nos convierte en usuarios responsables de la tecnología informática dentro de nuestra comunidad.'
  }
];

// Mapa de dedo recomendado por carácter
window.FINGER_MAP = {
  '1': 'MEÑIQUE IZQ', 'Q': 'MEÑIQUE IZQ', 'A': 'MEÑIQUE IZQ', 'Z': 'MEÑIQUE IZQ',
  '2': 'ANULAR IZQ',  'W': 'ANULAR IZQ',  'S': 'ANULAR IZQ',  'X': 'ANULAR IZQ',
  '3': 'MEDIO IZQ',   'E': 'MEDIO IZQ',   'D': 'MEDIO IZQ',   'C': 'MEDIO IZQ',
  '4': 'ÍNDICE IZQ',  '5': 'ÍNDICE IZQ',  'R': 'ÍNDICE IZQ',  'T': 'ÍNDICE IZQ',
  'F': 'ÍNDICE IZQ',  'G': 'ÍNDICE IZQ',  'V': 'ÍNDICE IZQ',  'B': 'ÍNDICE IZQ',
  '6': 'ÍNDICE DER',  '7': 'ÍNDICE DER',  'Y': 'ÍNDICE DER',  'U': 'ÍNDICE DER',
  'H': 'ÍNDICE DER',  'J': 'ÍNDICE DER',  'N': 'ÍNDICE DER',  'M': 'ÍNDICE DER',
  '8': 'MEDIO DER',   'I': 'MEDIO DER',   'K': 'MEDIO DER',   ',': 'MEDIO DER',
  '9': 'ANULAR DER',  'O': 'ANULAR DER',  'L': 'ANULAR DER',  '.': 'ANULAR DER',
  '0': 'MEÑIQUE DER', 'P': 'MEÑIQUE DER', 'Ñ': 'MEÑIQUE DER', '-': 'MEÑIQUE DER',
  ' ': 'PULGARES'
};

window.getFingerHint = function (char) {
  if (!char) return 'FILA GUÍA';
  const normalized = char
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, (m, offset, str) => {
      return str[offset - 1] === 'N' || str[offset - 1] === 'n' ? m : '';
    });
  const key = char.toUpperCase() === 'Ñ' ? 'Ñ' : normalized;
  return window.FINGER_MAP[key] || 'TECLADO';
};
