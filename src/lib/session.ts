import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type SessionState = {
  user: User | null;
  loading: boolean;
};

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ user: null, loading: true });
  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setState({ user: data.session?.user ?? null, loading: false });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setState({ user: session?.user ?? null, loading: false });
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);
  return state;
}

export type ProfileRow = {
  id: string;
  full_name: string;
  user_type: "admin" | "student" | "natural";
  email: string | null;
  age: number | null;
  grade: string | null;
  course: string | null;
  position: string | null;
  institution_id: string | null;
  xp: number;
  level: number;
  streak_days: number;
};

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId) { setProfile(null); setLoading(false); return; }
    let alive = true;
    setLoading(true);
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle().then(({ data }) => {
      if (!alive) return;
      setProfile(data as ProfileRow | null);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [userId]);
  return { profile, loading, setProfile };
}

export function xpForNextLevel(level: number) { return 100 + level * 50; }
export function computeLevel(xp: number) {
  let lvl = 1, remaining = xp;
  while (remaining >= xpForNextLevel(lvl)) { remaining -= xpForNextLevel(lvl); lvl++; }
  return { level: lvl, xpIntoLevel: remaining, nextLevelXp: xpForNextLevel(lvl) };
}

// =======================================================
// NUEVO SISTEMA DE RECOMPENSAS SÍNCRONO POR CADA 10 PUNTOS DE XP
// =======================================================

export type RewardItem = {
  id: string;
  name: string;
  category: "hair" | "eyes" | "mood" | "outfit" | "accessory";
  requiredXp: number;
};

/**
 * Lista maestra ordenada de todos los desbloqueables del juego.
 * Cada elemento requiere exactamente 10 puntos de XP más que el anterior de manera lineal.
 */
const AVATAR_REWARDS: RewardItem[] = [
  // Básicos iniciales (Desbloqueados con 0 XP)
  { id: "short", name: "Cabello Corto Estándar", category: "hair", requiredXp: 0 },
  { id: "normal", name: "Ojos Normales", category: "eyes", requiredXp: 0 },
  { id: "happy", name: "Expresión Alegre", category: "mood", requiredXp: 0 },
  { id: "calm", name: "Expresión Serena", category: "mood", requiredXp: 0 },
  { id: "tee", name: "Camiseta Básica", category: "outfit", requiredXp: 0 },
  { id: "hoodie", name: "Sudadera Hoodie", category: "outfit", requiredXp: 0 },

  // Hitos de Desbloqueo Constante cada 10 XP progresivos
  { id: "curly", name: "Peinado Rizado", category: "hair", requiredXp: 10 },
  { id: "wink", name: "Ojo Guiñado", category: "eyes", requiredXp: 20 },
  { id: "thinking", name: "Expresión Pensativa", category: "mood", requiredXp: 30 },
  { id: "long", name: "Cabello Largo Anime", category: "hair", requiredXp: 40 },
  { id: "sparkle", name: "Ojos Brillantes", category: "eyes", requiredXp: 50 },
  { id: "excited", name: "Expresión Entusiasmada", category: "mood", requiredXp: 60 },
  { id: "jacket", name: "Chaqueta Elegante", category: "outfit", requiredXp: 70 },
  { id: "glasses", name: "Gafas Modernas", category: "accessory", requiredXp: 80 },
  { id: "ponytail", name: "Coleta Ponytail", category: "hair", requiredXp: 90 },
  { id: "star", name: "Ojos de Estrella ✨", category: "eyes", requiredXp: 100 },
  { id: "sweater", name: "Suéter Cómodo", category: "outfit", requiredXp: 110 },
  { id: "cap", name: "Gorra Deportiva", category: "accessory", requiredXp: 120 },
  { id: "buns", name: "Peinado de Chongos (Buns)", category: "hair", requiredXp: 130 },
  { id: "surprised", name: "Expresión Sorprendida", category: "mood", requiredXp: 140 },
  { id: "dress", name: "Vestido de Gala", category: "outfit", requiredXp: 150 },
  { id: "headphones", name: "Audífonos Gamer", category: "accessory", requiredXp: 160 },
  { id: "spiky", name: "Cabello Picudo (Spiky)", category: "hair", requiredXp: 170 },
  { id: "anime-sad", name: "Ojos Emotivos Anime", category: "eyes", requiredXp: 180 },
  { id: "cool", name: "Expresión Desafiante / Cool", category: "mood", requiredXp: 190 },
  { id: "overalls", name: "Jardinera / Overol", category: "outfit", requiredXp: 200 },
  { id: "braids", name: "Cabello con Trenzas", category: "hair", requiredXp: 210 },
  { id: "scarf", name: "Bufanda Invernal", category: "accessory", requiredXp: 220 },
  { id: "crown", name: "Corona Imperial Kawaii 👑", category: "accessory", requiredXp: 250 },
];

/**
 * Devuelve la lista completa de ítems configurados en el catálogo.
 */
export function getAvatarRewards(): RewardItem[] {
  return AVATAR_REWARDS;
}

/**
 * Obtiene la lista de todos los objetos desbloqueados acumulados según los puntos de XP actuales.
 */
export function getUnlockedAvatarItems(xp: number): RewardItem[] {
  return AVATAR_REWARDS.filter((reward) => xp >= reward.requiredXp);
}

/**
 * Evalúa si un ítem específico está disponible basándose en la experiencia actual del jugador.
 */
export function isAvatarItemUnlocked(itemId: string, xp: number): boolean {
  if (itemId === "none" || itemId === "bald") return true;
  
  const reward = AVATAR_REWARDS.find((item) => item.id === itemId);
  if (!reward) return true; // Si el ID no está restringido en el catálogo de recompensas, se considera libre por defecto
  
  return xp >= reward.requiredXp;
}

/**
 * Encuentra el siguiente objeto más cercano a desbloquear según el puntaje de XP.
 */
export function getNextAvatarUnlock(xp: number): { requiredXp: number; item: RewardItem; missingXp: number; text: string } | null {
  const nextReward = AVATAR_REWARDS.find((reward) => reward.requiredXp > xp);
  
  if (!nextReward) return null;

  const missing = nextReward.requiredXp - xp;
  return {
    requiredXp: nextReward.requiredXp,
    item: nextReward.items ? (nextReward as any).items[0] : nextReward,
    missingXp: missing,
    text: `${nextReward.name} (Necesitas ${nextReward.requiredXp} XP, faltan ${missing} XP)`
  };
}