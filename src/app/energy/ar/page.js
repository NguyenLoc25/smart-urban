"use client";

import dynamic from "next/dynamic";

const Ar = dynamic(() => import("../../../components/energy/ar/Ar"), {
  ssr: false, // Vô hiệu hóa SSR để tránh lỗi A-Frame khi render server
});

export default function ARPage() {
  return (
    <main style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Ar />
    </main>
  );
}
