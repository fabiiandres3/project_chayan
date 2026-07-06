import { useMemo } from "react";

export type AvatarConfig = {
  skin?: string;
  hair?: string;
  hairColor?: string;
  eyes?: string;
  outfit?: string;
  outfitColor?: string;
  accessory?: string;
  mood?: "happy" | "calm" | "excited" | "thinking" | "surprised" | "cool";
};

// Catálogo ampliado de opciones para soportar el nuevo sistema progresivo de desbloqueos
export const AVATAR_OPTIONS = {
  skin: ["#F5D6BA", "#EAC199", "#D9A574", "#B67F4F", "#8A5A3B", "#5C3A22"],
  hair: ["short", "long", "curly", "ponytail", "buns", "spiky", "braids", "bald"],
  hairColor: ["#2C1810", "#5C3A22", "#B67F4F", "#E8B860", "#C97A9A", "#7A9AC9", "#9A7AC9", "#FE5F55"],
  eyes: ["normal", "happy", "wink", "sparkle", "star", "anime-sad"],
  outfit: ["hoodie", "tee", "jacket", "dress", "sweater", "overalls"],
  outfitColor: ["#8FB4E8", "#F3B4C6", "#B0DFC9", "#C7B4EA", "#F5D488", "#F19B84", "#222222", "#FFFFFF"],
  accessory: ["none", "glasses", "cap", "headphones", "earrings", "scarf", "crown"],
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

      {/* DETRÁS DEL CUERPO: Cabello Trasero */}
      {c.hair === "long" && (
        <path d="M48 70 Q15 130 35 180 Q100 195 165 180 Q185 130 152 70 Z" fill={c.hairColor} {...strokeProps} />
      )}
      {c.hair === "ponytail" && (
        <g transform="translate(35, 25)">
          <path d="M115 50 C155 30 180 65 165 110 C135 135 115 100 115 70 Z" fill={c.hairColor} {...strokeProps} />
        </g>
      )}
      {c.hair === "buns" && (
        <g>
          <circle cx="50" cy="40" r="24" fill={c.hairColor} {...strokeProps} />
          <circle cx="150" cy="40" r="24" fill={c.hairColor} {...strokeProps} />
        </g>
      )}
      {c.hair === "braids" && (
        <g>
          <path d="M44 80 Q25 140 35 200" fill="none" stroke={c.hairColor} strokeWidth="12" strokeLinecap="round" {...strokeProps} />
          <path d="M156 80 Q175 140 165 200" fill="none" stroke={c.hairColor} strokeWidth="12" strokeLinecap="round" {...strokeProps} />
        </g>
      )}

      {/* ACCESORIO TRASERO: Bufanda (Parte trasera) */}
      {c.accessory === "scarf" && (
        <path d="M74 136 Q100 150 126 136 L134 165 Q100 175 66 165 Z" fill="#FE5F55" {...strokeProps} />
      )}

      {/* PIES Y ZAPATOS */}
      <g>
        <path d="M70 255 C70 245 88 245 92 255 L92 265 C92 268 70 268 70 265 Z" fill="#FFF" {...strokeProps} />
        <path d="M70 260 L92 260" fill="none" stroke="#1A1A1A" strokeWidth="2" />
        <path d="M108 255 C108 245 126 245 130 255 L130 265 C130 268 108 268 108 265 Z" fill="#FFF" {...strokeProps} />
        <path d="M108 260 L130 260" fill="none" stroke="#1A1A1A" strokeWidth="2" />
      </g>

      {/* PIERNAS */}
      <g>
        {c.outfit === "dress" ? (
          <>
            <rect x="76" y="185" width="14" height="72" fill={c.skin} {...strokeProps} />
            <rect x="110" y="185" width="14" height="72" fill={c.skin} {...strokeProps} />
          </>
        ) : (
          <>
            <path d="M74 174 L70 255 L88 255 L94 185 Z" fill="#93BBE6" {...strokeProps} />
            <path d="M126 174 L130 255 L112 255 L106 185 Z" fill="#93BBE6" {...strokeProps} />
            <rect x="70" y="250" width="18" height="5" fill="#EAEAEA" stroke="#1A1A1A" strokeWidth="2" />
            <rect x="112" y="250" width="18" height="5" fill="#EAEAEA" stroke="#1A1A1A" strokeWidth="2" />
          </>
        )}
      </g>

      {/* BRAZOS */}
      <g>
        <path d="M54 135 L44 200 Q44 208 52 208 Q60 208 58 200 L64 145 Z" fill={c.skin} {...strokeProps} />
        <path d="M146 135 L156 200 Q156 208 148 208 Q140 208 142 200 L136 145 Z" fill={c.skin} {...strokeProps} />
        {c.outfit !== "dress" && (
          <>
            <path d="M54 135 L45 188 L57 188 L62 142 Z" fill={c.outfitColor} {...strokeProps} />
            <path d="M146 135 L155 188 L143 188 L138 142 Z" fill={c.outfitColor} {...strokeProps} />
          </>
        )}
      </g>

      {/* CUERPO PRINCIPAL (Ropa Ampliada) */}
      <g>
        {c.outfit === "dress" ? (
          <path d="M62 134 L50 195 L150 195 L138 134 Z" fill={c.outfitColor} {...strokeProps} />
        ) : c.outfit === "jacket" ? (
          <>
            <path d="M58 134 L54 182 L146 182 L142 134 Z" fill={c.outfitColor} {...strokeProps} />
            <line x1="100" y1="134" x2="100" y2="182" stroke="#1A1A1A" strokeWidth="2.5" />
            <path d="M92 134 L100 155 L108 134" fill="none" stroke="#1A1A1A" strokeWidth="2.5" />
          </>
        ) : c.outfit === "sweater" ? (
          <>
            <path d="M58 134 L54 184 L146 184 L142 134 Z" fill={c.outfitColor} {...strokeProps} />
            <path d="M64 145 Q100 155 136 145" fill="none" stroke="#1A1A1A" strokeWidth="2" />
          </>
        ) : c.outfit === "overalls" ? (
          <>
            <path d="M58 134 L54 180 L146 180 L142 134 Z" fill="#FFF" {...strokeProps} />
            <path d="M66 134 L62 180 L138 180 L134 134 Z" fill={c.outfitColor} {...strokeProps} />
            <rect x="74" y="142" width="10" height="12" fill="#1A1A1A" rx="2" />
            <rect x="116" y="142" width="10" height="12" fill="#1A1A1A" rx="2" />
          </>
        ) : (
          <path d="M58 134 L54 180 L146 180 L142 134 Z" fill={c.outfitColor} {...strokeProps} />
        )}

        {/* Detalles específicos del Hoodie original */}
        {c.outfit === "hoodie" && (
          <>
            <path d="M76 134 Q100 148 124 134" fill="none" stroke="#1A1A1A" strokeWidth="2.5" />
            <line x1="94" y1="138" x2="94" y2="152" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
            <line x1="106" y1="138" x2="106" y2="152" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </g>

      {/* CUELLO */}
      <rect x="93" y="118" width="14" height="20" fill={c.skin} {...strokeProps} />

      {/* CABEZA */}
      <rect x="48" y="36" width="104" height="96" rx="46" fill={c.skin} {...strokeProps} />
      <ellipse cx="66" cy="106" rx="11" ry="6" fill="#FF94B8" opacity="0.6" />
      <ellipse cx="134" cy="106" rx="11" ry="6" fill="#FF94B8" opacity="0.6" />

      {/* OJOS */}
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
        {c.eyes === "star" && (
          <>
            <ellipse cx="73" cy="91" rx="11" ry="11" fill="#F5D488" {...strokeProps} />
            <polygon points="73,83 76,88 82,89 77,93 79,99 73,96 67,99 69,93 64,89 70,88" fill="#FFF" />
            <ellipse cx="127" cy="91" rx="11" ry="11" fill="#F5D488" {...strokeProps} />
            <polygon points="127,83 130,88 136,89 131,93 133,99 127,96 121,99 123,93 118,89 124,88" fill="#FFF" />
          </>
        )}
        {c.eyes === "anime-sad" && (
          <>
            <ellipse cx="73" cy="91" rx="10" ry="13" fill="#1A1A1A" />
            <path d="M65 84 Q73 90 81 84" fill="none" stroke="#1A1A1A" strokeWidth="2.5" />
            <rect x="68" y="94" width="10" height="12" fill="#8FB4E8" opacity="0.7" rx="3" />
            <ellipse cx="127" cy="91" rx="10" ry="13" fill="#1A1A1A" />
            <path d="M119 84 Q127 90 135 84" fill="none" stroke="#1A1A1A" strokeWidth="2.5" />
            <rect x="122" y="94" width="10" height="12" fill="#8FB4E8" opacity="0.7" rx="3" />
          </>
        )}
      </g>

      {/* EXP-MOOD BOCA */}
      <g>
        {c.mood === "happy" && <path d="M93 106 Q100 115 107 106" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />}
        {c.mood === "calm" && <line x1="94" y1="108" x2="106" y2="108" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />}
        {c.mood === "excited" && <path d="M92 104 Q100 122 108 104 Z" fill="#FF6B8B" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />}
        {c.mood === "thinking" && <path d="M94 109 Q100 104 106 107" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />}
        {c.mood === "surprised" && <circle cx="100" cy="108" r="6" fill="none" stroke="#1A1A1A" strokeWidth="3" />}
        {c.mood === "cool" && <path d="M93 105 Q100 102 107 105" fill="none" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" />}
      </g>

      {/* PEINADOS */}
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
        {c.hair === "spiky" && (
          <path d="M46 72 L42 50 L56 55 L62 38 L76 48 L100 30 L124 48 L138 38 L144 55 L158 50 L154 72 Q100 50 46 72 Z" fill={c.hairColor} {...strokeProps} />
        )}
        {c.hair === "braids" && (
          <path d="M48 70 Q40 30 100 28 Q160 30 152 70 Q132 45 116 55 Q100 40 84 55 Q68 45 48 70 Z" fill={c.hairColor} {...strokeProps} />
        )}
      </g>

      {/* ACCESORIOS */}
      <g>
        {c.accessory === "glasses" && (
          <>
            <circle cx="74" cy="92" r="17" fill="none" stroke="#1A1A1A" strokeWidth="3.5" />
            <circle cx="126" cy="92" r="17" fill="none" stroke="#1A1A1A" strokeWidth="3.5" />
            <line x1="91" y1="92" x2="109" y2="92" stroke="#1A1A1A" strokeWidth="3.5" />
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
        {c.accessory === "scarf" && (
          <path d="M68 134 Q100 146 132 134 Q138 155 124 160 L120 195 L102 195 L106 158 Q100 158 94 158 L90 185 L74 185 Z" fill="#FE5F55" {...strokeProps} />
        )}
        {c.accessory === "crown" && (
          <polygon points="68,36 76,20 88,32 100,14 112,32 124,20 132,36" fill="#F5D488" {...strokeProps} />
        )}
      </g>
    </svg>
  );
}