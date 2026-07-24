// Fastline Paddock Club — treść (PL). Źródło prawdy dla sekcji strony.

export const tiers = [
  {
    key: 'club',
    name: 'Paddock Club',
    price: '299 zł',
    period: '/ rok',
    invite: false,
    tagline: 'Wejście do świata Klubu',
    desc:
      'Podstawowy poziom członkostwa, otwierający dostęp do społeczności Klubu oraz dedykowanych przywilejów i preferencyjnych warunków uczestnictwa.',
    features: [
      'Członkostwo w społeczności Fastline',
      'Preferencyjne warunki uczestnictwa',
      'Dedykowane szkolenia klubowe',
      'Oferty Partnerów Klubu',
      'Wcześniejsza informacja o nowych projektach',
    ],
  },
  {
    key: 'vip',
    name: 'Paddock Club VIP',
    price: '599 zł',
    period: '/ rok',
    invite: false,
    featured: true,
    tagline: 'Dla najbardziej zaangażowanych',
    desc:
      'Rozszerzony poziom członkostwa: szerszy zakres przywilejów, dostęp do limitowanych projektów, zamkniętych wydarzeń klubowych i dodatkowych benefitów.',
    features: [
      'Wszystkie przywileje poziomu Club',
      'Rozszerzone warunki uczestnictwa',
      'Priorytet rezerwacji miejsc',
      'Zamknięte wydarzenia klubowe',
      'Coroczna kolekcja Fastline Paddock Club',
      'Indywidualne zaproszenia na wybrane wydarzenia',
    ],
  },
  {
    key: 'ambassador',
    name: 'Paddock Club Ambassador',
    price: 'Na zaproszenie',
    period: '',
    invite: true,
    tagline: 'Najwyższy status honorowy',
    desc:
      'Najbardziej prestiżowy status, przyznawany wyłącznie na zaproszenie. Wyróżnienie dla osób, które w wyjątkowy sposób współtworzą świat Fastline.',
    features: [
      'Indywidualnie przygotowane przywileje',
      'Najwyższy poziom dostępu do projektów Fastline',
      'Zaproszenia na wydarzenia Partnerów Klubu',
      'Współtworzenie wybranych projektów Fastline',
      'Unikalne doświadczenia tworzone dla Ambasadorów',
    ],
  },
] as const

export const pathSteps = [
  {
    stage: 'Pierwsze doświadczenie',
    desc: 'Pierwsze szkolenie, wydarzenie lub wyjazd z Fastline Racing Academy.',
  },
  {
    stage: 'Członkostwo',
    desc: 'Dołączenie do Fastline Paddock Club i dostęp do świata oraz przywilejów Klubu.',
  },
  {
    stage: 'Zaangażowanie',
    desc: 'Regularny udział w wydarzeniach i projektach oraz budowanie relacji w społeczności.',
  },
  {
    stage: 'Status VIP',
    desc: 'Rozszerzony poziom członkostwa dla najbardziej zaangażowanych Członków Klubu.',
  },
  {
    stage: 'Ambassador',
    desc: 'Honorowy status przyznawany wyłącznie na zaproszenie osobom współtworzącym świat Fastline.',
  },
] as const

export const pillars = [
  {
    title: 'Wartość relacji',
    desc:
      'Klub buduje długofalowe relacje z Członkami. Wraz z aktywnym uczestnictwem rośnie wartość członkostwa — coraz bardziej preferencyjne warunki i szerszy zakres przywilejów.',
  },
  {
    title: 'Doświadczenia dla Członków',
    desc:
      'Kameralne szkolenia, zamknięte spotkania i limitowane inicjatywy tworzone wyłącznie z myślą o społeczności Klubu — pozwalają rozwijać pasję w gronie osób o wspólnych wartościach.',
  },
  {
    title: 'Starannie dobrani Partnerzy',
    desc:
      'Współpracujemy z markami reprezentującymi najwyższe standardy jakości. Członkowie korzystają z dedykowanych przywilejów i preferencyjnych warunków przygotowanych wyłącznie dla Klubu.',
  },
  {
    title: 'Społeczność oparta na pasji',
    desc:
      'Największą wartością Klubu są jego Członkowie. Zamknięte wydarzenia i wspólne aktywności sprzyjają budowaniu autentycznych relacji, które wykraczają poza świat motoryzacji.',
  },
] as const

// Zakres członkostwa — macierz porównawcza
export const comparison = {
  cols: ['Club', 'VIP', 'Ambassador'],
  rows: [
    ['Członkostwo w społeczności Fastline', '✓', '✓', '✓'],
    ['Preferencyjne warunki uczestnictwa', '✓', 'Rozszerzone', 'Dedykowane'],
    ['Oferty Partnerów Klubu', '✓', 'Rozszerzone', 'Personalizowane'],
    ['Dedykowane szkolenia dla Członków', '✓', '✓', '✓'],
    ['Zamknięte wydarzenia klubowe', '—', '✓', '✓'],
    ['Coroczna kolekcja Fastline Paddock Club', '—', '✓', '✓'],
    ['Indywidualne zaproszenia na wybrane wydarzenia', '—', '✓', '✓'],
    ['Zaproszenia na wydarzenia Partnerów Klubu', '—', '—', '✓'],
    ['Współtworzenie wybranych projektów Fastline', '—', '—', '✓'],
    ['Status przyznawany wyłącznie na zaproszenie', '—', '—', '✓'],
  ],
} as const

export const statusPoints = [
  ['Dołączenie do Fastline Paddock Club', '100 pkt'],
  ['Korzystanie z oferty Fastline Racing Academy*', '1 pkt / 100 zł'],
  ['Udział w szkoleniu', '100 pkt'],
  ['Udział w wydarzeniu klubowym', '50 pkt'],
  ['Udział w wyjeździe Fastline', '250 pkt'],
  ['Polecenie nowego Członka*', '200 pkt'],
] as const

export const balance = [
  ['5 000 zł', '500 zł', '299 zł', '+201 zł'],
  ['10 000 zł', '1 000 zł', '299 zł', '+701 zł'],
  ['20 000 zł', '2 000 zł', '299 zł', '+1 701 zł'],
  ['30 000 zł', '3 000 zł', '299 zł', '+2 701 zł'],
  ['50 000 zł', '5 000 zł', '299 zł', '+4 701 zł'],
] as const

export const rules = [
  'Członkostwo przyznawane jest na okres 12 miesięcy od dnia jego aktywacji.',
  'Korzystanie z przywilejów Klubu wymaga aktywnego członkostwa oraz opłaconej składki rocznej.',
  'Zakres przywilejów uzależniony jest od statusu członkostwa oraz poziomu zaangażowania w świat Fastline.',
  'Status VIP przyznawany jest zgodnie z zasadami programu członkowskiego.',
  'Status Ambassador stanowi honorowe wyróżnienie i przyznawany jest wyłącznie na zaproszenie.',
  'Punkty Zaangażowania naliczane są zgodnie z obowiązującymi zasadami programu.',
  'Przywileje członkowskie mają charakter osobisty i nie podlegają przeniesieniu na osoby trzecie.',
  'Partnerzy Klubu oraz zakres przywilejów mogą ulegać zmianom przy zachowaniu standardu oferowanych korzyści.',
  'Fastline zastrzega sobie prawo do aktualizacji zasad Klubu zgodnie z postanowieniami Regulaminu.',
] as const
