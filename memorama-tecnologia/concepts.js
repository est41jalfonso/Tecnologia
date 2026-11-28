// Banco de 105 conceptos básicos de Tecnología e Informática con ilustraciones SVG claras
(function () {
  const S = (inner, bg = '#F0F9FF') =>
    `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <rect x="4" y="4" width="112" height="112" rx="20" fill="${bg}"/>
      ${inner}
    </svg>`;

  const CONCEPTS = [
    // ==================== 1. HARDWARE INTERNO (21) ====================
    {
      id: 'hardware',
      term: 'Hardware',
      category: 'Hardware Interno',
      hint: 'Componentes físicos y tangibles de una computadora (torre, placa, piezas).',
      svg: S(`
        <rect x="18" y="24" width="44" height="72" rx="6" fill="#0F172A" stroke="#0284C7" stroke-width="3"/>
        <rect x="25" y="34" width="30" height="8" rx="2" fill="#38BDF8"/>
        <circle cx="40" cy="72" r="8" fill="#10B981"/>
        <rect x="68" y="42" width="34" height="34" rx="5" fill="#7C3AED"/>
        <rect x="75" y="49" width="20" height="20" rx="2" fill="#DDD6FE"/>
        <line x1="72" y1="38" x2="72" y2="42" stroke="#F59E0B" stroke-width="3"/>
        <line x1="85" y1="38" x2="85" y2="42" stroke="#F59E0B" stroke-width="3"/>
        <line x1="98" y1="38" x2="98" y2="42" stroke="#F59E0B" stroke-width="3"/>
      `, '#EFF6FF')
    },
    {
      id: 'memoria-ram',
      term: 'Memoria RAM',
      category: 'Hardware Interno',
      hint: 'Módulo alargado con chips negros y pines dorados para memoria de trabajo rápida.',
      svg: S(`
        <rect x="12" y="38" width="96" height="36" rx="4" fill="#059669" stroke="#065F46" stroke-width="2.5"/>
        <rect x="18" y="45" width="14" height="20" rx="2" fill="#0F172A"/>
        <rect x="37" y="45" width="14" height="20" rx="2" fill="#0F172A"/>
        <rect x="56" y="45" width="14" height="20" rx="2" fill="#0F172A"/>
        <rect x="75" y="45" width="14" height="20" rx="2" fill="#0F172A"/>
        <rect x="93" y="45" width="10" height="20" rx="2" fill="#0F172A"/>
        <rect x="16" y="74" width="38" height="8" fill="#F59E0B"/>
        <rect x="62" y="74" width="42" height="8" fill="#F59E0B"/>
        <circle cx="58" cy="78" r="3" fill="#F0F9FF"/>
      `, '#ECFDF5')
    },
    {
      id: 'cpu',
      term: 'Procesador (CPU)',
      category: 'Hardware Interno',
      hint: 'Cerebro de la computadora; circuito cuadrado con pines metálicos.',
      svg: S(`
        <rect x="30" y="30" width="60" height="60" rx="8" fill="#0284C7" stroke="#075985" stroke-width="3"/>
        <rect x="42" y="42" width="36" height="36" rx="4" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/>
        <rect x="52" y="52" width="16" height="16" rx="2" fill="#0F172A"/>
        <path d="M40 20v10M53 20v10M67 20v10M80 20v10M40 90v10M53 90v10M67 90v10M80 90v10M20 40h10M20 53h10M20 67h10M20 80h10M90 40h10M90 53h10M90 67h10M90 80h10" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      `, '#F0F9FF')
    },
    {
      id: 'hdd',
      term: 'Disco Duro (HDD)',
      category: 'Hardware Interno',
      hint: 'Almacenamiento magnético con plato giratorio y brazo lector.',
      svg: S(`
        <rect x="24" y="16" width="72" height="88" rx="8" fill="#334155" stroke="#0F172A" stroke-width="3"/>
        <circle cx="60" cy="54" r="24" fill="#E2E8F0" stroke="#64748B" stroke-width="2.5"/>
        <circle cx="60" cy="54" r="7" fill="#475569"/>
        <path d="M36 86 L58 60" stroke="#F59E0B" stroke-width="5" stroke-linecap="round"/>
        <circle cx="34" cy="88" r="5" fill="#94A3B8"/>
      `, '#F1F5F9')
    },
    {
      id: 'ssd',
      term: 'Unidad SSD',
      category: 'Hardware Interno',
      hint: 'Almacenamiento de estado sólido ultrarrápido sin partes móviles.',
      svg: S(`
        <rect x="16" y="34" width="88" height="52" rx="8" fill="#7C3AED" stroke="#5B21B6" stroke-width="3"/>
        <rect x="26" y="44" width="22" height="22" rx="3" fill="#0F172A"/>
        <rect x="54" y="44" width="22" height="22" rx="3" fill="#0F172A"/>
        <path d="M84 44 L94 56 L86 56 L92 68" stroke="#FDE047" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="26" y="74" width="68" height="5" rx="2" fill="#DDD6FE"/>
      `, '#F5F3FF')
    },
    {
      id: 'tarjeta-madre',
      term: 'Tarjeta Madre',
      category: 'Hardware Interno',
      hint: 'Placa principal donde se conectan el procesador, la RAM y las tarjetas.',
      svg: S(`
        <rect x="16" y="18" width="88" height="84" rx="6" fill="#047857" stroke="#064E3B" stroke-width="3"/>
        <rect x="26" y="28" width="28" height="28" rx="3" fill="#E2E8F0" stroke="#0F172A" stroke-width="2"/>
        <rect x="64" y="28" width="8" height="36" rx="1" fill="#F59E0B"/>
        <rect x="78" y="28" width="8" height="36" rx="1" fill="#38BDF8"/>
        <rect x="26" y="68" width="44" height="8" rx="2" fill="#0F172A"/>
        <rect x="26" y="82" width="44" height="8" rx="2" fill="#0F172A"/>
        <circle cx="84" cy="84" r="8" fill="#CBD5E1"/>
      `, '#ECFDF5')
    },
    {
      id: 'gpu',
      term: 'Tarjeta Gráfica (GPU)',
      category: 'Hardware Interno',
      hint: 'Tarjeta con ventiladores encargada de procesar gráficos y videojuegos.',
      svg: S(`
        <rect x="14" y="34" width="92" height="46" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
        <circle cx="40" cy="57" r="15" fill="#38BDF8" stroke="#0284C7" stroke-width="2.5"/>
        <circle cx="80" cy="57" r="15" fill="#38BDF8" stroke="#0284C7" stroke-width="2.5"/>
        <circle cx="40" cy="57" r="4" fill="#0F172A"/>
        <circle cx="80" cy="57" r="4" fill="#0F172A"/>
        <rect x="28" y="80" width="52" height="7" fill="#F59E0B"/>
      `, '#F0F9FF')
    },
    {
      id: 'fuente-poder',
      term: 'Fuente de Poder',
      category: 'Hardware Interno',
      hint: 'Convierte la corriente eléctrica para alimentar los componentes internos.',
      svg: S(`
        <rect x="18" y="28" width="84" height="64" rx="6" fill="#475569" stroke="#0F172A" stroke-width="3"/>
        <circle cx="48" cy="60" r="20" fill="#0F172A" stroke="#94A3B8" stroke-width="2"/>
        <path d="M48 44v32M32 60h32" stroke="#38BDF8" stroke-width="3"/>
        <path d="M84 44 L76 58 L84 58 L78 72" stroke="#FACC15" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      `, '#F1F5F9')
    },
    {
      id: 'disipador',
      term: 'Ventilador / Disipador',
      category: 'Hardware Interno',
      hint: 'Enfría el procesador expulsando el calor generado.',
      svg: S(`
        <rect x="22" y="22" width="76" height="76" rx="12" fill="#0F172A"/>
        <circle cx="60" cy="60" r="30" fill="#E2E8F0"/>
        <path d="M60 60 C52 36, 72 32, 66 56 C86 48, 90 68, 66 64 C72 86, 52 90, 56 64 C34 72, 32 52, 56 56 Z" fill="#0284C7"/>
        <circle cx="60" cy="60" r="6" fill="#0F172A"/>
      `, '#EFF6FF')
    },
    {
      id: 'gabinete',
      term: 'Gabinete / Torre',
      category: 'Hardware Interno',
      hint: 'Carcasa metálica que protege todos los componentes internos de la PC.',
      svg: S(`
        <rect x="34" y="14" width="52" height="92" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
        <rect x="42" y="24" width="36" height="8" rx="2" fill="#94A3B8"/>
        <rect x="42" y="38" width="36" height="32" rx="4" fill="#0284C7" fill-opacity="0.3" stroke="#38BDF8" stroke-width="2"/>
        <circle cx="60" cy="88" r="6" fill="#10B981"/>
      `, '#F1F5F9')
    },
    {
      id: 'bios',
      term: 'Chip BIOS / UEFI',
      category: 'Hardware Interno',
      hint: 'Memoria de arranque que inicia y revisa el hardware al encender la PC.',
      svg: S(`
        <rect x="28" y="34" width="64" height="52" rx="6" fill="#0F172A" stroke="#7C3AED" stroke-width="3"/>
        <text x="60" y="66" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="18" fill="#A78BFA">BIOS</text>
        <path d="M36 26v8M52 26v8M68 26v8M84 26v8M36 86v8M52 86v8M68 86v8M84 86v8" stroke="#CBD5E1" stroke-width="3"/>
      `, '#F5F3FF')
    },
    {
      id: 'bateria-cmos',
      term: 'Batería CMOS',
      category: 'Hardware Interno',
      hint: 'Pila redonda plateada que conserva la hora y configuración del BIOS.',
      svg: S(`
        <circle cx="60" cy="60" r="34" fill="#CBD5E1" stroke="#475569" stroke-width="3"/>
        <circle cx="60" cy="60" r="24" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2"/>
        <path d="M52 60h16M60 52v16" stroke="#0F172A" stroke-width="4" stroke-linecap="round"/>
      `, '#F1F5F9')
    },
    {
      id: 'puerto-usb',
      term: 'Puerto USB',
      category: 'Hardware Interno',
      hint: 'Conector universal para memorias, teclados y otros dispositivos.',
      svg: S(`
        <rect x="24" y="40" width="72" height="40" rx="6" fill="#334155" stroke="#0F172A" stroke-width="3"/>
        <rect x="34" y="48" width="52" height="12" rx="2" fill="#0284C7"/>
        <circle cx="44" cy="70" r="3" fill="#CBD5E1"/>
        <circle cx="76" cy="70" r="3" fill="#CBD5E1"/>
      `, '#EFF6FF')
    },
    {
      id: 'puerto-hdmi',
      term: 'Puerto HDMI',
      category: 'Hardware Interno',
      hint: 'Conector trapezoidal que transmite video y audio en alta definición.',
      svg: S(`
        <polygon points="24,42 96,42 96,64 84,78 36,78 24,64" fill="#0F172A" stroke="#64748B" stroke-width="3"/>
        <rect x="36" y="54" width="48" height="8" rx="2" fill="#F59E0B"/>
      `, '#FEF3C7')
    },
    {
      id: 'puerto-ethernet',
      term: 'Puerto Ethernet (RJ45)',
      category: 'Hardware Interno',
      hint: 'Entrada cuadrada para conectar el cable de red internet por cable.',
      svg: S(`
        <rect x="26" y="26" width="68" height="68" rx="8" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
        <polygon points="38,44 82,44 82,76 68,76 68,84 52,84 52,76 38,76" fill="#0F172A" stroke="#38BDF8" stroke-width="2.5"/>
        <rect x="34" y="32" width="12" height="6" rx="2" fill="#10B981"/>
        <rect x="74" y="32" width="12" height="6" rx="2" fill="#F59E0B"/>
      `, '#EFF6FF')
    },
    {
      id: 'tarjeta-red',
      term: 'Tarjeta de Red',
      category: 'Hardware Interno',
      hint: 'Placa de expansión que permite conectarse a redes LAN o Wi-Fi.',
      svg: S(`
        <rect x="22" y="32" width="76" height="48" rx="4" fill="#059669" stroke="#065F46" stroke-width="3"/>
        <rect x="36" y="44" width="24" height="22" rx="2" fill="#0F172A"/>
        <rect x="14" y="24" width="8" height="66" rx="2" fill="#94A3B8"/>
        <rect x="40" y="80" width="44" height="7" fill="#F59E0B"/>
      `, '#ECFDF5')
    },
    {
      id: 'tarjeta-sonido',
      term: 'Tarjeta de Audio',
      category: 'Hardware Interno',
      hint: 'Procesa la entrada y salida de sonido con conectores de colores.',
      svg: S(`
        <rect x="22" y="30" width="74" height="50" rx="5" fill="#7C3AED" stroke="#5B21B6" stroke-width="3"/>
        <circle cx="40" cy="48" r="7" fill="#10B981" stroke="#FFFFFF" stroke-width="2"/>
        <circle cx="40" cy="66" r="7" fill="#EC4899" stroke="#FFFFFF" stroke-width="2"/>
        <path d="M62 46v20M72 40v28M82 50v12" stroke="#FDE047" stroke-width="4" stroke-linecap="round"/>
      `, '#F5F3FF')
    },
    {
      id: 'pasta-termica',
      term: 'Pasta Térmica',
      category: 'Hardware Interno',
      hint: 'Jeringa con compuesto gris que mejora la transferencia de calor al disipador.',
      svg: S(`
        <rect x="44" y="28" width="32" height="52" rx="4" fill="#CBD5E1" stroke="#475569" stroke-width="3"/>
        <rect x="54" y="14" width="12" height="14" fill="#0284C7"/>
        <polygon points="56,80 64,80 60,102" fill="#64748B"/>
        <rect x="48" y="42" width="24" height="20" fill="#64748B"/>
      `, '#F1F5F9')
    },
    {
      id: 'bus-datos',
      term: 'Bus de Datos (SATA)',
      category: 'Hardware Interno',
      hint: 'Cable plano que transporta datos entre la tarjeta madre y los discos.',
      svg: S(`
        <path d="M22 36 C22 76, 98 44, 98 84" stroke="#DC2626" stroke-width="14" fill="none" stroke-linecap="round"/>
        <rect x="14" y="24" width="22" height="14" rx="2" fill="#0F172A"/>
        <rect x="84" y="82" width="22" height="14" rx="2" fill="#0F172A"/>
      `, '#FEF2F2')
    },
    {
      id: 'memoria-cache',
      term: 'Memoria Caché',
      category: 'Hardware Interno',
      hint: 'Memoria ultrarrápida integrada junto al núcleo del procesador.',
      svg: S(`
        <rect x="22" y="22" width="76" height="76" rx="10" fill="#0F172A" stroke="#0284C7" stroke-width="3"/>
        <rect x="34" y="34" width="22" height="22" rx="3" fill="#38BDF8"/>
        <rect x="64" y="34" width="22" height="22" rx="3" fill="#F59E0B"/>
        <rect x="34" y="64" width="52" height="18" rx="3" fill="#10B981"/>
      `, '#EFF6FF')
    },
    {
      id: 'lector-optico',
      term: 'Lector Óptico (CD/DVD)',
      category: 'Hardware Interno',
      hint: 'Unidad con bandeja para leer discos ópticos mediante láser.',
      svg: S(`
        <rect x="16" y="32" width="88" height="56" rx="6" fill="#334155" stroke="#0F172A" stroke-width="3"/>
        <rect x="24" y="42" width="72" height="10" rx="2" fill="#0F172A"/>
        <circle cx="60" cy="70" r="14" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"/>
        <circle cx="60" cy="70" r="4" fill="#FFFFFF"/>
      `, '#F1F5F9')
    },

    // ==================== 2. PERIFÉRICOS Y PUERTOS (21) ====================
    {
      id: 'teclado',
      term: 'Teclado',
      category: 'Periféricos',
      hint: 'Periférico de entrada con teclas alfanuméricas para escribir comandos y texto.',
      svg: S(`
        <rect x="12" y="34" width="96" height="52" rx="8" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
        <rect x="20" y="42" width="12" height="10" rx="2" fill="#FFFFFF"/>
        <rect x="36" y="42" width="12" height="10" rx="2" fill="#FFFFFF"/>
        <rect x="52" y="42" width="12" height="10" rx="2" fill="#FFFFFF"/>
        <rect x="68" y="42" width="12" height="10" rx="2" fill="#FFFFFF"/>
        <rect x="84" y="42" width="16" height="10" rx="2" fill="#38BDF8"/>
        <rect x="20" y="56" width="14" height="10" rx="2" fill="#FFFFFF"/>
        <rect x="38" y="56" width="14" height="10" rx="2" fill="#FFFFFF"/>
        <rect x="56" y="56" width="14" height="10" rx="2" fill="#FFFFFF"/>
        <rect x="74" y="56" width="26" height="10" rx="2" fill="#7C3AED"/>
        <rect x="30" y="70" width="58" height="9" rx="2" fill="#CBD5E1"/>
      `, '#EFF6FF')
    },
    {
      id: 'mouse',
      term: 'Mouse (Ratón)',
      category: 'Periféricos',
      hint: 'Dispositivo apuntador para mover el cursor y hacer clic en pantalla.',
      svg: S(`
        <rect x="36" y="22" width="48" height="76" rx="24" fill="#FFFFFF" stroke="#0F172A" stroke-width="3.5"/>
        <line x1="60" y1="22" x2="60" y2="54" stroke="#0F172A" stroke-width="2.5"/>
        <line x1="36" y1="54" x2="84" y2="54" stroke="#0F172A" stroke-width="2.5"/>
        <rect x="56" y="32" width="8" height="14" rx="4" fill="#0284C7"/>
      `, '#F0F9FF')
    },
    {
      id: 'monitor',
      term: 'Monitor',
      category: 'Periféricos',
      hint: 'Pantalla de salida visual que muestra la interfaz gráfica.',
      svg: S(`
        <rect x="14" y="20" width="92" height="60" rx="6" fill="#0F172A" stroke="#334155" stroke-width="3"/>
        <rect x="22" y="28" width="76" height="44" rx="2" fill="#38BDF8"/>
        <rect x="52" y="80" width="16" height="12" fill="#475569"/>
        <rect x="38" y="92" width="44" height="7" rx="3" fill="#1E293B"/>
      `, '#EFF6FF')
    },
    {
      id: 'impresora',
      term: 'Impresora',
      category: 'Periféricos',
      hint: 'Periférico de salida que plasma documentos o imágenes en papel.',
      svg: S(`
        <rect x="34" y="18" width="52" height="22" rx="3" fill="#FFFFFF" stroke="#64748B" stroke-width="2.5"/>
        <rect x="16" y="38" width="88" height="40" rx="8" fill="#334155" stroke="#0F172A" stroke-width="3"/>
        <rect x="32" y="66" width="56" height="34" rx="3" fill="#FFFFFF" stroke="#64748B" stroke-width="2.5"/>
        <line x1="40" y1="76" x2="80" y2="76" stroke="#0284C7" stroke-width="3"/>
        <line x1="40" y1="86" x2="72" y2="86" stroke="#94A3B8" stroke-width="3"/>
        <circle cx="88" cy="50" r="4" fill="#10B981"/>
      `, '#F1F5F9')
    },
    {
      id: 'escaner',
      term: 'Escáner',
      category: 'Periféricos',
      hint: 'Digitaliza documentos físicos y fotografías mediante un haz de luz.',
      svg: S(`
        <rect x="18" y="48" width="84" height="40" rx="6" fill="#334155" stroke="#0F172A" stroke-width="3"/>
        <polygon points="22,48 94,22 98,30 26,52" fill="#64748B"/>
        <rect x="28" y="58" width="64" height="6" rx="2" fill="#38BDF8"/>
        <circle cx="88" cy="76" r="4" fill="#10B981"/>
      `, '#EFF6FF')
    },
    {
      id: 'bocinas',
      term: 'Bocinas (Altavoces)',
      category: 'Periféricos',
      hint: 'Periférico de salida que reproduce música, efectos y voz.',
      svg: S(`
        <rect x="20" y="22" width="34" height="76" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
        <circle cx="37" cy="44" r="9" fill="#38BDF8"/>
        <circle cx="37" cy="74" r="12" fill="#475569" stroke="#CBD5E1" stroke-width="2"/>
        <rect x="66" y="22" width="34" height="76" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
        <circle cx="83" cy="44" r="9" fill="#38BDF8"/>
        <circle cx="83" cy="74" r="12" fill="#475569" stroke="#CBD5E1" stroke-width="2"/>
      `, '#F1F5F9')
    },
    {
      id: 'audifonos',
      term: 'Audífonos',
      category: 'Periféricos',
      hint: 'Diadema de salida de audio personal para escuchar sin ruido externo.',
      svg: S(`
        <path d="M26 64 V54 A34 34 0 0 1 94 54 V64" fill="none" stroke="#0F172A" stroke-width="7" stroke-linecap="round"/>
        <rect x="18" y="58" width="16" height="32" rx="8" fill="#7C3AED" stroke="#0F172A" stroke-width="2.5"/>
        <rect x="86" y="58" width="16" height="32" rx="8" fill="#7C3AED" stroke="#0F172A" stroke-width="2.5"/>
      `, '#F5F3FF')
    },
    {
      id: 'microfono',
      term: 'Micrófono',
      category: 'Periféricos',
      hint: 'Periférico de entrada que captura la voz y la convierte en señal digital.',
      svg: S(`
        <rect x="46" y="20" width="28" height="44" rx="14" fill="#0284C7" stroke="#0F172A" stroke-width="3"/>
        <path d="M36 52 A24 24 0 0 0 84 52" fill="none" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
        <line x1="60" y1="76" x2="60" y2="96" stroke="#334155" stroke-width="5"/>
        <line x1="42" y1="96" x2="78" y2="96" stroke="#0F172A" stroke-width="5" stroke-linecap="round"/>
      `, '#EFF6FF')
    },
    {
      id: 'webcam',
      term: 'Cámara Web',
      category: 'Periféricos',
      hint: 'Cámara de video conectada a la computadora para videollamadas.',
      svg: S(`
        <circle cx="60" cy="50" r="28" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
        <circle cx="60" cy="50" r="14" fill="#38BDF8" stroke="#FFFFFF" stroke-width="2.5"/>
        <circle cx="60" cy="50" r="5" fill="#0F172A"/>
        <rect x="44" y="78" width="32" height="16" rx="4" fill="#475569"/>
      `, '#F1F5F9')
    },
    {
      id: 'memoria-usb',
      term: 'Memoria USB',
      category: 'Periféricos',
      hint: 'Dispositivo portátil de almacenamiento flash que se conecta por USB.',
      svg: S(`
        <rect x="42" y="16" width="36" height="24" rx="2" fill="#CBD5E1" stroke="#475569" stroke-width="2.5"/>
        <rect x="49" y="22" width="7" height="8" fill="#475569"/>
        <rect x="64" y="22" width="7" height="8" fill="#475569"/>
        <rect x="34" y="40" width="52" height="62" rx="10" fill="#7C3AED" stroke="#5B21B6" stroke-width="3"/>
        <circle cx="60" cy="70" r="8" fill="#DDD6FE"/>
      `, '#F5F3FF')
    },
    {
      id: 'tarjeta-sd',
      term: 'Tarjeta SD',
      category: 'Periféricos',
      hint: 'Tarjeta de memoria compacta usada en cámaras, celulares y Raspberry Pi.',
      svg: S(`
        <polygon points="32,20 74,20 88,34 88,98 32,98" fill="#0284C7" stroke="#075985" stroke-width="3"/>
        <rect x="40" y="26" width="7" height="14" fill="#F59E0B"/>
        <rect x="51" y="26" width="7" height="14" fill="#F59E0B"/>
        <rect x="62" y="26" width="7" height="14" fill="#F59E0B"/>
        <rect x="42" y="54" width="36" height="32" rx="3" fill="#FFFFFF"/>
        <text x="60" y="76" text-anchor="middle" font-weight="bold" font-size="16" fill="#0284C7">SD</text>
      `, '#EFF6FF')
    },
    {
      id: 'proyector',
      term: 'Proyector (Cañón)',
      category: 'Periféricos',
      hint: 'Proyecta la imagen de la computadora en una pantalla o pared grande.',
      svg: S(`
        <rect x="18" y="40" width="84" height="40" rx="8" fill="#334155" stroke="#0F172A" stroke-width="3"/>
        <circle cx="76" cy="60" r="14" fill="#38BDF8" stroke="#FFFFFF" stroke-width="3"/>
        <polygon points="90,50 112,38 112,82 90,70" fill="#BAE6FD" fill-opacity="0.7"/>
        <rect x="28" y="52" width="22" height="14" rx="2" fill="#94A3B8"/>
      `, '#EFF6FF')
    },
    {
      id: 'gamepad',
      term: 'Control (Gamepad)',
      category: 'Periféricos',
      hint: 'Mando con palancas y botones para controlar videojuegos.',
      svg: S(`
        <path d="M26 46 C18 46, 14 78, 26 84 C34 88, 42 74, 48 74 H72 C78 74, 86 88, 94 84 C106 78, 102 46, 94 46 Z" fill="#7C3AED" stroke="#4C1D95" stroke-width="3"/>
        <path d="M34 54v14M27 61h14" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
        <circle cx="80" cy="56" r="4" fill="#10B981"/>
        <circle cx="88" cy="63" r="4" fill="#F59E0B"/>
        <circle cx="72" cy="63" r="4" fill="#38BDF8"/>
      `, '#F5F3FF')
    },
    {
      id: 'tableta-grafica',
      term: 'Tableta Gráfica',
      category: 'Periféricos',
      hint: 'Superficie digital con lápiz óptico para dibujar e ilustrar en PC.',
      svg: S(`
        <rect x="16" y="28" width="88" height="64" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
        <rect x="26" y="36" width="60" height="48" rx="3" fill="#E0F2FE"/>
        <path d="M74 22 L96 44 L58 82 L48 84 L50 74 Z" fill="#F59E0B" stroke="#0F172A" stroke-width="2"/>
      `, '#EFF6FF')
    },
    {
      id: 'pantalla-tactil',
      term: 'Pantalla Táctil',
      category: 'Periféricos',
      hint: 'Permite interactuar tocando directamente con los dedos sobre el cristal.',
      svg: S(`
        <rect x="24" y="18" width="72" height="84" rx="10" fill="#0F172A"/>
        <rect x="30" y="26" width="60" height="66" rx="4" fill="#BAE6FD"/>
        <circle cx="60" cy="56" r="14" fill="none" stroke="#0284C7" stroke-width="3"/>
        <circle cx="60" cy="56" r="6" fill="#0284C7"/>
      `, '#F0F9FF')
    },
    {
      id: 'lector-codigos',
      term: 'Lector de Códigos',
      category: 'Periféricos',
      hint: 'Escanea códigos de barras con láser rojo para identificar productos.',
      svg: S(`
        <path d="M26 42 L76 28 L82 48 L48 56 L58 92 L40 96 Z" fill="#0F172A"/>
        <line x1="84" y1="38" x2="104" y2="38" stroke="#EF4444" stroke-width="4" stroke-dasharray="4 3"/>
        <rect x="86" y="54" width="20" height="24" fill="#FFFFFF" stroke="#0F172A" stroke-width="2"/>
        <line x1="91" y1="58" x2="91" y2="74" stroke="#0F172A" stroke-width="2"/>
        <line x1="96" y1="58" x2="96" y2="74" stroke="#0F172A" stroke-width="3"/>
        <line x1="101" y1="58" x2="101" y2="74" stroke="#0F172A" stroke-width="2"/>
      `, '#FEF2F2')
    },
    {
      id: 'disco-externo',
      term: 'Disco Duro Externo',
      category: 'Periféricos',
      hint: 'Unidad portátil conectada por cable USB para respaldar información.',
      svg: S(`
        <rect x="28" y="20" width="64" height="78" rx="10" fill="#0284C7" stroke="#075985" stroke-width="3"/>
        <circle cx="60" cy="82" r="4" fill="#4ADE80"/>
        <path d="M60 10v10" stroke="#0F172A" stroke-width="4"/>
        <rect x="42" y="34" width="36" height="8" rx="3" fill="#BAE6FD"/>
      `, '#EFF6FF')
    },
    {
      id: 'laptop',
      term: 'Laptop (Portátil)',
      category: 'Periféricos',
      hint: 'Computadora portátil con pantalla, teclado y batería integrados.',
      svg: S(`
        <rect x="22" y="24" width="76" height="50" rx="5" fill="#0F172A"/>
        <rect x="28" y="30" width="64" height="38" rx="2" fill="#38BDF8"/>
        <polygon points="14,76 106,76 96,92 24,92" fill="#64748B" stroke="#0F172A" stroke-width="2"/>
      `, '#F1F5F9')
    },
    {
      id: 'smartphone',
      term: 'Teléfono Inteligente',
      category: 'Periféricos',
      hint: 'Dispositivo móvil táctil con conexión a internet y aplicaciones.',
      svg: S(`
        <rect x="36" y="14" width="48" height="92" rx="10" fill="#0F172A"/>
        <rect x="41" y="24" width="38" height="68" rx="4" fill="#38BDF8"/>
        <circle cx="60" cy="98" r="3" fill="#CBD5E1"/>
        <rect x="52" y="18" width="16" height="3" rx="1.5" fill="#64748B"/>
      `, '#EFF6FF')
    },
    {
      id: 'tableta',
      term: 'Tableta (Tablet)',
      category: 'Periféricos',
      hint: 'Pantalla portátil táctil de formato amplio para lectura y apps.',
      svg: S(`
        <rect x="22" y="16" width="76" height="88" rx="10" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
        <rect x="29" y="24" width="62" height="68" rx="4" fill="#A7F3D0"/>
        <circle cx="60" cy="97" r="3.5" fill="#CBD5E1"/>
      `, '#ECFDF5')
    },
    {
      id: 'smartwatch',
      term: 'Reloj Inteligente',
      category: 'Periféricos',
      hint: 'Dispositivo vestible con sensores de salud y notificaciones.',
      svg: S(`
        <rect x="44" y="14" width="32" height="20" rx="4" fill="#475569"/>
        <rect x="44" y="86" width="32" height="20" rx="4" fill="#475569"/>
        <rect x="34" y="32" width="52" height="56" rx="14" fill="#0F172A"/>
        <rect x="40" y="38" width="40" height="44" rx="8" fill="#7C3AED"/>
        <text x="60" y="65" text-anchor="middle" font-weight="bold" font-size="14" fill="#FFFFFF">10:41</text>
      `, '#F5F3FF')
    },

    // ==================== 3. SOFTWARE Y ARCHIVOS (21) ====================
    {
      id: 'software',
      term: 'Software',
      category: 'Software y Archivos',
      hint: 'Programas, aplicaciones e instrucciones lógicas intangibles.',
      svg: S(`
        <rect x="18" y="24" width="84" height="72" rx="8" fill="#FFFFFF" stroke="#0284C7" stroke-width="3"/>
        <rect x="18" y="24" width="84" height="16" rx="6" fill="#0284C7"/>
        <circle cx="30" cy="32" r="3" fill="#FFFFFF"/>
        <circle cx="40" cy="32" r="3" fill="#FFFFFF"/>
        <text x="60" y="70" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="22" fill="#7C3AED">&lt;/&gt;</text>
      `, '#EFF6FF')
    },
    {
      id: 'sistema-operativo',
      term: 'Sistema Operativo',
      category: 'Software y Archivos',
      hint: 'Software principal que administra el hardware y los programas (Windows, Linux, etc.).',
      svg: S(`
        <rect x="22" y="22" width="34" height="34" rx="5" fill="#0284C7"/>
        <rect x="64" y="22" width="34" height="34" rx="5" fill="#10B981"/>
        <rect x="22" y="64" width="34" height="34" rx="5" fill="#F59E0B"/>
        <rect x="64" y="64" width="34" height="34" rx="5" fill="#7C3AED"/>
      `, '#F8FAFC')
    },
    {
      id: 'navegador-web',
      term: 'Navegador Web',
      category: 'Software y Archivos',
      hint: 'Aplicación para abrir páginas de internet (Chrome, Firefox, Edge).',
      svg: S(`
        <circle cx="60" cy="60" r="36" fill="#38BDF8" stroke="#0284C7" stroke-width="3"/>
        <ellipse cx="60" cy="60" rx="16" ry="36" fill="none" stroke="#FFFFFF" stroke-width="3"/>
        <line x1="24" y1="60" x2="96" y2="60" stroke="#FFFFFF" stroke-width="3"/>
        <circle cx="60" cy="60" r="10" fill="#F59E0B"/>
      `, '#EFF6FF')
    },
    {
      id: 'carpeta',
      term: 'Carpeta (Directorio)',
      category: 'Software y Archivos',
      hint: 'Contenedor digital amarillo para organizar archivos y subcarpetas.',
      svg: S(`
        <path d="M16 32 H46 L54 42 H104 V92 H16 Z" fill="#FBBF24" stroke="#D97706" stroke-width="3" stroke-linejoin="round"/>
        <rect x="20" y="46" width="80" height="42" rx="4" fill="#FDE68A"/>
      `, '#FEF3C7')
    },
    {
      id: 'archivo-pdf',
      term: 'Archivo PDF',
      category: 'Software y Archivos',
      hint: 'Documento portátil que conserva su formato sin importar el dispositivo.',
      svg: S(`
        <polygon points="30,16 72,16 90,34 90,104 30,104" fill="#FFFFFF" stroke="#DC2626" stroke-width="3"/>
        <rect x="30" y="60" width="60" height="24" fill="#DC2626"/>
        <text x="60" y="78" text-anchor="middle" font-weight="bold" font-size="16" fill="#FFFFFF">PDF</text>
      `, '#FEF2F2')
    },
    {
      id: 'hoja-calculo',
      term: 'Hoja de Cálculo',
      category: 'Software y Archivos',
      hint: 'Programa de filas y columnas para fórmulas, tablas y gráficas.',
      svg: S(`
        <rect x="22" y="20" width="76" height="80" rx="8" fill="#16A34A" stroke="#15803D" stroke-width="3"/>
        <rect x="32" y="34" width="56" height="52" rx="3" fill="#FFFFFF"/>
        <line x1="32" y1="51" x2="88" y2="51" stroke="#16A34A" stroke-width="2.5"/>
        <line x1="32" y1="68" x2="88" y2="68" stroke="#16A34A" stroke-width="2.5"/>
        <line x1="60" y1="34" x2="60" y2="86" stroke="#16A34A" stroke-width="2.5"/>
      `, '#ECFDF5')
    },
    {
      id: 'procesador-textos',
      term: 'Procesador de Textos',
      category: 'Software y Archivos',
      hint: 'Aplicación para redactar, editar y dar formato a documentos escritos.',
      svg: S(`
        <rect x="22" y="20" width="76" height="80" rx="8" fill="#2563EB" stroke="#1D4ED8" stroke-width="3"/>
        <line x1="34" y1="40" x2="86" y2="40" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
        <line x1="34" y1="56" x2="86" y2="56" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
        <line x1="34" y1="72" x2="68" y2="72" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
      `, '#EFF6FF')
    },
    {
      id: 'presentacion',
      term: 'Presentación Digital',
      category: 'Software y Archivos',
      hint: 'Diapositivas visuales para exponer temas ante un grupo.',
      svg: S(`
        <rect x="16" y="24" width="88" height="62" rx="6" fill="#F59E0B" stroke="#B45309" stroke-width="3"/>
        <rect x="24" y="32" width="72" height="46" rx="3" fill="#FFFFFF"/>
        <rect x="32" y="42" width="26" height="24" rx="3" fill="#FDE047"/>
        <line x1="64" y1="46" x2="88" y2="46" stroke="#0F172A" stroke-width="3"/>
        <line x1="64" y1="58" x2="84" y2="58" stroke="#64748B" stroke-width="3"/>
        <line x1="60" y1="86" x2="44" y2="102" stroke="#475569" stroke-width="4"/>
        <line x1="60" y1="86" x2="76" y2="102" stroke="#475569" stroke-width="4"/>
      `, '#FEF3C7')
    },
    {
      id: 'antivirus',
      term: 'Antivirus',
      category: 'Software y Archivos',
      hint: 'Programa protector que detecta y elimina software malicioso.',
      svg: S(`
        <path d="M60 16 L96 30 V58 C96 80 78 96 60 104 C42 96 24 80 24 58 V30 Z" fill="#10B981" stroke="#047857" stroke-width="3"/>
        <path d="M44 60 L55 71 L78 46" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      `, '#ECFDF5')
    },
    {
      id: 'firewall',
      term: 'Firewall (Cortafuegos)',
      category: 'Software y Archivos',
      hint: 'Barrera de red que bloquea conexiones no autorizadas.',
      svg: S(`
        <rect x="18" y="28" width="84" height="64" rx="6" fill="#DC2626" stroke="#991B1B" stroke-width="3"/>
        <line x1="18" y1="49" x2="102" y2="49" stroke="#FECACA" stroke-width="3"/>
        <line x1="18" y1="70" x2="102" y2="70" stroke="#FECACA" stroke-width="3"/>
        <line x1="46" y1="28" x2="46" y2="49" stroke="#FECACA" stroke-width="3"/>
        <line x1="74" y1="49" x2="74" y2="70" stroke="#FECACA" stroke-width="3"/>
        <line x1="46" y1="70" x2="46" y2="92" stroke="#FECACA" stroke-width="3"/>
      `, '#FEF2F2')
    },
    {
      id: 'base-datos',
      term: 'Base de Datos',
      category: 'Software y Archivos',
      hint: 'Sistema organizado para almacenar, buscar y relacionar información.',
      svg: S(`
        <ellipse cx="60" cy="30" rx="34" ry="12" fill="#38BDF8" stroke="#0284C7" stroke-width="3"/>
        <path d="M26 30 V54 C26 61 94 61 94 54 V30" fill="#0284C7"/>
        <path d="M26 54 V74 C26 81 94 81 94 74 V54" fill="#0369A1"/>
        <path d="M26 74 V92 C26 99 94 99 94 92 V74" fill="#075985"/>
      `, '#EFF6FF')
    },
    {
      id: 'archivo-zip',
      term: 'Archivo Comprimido (ZIP)',
      category: 'Software y Archivos',
      hint: 'Paquete con cierre que reduce el tamaño de uno o varios archivos.',
      svg: S(`
        <rect x="30" y="18" width="60" height="84" rx="8" fill="#F59E0B" stroke="#B45309" stroke-width="3"/>
        <rect x="52" y="18" width="16" height="84" fill="#FFFFFF" fill-opacity="0.4"/>
        <rect x="50" y="34" width="20" height="10" rx="2" fill="#0F172A"/>
        <rect x="50" y="54" width="20" height="10" rx="2" fill="#0F172A"/>
        <rect x="50" y="74" width="20" height="14" rx="3" fill="#0F172A"/>
      `, '#FEF3C7')
    },
    {
      id: 'papelera',
      term: 'Papelera de Reciclaje',
      category: 'Software y Archivos',
      hint: 'Espacio temporal donde se guardan los archivos eliminados.',
      svg: S(`
        <rect x="30" y="24" width="60" height="10" rx="3" fill="#475569"/>
        <rect x="46" y="16" width="28" height="8" rx="2" fill="#64748B"/>
        <polygon points="34,36 86,36 78,100 42,100" fill="#CBD5E1" stroke="#334155" stroke-width="3"/>
        <line x1="50" y1="48" x2="52" y2="88" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
        <line x1="60" y1="48" x2="60" y2="88" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
        <line x1="70" y1="48" x2="68" y2="88" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
      `, '#F1F5F9')
    },
    {
      id: 'codigo-fuente',
      term: 'Código Fuente',
      category: 'Software y Archivos',
      hint: 'Instrucciones escritas en un lenguaje de programación.',
      svg: S(`
        <rect x="16" y="22" width="88" height="76" rx="8" fill="#0F172A"/>
        <text x="60" y="68" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="30" fill="#38BDF8">{ ; }</text>
      `, '#EFF6FF')
    },
    {
      id: 'compilador',
      term: 'Compilador',
      category: 'Software y Archivos',
      hint: 'Traduce el código fuente a lenguaje máquina ejecutable.',
      svg: S(`
        <rect x="14" y="34" width="32" height="52" rx="4" fill="#7C3AED"/>
        <path d="M50 60 H70 M64 52 L72 60 L64 68" stroke="#0F172A" stroke-width="4" fill="none" stroke-linecap="round"/>
        <rect x="76" y="34" width="30" height="52" rx="4" fill="#10B981"/>
        <text x="30" y="65" text-anchor="middle" font-size="14" font-weight="bold" fill="#FFF">A+</text>
        <text x="91" y="65" text-anchor="middle" font-size="14" font-weight="bold" fill="#FFF">01</text>
      `, '#F5F3FF')
    },
    {
      id: 'interfaz',
      term: 'Interfaz Gráfica (GUI)',
      category: 'Software y Archivos',
      hint: 'Ventanas, botones y menús visuales para interactuar con el software.',
      svg: S(`
        <rect x="16" y="20" width="88" height="80" rx="8" fill="#FFFFFF" stroke="#0F172A" stroke-width="3"/>
        <rect x="16" y="20" width="88" height="18" rx="6" fill="#7C3AED"/>
        <rect x="26" y="48" width="30" height="40" rx="4" fill="#E0F2FE"/>
        <rect x="64" y="48" width="30" height="16" rx="4" fill="#38BDF8"/>
        <rect x="64" y="72" width="30" height="16" rx="4" fill="#10B981"/>
      `, '#F5F3FF')
    },
    {
      id: 'actualizacion',
      term: 'Actualización',
      category: 'Software y Archivos',
      hint: 'Mejora de software que corrige fallos y añade seguridad.',
      svg: S(`
        <path d="M88 54 A30 30 0 1 0 86 74" fill="none" stroke="#0284C7" stroke-width="8" stroke-linecap="round"/>
        <polygon points="90,34 96,56 74,52" fill="#0284C7"/>
        <circle cx="60" cy="60" r="10" fill="#10B981"/>
      `, '#EFF6FF')
    },
    {
      id: 'app-movil',
      term: 'Aplicación Móvil (App)',
      category: 'Software y Archivos',
      hint: 'Programa diseñado específicamente para teléfonos y tabletas.',
      svg: S(`
        <rect x="26" y="26" width="68" height="68" rx="18" fill="#7C3AED" stroke="#5B21B6" stroke-width="3"/>
        <circle cx="60" cy="60" r="18" fill="#FFFFFF"/>
        <polygon points="55,51 71,60 55,69" fill="#7C3AED"/>
      `, '#F5F3FF')
    },
    {
      id: 'archivo-imagen',
      term: 'Archivo de Imagen (PNG/JPG)',
      category: 'Software y Archivos',
      hint: 'Formato gráfico digital para fotografías, dibujos e íconos.',
      svg: S(`
        <rect x="18" y="24" width="84" height="72" rx="8" fill="#FFFFFF" stroke="#0284C7" stroke-width="3"/>
        <circle cx="42" cy="46" r="9" fill="#FBBF24"/>
        <polygon points="24,88 52,58 72,76 84,64 96,88" fill="#10B981"/>
      `, '#EFF6FF')
    },
    {
      id: 'archivo-audio',
      term: 'Archivo de Audio (MP3)',
      category: 'Software y Archivos',
      hint: 'Formato digital que almacena música, grabaciones o efectos sonoros.',
      svg: S(`
        <circle cx="60" cy="60" r="38" fill="#7C3AED"/>
        <path d="M52 72 V40 L78 34 V66" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="46" cy="74" r="8" fill="#FFFFFF"/>
        <circle cx="72" cy="68" r="8" fill="#FFFFFF"/>
      `, '#F5F3FF')
    },
    {
      id: 'licencia-software',
      term: 'Licencia de Software',
      category: 'Software y Archivos',
      hint: 'Permiso legal que define cómo puede usarse o compartirse un programa.',
      svg: S(`
        <rect x="24" y="18" width="72" height="84" rx="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="3"/>
        <circle cx="60" cy="48" r="14" fill="#F59E0B"/>
        <polygon points="52,60 48,84 60,76 72,84 68,60" fill="#DC2626"/>
      `, '#FEF3C7')
    },

    // ==================== 4. REDES Y CIBERSEGURIDAD (21) ====================
    {
      id: 'router',
      term: 'Router (Enrutador)',
      category: 'Redes y Seguridad',
      hint: 'Equipo con antenas que reparte la señal de internet por cable y Wi-Fi.',
      svg: S(`
        <line x1="34" y1="22" x2="34" y2="54" stroke="#0F172A" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="22" x2="86" y2="54" stroke="#0F172A" stroke-width="5" stroke-linecap="round"/>
        <rect x="18" y="54" width="84" height="34" rx="8" fill="#0284C7" stroke="#075985" stroke-width="3"/>
        <circle cx="34" cy="71" r="4" fill="#4ADE80"/>
        <circle cx="48" cy="71" r="4" fill="#4ADE80"/>
        <circle cx="62" cy="71" r="4" fill="#FACC15"/>
      `, '#EFF6FF')
    },
    {
      id: 'wifi',
      term: 'Señal Wi-Fi',
      category: 'Redes y Seguridad',
      hint: 'Conexión inalámbrica de red mediante ondas de radio.',
      svg: S(`
        <path d="M22 48 A52 52 0 0 1 98 48" fill="none" stroke="#0284C7" stroke-width="7" stroke-linecap="round"/>
        <path d="M36 64 A32 32 0 0 1 84 64" fill="none" stroke="#0284C7" stroke-width="7" stroke-linecap="round"/>
        <path d="M48 78 A16 16 0 0 1 72 78" fill="none" stroke="#0284C7" stroke-width="7" stroke-linecap="round"/>
        <circle cx="60" cy="92" r="7" fill="#0F172A"/>
      `, '#F0F9FF')
    },
    {
      id: 'nube',
      term: 'Nube (Cloud)',
      category: 'Redes y Seguridad',
      hint: 'Almacenamiento y servicios accesibles a través de internet.',
      svg: S(`
        <path d="M34 84 H86 A18 18 0 0 0 88 48 A26 26 0 0 0 38 42 A20 20 0 0 0 34 84 Z" fill="#38BDF8" stroke="#0284C7" stroke-width="3"/>
        <path d="M60 74 V52 M50 62 L60 52 L70 62" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      `, '#EFF6FF')
    },
    {
      id: 'servidor',
      term: 'Servidor',
      category: 'Redes y Seguridad',
      hint: 'Computadora potente que provee datos y páginas web a otros equipos.',
      svg: S(`
        <rect x="24" y="18" width="72" height="24" rx="4" fill="#1E293B" stroke="#0F172A" stroke-width="2.5"/>
        <rect x="24" y="48" width="72" height="24" rx="4" fill="#1E293B" stroke="#0F172A" stroke-width="2.5"/>
        <rect x="24" y="78" width="72" height="24" rx="4" fill="#1E293B" stroke="#0F172A" stroke-width="2.5"/>
        <circle cx="38" cy="30" r="4" fill="#10B981"/>
        <circle cx="38" cy="60" r="4" fill="#38BDF8"/>
        <circle cx="38" cy="90" r="4" fill="#10B981"/>
      `, '#F1F5F9')
    },
    {
      id: 'cable-ethernet',
      term: 'Cable Ethernet',
      category: 'Redes y Seguridad',
      hint: 'Cable de red con conector RJ45 para conexión estable de internet.',
      svg: S(`
        <rect x="40" y="18" width="40" height="32" rx="4" fill="#BAE6FD" stroke="#0284C7" stroke-width="3"/>
        <line x1="48" y1="18" x2="48" y2="30" stroke="#F59E0B" stroke-width="3"/>
        <line x1="56" y1="18" x2="56" y2="30" stroke="#F59E0B" stroke-width="3"/>
        <line x1="64" y1="18" x2="64" y2="30" stroke="#F59E0B" stroke-width="3"/>
        <line x1="72" y1="18" x2="72" y2="30" stroke="#F59E0B" stroke-width="3"/>
        <rect x="52" y="50" width="16" height="52" fill="#0284C7"/>
      `, '#EFF6FF')
    },
    {
      id: 'direccion-ip',
      term: 'Dirección IP',
      category: 'Redes y Seguridad',
      hint: 'Número único que identifica a un dispositivo dentro de una red.',
      svg: S(`
        <rect x="14" y="34" width="92" height="52" rx="10" fill="#0F172A"/>
        <text x="60" y="58" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="16" fill="#38BDF8">192.168</text>
        <text x="60" y="76" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="16" fill="#4ADE80">.1.41</text>
      `, '#EFF6FF')
    },
    {
      id: 'url-enlace',
      term: 'Enlace / URL',
      category: 'Redes y Seguridad',
      hint: 'Dirección web única para localizar una página en internet.',
      svg: S(`
        <rect x="14" y="42" width="92" height="36" rx="18" fill="#FFFFFF" stroke="#0284C7" stroke-width="3.5"/>
        <text x="60" y="66" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="18" fill="#0284C7">https://</text>
      `, '#EFF6FF')
    },
    {
      id: 'correo',
      term: 'Correo Electrónico',
      category: 'Redes y Seguridad',
      hint: 'Servicio para enviar y recibir mensajes digitales con archivos adjuntos.',
      svg: S(`
        <rect x="16" y="30" width="88" height="60" rx="8" fill="#FFFFFF" stroke="#0284C7" stroke-width="3"/>
        <polyline points="18,34 60,64 102,34" fill="none" stroke="#0284C7" stroke-width="4" stroke-linejoin="round"/>
      `, '#EFF6FF')
    },
    {
      id: 'contrasena',
      term: 'Contraseña Segura',
      category: 'Redes y Seguridad',
      hint: 'Clave privada combinando letras, números y símbolos.',
      svg: S(`
        <rect x="14" y="38" width="92" height="44" rx="10" fill="#0F172A" stroke="#7C3AED" stroke-width="3"/>
        <circle cx="32" cy="60" r="5" fill="#FFFFFF"/>
        <circle cx="50" cy="60" r="5" fill="#FFFFFF"/>
        <circle cx="68" cy="60" r="5" fill="#FFFFFF"/>
        <circle cx="86" cy="60" r="5" fill="#4ADE80"/>
      `, '#F5F3FF')
    },
    {
      id: 'verificacion-2fa',
      term: 'Verificación 2FA',
      category: 'Redes y Seguridad',
      hint: 'Doble capa de seguridad con código temporal en tu dispositivo.',
      svg: S(`
        <rect x="20" y="20" width="44" height="72" rx="8" fill="#0F172A"/>
        <rect x="26" y="28" width="32" height="54" rx="4" fill="#38BDF8"/>
        <path d="M78 36 L98 44 V62 C98 76 88 86 78 90 C68 86 58 76 58 62 V44 Z" fill="#10B981" stroke="#FFFFFF" stroke-width="3"/>
      `, '#ECFDF5')
    },
    {
      id: 'candado-https',
      term: 'Candado HTTPS',
      category: 'Redes y Seguridad',
      hint: 'Indica que la comunicación con el sitio web está cifrada y protegida.',
      svg: S(`
        <path d="M40 52 V38 A20 20 0 0 1 80 38 V52" fill="none" stroke="#059669" stroke-width="8" stroke-linecap="round"/>
        <rect x="30" y="50" width="60" height="48" rx="10" fill="#10B981" stroke="#047857" stroke-width="3"/>
        <circle cx="60" cy="70" r="6" fill="#FFFFFF"/>
        <rect x="57" y="74" width="6" height="12" rx="2" fill="#FFFFFF"/>
      `, '#ECFDF5')
    },
    {
      id: 'phishing',
      term: 'Phishing (Engaño)',
      category: 'Redes y Seguridad',
      hint: 'Intento de robar contraseñas haciéndose pasar por un sitio legítimo.',
      svg: S(`
        <path d="M60 18 V66 C60 80 42 80 42 68" fill="none" stroke="#DC2626" stroke-width="6" stroke-linecap="round"/>
        <polygon points="42,60 34,70 46,72" fill="#DC2626"/>
        <rect x="68" y="54" width="34" height="24" rx="4" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5"/>
        <polyline points="68,56 85,68 102,56" fill="none" stroke="#DC2626" stroke-width="2.5"/>
      `, '#FEF2F2')
    },
    {
      id: 'malware',
      term: 'Malware / Virus',
      category: 'Redes y Seguridad',
      hint: 'Software malicioso diseñado para dañar o infiltrarse en un equipo.',
      svg: S(`
        <circle cx="60" cy="62" r="22" fill="#DC2626"/>
        <circle cx="60" cy="36" r="10" fill="#991B1B"/>
        <path d="M30 48 L42 54 M30 64 H38 M30 80 L42 72 M90 48 L78 54 M90 64 H82 M90 80 L78 72" stroke="#0F172A" stroke-width="4" stroke-linecap="round"/>
      `, '#FEF2F2')
    },
    {
      id: 'vpn',
      term: 'Red Privada (VPN)',
      category: 'Redes y Seguridad',
      hint: 'Túnel cifrado que protege tu conexión y privacidad en internet.',
      svg: S(`
        <rect x="14" y="42" width="92" height="36" rx="18" fill="#0F172A" stroke="#7C3AED" stroke-width="3"/>
        <text x="60" y="66" text-anchor="middle" font-weight="bold" font-size="18" fill="#A78BFA">VPN</text>
      `, '#F5F3FF')
    },
    {
      id: 'bluetooth',
      term: 'Bluetooth',
      category: 'Redes y Seguridad',
      hint: 'Tecnología inalámbrica de corto alcance para audífonos y controles.',
      svg: S(`
        <circle cx="60" cy="60" r="36" fill="#2563EB"/>
        <polyline points="48,44 74,72 60,86 60,34 74,48 48,76" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      `, '#EFF6FF')
    },
    {
      id: 'fibra-optica',
      term: 'Fibra Óptica',
      category: 'Redes y Seguridad',
      hint: 'Hilos transparentes que transmiten internet mediante pulsos de luz.',
      svg: S(`
        <rect x="14" y="50" width="50" height="20" rx="4" fill="#0F172A"/>
        <line x1="64" y1="54" x2="104" y2="42" stroke="#38BDF8" stroke-width="5" stroke-linecap="round"/>
        <line x1="64" y1="60" x2="106" y2="60" stroke="#A78BFA" stroke-width="5" stroke-linecap="round"/>
        <line x1="64" y1="66" x2="104" y2="78" stroke="#4ADE80" stroke-width="5" stroke-linecap="round"/>
      `, '#EFF6FF')
    },
    {
      id: 'codigo-qr',
      term: 'Código QR',
      category: 'Redes y Seguridad',
      hint: 'Matriz cuadrada de puntos que abre enlaces o datos al escanearla.',
      svg: S(`
        <rect x="22" y="22" width="76" height="76" rx="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="3"/>
        <rect x="30" y="30" width="22" height="22" fill="#0F172A"/>
        <rect x="35" y="35" width="12" height="12" fill="#FFFFFF"/>
        <rect x="68" y="30" width="22" height="22" fill="#0F172A"/>
        <rect x="73" y="35" width="12" height="12" fill="#FFFFFF"/>
        <rect x="30" y="68" width="22" height="22" fill="#0F172A"/>
        <rect x="35" y="73" width="12" height="12" fill="#FFFFFF"/>
        <rect x="68" y="68" width="10" height="10" fill="#0284C7"/>
        <rect x="80" y="80" width="10" height="10" fill="#0F172A"/>
      `, '#F1F5F9')
    },
    {
      id: 'satelite',
      term: 'Satélite',
      category: 'Redes y Seguridad',
      hint: 'Equipo orbital que enlaza comunicaciones y GPS desde el espacio.',
      svg: S(`
        <rect x="46" y="46" width="28" height="28" rx="4" fill="#CBD5E1" stroke="#0F172A" stroke-width="3"/>
        <rect x="14" y="50" width="28" height="20" rx="2" fill="#0284C7" stroke="#0F172A" stroke-width="2"/>
        <rect x="78" y="50" width="28" height="20" rx="2" fill="#0284C7" stroke="#0F172A" stroke-width="2"/>
        <line x1="60" y1="30" x2="60" y2="46" stroke="#0F172A" stroke-width="3"/>
        <circle cx="60" cy="26" r="5" fill="#F59E0B"/>
      `, '#EFF6FF')
    },
    {
      id: 'modem',
      term: 'Módem',
      category: 'Redes y Seguridad',
      hint: 'Convierte la señal del proveedor de internet en datos para tu red.',
      svg: S(`
        <rect x="34" y="22" width="52" height="76" rx="8" fill="#0F172A"/>
        <circle cx="60" cy="40" r="5" fill="#10B981"/>
        <circle cx="60" cy="56" r="5" fill="#38BDF8"/>
        <circle cx="60" cy="72" r="5" fill="#F59E0B"/>
      `, '#F1F5F9')
    },
    {
      id: 'gps',
      term: 'Ubicación GPS',
      category: 'Redes y Seguridad',
      hint: 'Sistema de posicionamiento global por coordenadas geográficas.',
      svg: S(`
        <path d="M60 18 C40 18, 28 34, 28 52 C28 74, 60 102, 60 102 C60 102, 92 74, 92 52 C92 34, 80 18, 60 18 Z" fill="#EF4444" stroke="#991B1B" stroke-width="3"/>
        <circle cx="60" cy="50" r="12" fill="#FFFFFF"/>
      `, '#FEF2F2')
    },
    {
      id: 'dominio-web',
      term: 'Dominio Web (.edu/.mx)',
      category: 'Redes y Seguridad',
      hint: 'Nombre legible de un sitio en internet asociado a una IP.',
      svg: S(`
        <rect x="14" y="34" width="92" height="52" rx="10" fill="#7C3AED"/>
        <text x="60" y="66" text-anchor="middle" font-weight="bold" font-size="22" fill="#FFFFFF">.EDU.MX</text>
      `, '#F5F3FF')
    },

    // ==================== 5. ROBÓTICA Y PROGRAMACIÓN (21) ====================
    {
      id: 'arduino',
      term: 'Placa Microcontrolador',
      category: 'Robótica y Código',
      hint: 'Tarjeta programable (tipo Arduino) para controlar sensores y motores.',
      svg: S(`
        <rect x="18" y="28" width="84" height="64" rx="6" fill="#0284C7" stroke="#075985" stroke-width="3"/>
        <rect x="10" y="42" width="16" height="20" fill="#CBD5E1" stroke="#475569" stroke-width="2"/>
        <rect x="44" y="48" width="38" height="16" rx="2" fill="#0F172A"/>
        <rect x="28" y="32" width="60" height="6" fill="#0F172A"/>
        <rect x="28" y="82" width="60" height="6" fill="#0F172A"/>
      `, '#EFF6FF')
    },
    {
      id: 'led',
      term: 'Diodo LED',
      category: 'Robótica y Código',
      hint: 'Componente luminoso con dos patitas (ánodo y cátodo).',
      svg: S(`
        <path d="M40 58 V38 A20 20 0 0 1 80 38 V58 Z" fill="#EF4444" stroke="#991B1B" stroke-width="3"/>
        <rect x="34" y="56" width="52" height="10" rx="2" fill="#DC2626"/>
        <line x1="50" y1="66" x2="50" y2="100" stroke="#64748B" stroke-width="5"/>
        <line x1="70" y1="66" x2="70" y2="92" stroke="#64748B" stroke-width="5"/>
      `, '#FEF2F2')
    },
    {
      id: 'resistencia',
      term: 'Resistencia Eléctrica',
      category: 'Robótica y Código',
      hint: 'Limita el flujo de corriente eléctrica; se identifica con bandas de colores.',
      svg: S(`
        <line x1="12" y1="60" x2="108" y2="60" stroke="#64748B" stroke-width="5"/>
        <rect x="30" y="44" width="60" height="32" rx="12" fill="#FDE68A" stroke="#B45309" stroke-width="3"/>
        <rect x="40" y="44" width="7" height="32" fill="#DC2626"/>
        <rect x="53" y="44" width="7" height="32" fill="#7C3AED"/>
        <rect x="66" y="44" width="7" height="32" fill="#0F172A"/>
        <rect x="78" y="44" width="5" height="32" fill="#F59E0B"/>
      `, '#FEF3C7')
    },
    {
      id: 'protoboard',
      term: 'Protoboard',
      category: 'Robótica y Código',
      hint: 'Tabla con orificios para armar circuitos sin necesidad de soldar.',
      svg: S(`
        <rect x="16" y="28" width="88" height="64" rx="6" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3"/>
        <line x1="22" y1="36" x2="98" y2="36" stroke="#EF4444" stroke-width="3"/>
        <line x1="22" y1="84" x2="98" y2="84" stroke="#2563EB" stroke-width="3"/>
        <circle cx="34" cy="54" r="3" fill="#0F172A"/><circle cx="48" cy="54" r="3" fill="#0F172A"/><circle cx="62" cy="54" r="3" fill="#0F172A"/><circle cx="76" cy="54" r="3" fill="#0F172A"/><circle cx="90" cy="54" r="3" fill="#0F172A"/>
        <circle cx="34" cy="68" r="3" fill="#0F172A"/><circle cx="48" cy="68" r="3" fill="#0F172A"/><circle cx="62" cy="68" r="3" fill="#0F172A"/><circle cx="76" cy="68" r="3" fill="#0F172A"/><circle cx="90" cy="68" r="3" fill="#0F172A"/>
      `, '#F1F5F9')
    },
    {
      id: 'sensor-ultrasonico',
      term: 'Sensor Ultrasónico',
      category: 'Robótica y Código',
      hint: 'Mide distancias enviando ondas de sonido (parece dos ojos metálicos).',
      svg: S(`
        <rect x="16" y="34" width="88" height="44" rx="6" fill="#0284C7" stroke="#075985" stroke-width="3"/>
        <circle cx="38" cy="56" r="14" fill="#CBD5E1" stroke="#475569" stroke-width="3"/>
        <circle cx="82" cy="56" r="14" fill="#CBD5E1" stroke="#475569" stroke-width="3"/>
        <circle cx="38" cy="56" r="7" fill="#0F172A"/>
        <circle cx="82" cy="56" r="7" fill="#0F172A"/>
        <path d="M50 86v10M57 86v10M64 86v10M71 86v10" stroke="#F59E0B" stroke-width="3"/>
      `, '#EFF6FF')
    },
    {
      id: 'servomotor',
      term: 'Servomotor',
      category: 'Robótica y Código',
      hint: 'Motor de precisión que gira a ángulos controlados en robótica.',
      svg: S(`
        <rect x="26" y="38" width="54" height="44" rx="5" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
        <circle cx="64" cy="34" r="10" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5"/>
        <rect x="60" y="20" width="32" height="10" rx="5" fill="#FFFFFF" stroke="#0284C7" stroke-width="2.5"/>
      `, '#F1F5F9')
    },
    {
      id: 'bateria',
      term: 'Batería / Pila',
      category: 'Robótica y Código',
      hint: 'Almacena energía química para alimentar proyectos portátiles.',
      svg: S(`
        <rect x="34" y="28" width="52" height="72" rx="8" fill="#10B981" stroke="#047857" stroke-width="3"/>
        <rect x="48" y="18" width="24" height="10" rx="2" fill="#475569"/>
        <path d="M64 46 L52 64 H62 L56 82 L70 60 H60 Z" fill="#FACC15"/>
      `, '#ECFDF5')
    },
    {
      id: 'multimetro',
      term: 'Multímetro',
      category: 'Robótica y Código',
      hint: 'Instrumento para medir voltaje, corriente y resistencia eléctrica.',
      svg: S(`
        <rect x="28" y="16" width="64" height="88" rx="10" fill="#F59E0B" stroke="#B45309" stroke-width="3"/>
        <rect x="38" y="26" width="44" height="24" rx="3" fill="#E2E8F0"/>
        <circle cx="60" cy="72" r="14" fill="#1E293B"/>
        <line x1="60" y1="72" x2="68" y2="62" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
      `, '#FEF3C7')
    },
    {
      id: 'interruptor',
      term: 'Interruptor (Switch)',
      category: 'Robótica y Código',
      hint: 'Abre o cierra el paso de corriente en un circuito eléctrico.',
      svg: S(`
        <rect x="22" y="34" width="76" height="52" rx="26" fill="#10B981" stroke="#047857" stroke-width="3"/>
        <circle cx="72" cy="60" r="18" fill="#FFFFFF"/>
      `, '#ECFDF5')
    },
    {
      id: 'cable-jumper',
      term: 'Cables Jumper',
      category: 'Robótica y Código',
      hint: 'Cables de colores con puntas para conectar pines en la protoboard.',
      svg: S(`
        <path d="M24 84 C24 30, 60 30, 60 84" fill="none" stroke="#EF4444" stroke-width="6" stroke-linecap="round"/>
        <path d="M48 84 C48 22, 92 22, 92 84" fill="none" stroke="#0284C7" stroke-width="6" stroke-linecap="round"/>
        <rect x="20" y="82" width="8" height="14" fill="#0F172A"/>
        <rect x="56" y="82" width="8" height="14" fill="#0F172A"/>
        <rect x="88" y="82" width="8" height="14" fill="#0F172A"/>
      `, '#EFF6FF')
    },
    {
      id: 'buzzer',
      term: 'Zumbador (Buzzer)',
      category: 'Robótica y Código',
      hint: 'Componente cilíndrico que emite pitidos y tonos en circuitos.',
      svg: S(`
        <circle cx="60" cy="60" r="32" fill="#0F172A" stroke="#475569" stroke-width="3"/>
        <circle cx="60" cy="60" r="8" fill="#CBD5E1"/>
        <path d="M96 48 Q104 60 96 72" fill="none" stroke="#0284C7" stroke-width="4" stroke-linecap="round"/>
      `, '#F1F5F9')
    },
    {
      id: 'algoritmo',
      term: 'Algoritmo (Diagrama)',
      category: 'Robótica y Código',
      hint: 'Secuencia ordenada de pasos lógicos para resolver un problema.',
      svg: S(`
        <rect x="40" y="16" width="40" height="18" rx="9" fill="#10B981"/>
        <line x1="60" y1="34" x2="60" y2="48" stroke="#0F172A" stroke-width="3"/>
        <rect x="34" y="48" width="52" height="22" rx="4" fill="#0284C7"/>
        <line x1="60" y1="70" x2="60" y2="84" stroke="#0F172A" stroke-width="3"/>
        <polygon points="60,84 82,96 60,108 38,96" fill="#F59E0B"/>
      `, '#EFF6FF')
    },
    {
      id: 'bucle',
      term: 'Bucle / Ciclo (Loop)',
      category: 'Robótica y Código',
      hint: 'Estructura de programación que repite instrucciones varias veces.',
      svg: S(`
        <path d="M36 44 H80 V76 H40" fill="none" stroke="#7C3AED" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <polygon points="30,44 46,32 46,56" fill="#7C3AED"/>
        <polygon points="90,76 74,64 74,88" fill="#0284C7"/>
      `, '#F5F3FF')
    },
    {
      id: 'condicional',
      term: 'Condicional (SI / ENTONCES)',
      category: 'Robótica y Código',
      hint: 'Toma una decisión según si una condición es verdadera o falsa.',
      svg: S(`
        <polygon points="60,20 96,52 60,84 24,52" fill="#F59E0B" stroke="#B45309" stroke-width="3"/>
        <text x="60" y="58" text-anchor="middle" font-weight="bold" font-size="16" fill="#FFFFFF">IF?</text>
        <path d="M40 84 L30 100 M80 84 L90 100" stroke="#0F172A" stroke-width="4" stroke-linecap="round"/>
      `, '#FEF3C7')
    },
    {
      id: 'variable',
      term: 'Variable',
      category: 'Robótica y Código',
      hint: 'Espacio con nombre en memoria que guarda un dato que puede cambiar.',
      svg: S(`
        <rect x="24" y="34" width="72" height="58" rx="8" fill="#0284C7" stroke="#075985" stroke-width="3"/>
        <rect x="20" y="24" width="80" height="16" rx="4" fill="#38BDF8"/>
        <text x="60" y="74" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="24" fill="#FFFFFF">x = 5</text>
      `, '#EFF6FF')
    },
    {
      id: 'codigo-binario',
      term: 'Código Binario',
      category: 'Robótica y Código',
      hint: 'Lenguaje de unos (1) y ceros (0) con el que trabajan las computadoras.',
      svg: S(`
        <rect x="16" y="22" width="88" height="76" rx="10" fill="#0F172A"/>
        <text x="60" y="54" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="22" fill="#4ADE80">0 1 0 1</text>
        <text x="60" y="82" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="22" fill="#38BDF8">1 0 1 0</text>
      `, '#ECFDF5')
    },
    {
      id: 'impresora-3d',
      term: 'Impresora 3D',
      category: 'Robótica y Código',
      hint: 'Crea objetos físicos capa por capa a partir de un diseño digital.',
      svg: S(`
        <rect x="20" y="20" width="80" height="80" rx="6" fill="none" stroke="#334155" stroke-width="6"/>
        <line x1="22" y1="42" x2="98" y2="42" stroke="#0284C7" stroke-width="5"/>
        <polygon points="52,42 68,42 60,58" fill="#F59E0B"/>
        <rect x="44" y="68" width="32" height="24" rx="3" fill="#7C3AED"/>
      `, '#F5F3FF')
    },
    {
      id: 'brazo-robotico',
      term: 'Brazo Robótico',
      category: 'Robótica y Código',
      hint: 'Mecanismo articulado programable para ensamblar o mover piezas.',
      svg: S(`
        <rect x="24" y="88" width="44" height="14" rx="4" fill="#0F172A"/>
        <line x1="46" y1="88" x2="36" y2="54" stroke="#F59E0B" stroke-width="9" stroke-linecap="round"/>
        <line x1="36" y1="54" x2="78" y2="36" stroke="#0284C7" stroke-width="8" stroke-linecap="round"/>
        <circle cx="36" cy="54" r="7" fill="#0F172A"/>
        <path d="M78 36 L94 28 M78 36 L94 46" stroke="#0F172A" stroke-width="4" stroke-linecap="round"/>
      `, '#FEF3C7')
    },
    {
      id: 'dron',
      term: 'Dron (Vehículo Aéreo)',
      category: 'Robótica y Código',
      hint: 'Robot volador controlado a distancia o de forma autónoma con hélices.',
      svg: S(`
        <line x1="26" y1="44" x2="94" y2="44" stroke="#334155" stroke-width="5"/>
        <line x1="26" y1="76" x2="94" y2="76" stroke="#334155" stroke-width="5"/>
        <rect x="44" y="42" width="32" height="36" rx="8" fill="#0284C7" stroke="#0F172A" stroke-width="3"/>
        <circle cx="24" cy="44" r="10" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"/>
        <circle cx="96" cy="44" r="10" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"/>
        <circle cx="24" cy="76" r="10" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"/>
        <circle cx="96" cy="76" r="10" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"/>
      `, '#EFF6FF')
    },
    {
      id: 'motor-dc',
      term: 'Motor Eléctrico DC',
      category: 'Robótica y Código',
      hint: 'Convierte la energía eléctrica de corriente directa en movimiento rotatorio.',
      svg: S(`
        <rect x="28" y="38" width="56" height="44" rx="8" fill="#CBD5E1" stroke="#475569" stroke-width="3"/>
        <rect x="84" y="54" width="20" height="12" rx="2" fill="#475569"/>
        <rect x="16" y="48" width="12" height="24" rx="2" fill="#0284C7"/>
      `, '#F1F5F9')
    },
    {
      id: 'inteligencia-artificial',
      term: 'Inteligencia Artificial',
      category: 'Robótica y Código',
      hint: 'Sistemas capaces de aprender patrones, analizar datos y asistir tareas.',
      svg: S(`
        <circle cx="60" cy="60" r="32" fill="#7C3AED"/>
        <circle cx="48" cy="52" r="5" fill="#FFFFFF"/>
        <circle cx="72" cy="52" r="5" fill="#FFFFFF"/>
        <circle cx="60" cy="72" r="5" fill="#4ADE80"/>
        <line x1="48" y1="52" x2="72" y2="52" stroke="#DDD6FE" stroke-width="2.5"/>
        <line x1="48" y1="52" x2="60" y2="72" stroke="#DDD6FE" stroke-width="2.5"/>
        <line x1="72" y1="52" x2="60" y2="72" stroke="#DDD6FE" stroke-width="2.5"/>
      `, '#F5F3FF')
    }
  ];

  window.TECH_PAIRS_CONCEPTS = CONCEPTS;
})();
