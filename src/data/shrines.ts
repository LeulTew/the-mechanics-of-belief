// Relic shrines placed along the sanctuary. Positions are world units (CSS y-down);
// each one stands on a carved altar the raymarcher builds at (x, -y, z).

export interface Shrine {
  x: number
  y: number
  z: number
  rotY: number
  src: string
  alt: string
}

const base = import.meta.env.BASE_URL

export const SHRINES: Shrine[] = [
  { x: 210, y: 10, z: -400, rotY: -16, src: `${base}relics/relic-1.webp`, alt: 'Carved stone archway with Ethiopian crosses' },
  { x: -205, y: 15, z: -1350, rotY: 18, src: `${base}relics/relic-2.webp`, alt: 'Kebero drum, meqwamiya prayer staff and tsenatsel sistrum' },
  { x: 205, y: 65, z: -2300, rotY: -16, src: `${base}relics/relic-3.webp`, alt: 'Rock-hewn niche holding a single lit candle' },
  { x: -205, y: 25, z: -3250, rotY: 18, src: `${base}relics/relic-4.webp`, alt: 'Open illuminated Ge’ez manuscript on a carved stand' },
  { x: 0, y: 15, z: -4200, rotY: 0, src: `${base}relics/relic-5.webp`, alt: 'Hermit monk holding a hand cross' },
  { x: 205, y: 10, z: -5150, rotY: -18, src: `${base}relics/relic-6.webp`, alt: 'Bronze censer with hand cross finial' },
  { x: -205, y: 25, z: -6100, rotY: 18, src: `${base}relics/relic-7.webp`, alt: 'Scales, a Ge’ez scroll and an hourglass' },
  { x: 0, y: 10, z: -7100, rotY: 0, src: `${base}relics/relic-8.webp`, alt: 'Ornate Ethiopian processional cross' }
]
