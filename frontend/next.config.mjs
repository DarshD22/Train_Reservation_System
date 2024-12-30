/** @type {import('next').NextConfig} */
const nextConfig = {
        async rewrites() {
          return [
            {
              source: '/api/:path*',
              destination: 'https://train-reservation-system-yob2.onrender.com/api/:path*',  // Proxy to backend
            },
          ];
        },
      
};

export default nextConfig;
