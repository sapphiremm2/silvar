import { getRarityConfig, type Rarity } from '@/lib/utils/rarity'
import { cn } from '@/lib/utils/cn'

interface RarityBadgeProps {
  rarity: string | null
  size?: 'sm' | 'md'
  className?: string
}

export function RarityBadge({ rarity, size = 'sm', className }: RarityBadgeProps) {
  const config = getRarityConfig(rarity)
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold uppercase tracking-wide',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
