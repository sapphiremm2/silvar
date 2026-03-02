import { createClient } from '@/lib/supabase/server'
import { BlindBoxesClient } from '@/components/boxes/BlindBoxesClient'
import { ParticleBackground } from '@/components/ui/ParticleBackground'

export const metadata = { title: 'Blind Boxes — silvar.gg' }

export default async function BlindBoxesPage() {
  const supabase = createClient()
  const { data: boxes } = await supabase
    .from('blind_boxes')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <>
      <ParticleBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black mb-2">
          Blind <span className="gradient-cyan">Boxes</span>
        </h1>
        <p className="text-[#64748b] mb-8">Open boxes to win rare items. Results are instant.</p>
        <BlindBoxesClient boxes={boxes ?? []} />
      </div>
    </>
  )
}
