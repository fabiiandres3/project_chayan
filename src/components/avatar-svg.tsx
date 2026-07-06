import { useMemo } from "react";

export type AvatarConfig = {
  skin?: string;
  hair?: string;
  hairColor?: string;
  eyes?: string;
  outfit?: string;
  outfitColor?: string;
  accessory?: string;
  mood?: "happy" | "calm" | "excited" | "thinking";
};

export const AVATAR_OPTIONS = {
  skin: ["#F5D6BA", "#EAC199", "#D9A574", "#B67F4F", "#8A5A3B", "#5C3A22"],
  hair: ["short", "long", "curly", "ponytail", "buns", "bald"],
  hairColor: ["#2C1810", "#5C3A22", "#B67F4F", "#E8B860", "#C97A9A", "#7A9AC9", "#9A7AC9"],
  eyes: ["normal", "happy", "wink", "sparkle"],
  outfit: ["hoodie", "tee", "jacket", "dress"],
  outfitColor: ["#8FB4E8", "#F3B4C6", "#B0DFC9", "#C7B4EA", "#F5D488", "#F19B84"],
  accessory: ["none", "glasses", "cap", "headphones", "earrings"],
} as const;

export function AvatarSVG({ config, size = 160 }: { config: AvatarConfig; size?: number }) {
  const c = useMemo(() => ({
    skin: config.skin ?? AVATAR_OPTIONS.skin[1],
    hair: config.hair ?? "short",
    hairColor: config.hairColor ?? AVATAR_OPTIONS.hairColor[0],
    eyes: config.eyes ?? "normal",
    outfit: config.outfit ?? "hoodie",
    outfitColor: config.outfitColor ?? AVATAR_OPTIONS.outfitColor[0],
    accessory: config.accessory ?? "none",
    mood: config.mood ?? "happy",
  }), [config]);

  // Contorno negro limpio y estilizado para estética Anime/Kawaii moderna
  const strokeProps = {
    stroke: "#1A1A1A",
    strokeWidth: "3",
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };

  return (
    <svg 
      viewBox="10 10 180 270" 
      width={size} 
      height={size} 
      className="drop-shadow-sm w-full h-full object-contain block"
    >
      <rect x="10" y="10" width="180" height="270" fill="none" />

      {/* DETRÁS DEL CUERPO: Cabello Largo Trasero Extendido */}
      {c.hair === "long" && (
        <path d="M48 70 Q15 130 35 180 Q100 195 165 180 Q185 130 152 70 Z" fill={c.hairColor} {...strokeProps} />
      )}
      {c.hair === "ponytail" && (
        <g transform="translate(35, 25)">
          <path d="M115 50 C155 30 180 65 165 110 C135 135 115 100 115 70 Z" fill={c.hairColor} {...strokeProps} />
          <path d="M117 65 Q135 55 148 80" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      {c.hair === "buns" && (
        <g>
          <circle cx="50" cy="40" r="24" fill={c.hairColor} {...strokeProps} />
          <circle cx="150" cy="40" r="24" fill={c.hairColor} {...strokeProps} />
        </g>
      )}

      {/* PIES Y ZAPATOS (Tenis modernos/estilizados de la referencia) */}
      <g>
        {/* Zapato Izquierdo */}
        <path d="M70 255 C70 245 88 245 92 255 L92 265 C92 268 70 268 70 265 Z" fill="#FFF" {...strokeProps} />
        <path d="M70 260 L92 260" fill="none" stroke="#1A1A1A" strokeWidth="2" />
        {/* Zapato Derecho */}
        <path d="M108 255 C108 245 126 245 130 255 L130 265 C130 268 108 268 108 265 Z" fill="#FFF" {...strokeProps} />
        <path d="M108 260 L130 260" fill="none" stroke="#1A1A1A" strokeWidth="2" />
      </g>

      {/* PIERNAS HUMANAS ESTILIZADAS (Pantalón / Jean de la referencia) */}
      <g>
        {c.outfit === "dress" ? (
          // Piernas descubiertas si usa vestido
          <>
            <rect x="76" y="185" width="14" height="72" fill={c.skin} {...strokeProps} />
            <rect x="110" y="185" width="14" height="72" fill={c.skin} {...strokeProps} />
          </>
        ) : (
          // Jeans estilizados con dobleces inferiores
          <>
            <path d="M74 174 L70 255 L88 255 L94 185 Z" fill="#93BBE6" {...strokeProps} />
            <path d="M126 174 L130 255 L112 255 L106 185 Z" fill="#93BBE6" {...strokeProps} />
            {/* Detalles de doblez del jean */}
            <rect x="70" y="250" width="18" height="5" fill="#EAEAEA" stroke="#1A1A1A" strokeWidth="2" />
            <rect x="112" y="250" width="18" height="5" fill="#EAEAEA" stroke="#1A1A1A" strokeWidth="2" />
          </>
        )}
      </g>

      {/* BRAZOS ESTILIZADOS (Caídos de forma natural al costado) */}
      <g>
        {/* Brazo Izquierdo */}
        <path d="M54 135 L44 200 Q44 208 52 208 Q60 208 58 200 L64 145 Z" fill={c.skin} {...strokeProps} />
        {c.outfit !== "dress" && <path d="M54 135 L45 188 L57 188 L62 142 Z" fill={c.outfitColor} {...strokeProps} />}
        
        {/* Brazo Derecho */}
        <path d="M146 135 L156 200 Q156 208 148 208 Q140 208 142 200 L136 145 Z" fill={c.skin} {...strokeProps} />
        {c.outfit !== "dress" && <path d="M146 135 L155 188 L143 188 L138 142 Z" fill={c.outfitColor} {...strokeProps} />}
      </g>

      {/* CUERPO PROPORCIONADO (Prendas de vestir estilizadas) */}
      <g>
        {c.outfit === "dress" ? (
          <path d="M62 134 L50 195 L150 195 L138 134 Z" fill={c.outfitColor} {...strokeProps} />
        ) : c.outfit === "jacket" ? (
          <>
            <path d="M58 134 L54 182 L146 182 L142 134 Z" fill={c.outfitColor} {...strokeProps} />
            <line x1="100" y1="134" x2="100" y2="182" stroke="#1A1A1A" strokeWidth="2.5" />
            {/* Línea abierta de chaqueta */}
            <path d="M92 134 L100 155 L108 134" fill="none" stroke="#1A1A1A" strokeWidth="2.5" />
          </>
        ) : (
          // Sudadera / Hoodie / Camiseta moderna alargada
          <path d="M58 134 L54 180 L146 180 L142 134 Z" fill={c.outfitColor} {...strokeProps} />
        )}

        {/* Cuerdas y detalles de Hoodie */}
        {c.outfit === "hoodie" && (
          <>
            <path d="M76 134 Q100 148 124 134" fill="none" stroke="#1A1A1A" strokeWidth="2.5" />
            <line x1="94" y1="138" x2="94" y2="152" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
            <line x1="106" y1="138" x2="106" y2="152" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </g>

      {/* CUELLO ESTILIZADO */}
      <rect x="93" y="118" width="14" height="20" fill={c.skin} {...strokeProps} />

      {/* LA CARA ACTUAL (Mantenida EXACTAMENTE IGUAL como pediste) */}
      <rect x="48" y="36" width="104" height="96" rx="46" fill={c.skin} {...strokeProps} />

      {/* MEJILLAS SONROJADAS KAWAII */}
      <ellipse cx="66" cy="106" rx="11" ry="6" fill="#FF94B8" opacity="0.6" />
      <ellipse cx="134" cy="106" rx="11" ry="6" fill="#FF94B8" opacity="0.6" />

      {/* OJOS GRANDES CON BRILLO KAWAII */}
      <g>
        {c.eyes === "normal" && (
          <>
            <ellipse cx="73" cy="91" rx="10" ry="13" fill="#1A1A1A" />
            <circle cx="71" cy="85" r="4" fill="#FFF" />
            <circle cx="76" cy="95" r="1.5" fill="#FFF" />
            <ellipse cx="127" cy="91" rx="10" ry="13" fill="#1A1A1A" />
            <circle cx="125" cy="85" r="4" fill="#FFF" />
            <circle cx="130" cy="95" r="1.5" fill="#FFF" />
          </>
        )}
        {c.eyes === "happy" && (
          <>
            <path d="M62 93 Q73 78 84 93" fill="none" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" />
            <path d="M116 93 Q127 78 138 93" fill="none" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" />
          </>
        )}
        {c.eyes === "wink" && (
          <>
            <ellipse cx="73" cy="91" rx="10" ry="13" fill="#1A1A1A" />
            <circle cx="71" cy="85" r="4" fill="#FFF" />
            <circle cx="76" cy="95" r="1.5" fill="#FFF" />
            <path d="M116 91 Q127 76 138 91" fill="none" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" />
          </>
        )}
        {c.eyes === "sparkle" && (
          <>
            <ellipse cx="73" cy="91" rx="10" ry="13" fill="#1A1A1A" />
            <path d="M73 82 L75 88 L81 88 L76 91 L78 97 L73 94 L68 97 L70 91 L65 88 L71 88 Z" fill="#FFF" />
            <ellipse cx="127" cy="91" rx="10" ry="13" fill="#1A1A1A" />
            <path d="M127 82 L129 88 L135 88 L130 91 L132 97 L127 94 L122 97 L124 91 L119 88 L125 88 Z" fill="#FFF" />
          </>
        )}
      </g>

      {/* BOCA PEQUEÑA Y EXPRESIVA */}
      <g>
        {c.mood === "happy" && (
          <path d="M93 106 Q100 115 107 106" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
        )}
        {c.mood === "calm" && (
          <line x1="94" y1="108" x2="106" y2="108" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
        )}
        {c.mood === "excited" && (
          <path d="M92 104 Q100 122 108 104 Z" fill="#FF6B8B" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
        )}
        {c.mood === "thinking" && (
          <path d="M94 109 Q100 104 106 107" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
        )}
      </g>

      {/* CABELLO DELANTERO */}
      <g>
        {c.hair === "short" && (
          <path d="M48 70 Q40 30 100 28 Q160 30 152 70 Q132 45 116 55 Q100 40 84 55 Q68 45 48 70 Z" fill={c.hairColor} {...strokeProps} />
        )}
        {c.hair === "long" && (
          <path d="M48 70 Q40 30 100 28 Q160 30 152 70 Q134 48 121 55 Q100 38 79 55 Q66 48 48 70 Z" fill={c.hairColor} {...strokeProps} />
        )}
        {c.hair === "curly" && (
          <path d="M46 70 C34 42 56 20 78 32 C89 15 111 15 122 32 C144 20 166 42 154 70 C138 52 127 58 116 50 C100 38 84 50 74 50 C63 58 55 52 46 70 Z" fill={c.hairColor} {...strokeProps} />
        )}
        {c.hair === "ponytail" && (
          <path d="M48 70 Q40 30 100 28 Q160 30 152 70 Q132 45 116 55 Q100 40 84 55 Q68 45 48 70 Z" fill={c.hairColor} {...strokeProps} />
        )}
        {c.hair === "buns" && (
          <path d="M48 70 Q40 35 100 32 Q160 35 152 70 Q132 48 116 55 Q100 42 84 55 Q68 48 48 70 Z" fill={c.hairColor} {...strokeProps} />
        )}
      </g>

      {/* ACCESORIOS */}
      <g>
        {c.accessory === "glasses" && (
          <>
            <circle cx="74" cy="92" r="17" fill="none" stroke="#1A1A1A" strokeWidth="3.5" />
            <circle cx="126" cy="92" r="17" fill="none" stroke="#1A1A1A" strokeWidth="3.5" />
            <line x1="91" y1="92" x2="109" y2="92" stroke="#1A1A1A" strokeWidth="3.5" />
            <line x1="65" y1="83" x2="74" y2="92" stroke="#FFF" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <line x1="117" y1="83" x2="126" y2="92" stroke="#FFF" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          </>
        )}
        {c.accessory === "cap" && (
          <g>
            <path d="M52 52 Q100 12 148 52 Z" fill="#7A9AC9" {...strokeProps} />
            <path d="M132 48 Q174 48 185 58 L148 58 Z" fill="#6585B2" {...strokeProps} />
          </g>
        )}
        {c.accessory === "headphones" && (
          <>
            <path d="M50 70 Q50 24 100 24 Q150 24 150 70" fill="none" stroke="#8B7EF1" strokeWidth="8" strokeLinecap="round" />
            <rect x="41" y="68" width="15" height="28" rx="7" fill="#8B7EF1" {...strokeProps} />
            <rect x="144" y="68" width="15" height="28" rx="7" fill="#8B7EF1" {...strokeProps} />
          </>
        )}
        {c.accessory === "earrings" && (
          <>
            <circle cx="44" cy="100" r="4.5" fill="#F5C842" {...strokeProps} />
            <circle cx="156" cy="100" r="4.5" fill="#F5C842" {...strokeProps} />
          </>
        )}
      </g>
    </svg>
  );
}
