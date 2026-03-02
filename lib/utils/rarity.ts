export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Godly'

export const RARITY_CONFIG: Record<Rarity, { label: string; className: string; glow: string }> = {
  Common:    { label: 'Common',    className: 'rarity-common',    glow: 'rgba(148,163,184,0.3)' },
  Rare:      { label: 'Rare',      className: 'rarity-rare',      glow: 'rgba(0,242,255,0.4)'   },
  Epic:      { label: 'Epic',      className: 'rarity-epic',      glow: 'rgba(255,0,193,0.4)'   },
  Legendary: { label: 'Legendary', className: 'rarity-legendary', glow: 'rgba(249,115,22,0.4)'  },
  Godly:     { label: 'Godly',     className: 'rarity-godly',     glow: 'rgba(251,191,36,0.5)'  },
}

export const getRarityConfig = (rarity: string | null) =>
  RARITY_CONFIG[(rarity as Rarity) ?? 'Common'] ?? RARITY_CONFIG['Common']
