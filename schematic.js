// ══════════════════════════════════════════════════════════════════
// BICYCLE TECHNICAL SCHEMATIC FORMULATOR
// Utility Diamond Frame · 26″ · Single-Speed Freewheel
// B. Everett · YellowHapax · Noetic Lab
// Three-sheet document: Geometry · BOM · Fabrication Brief
// ══════════════════════════════════════════════════════════════════

// ── POSTER DIMENSIONS ─────────────────────────────────────────────
// 36×24 in landscape. All three sheets share this format.
const PW = 1080;
const PH = 720;

// ── CURRENT STATE ─────────────────────────────────────────────────
let currentSheet = 1;
let currentLang  = 'en';
let currentZoom  = 1.0;
let placed       = new Set();
let ctxTarget    = null;

// ── LANGUAGE STRINGS ──────────────────────────────────────────────
// All sheet text goes through T(key). Add language objects to translate.
const STRINGS = {
  en: {
    sheet1_title:   'BICYCLE TECHNICAL SCHEMATIC',
    sheet1_sub:     'UTILITY · DIAMOND FRAME · 26″ (559mm BSD) · SINGLE-SPEED FREEWHEEL',
    sheet2_title:   'BILL OF MATERIALS & INTERFACE STANDARDS',
    sheet3_title:   'FABRICATION BRIEF & STRUCTURAL NOTES',
    primary_asm:    'PRIMARY ASSEMBLY · SCALE NTS · DIMENSIONS IN mm',
    credit:         'B. EVERETT · YELLOWHAPAX · NOETIC LAB · yellowhapax.github.io/Noetic-Lab',
    license:        'ORCID 0009-0007-6676-4897 · CC BY 4.0',
    sheet_n:        (n, t) => `SHEET ${n} OF 3 · ${t}`,
    // BOM headers
    bom_no:         'NO.',
    bom_component:  'COMPONENT',
    bom_spec:       'SPECIFICATION / STANDARD',
    bom_supplier:   'SUPPLIER',
    bom_qty:        'QTY',
    bom_check:      '✓',
    // Interface table headers
    iface_hdr:      'INTERFACE STANDARDS',
    iface_point:    'INTERFACE POINT',
    iface_standard: 'STANDARD',
    iface_note:     'FABRICATOR NOTE',
    // Sheet 3 section headers
    s3_tubes:       'TUBE SPECIFICATIONS',
    s3_welds:       'CRITICAL WELD ZONES',
    s3_struct:      'STRUCTURAL RATIONALE',
    s3_seq:         'ASSEMBLY SEQUENCE',
    // Sheet 3 body text — plain fabricator language
    struct_p1: 'A diamond bicycle frame resists deformation through triangulation. It is composed of two triangles sharing the seat tube as a common side: the FRONT TRIANGLE (top tube + down tube + seat tube) and the REAR TRIANGLE (seat tube + chainstay + seatstay).',
    struct_p2: 'Triangles cannot change shape without changing the length of a member. A rectangle or parallelogram can be racked diagonally without any member changing length — this is the failure mode. Every joint in the frame must close a triangle, not leave a parallelogram open.',
    struct_p3: 'The front triangle is the primary load path. Rider weight and road shock enter through the seat tube and head tube. The down tube carries compression from the head tube to the BB shell. The top tube carries tension. Failure initiates at the head tube / down tube junction — this is the highest stress concentration in the frame.',
    struct_p4: 'A shallower head tube angle (e.g. 71°) creates a longer, flatter front triangle. This increases stability and wheelbase but reduces the triangle height, slightly decreasing resistance to diagonal racking. Compensate with larger-diameter or thicker-wall down tube, and a gusset plate at the HT/DT junction.',
    // Weld zone notes
    weld_ht:   'HEAD TUBE / DOWN TUBE JUNCTION — Highest stress concentration. Gusset plate recommended for utility and load-bearing builds. Fillet weld minimum 6mm. Inspect for undercut.',
    weld_bb:   'BB SHELL — Highest torsional load in frame. Full penetration weld required on both BB shell faces. Shell must be faced and chased after welding before BB installation.',
    weld_ss:   'SEATSTAY / SEAT TUBE JUNCTION — Fatigue point under rear rack load cycling. Full fillet weld. Inspect for porosity if rack loads exceed 15 kg regularly.',
    weld_cs:   'CHAINSTAY / BB SHELL JUNCTION — Horizontal force from chain tension. Both chainstay blades must be welded symmetrically. Chain tension pulls rearward on drive side.',
    // Tube specs
    tube_dt:   'DOWN TUBE — Primary compression member. 4130 CrMo: 31.8mm OD × 1.0mm wall minimum. Hi-Ten: 31.8mm OD × 1.2mm wall minimum. Largest tube in the frame.',
    tube_tt:   'TOP TUBE — Tension member. 4130 CrMo: 25.4mm OD × 0.9mm wall. Hi-Ten: 28.6mm OD × 1.0mm wall.',
    tube_st:   'SEAT TUBE — Shared spine of both triangles. 28.6mm OD outer, reamed to 27.2mm ID for seatpost. 1.2mm wall minimum.',
    tube_cs:   'CHAINSTAY — Paired blades. 22.2mm round or 22×16mm ovalized. 1.2mm wall. 420mm length to rear dropout.',
    tube_ss:   'SEATSTAY — Paired. 16mm OD × 1.0mm wall. Runs from rear dropout to seat cluster.',
    tube_ht:   'HEAD TUBE — 34mm OD × 3mm wall (1″ threaded headset). Length 140mm nominal. Face both ends after welding.',
    // Assembly sequence
    seq_1:     '1. Cut all tubes to length. Face all tube ends square.',
    seq_2:     '2. Fixture BB shell, seat tube, and chainstays. Tack weld. Check alignment.',
    seq_3:     '3. Add seatstays. Verify rear triangle squareness before full weld.',
    seq_4:     '4. Fixture head tube, top tube, down tube to front triangle. Tack. Check.',
    seq_5:     '5. Join front and rear triangles at seat tube. Final tack all joints.',
    seq_6:     '6. Full weld all joints in sequence: BB shell → chainstay → seatstay → HT junctions.',
    seq_7:     '7. Stress relieve if required. Straighten. Face and chase BB shell. Ream seat tube.',
    seq_8:     '8. Drill/tap rack mounts and mudguard eyelets before finishing.',
  },
  fa: {
    sheet1_title:   'نقشه فنی دوچرخه',
    sheet1_sub:     'قاب الماسی · کاربردی · ۲۶ اینچ (۵۵۹ میلیمتر) · تک سرعته',
    sheet2_title:   'لیست مواد و استانداردهای اتصال',
    sheet3_title:   'دستورالعمل ساخت و یادداشت‌های سازه‌ای',
    primary_asm:    'مونتاژ اصلی · بدون مقیاس · اندازه‌ها به میلیمتر',
    credit:         'ب. اورت · یلوهاپاکس · آزمایشگاه نوتیک',
    license:        'ORCID 0009-0007-6676-4897 · CC BY 4.0',
    sheet_n:        (n, t) => `برگ ${n} از ۳ · ${t}`,
    bom_no: 'ردیف', bom_component: 'قطعه', bom_spec: 'مشخصات / استاندارد',
    bom_supplier: 'تامین‌کننده', bom_qty: 'تعداد', bom_check: '✓',
    iface_hdr: 'استانداردهای اتصال', iface_point: 'نقطه اتصال',
    iface_standard: 'استاندارد', iface_note: 'یادداشت سازنده',
    s3_tubes: 'مشخصات لوله‌ها', s3_welds: 'نقاط بحرانی جوشکاری',
    s3_struct: 'منطق سازه‌ای', s3_seq: 'توالی مونتاژ',
    struct_p1: 'قاب الماسی دوچرخه از طریق مثلث‌بندی در برابر تغییر شکل مقاومت می‌کند. این قاب از دو مثلث تشکیل شده که لوله صندلی ضلع مشترک آن‌هاست.',
    struct_p2: 'مثلث‌ها بدون تغییر طول اضلاع نمی‌توانند تغییر شکل دهند. اما متوازی‌الاضلاع می‌تواند بدون تغییر طول اضلاع به صورت مورب خم شود — این نوع شکست است.',
    struct_p3: 'مثلث جلو مسیر اصلی بار است. اتصال لوله هدایت به لوله پایین بیشترین تمرکز تنش را دارد.',
    struct_p4: 'زاویه کمتر لوله هدایت (مانند ۷۱ درجه) مثلث جلو را پهن‌تر و صاف‌تر می‌کند. برای جبران، از لوله پایین با قطر یا ضخامت دیواره بیشتر و صفحه گوشه در محل اتصال استفاده کنید.',
    weld_ht: 'اتصال لوله هدایت / لوله پایین — بیشترین تمرکز تنش. استفاده از صفحه گوشه توصیه می‌شود.',
    weld_bb: 'محور پدال — بیشترین بار پیچشی. جوش نفوذ کامل الزامی است.',
    weld_ss: 'اتصال پایه صندلی / لوله صندلی — نقطه خستگی زیر بار باربند.',
    weld_cs: 'اتصال زنجیربند / محور پدال — نیروی کشش زنجیر.',
    tube_dt: 'لوله پایین — عضو فشاری اصلی. CrMo 4130: ۳۱.۸ میلیمتر × ۱.۰ میلیمتر.',
    tube_tt: 'لوله بالا — عضو کششی. ۲۵.۴ میلیمتر × ۰.۹ میلیمتر.',
    tube_st: 'لوله صندلی — ستون فقرات مشترک. ۲۸.۶ میلیمتر خارجی.',
    tube_cs: 'زنجیربند — جفت. ۲۲.۲ میلیمتر، دیواره ۱.۲ میلیمتر.',
    tube_ss: 'پایه صندلی — جفت. ۱۶ میلیمتر × ۱.۰ میلیمتر.',
    tube_ht: 'لوله هدایت — ۳۴ میلیمتر × دیواره ۳ میلیمتر. طول ۱۴۰ میلیمتر.',
    seq_1: '۱. برش تمام لوله‌ها به طول. پرداخت انتهای لوله‌ها.',
    seq_2: '۲. فیکس کردن محور پدال، لوله صندلی و زنجیربندها. جوش نقطه‌ای.',
    seq_3: '۳. اضافه کردن پایه‌های صندلی. بررسی تراز قبل از جوش کامل.',
    seq_4: '۴. فیکس کردن لوله هدایت، لوله بالا و لوله پایین. جوش نقطه‌ای.',
    seq_5: '۵. اتصال مثلث جلو و عقب در لوله صندلی.',
    seq_6: '۶. جوش کامل به ترتیب: محور پدال → زنجیربند → پایه صندلی → لوله هدایت.',
    seq_7: '۷. رفع تنش در صورت نیاز. صاف کردن. پرداخت و تمیز کردن محور پدال.',
    seq_8: '۸. حفاری/رزوه‌کاری اتصالات باربند و گلگیر قبل از رنگ‌آمیزی.',
  },
  fr: {
    sheet1_title:'SCHÉMA TECHNIQUE VÉLO', sheet1_sub:'CADRE DIAMANT · UTILITAIRE · 26″ · SIMPLE VITESSE',
    sheet2_title:'NOMENCLATURE ET STANDARDS D\'INTERFACE', sheet3_title:'DOSSIER DE FABRICATION ET NOTES STRUCTURELLES',
    primary_asm:'ASSEMBLAGE PRINCIPAL · SANS ÉCHELLE · COTES EN mm', credit:'B. EVERETT · YELLOWHAPAX · NOETIC LAB',
    license:'ORCID 0009-0007-6676-4897 · CC BY 4.0', sheet_n:(n,t)=>`FEUILLE ${n}/3 · ${t}`,
    bom_no:'N°', bom_component:'COMPOSANT', bom_spec:'SPÉCIFICATION / STANDARD', bom_supplier:'FOURNISSEUR', bom_qty:'QTÉ', bom_check:'✓',
    iface_hdr:'STANDARDS D\'INTERFACE', iface_point:'POINT D\'INTERFACE', iface_standard:'STANDARD', iface_note:'NOTE FABRICANT',
    s3_tubes:'SPÉCIFICATIONS TUBES', s3_welds:'ZONES DE SOUDURE CRITIQUES', s3_struct:'RAISONNEMENT STRUCTUREL', s3_seq:'SÉQUENCE D\'ASSEMBLAGE',
    struct_p1:'Un cadre diamant résiste à la déformation par triangulation. Il est composé de deux triangles partageant le tube de selle.',
    struct_p2:'Les triangles ne peuvent pas changer de forme sans modifier la longueur d\'un côté. Un parallélogramme peut se racker sans changement de longueur — c\'est le mode de défaillance.',
    struct_p3:'Le triangle avant est le chemin de charge principal. La jonction tube de direction / tube diagonal est la concentration de contrainte la plus élevée.',
    struct_p4:'Un angle de tube de direction plus faible (71°) crée un triangle avant plus plat. Compenser avec un tube diagonal de plus grand diamètre et une gousset à la jonction.',
    weld_ht:'JONCTION TUBE DE DIRECTION / TUBE DIAGONAL — Gousset recommandé.', weld_bb:'BOÎTIER DE PÉDALIER — Soudure pleine pénétration obligatoire.',
    weld_ss:'JONCTION HAUBAN / TUBE DE SELLE — Point de fatigue sous charge porte-bagages.', weld_cs:'JONCTION BASES / BOÎTIER — Tension de chaîne.',
    tube_dt:'TUBE DIAGONAL — 31,8mm × 1,0mm CrMo.', tube_tt:'TUBE SUPÉRIEUR — 25,4mm × 0,9mm.', tube_st:'TUBE DE SELLE — 28,6mm ext.',
    tube_cs:'BASES — 22,2mm × 1,2mm.', tube_ss:'HAUBANS — 16mm × 1,0mm.', tube_ht:'TUBE DE DIRECTION — 34mm × 3mm, longueur 140mm.',
    seq_1:'1. Couper tous les tubes. Dresser les extrémités.', seq_2:'2. Brider boîtier, tube de selle, bases. Pointer. Vérifier.',
    seq_3:'3. Ajouter haubans. Vérifier équerre triangle arrière.', seq_4:'4. Brider tube direction, tube sup., tube diag. Pointer.',
    seq_5:'5. Assembler triangles avant et arrière au tube de selle.', seq_6:'6. Soudure complète dans l\'ordre.',
    seq_7:'7. Détente si nécessaire. Dresser. Tarauder boîtier.', seq_8:'8. Percer fixations porte-bagages avant finition.',
  },
  es: {
    sheet1_title:'ESQUEMA TÉCNICO DE BICICLETA', sheet1_sub:'CUADRO DIAMANTE · UTILITARIO · 26″ · VELOCIDAD ÚNICA',
    sheet2_title:'LISTA DE MATERIALES Y ESTÁNDARES DE INTERFAZ', sheet3_title:'INSTRUCCIONES DE FABRICACIÓN Y NOTAS ESTRUCTURALES',
    primary_asm:'ENSAMBLAJE PRINCIPAL · SIN ESCALA · DIMENSIONES EN mm', credit:'B. EVERETT · YELLOWHAPAX · NOETIC LAB',
    license:'ORCID 0009-0007-6676-4897 · CC BY 4.0', sheet_n:(n,t)=>`HOJA ${n} DE 3 · ${t}`,
    bom_no:'Nº', bom_component:'COMPONENTE', bom_spec:'ESPECIFICACIÓN / ESTÁNDAR', bom_supplier:'PROVEEDOR', bom_qty:'CANT', bom_check:'✓',
    iface_hdr:'ESTÁNDARES DE INTERFAZ', iface_point:'PUNTO DE INTERFAZ', iface_standard:'ESTÁNDAR', iface_note:'NOTA DEL FABRICANTE',
    s3_tubes:'ESPECIFICACIONES DE TUBOS', s3_welds:'ZONAS DE SOLDADURA CRÍTICAS', s3_struct:'FUNDAMENTO ESTRUCTURAL', s3_seq:'SECUENCIA DE MONTAJE',
    struct_p1:'Un cuadro de bicicleta de diamante resiste la deformación mediante triangulación. Está compuesto de dos triángulos que comparten el tubo del sillín.',
    struct_p2:'Los triángulos no pueden cambiar de forma sin cambiar la longitud de un miembro. Un paralelogramo puede rackear diagonalmente sin cambio de longitud — ese es el modo de fallo.',
    struct_p3:'El triángulo delantero es la trayectoria de carga principal. La unión tubo de dirección / tubo diagonal tiene la mayor concentración de tensión.',
    struct_p4:'Un ángulo de tubo de dirección más suave (71°) crea un triángulo delantero más plano. Compensar con tubo diagonal de mayor diámetro y cartela en la unión.',
    weld_ht:'UNIÓN TUBO DIRECCIÓN / TUBO DIAGONAL — Cartela recomendada.', weld_bb:'CAJA PEDALIER — Soldadura de penetración completa obligatoria.',
    weld_ss:'UNIÓN VAINA / TUBO SILLÍN — Punto de fatiga bajo carga de portaequipajes.', weld_cs:'UNIÓN CADENA / CAJA — Tensión de cadena.',
    tube_dt:'TUBO DIAGONAL — 31,8mm × 1,0mm CrMo.', tube_tt:'TUBO SUPERIOR — 25,4mm × 0,9mm.', tube_st:'TUBO SILLÍN — 28,6mm ext.',
    tube_cs:'VAINAS — 22,2mm × 1,2mm.', tube_ss:'TIRANTES — 16mm × 1,0mm.', tube_ht:'TUBO DIRECCIÓN — 34mm × 3mm, longitud 140mm.',
    seq_1:'1. Cortar todos los tubos. Esmerilar extremos.', seq_2:'2. Fijar caja, tubo sillín, vainas. Puntear. Verificar.',
    seq_3:'3. Añadir tirantes. Verificar escuadra triángulo trasero.', seq_4:'4. Fijar tubo dirección, sup., diagonal. Puntear.',
    seq_5:'5. Unir triángulos en tubo sillín.', seq_6:'6. Soldadura completa en secuencia.',
    seq_7:'7. Aliviar tensión si necesario. Enderezar. Fresar caja.', seq_8:'8. Taladrar soportes portaequipajes antes de acabado.',
  },
  ru: {
    sheet1_title:'ТЕХНИЧЕСКИЙ ЧЕРТЁЖ ВЕЛОСИПЕДА', sheet1_sub:'РОМБОВИДНАЯ РАМА · УТИЛИТАРНАЯ · 26″ · ОДНОСКОРОСТНАЯ',
    sheet2_title:'СПЕЦИФИКАЦИЯ И СТАНДАРТЫ ИНТЕРФЕЙСОВ', sheet3_title:'ИНСТРУКЦИЯ ПО ИЗГОТОВЛЕНИЮ И КОНСТРУКТИВНЫЕ ПРИМЕЧАНИЯ',
    primary_asm:'ОСНОВНАЯ СБОРКА · БЕЗ МАСШТАБА · РАЗМЕРЫ В мм', credit:'Б. ЭВЕРЕТ · YELLOWHAPAX · NOETIC LAB',
    license:'ORCID 0009-0007-6676-4897 · CC BY 4.0', sheet_n:(n,t)=>`ЛИСТ ${n} ИЗ 3 · ${t}`,
    bom_no:'№', bom_component:'КОМПОНЕНТ', bom_spec:'СПЕЦИФИКАЦИЯ / СТАНДАРТ', bom_supplier:'ПОСТАВЩИК', bom_qty:'КОЛ', bom_check:'✓',
    iface_hdr:'СТАНДАРТЫ ИНТЕРФЕЙСОВ', iface_point:'ТОЧКА ИНТЕРФЕЙСА', iface_standard:'СТАНДАРТ', iface_note:'ПРИМЕЧАНИЕ',
    s3_tubes:'СПЕЦИФИКАЦИЯ ТРУБ', s3_welds:'КРИТИЧЕСКИЕ ЗОНЫ СВАРКИ', s3_struct:'КОНСТРУКТИВНОЕ ОБОСНОВАНИЕ', s3_seq:'ПОСЛЕДОВАТЕЛЬНОСТЬ СБОРКИ',
    struct_p1:'Ромбовидная рама велосипеда противостоит деформации за счёт триангуляции. Она состоит из двух треугольников с общей подседельной трубой.',
    struct_p2:'Треугольники не могут изменить форму без изменения длины стороны. Параллелограмм может деформироваться диагонально без изменения длин сторон — это и есть механизм разрушения.',
    struct_p3:'Передний треугольник — основной путь нагрузки. Узел рулевой трубы и нижней трубы имеет наибольшую концентрацию напряжений.',
    struct_p4:'Меньший угол рулевой трубы (71°) делает передний треугольник более плоским. Компенсация: нижняя труба большего диаметра и косынка в узле.',
    weld_ht:'УЗЕЛ РУЛЕВОЙ / НИЖНЕЙ ТРУБЫ — Рекомендуется косынка.', weld_bb:'КАРЕТОЧНЫЙ СТАКАН — Требуется сварка с полным проплавлением.',
    weld_ss:'УЗЕЛ ПЕРЬЯ / ПОДСЕДЕЛЬНОЙ ТРУБЫ — Точка усталости при нагрузке багажника.', weld_cs:'УЗЕЛ ЦЕПНОГО ПЕРА / СТАКАНА — Натяжение цепи.',
    tube_dt:'НИЖНЯЯ ТРУБА — 31,8мм × 1,0мм CrMo.', tube_tt:'ВЕРХНЯЯ ТРУБА — 25,4мм × 0,9мм.', tube_st:'ПОДСЕДЕЛЬНАЯ ТРУБА — 28,6мм внешн.',
    tube_cs:'ЦЕПНЫЕ ПЕРЬЯ — 22,2мм × 1,2мм.', tube_ss:'ПОДСЕДЕЛЬНЫЕ ПЕРЬЯ — 16мм × 1,0мм.', tube_ht:'РУЛЕВАЯ ТРУБА — 34мм × 3мм, длина 140мм.',
    seq_1:'1. Нарезать трубы. Обработать торцы.', seq_2:'2. Зафиксировать стакан, подседельную трубу, цепные перья. Прихватить.',
    seq_3:'3. Добавить подседельные перья. Проверить прямоугольность.', seq_4:'4. Зафиксировать рулевую, верхнюю, нижнюю трубы. Прихватить.',
    seq_5:'5. Соединить передний и задний треугольники.', seq_6:'6. Полная сварка в последовательности.',
    seq_7:'7. Снятие напряжений при необходимости. Выправить. Подрезать стакан.', seq_8:'8. Сверлить крепления багажника до финишной обработки.',
  },
  zh: {
    sheet1_title:'自行车技术图纸', sheet1_sub:'菱形车架 · 实用型 · 26英寸 · 单速飞轮',
    sheet2_title:'材料清单及接口标准', sheet3_title:'制造说明及结构注释',
    primary_asm:'主装配图 · 非比例 · 尺寸单位：毫米', credit:'B. EVERETT · YELLOWHAPAX · NOETIC LAB',
    license:'ORCID 0009-0007-6676-4897 · CC BY 4.0', sheet_n:(n,t)=>`第${n}页 共3页 · ${t}`,
    bom_no:'编号', bom_component:'零部件', bom_spec:'规格 / 标准', bom_supplier:'供应商', bom_qty:'数量', bom_check:'✓',
    iface_hdr:'接口标准', iface_point:'接口位置', iface_standard:'标准', iface_note:'制造说明',
    s3_tubes:'管材规格', s3_welds:'关键焊接区域', s3_struct:'结构原理', s3_seq:'装配顺序',
    struct_p1:'菱形自行车车架通过三角形原理抵抗变形。它由两个共享立管的三角形组成：前三角（上管+下管+立管）和后三角（立管+链条拨叉+支撑管）。',
    struct_p2:'三角形在不改变边长的情况下无法改变形状。平行四边形在边长不变的情况下可以对角变形——这就是失效模式。',
    struct_p3:'前三角是主要载荷路径。头管与下管连接处应力集中最高，是车架失效的起始点。',
    struct_p4:'较小的头管角度（如71°）会使前三角变得更平。补偿方法：使用更大直径或更厚壁的下管，并在头管/下管连接处添加加强板。',
    weld_ht:'头管/下管连接处——建议使用加强板。', weld_bb:'五通管——必须完全熔透焊接。',
    weld_ss:'支撑管/立管连接处——后货架载荷循环疲劳点。', weld_cs:'链条拨叉/五通连接处——链条张力。',
    tube_dt:'下管——主压缩件。CrMo 4130：31.8mm×1.0mm。', tube_tt:'上管——拉伸件。25.4mm×0.9mm。',
    tube_st:'立管——共享支柱。外径28.6mm。', tube_cs:'链条拨叉——成对。22.2mm×1.2mm。',
    tube_ss:'支撑管——成对。16mm×1.0mm。', tube_ht:'头管——34mm×3mm壁厚，长度140mm。',
    seq_1:'1. 切割所有管材至所需长度，端面处理平整。', seq_2:'2. 固定五通、立管和链条拨叉。点焊。检查对齐。',
    seq_3:'3. 添加支撑管。焊接前确认后三角方正。', seq_4:'4. 固定头管、上管、下管。点焊。检查。',
    seq_5:'5. 在立管处连接前后三角。', seq_6:'6. 按顺序完成所有焊接。',
    seq_7:'7. 必要时消除应力。校直。铣削五通管端面。', seq_8:'8. 完工前钻孔攻丝货架和挡泥板安装点。',
  },
};

function T(key) {
  const lang = STRINGS[currentLang] || STRINGS.en;
  const val  = lang[key] !== undefined ? lang[key] : (STRINGS.en[key] || key);
  return val;
}

// ── GEOMETRY ──────────────────────────────────────────────────────
let GEO = { hta:95.5, sta:81, cs:470, bbd:50, tt:555, ht:140, wb:1030, fr:55, wbsd:559, tireW:38 };

const PRESETS = {
  utility:  { hta:95.5, sta:81, cs:470, bbd:50, tt:555, ht:140, wb:1030, fr:55 },
  road:     { hta:97,   sta:84, cs:410, bbd:68, tt:555, ht:120, wb:980,  fr:43 },
  touring:  { hta:94,   sta:80, cs:505, bbd:50, tt:570, ht:155, wb:1085, fr:65 },
  mountain: { hta:91,   sta:79, cs:435, bbd:30, tt:595, ht:130, wb:1115, fr:50 },
  track:    { hta:100,  sta:87, cs:390, bbd:62, tt:540, ht:110, wb:960,  fr:25 },
  dutch:    { hta:88,   sta:75, cs:495, bbd:42, tt:580, ht:165, wb:1065, fr:68 },
};
const PRESET_LABELS = {
  utility:'UTILITY / CITY', road:'ROAD / RACE', touring:'TOURING',
  mountain:'MOUNTAIN / ATB', track:'TRACK / FIXED', dutch:'DUTCH / COMFORT',
};

function computePoints(g) {
  const D = Math.PI / 180;
  const wR = g.wbsd / 2 + g.tireW;
  const rA = { x:0, y:0 };
  const fA = { x:g.wb, y:0 };
  const csH = Math.sqrt(Math.max(0, g.cs*g.cs - g.bbd*g.bbd));
  const bb  = { x:csH, y:g.bbd };
  const stA = (180 - g.sta) * D;
  // cos(stA) is negative for STA < 90° — adding it moves stTop rearward (correct backward lean)
  const stTop = { x: bb.x + 510*Math.cos(stA), y: bb.y + 510*Math.sin(stA) };
  const htA = (180 - g.hta) * D;
  const forkAC = 400;
  // same convention: cos(htA) negative → head tube sits behind the front axle (correct)
  const htBot = { x: fA.x - g.fr + forkAC*Math.cos(htA), y: forkAC*Math.sin(htA) };
  const htTop = { x: htBot.x + g.ht*Math.cos(htA), y: htBot.y + g.ht*Math.sin(htA) };
  return { rA, fA, bb, stTop, htBot, htTop, wR };
}

// ── CATALOGUE ─────────────────────────────────────────────────────
const CATALOGUE = {
  frame:[
    {id:'frame',    name:'Main Frame',     tab:'frame',   spec:'Diamond · BSA 68mm · 135mm rear', req:true,  icon:'frame'},
    {id:'fork',     name:'Fork',           tab:'frame',   spec:'Utility · 100mm · 1″ threaded',   req:true,  icon:'fork'},
    {id:'headset',  name:'Headset',        tab:'frame',   spec:'1″ threaded · ISO/JIS',            req:true,  icon:'headset'},
    {id:'bb',       name:'Bottom Bracket', tab:'frame',   spec:'BSA 68mm · cup-and-cone',          req:true,  icon:'bb'},
  ],
  drive:[
    {id:'crank',    name:'Crankset',       tab:'drive',   spec:'170mm · 38–44T · JIS taper',       req:true,  icon:'crank'},
    {id:'freewheel',name:'Freewheel',      tab:'drive',   spec:'16–22T · 3/32″ · Right-hand',      req:true,  icon:'freewheel'},
    {id:'chain',    name:'Chain',          tab:'drive',   spec:'3/32″ #50 · 116L',                 req:true,  icon:'chain'},
  ],
  wheels:[
    {id:'rwheel',   name:'Rear Wheel',     tab:'wheels',  spec:'26″ · Freewheel hub · 36H',        req:true,  icon:'wheel'},
    {id:'fwheel',   name:'Front Wheel',    tab:'wheels',  spec:'26″ · 100mm bolt-on · 36H',        req:true,  icon:'wheel'},
    {id:'rtyre',    name:'Rear Tyre',      tab:'wheels',  spec:'26×1.5–1.75 · wire bead',          req:false, icon:'tyre'},
    {id:'ftyre',    name:'Front Tyre',     tab:'wheels',  spec:'26×1.5–1.75 · wire bead',          req:false, icon:'tyre'},
  ],
  cockpit:[
    {id:'stem',     name:'Stem',           tab:'cockpit', spec:'Quill · 1″ · 80–120mm',            req:true,  icon:'stem'},
    {id:'bars',     name:'Handlebars',     tab:'cockpit', spec:'Upright · 560–620mm · 22.2mm',     req:true,  icon:'bars'},
    {id:'seatpost', name:'Seatpost',       tab:'cockpit', spec:'27.2mm · 300mm min',               req:true,  icon:'seatpost'},
    {id:'saddle',   name:'Saddle',         tab:'cockpit', spec:'Utility · wide · sprung',          req:true,  icon:'saddle'},
  ],
  extras:[
    {id:'fbrake',   name:'Front Brake',    tab:'extras',  spec:'Caliper · 26″ reach',              req:false, icon:'brake'},
    {id:'rbrake',   name:'Rear Brake',     tab:'extras',  spec:'Caliper · 26″ reach',              req:false, icon:'brake'},
    {id:'blevers',  name:'Brake Levers',   tab:'extras',  spec:'Upright bar · 22.2mm',             req:false, icon:'lever'},
    {id:'rack',     name:'Rear Rack',      tab:'extras',  spec:'Brazed mounts · 25kg rated',       req:false, icon:'rack'},
    {id:'mudguards',name:'Mudguards',      tab:'extras',  spec:'26″ · Steel/plastic',              req:false, icon:'mudguard'},
    {id:'lights',   name:'Lighting',       tab:'extras',  spec:'Dynamo or battery',                req:false, icon:'light'},
  ],
};
const CMAP = {};
Object.values(CATALOGUE).flat().forEach(c => { CMAP[c.id] = c; });
// Pre-populate required components — palette removed
placed = new Set(Object.values(CMAP).filter(c => c.req).map(c => c.id));

// ── CONSTRAINTS ───────────────────────────────────────────────────
const CONSTRAINTS = [
  {id:'frame',    label:'Frame present',           check:p=>p.has('frame'),                                      msg:'Main frame required',                   sev:'err'},
  {id:'drive',    label:'Drivetrain loop closed',  check:p=>p.has('crank')&&p.has('chain')&&p.has('freewheel'), msg:'Need: crankset + chain + freewheel',    sev:'err'},
  {id:'bb',       label:'BB present',              check:p=>p.has('bb'),                                         msg:'Bottom bracket missing',                sev:'err'},
  {id:'steering', label:'Steering complete',       check:p=>p.has('headset')&&p.has('stem')&&p.has('bars'),      msg:'Need: headset + stem + bars',           sev:'warn'},
  {id:'wheels',   label:'Both wheels specified',   check:p=>p.has('rwheel')&&p.has('fwheel'),                    msg:'One or both wheels missing',            sev:'warn'},
  {id:'rider',    label:'Rider interface complete',check:p=>p.has('seatpost')&&p.has('saddle'),                  msg:'Seatpost or saddle missing',            sev:'warn'},
  {id:'complete', label:'Build complete',          check:p=>Object.values(CMAP).filter(c=>c.req).every(c=>p.has(c.id)), msg:'Required components missing',   sev:'warn'},
];

// ── INTERFACE STANDARDS TABLE DATA ────────────────────────────────
const IFACE_DATA = [
  {point:'BB SHELL',      standard:'BSA 68mm · 1.370″×24tpi', note:'Right-hand drive cup threads right. Left cup threads left. Never force. Face shell after welding.'},
  {point:'REAR O.L.D.',   standard:'135mm bolt-on axle',       note:'135mm between locknuts. Use bolt-on (solid) axle, not quick-release. More secure under load.'},
  {point:'FRONT O.L.D.',  standard:'100mm bolt-on axle',       note:'Standard 100mm. Bolt-on preferred for utility. QR acceptable on front only.'},
  {point:'STEERER',       standard:'1″ threaded · 25.4mm',     note:'1″ (25.4mm) threaded steerer. Quill stem clamps inside. Headset cups press into 30mm HT bore.'},
  {point:'CHAIN PITCH',   standard:'1/2″ × 3/32″',             note:'Half-inch pitch, 3/32″ width. Do not substitute 1/8″ chain — narrower freewheel will not clear.'},
  {point:'FREEWHEEL',     standard:'1.375″×24tpi · RHD',       note:'Freewheel threads RIGHT-HAND onto hub. It self-tightens when pedaling. No lockring needed.'},
  {point:'WHEEL BSD',     standard:'559mm · 26 × 1.5–1.75',    note:'559mm bead seat diameter. Widely available globally. Not 650c (571mm) — incompatible rim size.'},
  {point:'SEATPOST',      standard:'27.2mm OD',                 note:'Ream seat tube to 27.2mm after welding. Insert minimum 80mm. Mark minimum insertion line.'},
];

// ── INIT ──────────────────────────────────────────────────────────
function init() {
  renderPoster();
  renderSpec();
  fitZoom();
}

// ── SHEET SWITCHING ───────────────────────────────────────────────
function switchSheet(n) {
  currentSheet = n;
  document.querySelectorAll('.sheet-tab').forEach(b => b.classList.toggle('active', +b.dataset.sheet === n));
  document.getElementById('export-btn').textContent = `EXPORT SHEET ${n}`;
  // Spec panel only shown on Sheet 1
  document.getElementById('panel-right').classList.toggle('hidden', n !== 1);
  renderPoster();
  fitZoom();
}

// ── LANGUAGE ──────────────────────────────────────────────────────
function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  renderPoster();
}

// ── ZOOM ──────────────────────────────────────────────────────────
function setZoom(z) {
  currentZoom = z;
  document.getElementById('poster-wrap').style.transform = `scale(${z})`;
  document.getElementById('poster-wrap').style.marginBottom = `${PH * (z - 1)}px`;
  document.querySelectorAll('.zoom-btn').forEach(b => b.classList.toggle('active', b.textContent.trim() === Math.round(z*100)+'%'));
}
function fitZoom() {
  const area = document.getElementById('canvas-area');
  const z = Math.min((area.clientWidth - 48) / PW, (area.clientHeight - 48) / PH, 1.0);
  setZoom(Math.round(z * 100) / 100);
  document.querySelectorAll('.zoom-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.zoom-btn:last-child').classList.add('active');
}

// ── POSTER ROUTER ─────────────────────────────────────────────────
function renderPoster() {
  const el = document.getElementById('poster-canvas');
  el.style.width  = PW + 'px';
  el.style.height = PH + 'px';
  if      (currentSheet === 1) el.innerHTML = buildSheet1();
  else if (currentSheet === 2) el.innerHTML = buildSheet2();
  else                          el.innerHTML = buildSheet3();
}

function v(id) { const e = document.getElementById(id); return e ? e.value : ''; }
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ── SVG WRAPPER ───────────────────────────────────────────────────
function svgOpen(id) {
  return `<svg id="${id}" width="${PW}" height="${PH}" viewBox="0 0 ${PW} ${PH}"
    xmlns="http://www.w3.org/2000/svg"
    font-family="'IBM Plex Mono','Courier New',monospace"
    style="display:block;background:white">
  <defs>
    <marker id="da" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M1 1L7 4L1 7" fill="none" stroke="#888" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <rect x="8" y="8" width="${PW-16}" height="${PH-16}" fill="none" stroke="#1a1a18" stroke-width="2"/>
  <rect x="14" y="14" width="${PW-28}" height="${PH-28}" fill="none" stroke="#c8c8be" stroke-width="0.5"/>`;
}

// ── SHARED TITLE BAR (top of every sheet) ─────────────────────────
function svgTitleBar(sheetNum, sheetName, h) {
  const shop = v('tb-shop')||'—', build = v('tb-build')||'—';
  const builder = v('tb-builder')||'—', date = v('tb-date')||'—';
  const rev = v('tb-rev')||'A', mat = v('tb-mat')||'—';
  const mid = 14 + h/2;
  const divs = [560, 680, 790, 880, 950];
  return `<g id="g-title">
  <rect x="14" y="14" width="${PW-28}" height="${h}" fill="white" stroke="#1a1a18" stroke-width="1.2"/>
  <line x1="14" y1="${14+h/2}" x2="${PW-14}" y2="${14+h/2}" stroke="#c8c8be" stroke-width="0.5"/>
  ${divs.map(dx=>`<line x1="${dx}" y1="14" x2="${dx}" y2="${14+h}" stroke="#c8c8be" stroke-width="0.5"/>`).join('')}
  <text x="28" y="${mid-12}" font-size="20" font-weight="600" fill="#1a1a18" letter-spacing="0.10em">${esc(T('sheet1_title'))}</text>
  <text x="28" y="${mid+4}"  font-size="11" fill="#3d3d38" letter-spacing="0.09em">${esc(T('sheet1_sub'))}</text>
  <text x="28" y="${mid+20}" font-size="9"  fill="#9b9b92" letter-spacing="0.08em">${esc(T('credit'))}</text>
  <text x="28" y="${mid+32}" font-size="8"  fill="#c8c8be" letter-spacing="0.07em">${esc(T('license'))}</text>
  <text x="${divs[0]+10}" y="${mid-14}" font-size="8" fill="#9b9b92" letter-spacing="0.10em">SHOP</text>
  <text x="${divs[1]+10}" y="${mid-14}" font-size="8" fill="#9b9b92" letter-spacing="0.10em">BUILD NAME</text>
  <text x="${divs[2]+10}" y="${mid-14}" font-size="8" fill="#9b9b92" letter-spacing="0.10em">BUILDER</text>
  <text x="${divs[3]+10}" y="${mid-14}" font-size="8" fill="#9b9b92" letter-spacing="0.10em">DATE</text>
  <text x="${divs[4]+10}" y="${mid-14}" font-size="8" fill="#9b9b92" letter-spacing="0.10em">REV</text>
  <text x="${divs[0]+10}" y="${mid+2}"  font-size="12" fill="#1a1a18">${esc(shop)}</text>
  <text x="${divs[1]+10}" y="${mid+2}"  font-size="12" fill="#1a1a18">${esc(build)}</text>
  <text x="${divs[2]+10}" y="${mid+2}"  font-size="12" fill="#1a1a18">${esc(builder)}</text>
  <text x="${divs[3]+10}" y="${mid+2}"  font-size="12" fill="#1a1a18">${esc(date)}</text>
  <text x="${divs[4]+10}" y="${mid+4}"  font-size="17" font-weight="600" fill="#1a1a18">${esc(rev)}</text>
  <text x="${divs[0]+10}" y="${mid+20}" font-size="8" fill="#9b9b92" letter-spacing="0.10em">MATERIAL</text>
  <text x="${divs[1]+10}" y="${mid+20}" font-size="8" fill="#9b9b92" letter-spacing="0.10em">FINISH</text>
  <text x="${divs[2]+10}" y="${mid+20}" font-size="8" fill="#9b9b92" letter-spacing="0.10em">NOTES</text>
  <text x="${divs[0]+10}" y="${mid+34}" font-size="11" fill="#1a1a18">${esc(mat)}</text>
  <text x="${divs[1]+10}" y="${mid+34}" font-size="11" fill="#1a1a18">${esc(v('tb-finish')||'—')}</text>
  <text x="${divs[2]+10}" y="${mid+34}" font-size="11" fill="#1a1a18">${esc(v('tb-notes')||'—')}</text>
  </g>`;
}

// ── SHARED FOOTER ─────────────────────────────────────────────────
function svgFooter(sheetNum) {
  const y = PH - 14 - 36;
  const mid = y + 18;
  return `<g id="g-footer">
  <rect x="14" y="${y}" width="${PW-28}" height="36" fill="white" stroke="#c8c8be" stroke-width="0.5"/>
  <line x1="380" y1="${y}" x2="380" y2="${y+36}" stroke="#e0e0d8" stroke-width="0.4"/>
  <line x1="730" y1="${y}" x2="730" y2="${y+36}" stroke="#e0e0d8" stroke-width="0.4"/>
  <text x="24"  y="${mid-5}" font-size="9" fill="#888" letter-spacing="0.09em">UTILITY BICYCLE TECHNICAL SCHEMATIC · DIAMOND FRAME · 26″ / 559mm BSD</text>
  <text x="24"  y="${mid+9}" font-size="8" fill="#bbb" letter-spacing="0.07em">ALL DIMENSIONS NOMINAL mm · SCALE NTS · SINGLE-SPEED FREEWHEEL</text>
  <text x="390" y="${mid-5}" font-size="9" fill="#888" letter-spacing="0.08em">B. EVERETT · YELLOWHAPAX · NOETIC LAB</text>
  <text x="390" y="${mid+9}" font-size="8" fill="#bbb" letter-spacing="0.06em">yellowhapax.github.io/Noetic-Lab · CC BY 4.0</text>
  <text x="740" y="${mid-5}" font-size="9" fill="#888" letter-spacing="0.09em">${esc(T('sheet_n')(sheetNum, ['GEOMETRY','BOM & INTERFACES','FABRICATION BRIEF'][sheetNum-1]))}</text>
  <text x="740" y="${mid+9}" font-size="8" fill="#bbb" letter-spacing="0.07em">36 × 24 in · SVG VECTOR</text>
  </g>`;
}

// ════════════════════════════════════════════════════════════════
// SHEET 1 — PRIMARY SCHEMATIC
// ════════════════════════════════════════════════════════════════
function buildSheet1() {
  const TITLE_H = 88, FOOTER_H = 36, MARGIN = 14;
  const drawY  = MARGIN + TITLE_H + 6;
  const drawH  = PH - drawY - FOOTER_H - 8 - MARGIN;
  const drawW  = PW - MARGIN * 2;
  const AX_OFFSET = 180; // annotation strip width on right

  const g   = GEO;
  const pts = computePoints(g);
  const { rA, fA, bb, stTop, htBot, htTop, wR } = pts;

  // Scale: account for wheel extending BELOW the axle AND seatpost/saddle above seat tube top.
  // bikeAbove = max height above axle (frame + seatpost + saddle)
  // bikeBelow = wheel radius below axle + room for dimension lines
  const bikeXmax  = g.wb + 80;
  const bikeAbove = Math.max(htTop.y + 60, stTop.y + 185); // seat tube top + full seatpost+saddle
  const bikeBelow = wR + 40;                                // wheel below axle + dim-line clearance
  const usableW   = drawW - AX_OFFSET - 60;
  const usableH   = drawH - 40;
  const sc = Math.min(usableW / bikeXmax, usableH / (bikeAbove + bikeBelow)) * 0.88;

  // Origin: rear axle — OX reserves wheel clearance on the left; OY places axle above the bottom
  const OX = MARGIN + Math.round(wR * sc) + 20;
  const OY = drawY + 20 + Math.round(bikeAbove * sc);
  const px = mm => OX + mm * sc;
  const py = mm => OY - mm * sc;

  // Annotation column x
  const AX = MARGIN + drawW - AX_OFFSET + 10;

  const TW = 3.5, TW2 = 3.5;

  // Sprocket radii from tooth pitch
  const crRmm = (42 * 12.7) / (2 * Math.PI);
  const fwRmm = (18 * 12.7) / (2 * Math.PI);
  const crR = crRmm * sc;
  const fwR = fwRmm * sc;
  const wRpx   = wR * sc;
  const rimRpx = (wR - g.tireW + 8) * sc;
  const hubRpx = Math.max(5, 7 * sc);

  // Spokes
  function spokes(cx, cy, inner, outer, n, off) {
    let s = '';
    for (let i=0; i<n; i++) {
      const a = (i/n)*Math.PI*2 + (off||0);
      s += `<line x1="${(cx+inner*Math.cos(a)).toFixed(1)}" y1="${(cy+inner*Math.sin(a)).toFixed(1)}"
                  x2="${(cx+outer*Math.cos(a)).toFixed(1)}" y2="${(cy+outer*Math.sin(a)).toFixed(1)}"
                  stroke="#888" stroke-width="0.5" opacity="0.6"/>`;
    }
    return s;
  }

  // Chain tangent lines
  function chainLines() {
    const x1=px(bb.x), y1=py(bb.y), r1=crR;
    const x2=px(rA.x), y2=py(rA.y), r2=fwR;
    const dx=x2-x1, dy=y2-y1, d=Math.sqrt(dx*dx+dy*dy);
    const a=Math.atan2(dy,dx);
    const sinT=(r1-r2)/d, cosT=Math.sqrt(Math.max(0,1-sinT*sinT));
    const tU=Math.atan2(-cosT,sinT)+a, tL=Math.atan2(cosT,sinT)+a;
    const ux1=(x1+r1*Math.cos(tU+Math.PI/2)).toFixed(1), uy1=(y1+r1*Math.sin(tU+Math.PI/2)).toFixed(1);
    const ux2=(x2+r2*Math.cos(tU+Math.PI/2)).toFixed(1), uy2=(y2+r2*Math.sin(tU+Math.PI/2)).toFixed(1);
    const lx1=(x1+r1*Math.cos(tL-Math.PI/2)).toFixed(1), ly1=(y1+r1*Math.sin(tL-Math.PI/2)).toFixed(1);
    const lx2=(x2+r2*Math.cos(tL-Math.PI/2)).toFixed(1), ly2=(y2+r2*Math.sin(tL-Math.PI/2)).toFixed(1);
    return `<line x1="${ux1}" y1="${uy1}" x2="${ux2}" y2="${uy2}" stroke="#333" stroke-width="1.4" stroke-dasharray="3 2"/>
            <line x1="${lx1}" y1="${ly1}" x2="${lx2}" y2="${ly2}" stroke="#333" stroke-width="1.4" stroke-dasharray="3 2"/>`;
  }

  // Teeth marks
  function teeth(cx, cy, r, n) {
    let s='';
    for (let i=0;i<n;i++) {
      const a=(i/n)*Math.PI*2;
      s+=`<line x1="${(cx+(r-3)*Math.cos(a)).toFixed(1)}" y1="${(cy+(r-3)*Math.sin(a)).toFixed(1)}"
               x2="${(cx+(r+2)*Math.cos(a)).toFixed(1)}" y2="${(cy+(r+2)*Math.sin(a)).toFixed(1)}"
               stroke="#1a1a18" stroke-width="1.5" stroke-linecap="round"/>`;
    }
    return s;
  }

  // Annotation leader — horizontal line to right margin
  function annot(fromX, fromY, label) {
    return `<circle cx="${fromX.toFixed(1)}" cy="${fromY.toFixed(1)}" r="2.5" fill="#aaa"/>
    <line x1="${fromX.toFixed(1)}" y1="${fromY.toFixed(1)}" x2="${AX-4}" y2="${fromY.toFixed(1)}"
      stroke="#ccc" stroke-width="0.5" stroke-dasharray="3 2"/>
    <text x="${AX+2}" y="${(fromY+4).toFixed(1)}" font-size="12" fill="#333" letter-spacing="0.04em">${label}</text>`;
  }

  // Dimension line below ground
  const groundY = py(0);
  const dimY = groundY + 32;
  function dimH(x1mm, x2mm, label) {
    return `<line x1="${px(x1mm)}" y1="${dimY}" x2="${px(x2mm)}" y2="${dimY}"
      stroke="#888" stroke-width="0.7" marker-start="url(#da)" marker-end="url(#da)"/>
    <line x1="${px(x1mm)}" y1="${groundY}" x2="${px(x1mm)}" y2="${dimY+5}" stroke="#bbb" stroke-width="0.5"/>
    <line x1="${px(x2mm)}" y1="${groundY}" x2="${px(x2mm)}" y2="${dimY+5}" stroke="#bbb" stroke-width="0.5"/>
    <text x="${((px(x1mm)+px(x2mm))/2).toFixed(1)}" y="${dimY+16}"
      font-size="12" fill="#444" text-anchor="middle" letter-spacing="0.04em">${label}</text>`;
  }
  const bbDimX = px(rA.x) - 36;
  function dimBBdrop() {
    return `<line x1="${bbDimX}" y1="${py(0)}" x2="${bbDimX}" y2="${py(bb.y)}"
      stroke="#888" stroke-width="0.7" marker-start="url(#da)" marker-end="url(#da)"/>
    <line x1="${px(rA.x)}" y1="${py(0)}"   x2="${bbDimX-5}" y2="${py(0)}"   stroke="#bbb" stroke-width="0.5"/>
    <line x1="${px(bb.x)}" y1="${py(bb.y)}" x2="${bbDimX-5}" y2="${py(bb.y)}" stroke="#bbb" stroke-width="0.5"/>
    <text x="${bbDimX-8}" y="${((py(0)+py(bb.y))/2+5).toFixed(1)}"
      font-size="11" fill="#444" text-anchor="end">BB↓${g.bbd}</text>`;
  }

  // Tube lengths computed from rendered geometry (mm)
  const stLenMm = Math.round(Math.sqrt((stTop.x-bb.x)**2+(stTop.y-bb.y)**2));
  const dtLenMm = Math.round(Math.sqrt((htBot.x-bb.x)**2+(htBot.y-bb.y)**2));
  const ttLenMm = Math.round(Math.sqrt((htTop.x-stTop.x)**2+(htTop.y-stTop.y)**2));
  const ssLenMm = Math.round(Math.sqrt(stTop.x**2+stTop.y**2));

  // Aligned tube dimension — parallel offset from tube with arrowed ends and rotated label
  function dimTube(x1, y1, x2, y2, label, offPx) {
    const dx = x2-x1, dy = y2-y1;
    const len = Math.sqrt(dx*dx+dy*dy);
    if (len < 1) return '';
    const nx = -dy/len * offPx;
    const ny =  dx/len * offPx;
    const ax1=(x1+nx).toFixed(1), ay1=(y1+ny).toFixed(1);
    const ax2=(x2+nx).toFixed(1), ay2=(y2+ny).toFixed(1);
    const mx=(x1+x2)/2+nx, my=(y1+y2)/2+ny;
    let ang = Math.atan2(dy,dx)*180/Math.PI;
    if (ang > 90 || ang < -90) ang += 180;
    const tw = label.length * 6.5 + 10;
    return `
  <line x1="${(x1+nx*0.25).toFixed(1)}" y1="${(y1+ny*0.25).toFixed(1)}" x2="${ax1}" y2="${ay1}" stroke="#c0c0b8" stroke-width="0.5"/>
  <line x1="${(x2+nx*0.25).toFixed(1)}" y1="${(y2+ny*0.25).toFixed(1)}" x2="${ax2}" y2="${ay2}" stroke="#c0c0b8" stroke-width="0.5"/>
  <line x1="${ax1}" y1="${ay1}" x2="${ax2}" y2="${ay2}" stroke="#888" stroke-width="0.6" marker-start="url(#da)" marker-end="url(#da)"/>
  <rect x="${(mx-tw/2).toFixed(1)}" y="${(my-7).toFixed(1)}" width="${tw.toFixed(1)}" height="12" fill="white" opacity="0.88"
    transform="rotate(${ang.toFixed(1)},${mx.toFixed(1)},${my.toFixed(1)})"/>
  <text x="${mx.toFixed(1)}" y="${(my+3.5).toFixed(1)}" font-size="10.5" fill="#333" text-anchor="middle" letter-spacing="0.03em"
    transform="rotate(${ang.toFixed(1)},${mx.toFixed(1)},${my.toFixed(1)})">${label}</text>`;
  }

  return svgOpen('poster-svg') +
    svgTitleBar(1,'GEOMETRY', TITLE_H) +
    `<g id="g-schema">
  <rect x="14" y="${drawY}" width="${drawW}" height="${drawH}" fill="white" stroke="#c8c8be" stroke-width="0.5"/>
  <text x="26" y="${drawY+16}" font-size="9" fill="#9b9b92" letter-spacing="0.14em">${esc(T('primary_asm'))}</text>
  <line x1="${AX-10}" y1="${drawY+22}" x2="${AX-10}" y2="${drawY+drawH-10}" stroke="#e0e0d8" stroke-width="0.6"/>

  <!-- ground line -->
  <line x1="${px(-50)}" y1="${py(0)}" x2="${px(g.wb+50)}" y2="${py(0)}"
    stroke="#c8c8c0" stroke-width="0.7" stroke-dasharray="6 4"/>

  <!-- REAR WHEEL -->
  <g>
    <circle cx="${px(rA.x).toFixed(1)}" cy="${py(rA.y).toFixed(1)}" r="${wRpx.toFixed(1)}" fill="none" stroke="#444" stroke-width="1.5"/>
    <circle cx="${px(rA.x).toFixed(1)}" cy="${py(rA.y).toFixed(1)}" r="${rimRpx.toFixed(1)}" fill="none" stroke="#777" stroke-width="0.7" opacity="0.5"/>
    ${spokes(px(rA.x),py(rA.y),hubRpx,rimRpx*0.97,20,0)}
    <circle cx="${px(rA.x).toFixed(1)}" cy="${py(rA.y).toFixed(1)}" r="${hubRpx.toFixed(1)}" fill="#f0f0e8" stroke="#888" stroke-width="1"/>
  </g>

  <!-- FRONT WHEEL -->
  <g>
    <circle cx="${px(fA.x).toFixed(1)}" cy="${py(fA.y).toFixed(1)}" r="${wRpx.toFixed(1)}" fill="none" stroke="#444" stroke-width="1.5"/>
    <circle cx="${px(fA.x).toFixed(1)}" cy="${py(fA.y).toFixed(1)}" r="${rimRpx.toFixed(1)}" fill="none" stroke="#777" stroke-width="0.7" opacity="0.5"/>
    ${spokes(px(fA.x),py(fA.y),hubRpx,rimRpx*0.97,20,0.16)}
    <circle cx="${px(fA.x).toFixed(1)}" cy="${py(fA.y).toFixed(1)}" r="${hubRpx.toFixed(1)}" fill="#f0f0e8" stroke="#888" stroke-width="1"/>
  </g>

  <!-- FRAME -->
  <g>
    <line x1="${px(rA.x).toFixed(1)}"  y1="${py(rA.y).toFixed(1)}" x2="${px(bb.x).toFixed(1)}"    y2="${py(bb.y).toFixed(1)}"    stroke="#000" stroke-width="${TW}" stroke-linecap="round"/>
    <line x1="${px(rA.x).toFixed(1)}"  y1="${py(rA.y).toFixed(1)}" x2="${px(stTop.x).toFixed(1)}" y2="${py(stTop.y).toFixed(1)}" stroke="#000" stroke-width="${TW}" stroke-linecap="round"/>
    <line x1="${px(bb.x).toFixed(1)}"  y1="${py(bb.y).toFixed(1)}" x2="${px(stTop.x).toFixed(1)}" y2="${py(stTop.y).toFixed(1)}" stroke="#000" stroke-width="${TW}" stroke-linecap="round"/>
    <line x1="${px(stTop.x).toFixed(1)}" y1="${py(stTop.y).toFixed(1)}" x2="${px(htTop.x).toFixed(1)}" y2="${py(htTop.y).toFixed(1)}" stroke="#000" stroke-width="${TW}" stroke-linecap="round"/>
    <line x1="${px(bb.x).toFixed(1)}"  y1="${py(bb.y).toFixed(1)}" x2="${px(htBot.x).toFixed(1)}" y2="${py(htBot.y).toFixed(1)}" stroke="#000" stroke-width="${TW}" stroke-linecap="round"/>
    <line x1="${px(htBot.x).toFixed(1)}" y1="${py(htBot.y).toFixed(1)}" x2="${px(htTop.x).toFixed(1)}" y2="${py(htTop.y).toFixed(1)}" stroke="#000" stroke-width="${TW}" stroke-linecap="round"/>
    <circle cx="${px(bb.x).toFixed(1)}" cy="${py(bb.y).toFixed(1)}" r="${(10*sc).toFixed(1)}" fill="white" stroke="#000" stroke-width="${TW}"/>
  </g>

  <!-- FORK -->
  <g>
    <line x1="${px(htBot.x).toFixed(1)}" y1="${py(htBot.y).toFixed(1)}"
          x2="${px(fA.x).toFixed(1)}"    y2="${py(0).toFixed(1)}"
          stroke="#000" stroke-width="${TW}" stroke-linecap="round"/>
    <line x1="${px(htTop.x).toFixed(1)}" y1="${py(htTop.y).toFixed(1)}"
          x2="${(px(htTop.x)-7*sc).toFixed(1)}" y2="${py(htTop.y + 55).toFixed(1)}"
          stroke="#000" stroke-width="${TW}" stroke-dasharray="5 3" stroke-linecap="round"/>
  </g>

  <!-- DRIVETRAIN -->
  <g>
    <circle cx="${px(bb.x).toFixed(1)}" cy="${py(bb.y).toFixed(1)}" r="${crR.toFixed(1)}" fill="none" stroke="#1a1a18" stroke-width="1.8"/>
    ${teeth(px(bb.x),py(bb.y),crR,42)}
  </g>
  <g>
    <circle cx="${px(rA.x).toFixed(1)}" cy="${py(rA.y).toFixed(1)}" r="${fwR.toFixed(1)}" fill="none" stroke="#1a1a18" stroke-width="1.8"/>
    ${teeth(px(rA.x),py(rA.y),fwR,18)}
  </g>
  <g>${chainLines()}</g>

  <!-- COCKPIT (reference lines — gray) -->
  <rect x="${(px(htTop.x)-24*sc).toFixed(1)}" y="${py(htTop.y+16).toFixed(1)}" width="${(22*sc).toFixed(1)}" height="${(7*sc).toFixed(1)}" fill="none" stroke="#aaa" stroke-width="1" rx="1"/>
  <path d="M${(px(htTop.x-52)).toFixed(1)} ${py(htTop.y+5).toFixed(1)} L${(px(htTop.x-36)).toFixed(1)} ${py(htTop.y+18).toFixed(1)} L${(px(htTop.x-4)).toFixed(1)} ${py(htTop.y+18).toFixed(1)}" fill="none" stroke="#aaa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="${px(stTop.x+4).toFixed(1)}" y1="${py(stTop.y+6).toFixed(1)}" x2="${px(stTop.x+11).toFixed(1)}" y2="${py(stTop.y+155).toFixed(1)}" stroke="#aaa" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M${px(stTop.x-25).toFixed(1)} ${py(stTop.y+165).toFixed(1)} Q${px(stTop.x+10).toFixed(1)} ${py(stTop.y+173).toFixed(1)} ${px(stTop.x+46).toFixed(1)} ${py(stTop.y+163).toFixed(1)}" fill="none" stroke="#aaa" stroke-width="1.5" stroke-linecap="round"/>

  <!-- DIMENSIONS -->
  ${dimH(rA.x, fA.x, `WB ${g.wb}mm`)}
  ${dimH(rA.x, bb.x, `CS ${g.cs}mm`)}
  ${dimBBdrop()}
  <text x="${(px(htBot.x)+36).toFixed(1)}" y="${(py(htBot.y)+18).toFixed(1)}" font-size="12" fill="#555" letter-spacing="0.04em">HTA ${g.hta}°</text>
  <text x="${(px(bb.x)-18).toFixed(1)}"    y="${(py(bb.y+65)).toFixed(1)}"    font-size="12" fill="#555" text-anchor="end" letter-spacing="0.04em">STA ${g.sta}°</text>
  ${dimTube(px(bb.x),    py(bb.y),    px(stTop.x), py(stTop.y), `ST ${stLenMm}mm`, -22)}
  ${dimTube(px(bb.x),    py(bb.y),    px(htBot.x), py(htBot.y), `DT ${dtLenMm}mm`,  22)}
  ${dimTube(px(stTop.x), py(stTop.y), px(htTop.x), py(htTop.y), `TT ${ttLenMm}mm`,  22)}
  ${dimTube(px(rA.x),    py(rA.y),    px(stTop.x), py(stTop.y), `SS ${ssLenMm}mm`, -22)}
  ${dimTube(px(htBot.x), py(htBot.y), px(htTop.x), py(htTop.y), `HT ${g.ht}mm`,     22)}

  <!-- ANNOTATION STRIP -->
  ${annot(px(rA.x),    py(wR),       `26″ Ø ${g.wbsd + g.tireW*2}mm`)}
  ${annot(px(htTop.x), py(htTop.y),  `HT ${g.ht}mm`)}
  ${annot(px(stTop.x), py(stTop.y),  'SEAT CLUSTER')}
  ${annot(px(bb.x),    py(bb.y),     'BSA 68mm BB')}
  ${annot(px(rA.x),    py(rA.y),     '135mm O.L.D.')}
  ${annot(px(fA.x),    py(fA.y),     '100mm O.L.D.')}
  </g>` +
    svgFooter(1) +
    '</svg>';
}

// ════════════════════════════════════════════════════════════════
// SHEET 2 — BILL OF MATERIALS & INTERFACE STANDARDS
// ════════════════════════════════════════════════════════════════
function buildSheet2() {
  const TITLE_H = 88, FOOTER_H = 36, M = 14;
  const bodyY = M + TITLE_H + 6;
  const bodyH = PH - bodyY - FOOTER_H - 8 - M;
  const bodyW = PW - M * 2;

  // BOM: top 52%, Interface table: bottom 48%
  const bomH   = Math.floor(bodyH * 0.52);
  const ifaceH = bodyH - bomH - 4;
  const ifaceY = bodyY + bomH + 4;

  // ── BOM TABLE ──
  const all = Object.values(CMAP);
  const BOM_HDR_H = 28;
  const BOM_ROW_H = Math.floor((bomH - BOM_HDR_H - 24) / all.length);
  const bcols = [0, 34, 220, 510, 730, 790, 836];
  const bhdrs = [T('bom_no'), T('bom_component'), T('bom_spec'), T('bom_supplier'), T('bom_qty'), T('bom_check')];

  function bomRow(c, i) {
    const p = placed.has(c.id);
    const y = bodyY + BOM_HDR_H + 16 + i * BOM_ROW_H;
    const fill = p ? '#1a1a18' : '#aaa';
    const fw   = p ? '500' : '400';
    return `
    <line x1="${M}" y1="${y+BOM_ROW_H}" x2="${M+bodyW}" y2="${y+BOM_ROW_H}" stroke="${i%2===0?'#f0f0e8':'#e8e8e0'}" stroke-width="${BOM_ROW_H}"/>
    <text x="${M+bcols[0]+6}" y="${y+BOM_ROW_H*0.64}" font-size="12" fill="${fill}">${i+1}</text>
    <text x="${M+bcols[1]+6}" y="${y+BOM_ROW_H*0.64}" font-size="13" fill="${fill}" font-weight="${fw}">${esc(c.name)}</text>
    <text x="${M+bcols[2]+6}" y="${y+BOM_ROW_H*0.64}" font-size="11" fill="${p?'#333':'#bbb'}">${esc(c.spec)}</text>
    <text x="${M+bcols[3]+6}" y="${y+BOM_ROW_H*0.64}" font-size="11" fill="#ccc">—</text>
    <text x="${M+bcols[4]+6}" y="${y+BOM_ROW_H*0.64}" font-size="12" fill="${fill}">1</text>
    <text x="${M+bcols[5]+6}" y="${y+BOM_ROW_H*0.64}" font-size="16" fill="${p?'#2a7a42':'#ddd'}">${p?'✓':'○'}</text>`;
  }

  // ── INTERFACE TABLE ──
  const IFACE_HDR_H = 28;
  const IFACE_ROW_H = Math.floor((ifaceH - IFACE_HDR_H - 12) / IFACE_DATA.length);
  const icols = [0, 150, 350, 360];

  function ifaceRow(r, i) {
    const y = ifaceY + IFACE_HDR_H + 8 + i * IFACE_ROW_H;
    return `
    <line x1="${M}" y1="${y+IFACE_ROW_H}" x2="${M+bodyW}" y2="${y+IFACE_ROW_H}" stroke="${i%2===0?'#f0f0e8':'#e8e8e0'}" stroke-width="${IFACE_ROW_H}"/>
    <text x="${M+icols[0]+8}" y="${y+IFACE_ROW_H*0.60}" font-size="12" fill="#1a1a18" font-weight="500" letter-spacing="0.04em">${esc(r.point)}</text>
    <text x="${M+icols[1]+8}" y="${y+IFACE_ROW_H*0.60}" font-size="12" fill="#333">${esc(r.standard)}</text>
    <text x="${M+icols[2]+16}" y="${y+IFACE_ROW_H*0.60}" font-size="11" fill="#555" font-style="italic">${esc(r.note)}</text>`;
  }

  return svgOpen('poster-svg') +
    svgTitleBar(2,'BOM', TITLE_H) +
    `<!-- BOM section -->
  <rect x="${M}" y="${bodyY}" width="${bodyW}" height="${bomH}" fill="white" stroke="#c8c8be" stroke-width="0.5"/>
  <text x="${M+10}" y="${bodyY+16}" font-size="10" fill="#9b9b92" letter-spacing="0.14em">${esc(T('bom_component').toUpperCase())} — BILL OF MATERIALS</text>

  <!-- BOM header row -->
  <rect x="${M}" y="${bodyY+18}" width="${bodyW}" height="${BOM_HDR_H}" fill="#1a1a18"/>
  ${bhdrs.map((h,i)=>`<text x="${M+bcols[i]+6}" y="${bodyY+18+BOM_HDR_H*0.68}" font-size="11" fill="white" font-weight="500" letter-spacing="0.09em">${esc(h)}</text>`).join('')}

  <!-- BOM column dividers -->
  ${bcols.slice(1).map(cx=>`<line x1="${M+cx}" y1="${bodyY+18}" x2="${M+cx}" y2="${bodyY+bomH}" stroke="#e0e0d8" stroke-width="0.5"/>`).join('')}

  <!-- BOM rows -->
  ${all.map((c,i) => bomRow(c,i)).join('')}

  <!-- INTERFACE section -->
  <rect x="${M}" y="${ifaceY}" width="${bodyW}" height="${ifaceH}" fill="white" stroke="#c8c8be" stroke-width="0.5"/>
  <text x="${M+10}" y="${ifaceY+16}" font-size="10" fill="#9b9b92" letter-spacing="0.14em">${esc(T('iface_hdr'))}</text>

  <!-- Interface header row -->
  <rect x="${M}" y="${ifaceY+18}" width="${bodyW}" height="${IFACE_HDR_H}" fill="#3d3d38"/>
  <text x="${M+icols[0]+8}" y="${ifaceY+18+IFACE_HDR_H*0.68}" font-size="11" fill="white" font-weight="500" letter-spacing="0.09em">${esc(T('iface_point'))}</text>
  <text x="${M+icols[1]+8}" y="${ifaceY+18+IFACE_HDR_H*0.68}" font-size="11" fill="white" font-weight="500" letter-spacing="0.09em">${esc(T('iface_standard'))}</text>
  <text x="${M+icols[2]+16}" y="${ifaceY+18+IFACE_HDR_H*0.68}" font-size="11" fill="white" font-weight="500" letter-spacing="0.09em">${esc(T('iface_note'))}</text>
  <line x1="${M+icols[1]}" y1="${ifaceY+18}" x2="${M+icols[1]}" y2="${ifaceY+ifaceH}" stroke="#555" stroke-width="0.5"/>
  <line x1="${M+icols[2]}" y1="${ifaceY+18}" x2="${M+icols[2]}" y2="${ifaceY+ifaceH}" stroke="#555" stroke-width="0.5"/>

  <!-- Interface rows -->
  ${IFACE_DATA.map((r,i) => ifaceRow(r,i)).join('')}` +
    svgFooter(2) + '</svg>';
}

// ════════════════════════════════════════════════════════════════
// SHEET 3 — FABRICATION BRIEF & STRUCTURAL NOTES
// ════════════════════════════════════════════════════════════════
function buildSheet3() {
  const TITLE_H = 88, FOOTER_H = 36, M = 14;
  const bodyY = M + TITLE_H + 6;
  const bodyH = PH - bodyY - FOOTER_H - 8 - M;
  const bodyW = PW - M * 2;

  // Two columns: left=structural rationale + seq, right=tubes + weld zones
  const colW = Math.floor(bodyW / 2) - 4;
  const col2X = M + colW + 8;

  // Section header helper
  function secHdr(x, y, w, label) {
    return `<rect x="${x}" y="${y}" width="${w}" height="26" fill="#1a1a18"/>
    <text x="${x+10}" y="${y+18}" font-size="12" fill="white" font-weight="500" letter-spacing="0.12em">${esc(label)}</text>`;
  }

  // Paragraph text — word-wrapped by line
  function para(x, y, w, lines, size, color) {
    return lines.map((line, i) =>
      `<text x="${x}" y="${y + i*(size+4)}" font-size="${size}" fill="${color||'#333'}" font-family="'IBM Plex Sans','Arial',sans-serif">${esc(line)}</text>`
    ).join('');
  }

  // Wrap text into lines of ~maxChars
  function wrap(text, maxChars) {
    const words = text.split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
      if ((cur + ' ' + w).trim().length > maxChars) {
        if (cur) lines.push(cur.trim());
        cur = w;
      } else {
        cur = (cur + ' ' + w).trim();
      }
    }
    if (cur) lines.push(cur.trim());
    return lines;
  }

  // Weld zone entry
  function weldEntry(x, y, w, label, text, color) {
    const lines = wrap(text, 68);
    return `<rect x="${x}" y="${y}" width="8" height="${14 + lines.length*15}" fill="${color}"/>
    <text x="${x+14}" y="${y+13}" font-size="12" fill="#1a1a18" font-weight="500" font-family="'IBM Plex Sans','Arial',sans-serif">${esc(label)}</text>
    ${lines.map((l,i)=>`<text x="${x+14}" y="${y+28+i*15}" font-size="11" fill="#444" font-family="'IBM Plex Sans','Arial',sans-serif">${esc(l)}</text>`).join('')}`;
  }

  // Tube spec entry
  function tubeEntry(x, y, label, text) {
    const lines = wrap(text, 56);
    return `<text x="${x}" y="${y}" font-size="12" fill="#1a1a18" font-weight="500" font-family="'IBM Plex Mono','Courier New',monospace" letter-spacing="0.05em">${esc(label)}</text>
    ${lines.map((l,i)=>`<text x="${x+12}" y="${y+15+i*14}" font-size="11" fill="#444" font-family="'IBM Plex Sans','Arial',sans-serif">${esc(l)}</text>`).join('')}`;
  }

  // ── LEFT COLUMN ──
  const LX = M + 10;
  let ly = bodyY + 8;

  // Structural rationale
  const structLines1 = wrap(T('struct_p1'), 70);
  const structLines2 = wrap(T('struct_p2'), 70);
  const structLines3 = wrap(T('struct_p3'), 70);
  const structLines4 = wrap(T('struct_p4'), 70);
  const allStructLines = [...structLines1, [''], ...structLines2, [''], ...structLines3, [''], ...structLines4];

  // Assembly sequence
  const seqKeys = ['seq_1','seq_2','seq_3','seq_4','seq_5','seq_6','seq_7','seq_8'];

  // ── RIGHT COLUMN ──
  const RX = col2X + 10;
  const tubeKeys = ['tube_dt','tube_tt','tube_st','tube_cs','tube_ss','tube_ht'];
  const weldEntries = [
    {key:'weld_ht', color:'#e8c84a'},
    {key:'weld_bb', color:'#f5a623'},
    {key:'weld_ss', color:'#aaaaff'},
    {key:'weld_cs', color:'#88cc88'},
  ];

  return svgOpen('poster-svg') +
    svgTitleBar(3,'FABRICATION', TITLE_H) +

    // Left column background
    `<rect x="${M}" y="${bodyY}" width="${colW}" height="${bodyH}" fill="white" stroke="#c8c8be" stroke-width="0.5"/>` +
    secHdr(M, bodyY, colW, T('s3_struct')) +

    // Structural paragraphs
    para(LX, bodyY+38, colW-20,
      [...structLines1, ...[''].concat(structLines2), ...[''].concat(structLines3), ...[''].concat(structLines4)].filter(l=>l!==undefined),
      11, '#333') +

    // Assembly sequence
    (() => {
      const secY = bodyY + 38 + (structLines1.length + structLines2.length + structLines3.length + structLines4.length + 3) * 15 + 8;
      return secHdr(M, secY, colW, T('s3_seq')) +
        seqKeys.map((k,i) => {
          const lines = wrap(T(k), 68);
          return lines.map((l,j) =>
            `<text x="${LX}" y="${secY+34+i*22+j*13}" font-size="11.5" fill="${j===0?'#1a1a18':'#555'}"
              font-family="'IBM Plex Sans','Arial',sans-serif" font-weight="${j===0?'500':'400'}">${esc(l)}</text>`
          ).join('');
        }).join('');
    })() +

    // Right column background
    `<rect x="${col2X}" y="${bodyY}" width="${colW}" height="${bodyH}" fill="white" stroke="#c8c8be" stroke-width="0.5"/>` +
    secHdr(col2X, bodyY, colW, T('s3_tubes')) +

    // Tube entries
    (() => {
      let y = bodyY + 36;
      return tubeKeys.map(k => {
        const lines = wrap(T(k), 55);
        const entry = tubeEntry(RX, y, k.replace('tube_','').toUpperCase(), T(k));
        y += 12 + lines.length * 12 + 5;
        return entry;
      }).join('');
    })() +

    // Weld zones section
    (() => {
      const secY = bodyY + 36 + tubeKeys.reduce((sum,k) => {
        return sum + 12 + wrap(T(k),55).length*12 + 5;
      }, 0) + 8;
      return secHdr(col2X, secY, colW, T('s3_welds')) +
        (() => {
          let wy = secY + 34;
          return weldEntries.map(({key,color}) => {
            const lines = wrap(T(key), 65);
            const entry = weldEntry(RX, wy, '', T(key), T(key), color);
            // Re-render properly
            const h = 14 + lines.length * 11 + 2;
            const out = `<rect x="${RX}" y="${wy}" width="6" height="${h}" fill="${color}" rx="1"/>
            ${lines.map((l,i) => `<text x="${RX+12}" y="${wy+13+i*11}" font-size="11" fill="#222" font-family="'IBM Plex Sans','Arial',sans-serif">${esc(l)}</text>`).join('')}`;
            wy += h + 5;
            return out;
          }).join('');
        })();
    })() +

    svgFooter(3) + '</svg>';
}



// ── SPEC PANEL ────────────────────────────────────────────────────
function renderSpec() {
  const vb = document.getElementById('valid-body');
  if (vb) vb.innerHTML = CONSTRAINTS.map(c => {
    const pass = c.check(placed);
    return `<div class="vitem ${pass?'ok':c.sev}">
      <span class="dot ${pass?'dok':c.sev==='err'?'derr':'dwarn'}"></span>
      <div><div style="font-size:10px;font-weight:500">${c.label}</div>
      ${!pass?`<div style="font-size:9px;margin-top:1px;opacity:.85">${c.msg}</div>`:''}</div></div>`;
  }).join('');

  const ib = document.getElementById('iface-body');
  if (ib) ib.innerHTML = [
    {label:'BB SHELL',    val:'BSA 68mm threaded',  ok:placed.has('bb')},
    {label:'REAR O.L.D.', val:'135mm bolt-on',       ok:placed.has('rwheel')},
    {label:'FRONT O.L.D.',val:'100mm bolt-on',        ok:placed.has('fwheel')},
    {label:'STEERER',     val:'1″ threaded',          ok:placed.has('headset')},
    {label:'CHAIN',       val:'1/2″ × 3/32″',        ok:placed.has('chain')},
    {label:'FREEWHEEL',   val:'1.375″ × 24tpi',      ok:placed.has('freewheel')},
  ].map(r=>`<div class="srow">
    <div style="display:flex;align-items:center;gap:5px">
      <span class="dot ${r.ok?'dok':'dempty'}"></span>
      <span class="slabel">${r.label}</span>
    </div><span class="sval" style="font-family:var(--mono);font-size:10px">${r.val}</span></div>`).join('');
}

// ── GEOMETRY ──────────────────────────────────────────────────────
function applyGeometry() {
  GEO.hta = parseFloat(document.getElementById('g-hta').value)||71;
  GEO.sta = parseFloat(document.getElementById('g-sta').value)||73;
  GEO.cs  = parseFloat(document.getElementById('g-cs').value) ||420;
  GEO.bbd = parseFloat(document.getElementById('g-bbd').value)||70;
  GEO.tt  = parseFloat(document.getElementById('g-tt').value) ||560;
  GEO.ht  = parseFloat(document.getElementById('g-ht').value) ||140;
  GEO.wb  = parseFloat(document.getElementById('g-wb').value) ||1030;
  GEO.fr  = parseFloat(document.getElementById('g-fr').value) ||55;
  refresh(); toast('Geometry applied');
}
function loadPreset(key) {
  const d = PRESETS[key]; if (!d) return;
  Object.entries(d).forEach(([k,v]) => { const el=document.getElementById('g-'+k); if(el) el.value=v; GEO[k]=v; });
  const sel = document.getElementById('preset-sel'); if (sel) sel.value = key;
  const lbl = document.getElementById('tb-style'); if (lbl) lbl.textContent = PRESET_LABELS[key] || key.toUpperCase();
  refresh(); toast('Preset: ' + (PRESET_LABELS[key] || key.toUpperCase()));
}
function loadUtility() { loadPreset('utility'); }

// ── MISC ──────────────────────────────────────────────────────────
function toggleSec(id) { const el=document.getElementById(id); if(el) el.classList.toggle('collapsed'); }
function resetCanvas() { refresh(); }
document.addEventListener('click', () => document.getElementById('ctx-menu').style.display='none');
function ctxDo(action) {
  document.getElementById('ctx-menu').style.display='none';
}
function exportSheet() {
  const svgId = ['poster-svg','poster-svg','poster-svg'][currentSheet-1];
  const svg = document.getElementById(svgId); if(!svg){toast('Nothing to export');return;}
  const clone = svg.cloneNode(true);
  clone.setAttribute('width','36in'); clone.setAttribute('height','24in');
  const style = document.createElementNS('http://www.w3.org/2000/svg','style');
  style.textContent = `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500&display=swap');`;
  clone.insertBefore(style, clone.firstChild);
  const blob = new Blob([clone.outerHTML],{type:'image/svg+xml'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href=url; a.download=`bicycle-schematic-sheet${currentSheet}.svg`; a.click();
  URL.revokeObjectURL(url);
  toast(`Exported sheet ${currentSheet}`);
}
function toast(msg) {
  const el=document.getElementById('toast'); el.textContent=msg;
  el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2200);
}
function refresh() { renderPoster(); renderSpec(); }

// ── EXPOSE GLOBALS ────────────────────────────────────────────────
window.applyGeometry = applyGeometry;
window.loadUtility   = loadUtility;
window.loadPreset    = loadPreset;
window.resetCanvas   = resetCanvas;
window.exportSheet   = exportSheet;
window.toggleSec     = toggleSec;
window.setZoom       = setZoom;
window.fitZoom       = fitZoom;
window.ctxDo         = ctxDo;
window.switchSheet   = switchSheet;
window.setLang       = setLang;

window.addEventListener('load', init);
