// Fastline Paddock Club — treść (PL). Teksty dosłownie z briefu klienta.

export const copy = {
  heroTitle: 'Wspólna pasja jest początkiem każdej relacji.',
  heroSub: 'Fastline Paddock Club powstał, by tworzyć wokół niej wyjątkowe doświadczenia.',

  about: [
    'Fastline Paddock Club to prywatny klub stworzony dla osób, które łączy pasja do sportowych samochodów oraz wyjątkowego stylu życia, jaki im towarzyszy.',
    'Powstał z myślą o tych, którzy od motoryzacji oczekują czegoś więcej niż samych emocji za kierownicą. To miejsce, w którym wspólna pasja staje się początkiem wartościowych relacji, inspirujących podróży i wyjątkowych doświadczeń tworzonych wyłącznie dla Członków Klubu.',
    'Członkostwo otwiera dostęp do starannie przygotowanych przywilejów, w tym preferencyjnych warunków korzystania z oferty Fastline oraz Partnerów Klubu. To także możliwość uczestnictwa w inicjatywach tworzonych z myślą o wspólnym rozwijaniu pasji, zdobywaniu nowych doświadczeń i budowaniu trwałych relacji.',
    'Członków Fastline Paddock Club wyróżnia chęć ciągłego rozwoju, otwartość na nowe doświadczenia oraz przekonanie, że pasja nabiera prawdziwej wartości, gdy można dzielić ją z innymi.',
  ],

  ecoTitle: 'Świat doświadczeń Fastline',
  eco: [
    'Fastline Paddock Club to klub członkowski Fastline Racing Academy, który łączy wszystkie projekty, wydarzenia i aktywności realizowane przez markę. Dzięki temu członkostwo staje się naturalnym elementem całego ekosystemu Fastline, a nie wyłącznie dodatkiem do pojedynczych produktów czy usług.',
    'Świat Fastline został stworzony tak, aby każdy kolejny wyjazd, trening czy projekt wzmacniał wartość członkostwa, otwierając przed Członkami Klubu dostęp do projektów, wydarzeń i przywilejów niedostępnych dla osób spoza Klubu.',
  ],

  tiersTitle: 'Poziomy członkostwa',
  tiersLead:
    'Fastline Paddock Club oferuje trzy poziomy członkostwa, odzwierciedlające poziom zaangażowania w świat Fastline Racing Academy. Każdy kolejny poziom rozszerza zakres dostępnych przywilejów, zapewniając dostęp do nowych doświadczeń, projektów i możliwości.',
  modelTitle: 'Model członkostwa',
  model:
    'Fastline Paddock Club funkcjonuje w oparciu o model hybrydowy, który łączy roczne członkostwo z aktywnym uczestnictwem w świecie Fastline. Dzięki temu każdy Członek ma możliwość stopniowego rozszerzania zakresu swoich przywilejów poprzez udział w szkoleniach, wyjazdach i wydarzeniach organizowanych przez Fastline Racing Academy.',

  pathTitle: 'Ścieżka członkostwa',
  pathLead:
    'Członkostwo w Fastline Paddock Club rozwija się wraz z aktywnością w świecie Fastline. Regularny udział w szkoleniach, wyjazdach, wydarzeniach i projektach organizowanych przez Fastline Racing Academy otwiera dostęp do kolejnych poziomów członkostwa oraz coraz szerszego zakresu przywilejów.',
  pathNote:
    'Status Fastline Paddock Club Ambassador stanowi odrębną kategorię członkostwa i przyznawany jest wyłącznie na zaproszenie.',

  pillarsTitle: 'Przywileje członkostwa',
  zakresTitle: 'Zakres członkostwa',

  statusTitle: 'Status Points',
  statusLead: [
    'Aktywność Członków Klubu nagradzana jest Punktami Aktywności. Przyznawane są one za uczestnictwo w szkoleniach, wyjazdach i wydarzeniach organizowanych przez Fastline, korzystanie z oferty marki oraz rekomendowanie Klubu nowym Członkom.',
    'Punkty odzwierciedlają poziom zaangażowania w świat Fastline i stanowią jeden z elementów branych pod uwagę przy rozwoju członkostwa oraz przyznawaniu dodatkowych przywilejów.',
  ],
  balanceNote:
    '*Symulacja ma charakter poglądowy i została przygotowana przy założeniu średniej wartości preferencyjnych warunków na poziomie 10%. Rzeczywisty zakres korzyści zależy od aktywności Członka oraz wykorzystania dostępnych przywilejów.',

  standardsTitle: 'Standardy Klubu',
  standardsQuote:
    'Wierzymy, że prawdziwy prestiż nie wynika wyłącznie z samochodów, lecz przede wszystkim z ludzi, którzy zasiadają za ich kierownicą.',
  standards: [
    'Fastline Paddock Club został zbudowany na wartościach, które definiują jego wyjątkowy charakter. Członkowie tworzą społeczność opartą na wzajemnym szacunku, dyskrecji oraz kulturze współpracy.',
    'Każde wydarzenie organizowane przez Fastline powinno pozostawiać po sobie nie tylko wyjątkowe wspomnienia, ale również poczucie przynależności do społeczności reprezentującej najwyższe standardy.',
  ],

  partnersTitle: 'Partnerzy Klubu',
  partners: [
    'Fastline Paddock Club zaprasza do współpracy Partnerów, którzy chcą stać się częścią świata Fastline i wspólnie tworzyć wyjątkowe doświadczenia dla Członków Klubu. Współpraca opiera się na wspólnych wartościach, najwyższej jakości oraz długofalowych relacjach, tworząc wartość zarówno dla Członków Klubu, jak i Partnerów.',
    'Obecność w Fastline Paddock Club to szansa na budowanie długofalowych relacji z wymagającą grupą klientów premium, aktywne uczestnictwo w wyjątkowych projektach oraz naturalną obecność marki w świecie opartym na pasji, zaufaniu i jakości.',
  ],

  zasadyTitle: 'Zasady członkostwa',
  zasadyLead:
    'Fastline Paddock Club funkcjonuje w oparciu o przejrzyste zasady, których celem jest budowanie zaangażowanej społeczności oraz zapewnienie najwyższej jakości doświadczeń wszystkim Członkom Klubu.',
  regulamin:
    'Szczegółowe zasady członkostwa, naliczania Punktów Zaangażowania, przyznawania statusów, korzystania z przywilejów oraz prawa i obowiązki Członków określa Regulamin Fastline Paddock Club, dostępny poniżej.',
} as const

export const tiers = [
  {
    key: 'club',
    name: 'Fastline Paddock Club',
    price: '299 zł',
    period: '/ rok',
    invite: false,
    tagline: 'Poziom podstawowy',
    desc:
      'Podstawowy poziom członkostwa, otwierający dostęp do społeczności Klubu oraz dedykowanych przywilejów. Członkowie korzystają z preferencyjnych warunków uczestnictwa w aktywnościach Fastline Racing Academy oraz benefitów przygotowanych wspólnie z Partnerami Klubu.',
    features: [
      'Członkostwo w społeczności Fastline',
      'Preferencyjne warunki uczestnictwa',
      'Dostęp do dedykowanych szkoleń klubowych',
      'Oferty Partnerów Klubu',
      'Wcześniejsza informacja o nowych projektach',
    ],
  },
  {
    key: 'vip',
    name: 'Fastline Paddock Club VIP',
    price: '599 zł',
    period: '/ rok',
    invite: false,
    featured: true,
    tagline: 'Poziom rozszerzony',
    desc:
      'Rozszerzony poziom członkostwa przeznaczony dla osób aktywnie uczestniczących w życiu Fastline. Status VIP zapewnia szerszy zakres przywilejów, dostęp do limitowanych projektów, zamkniętych wydarzeń klubowych oraz dodatkowych benefitów przygotowanych z myślą o najbardziej zaangażowanych Członkach.',
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
    name: 'Fastline Paddock Club Ambassador',
    price: 'Na zaproszenie',
    period: '',
    invite: true,
    tagline: 'Status honorowy',
    desc:
      'Najwyższy i najbardziej prestiżowy status członkostwa, przyznawany wyłącznie na zaproszenie. Jest wyróżnieniem dla osób, które w wyjątkowy sposób identyfikują się z wartościami Fastline, aktywnie uczestniczą w życiu Klubu i wspierają jego rozwój.',
    features: [
      'Indywidualnie przygotowane przywileje',
      'Najwyższy poziom dostępu do projektów Fastline',
      'Zaproszenia na wydarzenia Partnerów Klubu',
      'Możliwość współtworzenia wybranych projektów Fastline',
      'Status przyznawany wyłącznie na zaproszenie',
    ],
  },
] as const

export const pathSteps = [
  { stage: 'Pierwsze doświadczenie', desc: 'Pierwsze szkolenie, wydarzenie lub wyjazd z Fastline Racing Academy.' },
  { stage: 'Członkostwo', desc: 'Dołączenie do Fastline Paddock Club i dostęp do świata oraz przywilejów Klubu.' },
  { stage: 'Zaangażowanie', desc: 'Regularny udział w wydarzeniach, szkoleniach i projektach Fastline oraz budowanie relacji w społeczności.' },
  { stage: 'Status VIP', desc: 'Rozszerzony poziom członkostwa dla najbardziej zaangażowanych Członków Klubu.' },
  { stage: 'Ambassador', desc: 'Honorowy status członkostwa przyznawany wyłącznie na zaproszenie osobom, które aktywnie współtworzą świat Fastline i reprezentują wartości Klubu.' },
] as const

// Przywileje członkostwa — 4 filary, teksty dosłowne
export const pillars = [
  {
    title: 'Wartość relacji',
    desc:
      'Fastline Paddock Club został stworzony z myślą o budowaniu długofalowych relacji z Członkami. Wraz z aktywnym uczestnictwem w szkoleniach, wyjazdach i wydarzeniach organizowanych przez Fastline rośnie wartość członkostwa, zapewniając coraz bardziej preferencyjne warunki uczestnictwa, rozszerzony zakres przywilejów oraz dostęp do doświadczeń zarezerwowanych dla najwyższych poziomów członkostwa.',
  },
  {
    title: 'Doświadczenia zarezerwowane dla Członków',
    desc:
      'Fastline Paddock Club zapewnia dostęp do starannie wyselekcjonowanych wydarzeń i aktywności tworzonych wyłącznie z myślą o społeczności Klubu. Kameralne szkolenia, zamknięte spotkania oraz limitowane inicjatywy pozwalają rozwijać pasję w gronie osób, które łączy miłość do sportowych samochodów oraz wspólne wartości.',
  },
  {
    title: 'Starannie dobrani Partnerzy',
    desc:
      'Fastline Paddock Club współpracuje z markami, które reprezentują najwyższe standardy jakości i naturalnie uzupełniają świat Fastline. Dzięki temu Członkowie korzystają z dedykowanych przywilejów, preferencyjnych warunków oraz wyjątkowych doświadczeń przygotowanych wyłącznie dla społeczności Klubu.',
  },
  {
    title: 'Społeczność oparta na wspólnej pasji',
    desc:
      'Największą wartością Fastline Paddock Club są jego Członkowie. Klub tworzy kameralną społeczność osób, które łączy pasja do sportowych samochodów oraz chęć dzielenia się wyjątkowymi doświadczeniami. Zamknięte wydarzenia i wspólne aktywności sprzyjają budowaniu autentycznych relacji, inspirujących znajomości i więzi, które wykraczają poza świat motoryzacji.',
  },
] as const

// Zakres członkostwa — macierz porównawcza (dosłownie)
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
    ['Możliwość współtworzenia wybranych projektów Fastline', '—', '—', '✓'],
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

// Zasady członkostwa — „Najważniejsze informacje" (dosłownie)
export const rules = [
  'Członkostwo przyznawane jest na okres 12 miesięcy od dnia jego aktywacji.',
  'Korzystanie z przywilejów Klubu wymaga aktywnego członkostwa oraz opłaconej składki rocznej.',
  'Zakres przywilejów uzależniony jest od statusu członkostwa oraz poziomu zaangażowania w świat Fastline.',
  'Status Fastline Paddock VIP Club przyznawany jest zgodnie z zasadami programu członkowskiego.',
  'Status Fastline Paddock Club Ambassador stanowi honorowe wyróżnienie i przyznawany jest wyłącznie na zaproszenie.',
  'Punkty Zaangażowania naliczane są zgodnie z obowiązującymi zasadami programu i stanowią jeden z elementów rozwoju członkostwa.',
  'Przywileje członkowskie mają charakter osobisty i nie podlegają przeniesieniu na osoby trzecie.',
  'Partnerzy Klubu oraz zakres oferowanych przywilejów mogą ulegać zmianom w trakcie obowiązywania członkostwa przy zachowaniu standardu i charakteru oferowanych korzyści.',
  'Fastline zastrzega sobie prawo do aktualizacji zasad funkcjonowania Klubu, katalogu przywilejów oraz programu członkowskiego zgodnie z postanowieniami Regulaminu.',
] as const
