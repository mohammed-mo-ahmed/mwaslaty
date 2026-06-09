export type Stop = {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr?: string;
  connections: string[];
  imageUrl: string;
  routes: number;
  isMetroStation: boolean;
  facilities: string[];
};

export const stops: Stop[] = [
  {
    id: 'ramses',
    name: 'Ramses Station',
    nameAr: 'محطة رمسيس',
    description: 'Major railway and metro hub connecting Cairo with the rest of Egypt.',
    descriptionAr: 'محطة قطارات ومترو رئيسية تربط القاهرة ببقية مصر.',
    connections: ['Metro Line 2', 'National Railway', '50+ Bus Lines'],
    imageUrl: 'https://images.pexels.com/photos/2935687/pexels-photo-2935687.jpeg',
    routes: 75,
    isMetroStation: true,
    facilities: ['ATM', 'Restaurants', 'Waiting Areas', 'Ticket Office', 'Parking']
  },
  {
    id: 'tahrir',
    name: 'Tahrir Square',
    nameAr: 'ميدان التحرير',
    description: 'Historic central square with extensive bus and microbus networks.',
    descriptionAr: 'ميدان تاريخي مركزي مع شبكات واسعة من الأتوبيسات والميكروباصات.',
    connections: ['Metro Line 2', '30+ Bus Lines', '20+ Microbus Lines'],
    imageUrl: 'https://images.pexels.com/photos/2363807/pexels-photo-2363807.jpeg',
    routes: 65,
    isMetroStation: true,
    facilities: ['Metro Access', 'Restaurants', 'Tourist Information']
  },
  {
    id: 'aboud',
    name: 'Aboud',
    nameAr: 'عبود',
    description: 'Key transportation junction connecting Cairo to northern and western regions.',
    descriptionAr: 'تقاطع مواصلات رئيسي يربط القاهرة بالمناطق الشمالية والغربية.',
    connections: ['15+ Bus Lines', '25+ Microbus Lines'],
    imageUrl: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg',
    routes: 45,
    isMetroStation: false,
    facilities: ['Ticket Office', 'Waiting Areas', 'Food Kiosks']
  },
  {
    id: 'el-monib',
    name: 'El-Monib',
    nameAr: 'المنيب',
    description: 'Southern terminus of Metro Line 2 with extensive Giza connections.',
    descriptionAr: 'المحطة الجنوبية للخط الثاني للمترو مع اتصالات واسعة بالجيزة.',
    connections: ['Metro Line 2', '20+ Bus Lines', '15+ Microbus Lines'],
    imageUrl: 'https://images.pexels.com/photos/2363807/pexels-photo-2363807.jpeg',
    routes: 55,
    isMetroStation: true,
    facilities: ['Metro Access', 'Parking', 'Waiting Areas']
  }
];
