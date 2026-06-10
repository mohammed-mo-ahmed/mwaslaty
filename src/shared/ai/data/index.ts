import {stops} from './stops';
import {routes} from './routes';
import type {TransitStop, TransitRoute} from './stops';
import type {RouteOption} from '../types';
import {getSupabase} from '@/shared/supabase/client';

type DataSearchResult = {
  found: boolean;
  routes: RouteOption[];
  source: 'database' | 'osrm';
  text: string;
};

async function loadCustomRoutes(): Promise<TransitRoute[]> {
  try {
    const supabase = getSupabase();
    if (!supabase) return [];
    const {data} = await supabase.from('routes').select('*');
    if (!data) return [];
    return data.map((r: Record<string, unknown>) => ({
      id: r.id as string,
      fromId: r.from_id as string,
      toId: r.to_id as string,
      fromName: r.from_name as string,
      toName: r.to_name as string,
      duration: r.duration as string,
      cost: r.cost as string,
      type: r.type as TransitRoute['type'],
      lineName: r.line_name as string,
      transfers: r.transfers as number,
      steps: r.steps as Array<{instruction: string; type: string; duration: string}>,
    }));
  } catch {}
  return [];
}

async function loadCustomStops(): Promise<TransitStop[]> {
  try {
    const supabase = getSupabase();
    if (!supabase) return [];
    const {data} = await supabase.from('stops').select('*');
    if (!data) return [];
    return data.map((s: Record<string, unknown>) => ({
      id: s.id as string,
      name: s.name as string,
      nameAr: s.name_ar as string,
      lat: s.lat as number,
      lng: s.lng as number,
      area: s.area as string,
      lines: s.lines as string[],
      zone: s.zone as TransitStop['zone'],
    }));
  } catch {}
  return [];
}

function routeToRouteOption(r: TransitRoute): RouteOption {
  return {
    id: r.id,
    duration: r.duration,
    cost: r.cost,
    transfers: r.transfers,
    modes: r.type === 'multi' ? ['walk', 'metro', 'bus'] : ['walk', r.type],
    steps: r.steps.map(s => ({
      instruction: s.instruction,
      duration: s.duration,
      icon: s.type,
    })),
  };
}

export async function searchLocalDatabase(
  originQuery: string,
  destinationQuery: string
): Promise<DataSearchResult> {
  const allStops = [...stops, ...(await loadCustomStops())];
  const allRoutes = [...routes, ...(await loadCustomRoutes())];

  const originStop = findStopInList(allStops, originQuery);
  const destStop = findStopInList(allStops, destinationQuery);

  if (!originStop && !destStop) {
    return {
      found: false,
      routes: [],
      source: 'osrm',
      text: `لم أتعرف على المنطقتين "${originQuery}" و "${destinationQuery}". بس هحاول أوصلك عبر الخريطة العامة.`,
    };
  }

  if (!originStop) {
    return {
      found: false,
      routes: [],
      source: 'osrm',
      text: `مش معروف عندي اسم "${originQuery}". هحاول أوصلك من "${destinationQuery}" عبر الخريطة العامة.`,
    };
  }

  if (!destStop) {
    return {
      found: false,
      routes: [],
      source: 'osrm',
      text: `مش معروف عندي اسم "${destinationQuery}". هحاول أوصلك من "${originQuery}" عبر الخريطة العامة.`,
    };
  }

  const matchedRoutes: TransitRoute[] = allRoutes.filter(
    r =>
      (r.fromId === originStop.id && r.toId === destStop.id) ||
      (r.fromId === destStop.id && r.toId === originStop.id)
  );

  if (matchedRoutes.length === 0) {
    return {
      found: false,
      routes: [],
      source: 'osrm',
      text: `عندي محطة "${originStop.nameAr}" و "${destStop.nameAr}" في قاعدة البيانات، لكن مفيش طريق مسجل بينهم مباشرة. هحاول أوصلك من "${originStop.nameAr}" ل "${destStop.nameAr}" عبر الخريطة العامة.`,
    };
  }

  const originName = originStop.nameAr;
  const destName = destStop.nameAr;

  if (matchedRoutes.length === 1) {
    const r = matchedRoutes[0];
    return {
      found: true,
      routes: [routeToRouteOption(r)],
      source: 'database',
      text: `لقيت طريق من ${originName} إلى ${destName}:\n• ${r.lineName}\n• المدة: ${r.duration}\n• التكلفة: ${r.cost}\n• عدد المحطات/التحويلات: ${r.transfers}`,
    };
  }

  return {
    found: true,
    routes: matchedRoutes.map(routeToRouteOption),
    source: 'database',
    text: `لقيت ${matchedRoutes.length} طرق من ${originName} إلى ${destName}:`,
  };
}

function findStopInList(stopList: TransitStop[], query: string): TransitStop | null {
  const q = query.trim().toLowerCase();

  for (const stop of stopList) {
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
  };

  const aliasMatch = aliasMap[q];
  if (aliasMatch) {
    return stopList.find(s => s.id === aliasMatch) ?? null;
  }

  return null;
}
