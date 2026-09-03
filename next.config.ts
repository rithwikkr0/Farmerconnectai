import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  env: {
    // Baked into the static build — safe to commit (not a secret, just the API base URL)
    NEXT_PUBLIC_WORKER_URL:
      process.env.NEXT_PUBLIC_WORKER_URL ||
      "https://farmconnect-ai-worker.bhoomi-mithra.workers.dev",
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL || "https://bhoomi-mithra.pages.dev",
  },
};

export default nextConfig;
