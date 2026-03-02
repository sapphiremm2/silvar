/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'emkquizktyzkwfhvqvvd.supabase.co' },
    ],
  },
}

export default nextConfig