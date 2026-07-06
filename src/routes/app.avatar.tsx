import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession, useProfile, computeLevel, isAvatarItemUnlocked, getNextAvatarUnlock } from "@/lib/session";
import { AvatarSVG, AVATAR_OPTIONS, type AvatarConfig } from "@/components/avatar-svg";
import { toast } from "sonner";
import { Save, Sparkles, Trophy, ShieldCheck, Lock, Shirt, Eye, Smile, Scissors, Crown, SlidersHorizontal, Check } from "lucide-react";

export const Route = createFileRoute("/app/avatar")({ component: AvatarPage });

type CustomCategory = "cabello" | "ojos" | "boca" | "ropa" | "accesorios";

function AvatarPage() {
  const { user } = useSession();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  const [config, setConfig] = useState<AvatarConfig>({});
  const [activeCategory, setActiveCategory] = useState<CustomCategory>("cabello");
  const [isEditing, setIsEditing] = useState(false);

  // Obtener XP real del perfil o usar 0 por defecto mientras carga
  const currentXp = profile?.xp ?? 0;
  
  // Usamos el calculador matemático oficial del sistema
  const levelInfo = computeLevel(currentXp);
  const nextUnlockInfo = getNextAvatarUnlock(currentXp);

  useEffect(() => {
    if (!user) return;
    supabase.from("avatars").select("config").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data?.config) setConfig(data.config as AvatarConfig);
    });
  }, [user]);

  async function save() {
    if (!user) return;
    const { error } = await supabase.from("avatars").upsert({ user_id: user.id, config });
    if (error) return toast.error(error.message);
    toast.success("¡Avatar y estilo guardados con éxito!");
    setIsEditing(false);
  }

  const set = (k: keyof AvatarConfig, v: any) => {
    // Protección a nivel de interfaz: si el ítem está bloqueado por XP, no se puede equipar
    if (!isAvatarItemUnlocked(v, currentXp)) {
      toast.error("¡Necesitas más XP para desbloquear este objeto!");
      return;
    }
    setConfig((c) => ({ ...c, [k]: v }));
  };

  const xpPercentage = (levelInfo.xpIntoLevel / levelInfo.nextLevelXp) * 100;

  if (profileLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6 animate-fade-in">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Crown className="h-8 w-8 text-yellow-500 animate-pulse" /> Sala de Avatar
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Gana XP, desbloquea recompensas cada 10 puntos y personaliza tu identidad.
          </p>
        </div>
        
        {isEditing && (
          <button 
            onClick={save} 
            className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Save className="h-5 w-5" /> Guardar Cambios
          </button>
        )}
      </div>

      {/* RESTRICCIÓN DE LAYOUT RESPONSIVE */}
      <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: VISUALIZACIÓN CENTRAL Y ESTADÍSTICAS */}
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-purple-900/10 via-background to-background border-2 border-primary/20 p-8 flex flex-col items-center justify-center min-h-[380px] shadow-2xl group">
            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border text-xs font-black text-primary flex items-center gap-1.5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" /> TOTAL: {currentXp} XP
            </div>

            {/* Avatar Grande Rediseñado en el centro */}
            <div className="w-56 h-56 md:w-64 md:h-64 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_10px_25px_rgba(139,126,241,0.25)]">
              <AvatarSVG config={config} size={260} />
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 rounded-full bg-primary hover:bg-primary/90 text-white px-8 py-3.5 font-bold shadow-xl shadow-primary/30 flex items-center gap-2 transition-all transform hover:scale-105"
              >
                <SlidersHorizontal className="h-5 w-5" /> Personalizar Aspecto
              </button>
            )}
          </div>

          {/* Tarjeta con información real del progreso */}
          <div className="rounded-3xl bg-card border border-border/60 p-6 shadow-md relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-black border border-amber-500/20">
                  {levelInfo.level}
                </div>
                <div>
                  <div className="text-sm font-black tracking-wide uppercase text-muted-foreground/80">Nivel de Cuenta</div>
                  <div className="font-extrabold text-foreground flex items-center gap-1">Rango Universitario <Trophy className="h-4 w-4 text-amber-400" /></div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-muted-foreground">Progreso Lineal</div>
                <div className="text-sm font-black text-primary flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Desbloqueos de XP</div>
              </div>
            </div>

            {/* Barra de Experiencia Bonita y Animada */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-primary">Progreso del Nivel</span>
                <span className="text-muted-foreground">{levelInfo.xpIntoLevel} / {levelInfo.nextLevelXp} XP</span>
              </div>
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden p-[2px] border border-border/50">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(139,126,241,0.5)]"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>

            {/* Próximo desbloqueo real basado en XP */}
            {nextUnlockInfo && (
              <div className="mt-4 pt-4 border-t border-border/40 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Lock className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span>Próximo desbloqueo de recompensa: <strong className="text-foreground font-bold">{nextUnlockInfo.text}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: PANEL DE CATEGORÍAS */}
        <div className={`transition-all duration-300 ${isEditing ? "opacity-100 scale-100" : "opacity-60 pointer-events-none lg:opacity-100 lg:pointer-events-auto"}`}>
          <div className="rounded-3xl bg-card border-2 border-border p-5 shadow-xl space-y-5 sticky top-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h2 className="font-black text-lg tracking-tight flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" /> Armario de Ely
              </h2>
              {!isEditing && <span className="text-xs font-bold bg-secondary px-2.5 py-1 rounded-md text-muted-foreground">Vista Lectura</span>}
            </div>

            {/* CATEGORÍAS TIPO VIDEOJUEGO */}
            <div className="grid grid-cols-5 gap-1.5 bg-secondary/60 p-1 rounded-2xl border border-border/30">
              {(["cabello", "ojos", "boca", "ropa", "accesorios"] as CustomCategory[]).map((cat) => {
                const icons = {
                  cabello: <Scissors className="h-4 w-4" />,
                  ojos: <Eye className="h-4 w-4" />,
                  boca: <Smile className="h-4 w-4" />,
                  ropa: <Shirt className="h-4 w-4" />,
                  accesorios: <Crown className="h-4 w-4" />,
                };
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex flex-col items-center justify-center py-2.5 rounded-xl capitalize font-bold text-[10px] transition-all gap-1 ${
                      activeCategory === cat 
                        ? "bg-background text-primary shadow-md border border-border" 
                        : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                    }`}
                  >
                    {icons[cat]}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* LISTA DINÁMICA DE OPCIONES CON COMPROBACIÓN DE CANDADO */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {activeCategory === "cabello" && (
                <>
                  <SelectRow label="Modelos de Peinado" options={[...AVATAR_OPTIONS.hair]} current={config.hair} onSelect={(v) => set("hair", v)} currentXp={currentXp} kind="label" />
                  <SelectRow label="Colores de Tintura" options={[...AVATAR_OPTIONS.hairColor]} current={config.hairColor} onSelect={(v) => set("hairColor", v)} currentXp={currentXp} kind="color" />
                </>
              )}

              {activeCategory === "ojos" && (
                <SelectRow label="Diseños de Ojos Anime" options={[...AVATAR_OPTIONS.eyes]} current={config.eyes} onSelect={(v) => set("eyes", v)} currentXp={currentXp} kind="label" />
              )}

              {activeCategory === "boca" && (
                <SelectRow label="Expresiones del Rostro" options={["happy", "calm", "excited", "thinking", "surprised", "cool"]} current={config.mood} onSelect={(v) => set("mood", v as any)} currentXp={currentXp} kind="label" />
              )}

              {activeCategory === "ropa" && (
                <>
                  <SelectRow label="Prendas de Vestir" options={[...AVATAR_OPTIONS.outfit]} current={config.outfit} onSelect={(v) => set("outfit", v)} currentXp={currentXp} kind="label" />
                  <SelectRow label="Colores de Tela" options={[...AVATAR_OPTIONS.outfitColor]} current={config.outfitColor} onSelect={(v) => set("outfitColor", v)} currentXp={currentXp} kind="color" />
                </>
              )}

              {activeCategory === "accesorios" && (
                <SelectRow label="Accesorios de Cabeza / Rostro" options={[...AVATAR_OPTIONS.accessory]} current={config.accessory} onSelect={(v) => set("accessory", v)} currentXp={currentXp} kind="label" />
              )}

              {/* CONTENEDOR GLOBAL INDEPENDIENTE PARA EL TONO DE PIEL */}
              <div className="pt-2 border-t border-border/40">
                <SelectRow label="Tono de Piel Base" options={[...AVATAR_OPTIONS.skin]} current={config.skin} onSelect={(v) => set("skin", v)} currentXp={currentXp} kind="color" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

interface SelectRowProps {
  label: string;
  options: readonly string[];
  current: any;
  onSelect: (v: string) => void;
  currentXp: number;
  kind: "color" | "label";
}

function SelectRow({ label, options, current, onSelect, currentXp, kind }: SelectRowProps) {
  return (
    <div className="rounded-2xl bg-secondary/30 border border-border/50 p-3.5 space-y-2">
      <div className="text-xs font-black tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="flex gap-2 flex-wrap">
        {options.map((o) => {
          // Validar de forma síncrona usando la XP real si el ítem está disponible
          const unlocked = isAvatarItemUnlocked(o, currentXp);
          const isSelected = current === o;

          return (
            <button
              key={o}
              onClick={() => unlocked && onSelect(o)}
              disabled={!unlocked}
              className={`relative flex items-center justify-center rounded-xl border-2 transition-all duration-200 transform ${
                unlocked 
                  ? isSelected 
                    ? "border-primary scale-105 shadow-md shadow-primary/10 bg-background text-primary font-black" 
                    : "border-transparent hover:border-border/80 bg-background/50 text-foreground"
                  : "border-transparent bg-secondary/40 text-muted-foreground/40 cursor-not-allowed opacity-50"
              } ${kind === "color" ? "h-9 w-9 rounded-full shadow-inner" : "px-3 py-2 text-xs font-bold capitalize"}`}
              style={kind === "color" ? { backgroundColor: o } : undefined}
            >
              {kind === "label" && <span>{o}</span>}
              
              {/* Overlay visual del Candado si el ítem requiere más experiencia */}
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                  <Lock className="h-3 w-3 text-muted-foreground/80" />
                </div>
              )}
              
              {/* Checkmark sutil si el color o elemento está activo y seleccionado */}
              {unlocked && isSelected && kind === "color" && (
                <Check className="h-3.5 w-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] stroke-[4]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}