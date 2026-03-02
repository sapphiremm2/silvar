import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'emkquizktyzkwfhvqvvd.supabase.co' },
    ],
  },
}

export default nextConfig
