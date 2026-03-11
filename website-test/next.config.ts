import type { NextConfig } from "next";
const createNextIntlPlugin = require('next-intl/plugin'); //

const withNextIntl = createNextIntlPlugin(); //

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wdzoudpuzlfksiddvdzy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig); //