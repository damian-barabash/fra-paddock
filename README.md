# Fastline Paddock Club

Super-premium, invitation-only club dla klientów Fastline. Landing (PL) z formularzem
zgłoszeń o członkostwo.

**Stack:** React + Vite + TypeScript, framer-motion, Supabase (backend zgłoszeń).
Estetyka: złoto na ciemnym tle, karbon z umiarem, Fraunces + Manrope.

## Rozwój lokalny

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # produkcja → dist/
npm run typecheck  # tsc --noEmit
```

## Backend (Supabase)

Formularz działa w dwóch trybach:

- **Bez kluczy** → fallback do `mailto:` (klub@fastlineracingacademy.pl). Nic się nie psuje.
- **Z kluczami** → zapis do tabeli `applications` w Supabase.

Skopiuj `.env.example` do `.env.local` i uzupełnij:

```
VITE_SUPABASE_URL=https://<projekt>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>
```

Schemat tabeli — patrz `supabase/schema.sql`.

## Deploy — GitHub Pages

Workflow `.github/workflows/deploy.yml` buduje i publikuje na Pages przy każdym push
do `main`.

1. Repo → **Settings → Pages → Source: GitHub Actions**.
2. Repo → **Settings → Secrets and variables → Actions** → dodaj `VITE_SUPABASE_URL`
   i `VITE_SUPABASE_ANON_KEY` (żeby build produkcyjny miał backend).
3. `git push origin main` — reszta dzieje się automatycznie.

`base` w Vite jest względny (`./`), więc działa i na ścieżce projektu GH Pages,
i na własnej domenie (np. `paddock.fastlineracingacademy.pl` — dodaj wtedy plik
`public/CNAME` z domeną).

## Assets

- `Logo.png` / `public/assets/logo.webp` — herb klubu (złoto na przezroczystym tle).
- `public/assets/car.webp` — render auta z góry (element dekoracyjny, rezerwa).
- `public/assets/og.png` — obrazek social (logo na ciemnym tle).
- `public/assets/meet-1.webp` / `meet-2.webp` / `hero-cars.webp` — zdjęcia ze zlotów
  (Maserati MC20 z logo klubu + supersamochody), użyte jako tła sekcji pod ciemnym
  gradientem. Wygenerowane ze zdjęć `20240*.jpg` (korekta EXIF + WebP).

> **Regulamin PDF**: przycisk „Pobierz Regulamin" jest zaślepką — wgraj plik do
> `public/regulamin.pdf` i podmień `href` w `src/components/Rules.tsx`.
