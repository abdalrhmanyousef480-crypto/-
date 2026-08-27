import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // ضيف هون أي دومين تاني رح تستضيف عليه صور المتاجر/الكوبونات
      // (مثلًا لو ربطت Cloudinary أو Vercel Blob لاحقًا)
    ],
  },
  eslint: {
    // نخلي الـ lint يشتغل يدويًا (npm run lint) بدل ما يوقف الـ build،
    // لأنه ببيئة الإنتاج الأولى بيكون فيه تحذيرات بسيطة طبيعية
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
