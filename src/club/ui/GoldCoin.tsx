import { useId } from 'react'

/**
 * Golden Liters coin — minted gold with a reeded edge, engraved legend on the rim
 * and the club's fuel-drop seal in the centre. Pure SVG, scales from chip to hero size.
 */
export default function GoldCoin({ size = 48, shine = true, className = '' }: { size?: number; shine?: boolean; className?: string }) {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${n}-${id}`
  return (
    <span className={`gold-coin${shine ? ' gold-coin--shine' : ''} ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label="Golden Liters">
        <defs>
          <linearGradient id={g('rim')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6e7bf" />
            <stop offset="0.28" stopColor="#c9a35a" />
            <stop offset="0.55" stopColor="#8a6a30" />
            <stop offset="0.78" stopColor="#e2c27f" />
            <stop offset="1" stopColor="#7a5c27" />
          </linearGradient>
          <radialGradient id={g('face')} cx="0.38" cy="0.32" r="0.8">
            <stop offset="0" stopColor="#fbf0cf" />
            <stop offset="0.35" stopColor="#e3c27c" />
            <stop offset="0.7" stopColor="#b58c45" />
            <stop offset="1" stopColor="#7d5f2b" />
          </radialGradient>
          <linearGradient id={g('inset')} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#6e5222" />
            <stop offset="0.5" stopColor="#a8823f" />
            <stop offset="1" stopColor="#f0dba4" />
          </linearGradient>
          <linearGradient id={g('drop')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff6dc" />
            <stop offset="0.5" stopColor="#d9b56c" />
            <stop offset="1" stopColor="#8f6d31" />
          </linearGradient>
          <path id={g('arc')} d="M100 100 m-68 0 a68 68 0 1 1 136 0 a68 68 0 1 1 -136 0" />
        </defs>

        {/* body + reeded edge */}
        <circle cx="100" cy="100" r="98" fill={`url(#${g('rim')})`} />
        <circle cx="100" cy="100" r="93" fill="none" stroke="#5c441b" strokeOpacity="0.55" strokeWidth="6" strokeDasharray="1.6 2.2" />
        <circle cx="100" cy="100" r="89" fill={`url(#${g('face')})`} />
        <circle cx="100" cy="100" r="89" fill="none" stroke="#fff3cf" strokeOpacity="0.55" strokeWidth="0.8" />

        {/* engraved legend */}
        <circle cx="100" cy="100" r="80" fill="none" stroke={`url(#${g('inset')})`} strokeWidth="1.2" />
        <circle cx="100" cy="100" r="56" fill="none" stroke={`url(#${g('inset')})`} strokeWidth="1.2" />
        <text fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="11.5" letterSpacing="3.1" fill="#5d4419" fillOpacity="0.85">
          <textPath href={`#${g('arc')}`} startOffset="0">GOLDEN LITERS · FASTLINE PADDOCK CLUB ·</textPath>
        </text>

        {/* seal: fuel drop with laurel ticks */}
        <circle cx="100" cy="100" r="54" fill="#6b5020" fillOpacity="0.16" />
        <path
          d="M100 58c12 16 26 30 26 46a26 26 0 0 1-52 0c0-16 14-30 26-46z"
          fill={`url(#${g('drop')})`}
          stroke="#6a4f1e"
          strokeOpacity="0.6"
          strokeWidth="1.2"
        />
        <path d="M88 99c-3 8 0 18 9 22" fill="none" stroke="#fffbe9" strokeOpacity="0.75" strokeWidth="3" strokeLinecap="round" />
        <text x="100" y="117" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontWeight="500" fontSize="25" fill="#4e3a14">
          GL
        </text>
        {[-1, 1].map((s) =>
          [0, 1, 2, 3].map((i) => (
            <ellipse
              key={`${s}${i}`}
              cx={100 + s * (36 + i * 2.6)}
              cy={128 - i * 13}
              rx="2.4"
              ry="5.6"
              transform={`rotate(${s * (28 - i * 9)} ${100 + s * (36 + i * 2.6)} ${128 - i * 13})`}
              fill="#6b5020"
              fillOpacity="0.55"
            />
          )),
        )}
      </svg>
    </span>
  )
}
