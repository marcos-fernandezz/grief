/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // El doble asterisco permite CUALQUIER proyecto de Supabase
        port: '',
        pathname: '/**',            // Esto permite CUALQUIER carpeta o archivo adentro
      },
    ],
  },
};

module.exports = nextConfig;