import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Evita que o Turbopack tente inferir a raiz do workspace fora do projeto
    // (e acabe varrendo diretórios sem permissão, como C:\Users\USER).
    root: process.cwd(),
  },
};

export default nextConfig;
