// Ambient gold orbs drifting behind the page at different speeds — global parallax depth.
const orbs = [
  { cls: 'orb orb-1', speed: 0.18, style: { top: '8%', left: '-6%' } },
  { cls: 'orb orb-2', speed: 0.34, style: { top: '26%', right: '-8%' } },
  { cls: 'orb orb-3', speed: 0.12, style: { top: '52%', left: '10%' } },
  { cls: 'orb orb-4', speed: 0.42, style: { top: '70%', right: '4%' } },
  { cls: 'orb orb-5', speed: 0.24, style: { top: '88%', left: '-4%' } },
]

export default function ParallaxField() {
  return (
    <div className="parallax-field" aria-hidden="true">
      {orbs.map((o, i) => (
        <span
          key={i}
          className={o.cls}
          data-parallax={o.speed}
          data-parallax-fixed=""
          style={o.style}
        />
      ))}
    </div>
  )
}
