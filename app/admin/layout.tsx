import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile as any).role !== 'admin') redirect('/')

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-[#ff00c1] text-2xl">⚙️</span>
        <h1 className="text-2xl font-black">
          Admin <span style={{ background: 'linear-gradient(90deg,#ff00c1,#00f2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Panel</span>
        </h1>
      </div>
      {children}
    </div>
  )
}