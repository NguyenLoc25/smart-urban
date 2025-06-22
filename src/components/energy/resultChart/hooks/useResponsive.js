"use client";

import { useState, useEffect } from "react";

export function useResponsive(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Chỉ chạy phía client
    if (typeof window === "undefined") return;

    const mediaQuery = `(max-width: ${breakpoint - 0.02}px)`;
    const mql = window.matchMedia(mediaQuery);
    
    // Cập nhật state ban đầu
    setIsMobile(mql.matches);

    let rAF = null;
    const handle = () => {
      if (rAF) cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        setIsMobile(mql.matches);
      });
    };

    mql.addEventListener("change", handle);
    window.addEventListener("resize", handle);

    return () => {
      mql.removeEventListener("change", handle);
      window.removeEventListener("resize", handle);
      if (rAF) cancelAnimationFrame(rAF);
    };
  }, [breakpoint]);

  return isMobile;
}

export default useResponsive;