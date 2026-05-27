import React from 'react';

/**
 * Logo Maya Yamamoto RPG
 *
 * Props:
 *  - height: altura em px (default 60)
 *  - showBackground: se true, mostra o fundo azul petróleo da logo; se false, fundo transparente
 *  - variant: 'full' (padrão) | 'icon' (só a parte de cima "maya")
 *
 * Uso:
 *   <Logo height={48} />
 *   <Logo height={80} showBackground />
 *   <Logo height={40} variant="icon" />
 */
export default function Logo({ height = 60, showBackground = false, variant = 'full' }) {
  // proporção original: 1280 x 480  (~ 2.67:1)
  // se for variant='icon', só a parte de cima: 1280 x 280 (~ 4.57:1)
  const isIcon = variant === 'icon';
  const viewBox = isIcon ? '0 0 1280 280' : '0 0 1280 480';
  const aspect = isIcon ? 1280 / 280 : 1280 / 480;
  const width = height * aspect;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={height}
      style={{ display: 'block' }}
      aria-label="Maya Yamamoto RPG"
      role="img"
    >
      {showBackground && <rect width="1280" height={isIcon ? 280 : 480} fill="#0E5A7C" />}

      {/* MAYA — formas geométricas */}
      <g stroke="#FFFFFF" strokeWidth="44" fill="none" strokeLinecap="butt">
        {/* m — duas meias-luas */}
        <path d="M 130 260 L 130 200 A 65 65 0 0 1 260 200 L 260 260" />
        <path d="M 260 260 L 260 200 A 65 65 0 0 1 390 200 L 390 260" />
        {/* a (primeira) */}
        <path d="M 455 260 L 455 200 A 65 65 0 0 1 585 200 L 585 260" />
        {/* y */}
        <path d="M 655 140 L 720 220" />
        <path d="M 785 140 L 720 220" />
        <path d="M 720 220 L 720 290" />
        {/* a (segunda) */}
        <path d="M 855 260 L 855 200 A 65 65 0 0 1 985 200 L 985 260" />
      </g>

      {!isIcon && (
        <>
          {/* yamamoto (branco) */}
          <text
            x="130"
            y="345"
            fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
            fontSize="62"
            fontWeight="400"
            letterSpacing="-1"
            fill="#FFFFFF"
          >
            yamamoto
          </text>

          {/* rpg (bege) */}
          <text
            x="855"
            y="345"
            fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
            fontSize="62"
            fontWeight="400"
            letterSpacing="-1"
            fill="#E8DCC8"
          >
            rpg
          </text>
        </>
      )}
    </svg>
  );
}
