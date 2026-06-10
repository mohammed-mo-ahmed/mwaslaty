export type TransitStop = {
  id: string;
  name: string;
  nameAr: string;
  lat: number;
  lng: number;
  area: string;
  lines: string[];
  zone: 'cairo' | 'giza' | 'qalyubia' | 'alexandria';
};

export type TransitRoute = {
  id: string;
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  duration: string;
  cost: string;
  type: 'metro' | 'bus' | 'microbus' | 'multi';
  lineName: string;
  transfers: number;
  steps: Array<{
    instruction: string;
    type: string;
    duration: string;
  }>;
};

export const stops: TransitStop[] = [
  // ========= Metro Line 1 (Helwan ↔ El-Marg) =========
  {
    id: 'helwan',
    name: 'Helwan',
    nameAr: 'حلوان',
    lat: 29.8417,
    lng: 31.3335,
    area: 'Helwan',
    lines: ['Metro Line 1', 'Bus 15', 'Bus 18'],
    zone: 'cairo'
  },
  {
    id: 'maadi',
    name: 'Maadi',
    nameAr: 'المعادي',
    lat: 29.9667,
    lng: 31.2667,
    area: 'Maadi',
    lines: ['Metro Line 1', 'Bus 85', 'Bus 105', 'Microbus Maadi-Nasr'],
    zone: 'cairo'
  },
  {
    id: 'dar-elsalam',
    name: 'Dar El-Salam',
    nameAr: 'دار السلام',
    lat: 29.9825,
    lng: 31.2497,
    area: 'Dar El-Salam',
    lines: ['Metro Line 1', 'Bus 14'],
    zone: 'cairo'
  },
  {
    id: 'sayeda-zeinab',
    name: 'Sayeda Zeinab',
    nameAr: 'السيدة زينب',
    lat: 30.0247,
    lng: 31.2385,
    area: 'Sayeda Zeinab',
    lines: ['Metro Line 1', 'Bus 24', 'Bus 81'],
    zone: 'cairo'
  },
  {
    id: 'sadat',
    name: 'Sadat (Tahrir)',
    nameAr: 'السادات (التحرير)',
    lat: 30.0444,
    lng: 31.2357,
    area: 'Downtown',
    lines: ['Metro Line 1', 'Metro Line 2', 'Bus 22', 'Bus 66', 'Bus 111', 'Microbus Tahrir-Giza', 'Microbus Tahrir-Mohandeseen'],
    zone: 'cairo'
  },
  {
    id: 'nasser-ataba',
    name: 'Nasser (Ataba)',
    nameAr: 'ناصر (العتبة)',
    lat: 30.0522,
    lng: 31.2397,
    area: 'Downtown',
    lines: ['Metro Line 1', 'Metro Line 2', 'Metro Line 3', 'Bus 12', 'Bus 50'],
    zone: 'cairo'
  },
  {
    id: 'shohadaa',
    name: 'Shohadaa (Ramses)',
    nameAr: 'الشهداء (رمسيس)',
    lat: 30.0636,
    lng: 31.2469,
    area: 'Ramses',
    lines: ['Metro Line 1', 'Metro Line 2', 'Metro Line 3', 'Bus 37', 'Bus 111', 'Bus 905', 'National Railway'],
    zone: 'cairo'
  },
  {
    id: 'demerdash',
    name: 'Demerdash',
    nameAr: 'دمرداش',
    lat: 30.0732,
    lng: 31.2532,
    area: 'Demerdash',
    lines: ['Metro Line 1', 'Bus 41'],
    zone: 'cairo'
  },
  {
    id: 'abbasiya',
    name: 'Abbasiya',
    nameAr: 'العباسية',
    lat: 30.0697,
    lng: 31.2766,
    area: 'Abbasiya',
    lines: ['Metro Line 1', 'Metro Line 3', 'Bus 41', 'Bus 66', 'Microbus Abbasiya-Heliopolis', 'Microbus Abbasiya-Nasr'],
    zone: 'cairo'
  },
  {
    id: 'el-marg',
    name: 'El-Marg',
    nameAr: 'المرج',
    lat: 30.1447,
    lng: 31.3336,
    area: 'El-Marg',
    lines: ['Metro Line 1', 'Bus 23'],
    zone: 'cairo'
  },

  // ========= Metro Line 2 (El-Monib ↔ Shubra El-Kheima) =========
  {
    id: 'el-monib',
    name: 'El-Monib',
    nameAr: 'المنيب',
    lat: 29.9873,
    lng: 31.2126,
    area: 'El-Monib',
    lines: ['Metro Line 2', 'Bus 7', 'Bus 15'],
    zone: 'giza'
  },
  {
    id: 'cairo-university',
    name: 'Cairo University',
    nameAr: 'جامعة القاهرة',
    lat: 30.0271,
    lng: 31.2098,
    area: 'Giza',
    lines: ['Metro Line 2', 'Bus 7', 'Bus 82', 'Microbus University-Mohandeseen'],
    zone: 'giza'
  },
  {
    id: 'dokki',
    name: 'Dokki',
    nameAr: 'الدقي',
    lat: 30.0365,
    lng: 31.2091,
    area: 'Dokki',
    lines: ['Metro Line 2', 'Bus 22', 'Bus 82'],
    zone: 'giza'
  },
  {
    id: 'rod-elfarag',
    name: 'Rod El-Farag',
    nameAr: 'روض الفرج',
    lat: 30.0781,
    lng: 31.2332,
    area: 'Rod El-Farag',
    lines: ['Metro Line 2', 'Bus 14', 'Bus 23'],
    zone: 'cairo'
  },
  {
    id: 'shubra',
    name: 'Shubra',
    nameAr: 'شبرا',
    lat: 30.1019,
    lng: 31.2409,
    area: 'Shubra',
    lines: ['Metro Line 2', 'Bus 14', 'Bus 23'],
    zone: 'cairo'
  },

  // ========= Metro Line 3 (Attaba ↔ Cairo Airport / Cairo University) =========
  {
    id: 'attaba',
    name: 'Attaba',
    nameAr: 'العتبة',
    lat: 30.0489,
    lng: 31.2442,
    area: 'Downtown',
    lines: ['Metro Line 3', 'Bus 12', 'Bus 37', 'Bus 50', 'Microbus Attaba-Nasr', 'Microbus Attaba-Heliopolis'],
    zone: 'cairo'
  },
  {
    id: 'maspic',
    name: 'Maspic',
    nameAr: 'ماسبيرو',
    lat: 30.0547,
    lng: 31.2322,
    area: 'Downtown',
    lines: ['Metro Line 3'],
    zone: 'cairo'
  },
  {
    id: 'bab-elshaaria',
    name: 'Bab El-Shaaria',
    nameAr: 'باب الشعرية',
    lat: 30.0592,
    lng: 31.2531,
    area: 'Bab El-Shaaria',
    lines: ['Metro Line 3'],
    zone: 'cairo'
  },
  {
    id: 'manshiet-elsadr',
    name: 'Manshiet El-Sadr',
    nameAr: 'منشية الصدر',
    lat: 30.0647,
    lng: 31.2653,
    area: 'Abbasiya',
    lines: ['Metro Line 3'],
    zone: 'cairo'
  },
  {
    id: 'heliopolis',
    name: 'Heliopolis',
    nameAr: 'مصر الجديدة',
    lat: 30.1109,
    lng: 31.3309,
    area: 'Heliopolis',
    lines: ['Metro Line 3', 'Bus 41', 'Bus 66', 'Bus 111', 'Microbus Heliopolis-Nasr', 'Microbus Heliopolis-Abbasiya'],
    zone: 'cairo'
  },
  {
    id: 'nozha',
    name: 'Nozha',
    nameAr: 'النزهة',
    lat: 30.1225,
    lng: 31.3583,
    area: 'Heliopolis',
    lines: ['Metro Line 3', 'Bus 23'],
    zone: 'cairo'
  },
  {
    id: 'ain-shams',
    name: 'Ain Shams',
    nameAr: 'عين شمس',
    lat: 30.1317,
    lng: 31.3878,
    area: 'Ain Shams',
    lines: ['Metro Line 3', 'Bus 23'],
    zone: 'cairo'
  },
  {
    id: 'cairo-airport',
    name: 'Cairo Airport',
    nameAr: 'مطار القاهرة',
    lat: 30.1119,
    lng: 31.4101,
    area: 'Airport',
    lines: ['Metro Line 3', 'Bus 37', 'Bus 905', 'Shuttle Bus'],
    zone: 'cairo'
  },

  // ========= Districts & Major Areas =========
  {
    id: 'zamalek',
    name: 'Zamalek',
    nameAr: 'الزمالك',
    lat: 30.0636,
    lng: 31.2172,
    area: 'Zamalek',
    lines: ['Bus 22', 'Bus 66', 'Microbus Zamalek-Downtown'],
    zone: 'cairo'
  },
  {
    id: 'mohandeseen',
    name: 'Mohandeseen',
    nameAr: 'المهندسين',
    lat: 30.0451,
    lng: 31.2107,
    area: 'Mohandeseen',
    lines: ['Bus 22', 'Bus 82', 'Microbus Mohandeseen-Downtown', 'Microbus Mohandeseen-Giza'],
    zone: 'giza'
  },
  {
    id: 'agouza',
    name: 'Agouza',
    nameAr: 'العجوزة',
    lat: 30.0458,
    lng: 31.2092,
    area: 'Mohandeseen',
    lines: ['Bus 22', 'Bus 82'],
    zone: 'giza'
  },
  {
    id: 'nasr-city',
    name: 'Nasr City',
    nameAr: 'مدينة نصر',
    lat: 30.0483,
    lng: 31.3656,
    area: 'Nasr City',
    lines: ['Bus 111', 'Bus 905', 'Microbus Nasr-Abbasiya', 'Microbus Nasr-Tahrir', 'Microbus Nasr-Tagamo3'],
    zone: 'cairo'
  },
  {
    id: 'new-cairo',
    name: 'New Cairo',
    nameAr: 'القاهرة الجديدة',
    lat: 30.0159,
    lng: 31.4317,
    area: 'New Cairo',
    lines: ['Bus 111', 'Bus 905', 'Microbus Tagamo3-Nasr', 'Microbus Tagamo3-Abbasiya'],
    zone: 'cairo'
  },
  {
    id: 'tagamo3',
    name: 'Tagamo3 El-Khamis',
    nameAr: 'التجمع الخامس',
    lat: 30.0125,
    lng: 31.4497,
    area: 'New Cairo',
    lines: ['Bus 111', 'Microbus Tagamo3-Nasr'],
    zone: 'cairo'
  },
  {
    id: 'rehab',
    name: 'Rehab',
    nameAr: 'الرحاب',
    lat: 30.0058,
    lng: 31.4818,
    area: 'New Cairo',
    lines: ['Bus 111'],
    zone: 'cairo'
  },
  {
    id: 'madinaty',
    name: 'Madinaty',
    nameAr: 'مدينتي',
    lat: 30.1055,
    lng: 31.6572,
    area: 'Madinaty',
    lines: ['Bus 905', 'Shuttle Bus'],
    zone: 'cairo'
  },
  {
    id: 'mokattam',
    name: 'Mokattam',
    nameAr: 'المقطم',
    lat: 30.0106,
    lng: 31.2964,
    area: 'Mokattam',
    lines: ['Bus 81', 'Bus 85'],
    zone: 'cairo'
  },
  {
    id: 'shorouk',
    name: 'Shorouk',
    nameAr: 'الشروق',
    lat: 30.1431,
    lng: 31.6344,
    area: 'Shorouk',
    lines: ['Bus 905'],
    zone: 'cairo'
  },
  {
    id: 'obour',
    name: 'Obour',
    nameAr: 'العبور',
    lat: 30.2147,
    lng: 31.4606,
    area: 'Obour',
    lines: ['Bus 23'],
    zone: 'cairo'
  },

  // ========= Giza Area =========
  {
    id: 'giza',
    name: 'Giza',
    nameAr: 'الجيزة',
    lat: 30.0094,
    lng: 31.2089,
    area: 'Giza',
    lines: ['Bus 7', 'Bus 15', 'Bus 82', 'Microbus Giza-Mohandeseen', 'Microbus Giza-Downtown'],
    zone: 'giza'
  },
  {
    id: 'sheikh-zayed',
    name: 'Sheikh Zayed',
    nameAr: 'الشيخ زايد',
    lat: 30.0189,
    lng: 30.9869,
    area: 'Sheikh Zayed',
    lines: ['Bus 7', 'Microbus Zayed-Dokki'],
    zone: 'giza'
  },
  {
    id: 'sixth-october',
    name: '6th October City',
    nameAr: 'السادس من أكتوبر',
    lat: 29.9767,
    lng: 30.9474,
    area: '6th October',
    lines: ['Bus 7', 'Bus 82', 'Microbus October-Giza'],
    zone: 'giza'
  },
  {
    id: 'faisal',
    name: 'Faisal',
    nameAr: 'فيصل',
    lat: 30.0061,
    lng: 31.1858,
    area: 'Faisal',
    lines: ['Bus 7', 'Bus 15'],
    zone: 'giza'
  },
  {
    id: 'haram',
    name: 'Haram',
    nameAr: 'الهرم',
    lat: 29.9875,
    lng: 31.1889,
    area: 'Haram',
    lines: ['Bus 7', 'Bus 15', 'Bus 82'],
    zone: 'giza'
  },

  // ========= Other Areas =========
  {
    id: 'downtown',
    name: 'Downtown',
    nameAr: 'وسط البلد',
    lat: 30.0477,
    lng: 31.2370,
    area: 'Downtown',
    lines: ['Bus 12', 'Bus 24', 'Bus 50'],
    zone: 'cairo'
  },
  {
    id: 'garden-city',
    name: 'Garden City',
    nameAr: 'جاردن سيتي',
    lat: 30.0455,
    lng: 31.2278,
    area: 'Garden City',
    lines: ['Bus 24'],
    zone: 'cairo'
  },
  {
    id: 'hadayek-elkobba',
    name: 'Hadayek El-Kobba',
    nameAr: 'حدائق القبة',
    lat: 30.0794,
    lng: 31.2844,
    area: 'Hadayek El-Kobba',
    lines: ['Bus 41'],
    zone: 'cairo'
  },
  {
    id: 'imbaba',
    name: 'Imbaba',
    nameAr: 'إمبابة',
    lat: 30.0672,
    lng: 31.2022,
    area: 'Imbaba',
    lines: ['Microbus Imbaba-Mohandeseen'],
    zone: 'giza'
  },
  {
    id: 'matareya',
    name: 'El-Matareya',
    nameAr: 'المطرية',
    lat: 30.1314,
    lng: 31.3106,
    area: 'El-Matareya',
    lines: ['Bus 41', 'Bus 23'],
    zone: 'cairo'
  },
  {
    id: 'sayeda-aisha',
    name: 'Sayeda Aisha',
    nameAr: 'السيدة عائشة',
    lat: 30.0181,
    lng: 31.2308,
    area: 'Sayeda Zeinab',
    lines: ['Bus 24', 'Bus 85'],
    zone: 'cairo'
  },
  {
    id: 'bashteel',
    name: 'Bashteel',
    nameAr: 'بشتيل',
    lat: 30.0583,
    lng: 31.2250,
    area: 'Imbaba',
    lines: ['Microbus Bashteel-Downtown'],
    zone: 'giza'
  },
  {
    id: 'manial',
    name: 'Manial',
    nameAr: 'المنيل',
    lat: 30.0289,
    lng: 31.2297,
    area: 'Manial',
    lines: ['Bus 24'],
    zone: 'cairo'
  },
  {
    id: 'zamalek-marriott',
    name: 'Zamalek (Marriott)',
    nameAr: 'الزمالك (ماريوت)',
    lat: 30.0586,
    lng: 31.2194,
    area: 'Zamalek',
    lines: ['Bus 22'],
    zone: 'cairo'
  },
  {
    id: 'manyal',
    name: 'El-Manyal',
    nameAr: 'المنيل',
    lat: 30.0300,
    lng: 31.2250,
    area: 'Manial',
    lines: ['Bus 24', 'Bus 85'],
    zone: 'cairo'
  },
];

export function findStop(query: string): TransitStop | null {
  const q = query.trim().toLowerCase();

  for (const stop of stops) {
    if (
      stop.id.toLowerCase() === q ||
      stop.name.toLowerCase().includes(q) ||
      stop.nameAr.toLowerCase().includes(q) ||
      stop.area.toLowerCase().includes(q) ||
      stop.nameAr.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))
    ) {
      return stop;
    }
  }

  // Try matching with aliases / common variations
  const aliasMap: Record<string, string> = {
    'التحرير': 'sadat',
    'tahrir': 'sadat',
    'رمسيس': 'shohadaa',
    'ramses': 'shohadaa',
    'محطة رمسيس': 'shohadaa',
    'ramses station': 'shohadaa',
    'العتبة': 'attaba',
    'ataba': 'attaba',
    'مصر الجديدة': 'heliopolis',
    'القاهرة الجديدة': 'new-cairo',
    'التجمع': 'tagamo3',
    'التجمع الخامس': 'tagamo3',
    'وسط البلد': 'downtown',
    'السادس من أكتوبر': 'sixth-october',
    'مدينة نصر': 'nasr-city',
    'الزمالك': 'zamalek',
    'المهندسين': 'mohandeseen',
    'المعادي': 'maadi',
    'الرحاب': 'rehab',
    'مدينتي': 'madinaty',
    'المقطم': 'mokattam',
    'الشروق': 'shorouk',
    'العبور': 'obour',
    'الشيخ زايد': 'sheikh-zayed',
    'فيصل': 'faisal',
    'الهرم': 'haram',
    'الجيزة': 'giza',
    'المنيل': 'manial',
    'الزمالك ماريوت': 'zamalek-marriott',
    'النزهة': 'nozha',
    'جامعة القاهرة': 'cairo-university',
    'عين شمس': 'ain-shams',
    'المطار': 'cairo-airport',
    'مطار القاهرة': 'cairo-airport',
    'حلوان': 'helwan',
    'دار السلام': 'dar-elsalam',
    'السيدة زينب': 'sayeda-zeinab',
    'دمرداش': 'demerdash',
    'العباسية': 'abbasiya',
    'المرج': 'el-marg',
    'المنيب': 'el-monib',
    'الدقي': 'dokki',
    'روض الفرج': 'rod-elfarag',
    'شبرا': 'shubra',
    'ماسبيرو': 'maspic',
    'باب الشعرية': 'bab-elshaaria',
    'منشية الصدر': 'manshiet-elsadr',
    'جاردن سيتي': 'garden-city',
    'حدائق القبة': 'hadayek-elkobba',
    'إمبابة': 'imbaba',
    'امبابة': 'imbaba',
    'المطرية': 'matareya',
    'بشتيل': 'bashteel',
    'السيدة عائشة': 'sayeda-aisha',
    'العجوزة': 'agouza',
    'الأقصر': 'luxor',
  };

  const aliasMatch = aliasMap[q];
  if (aliasMatch) {
    const stop = stops.find(s => s.id === aliasMatch);
    if (stop) return stop;
  }

  return null;
}

export function findStopsByArea(area: string): TransitStop[] {
  const q = area.toLowerCase();
  return stops.filter(
    s =>
      s.area.toLowerCase().includes(q) ||
      s.nameAr.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q)
  );
}
