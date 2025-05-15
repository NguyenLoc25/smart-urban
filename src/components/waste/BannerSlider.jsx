"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  { src: "/waste/smart-waste-banner-1.jpg", alt: "Banner 1" },
  { src: "/waste/smart-waste-banner-2.webp", alt: "Banner 2" },
  { src: "/waste/smart-waste-banner-3.jpg", alt: "Banner 3" },
  { src: "/waste/smart-waste-banner-4.jpeg", alt: "Banner 4" },
  { src: "/waste/smart-waste-banner.jpg", alt: "Banner 5" },
];

export default function BannerSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const startX = useRef(null);
  const dragOffset = useRef(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  const goTo = (dir) => {
    setIndex((prev) =>
      dir === "next"
        ? (prev + 1) % banners.length
        : (prev - 1 + banners.length) % banners.length
    );
  };

  const handleStart = (x) => {
    startX.current = x;
    dragOffset.current = 0;
    setIsDragging(true);
    if (sliderRef.current) {
      sliderRef.current.style.transition = "none";
      sliderRef.current.style.cursor = "grabbing";
    }
  };

  const handleMove = (x) => {
    if (!isDragging || startX.current === null) return;
    dragOffset.current = x - startX.current;
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(calc(-${index * 100}% + ${dragOffset.current}px))`;
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    const threshold = 80;
    let newIndex = index;
    if (dragOffset.current > threshold) {
      newIndex = (index - 1 + banners.length) % banners.length;
    } else if (dragOffset.current < -threshold) {
      newIndex = (index + 1) % banners.length;
    }
    setIndex(newIndex);
    setIsDragging(false);
    dragOffset.current = 0;
    startX.current = null;
    if (sliderRef.current) {
      sliderRef.current.style.transition = "transform 0.7s ease-in-out";
      sliderRef.current.style.transform = `translateX(-${newIndex * 100}%)`;
      sliderRef.current.style.cursor = "grab";
    }
  };

  const handleMouseLeave = () => {
    handleEnd();
    setPaused(false);
  };

  return (
    <div
      className="relative w-full max-w-5xl aspect-[669/180] mx-auto overflow-hidden rounded-2xl shadow-xl ring-1 ring-gray-300 dark:ring-gray-700 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => isDragging && handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleMouseLeave}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      <div
        ref={sliderRef}
        className="flex w-full h-full cursor-grab"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: isDragging ? "none" : "transform 0.7s ease-in-out",
        }}
      >
        {banners.map((banner, i) => (
          <div key={i} className="w-full flex-shrink-0 h-full relative">
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              draggable={false}
              className="object-cover object-center"
              priority
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => goTo("prev")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white text-gray-700 p-2 rounded-full shadow hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => goTo("next")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white text-gray-700 p-2 rounded-full shadow hover:scale-110"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full border border-white transition-all duration-300 ${
              index === i ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
