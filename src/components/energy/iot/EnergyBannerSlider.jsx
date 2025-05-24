"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/use-media-query';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  bg: string;
  icon: string;
  stats: string;
  color: string;
  highlight: string;
  link: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "TỔNG QUAN HỆ THỐNG IoT",
    subtitle: "Giám sát năng lượng tái tạo thời gian thực",
    bg: "bg-gradient-to-br from-amber-100 via-white to-blue-100 dark:from-amber-900/30 dark:via-gray-900 dark:to-blue-900/30",
    icon: "🌐",
    stats: "Kết nối 150+ thiết bị IoT",
    color: "text-amber-600 dark:text-amber-300",
    highlight: "from-amber-400 to-amber-600",
    link: "/energy/iot"
  },
  {
    id: 2,
    title: "TRANG TRẠI ĐIỆN GIÓ",
    subtitle: "5 tuabin gió công suất cao",
    bg: "bg-gradient-to-br from-green-100 via-white to-cyan-100 dark:from-green-900/30 dark:via-gray-900 dark:to-cyan-900/30",
    icon: "🌬️",
    stats: "Công suất tối đa 7.5 MW",
    color: "text-green-600 dark:text-green-300",
    highlight: "from-green-400 to-green-600",
    link: "/energy/iot/windplace"
  },
  {
    id: 3,
    title: "TRANG TRẠI PIN MẶT TRỜI",
    subtitle: "Hệ thống quang điện hiệu suất cao",
    bg: "bg-gradient-to-br from-purple-100 via-white to-pink-100 dark:from-purple-900/30 dark:via-gray-900 dark:to-pink-900/30",
    icon: "☀️",
    stats: "3.000 tấm pin, công suất 3 MW",
    color: "text-purple-600 dark:text-purple-300",
    highlight: "from-purple-400 to-purple-600",
    link: "/energy/iot/solarplace"
  },
  {
    id: 4,
    title: "CHU KỲ NGÀY ĐÊM",
    subtitle: "Mô phỏng thời gian thực",
    bg: "bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-blue-900/30 dark:via-gray-900 dark:to-indigo-900/30",
    icon: "⏳",
    stats: "1 ngày (24h) = 24 phút mô phỏng",
    color: "text-blue-600 dark:text-blue-300",
    highlight: "from-blue-400 to-blue-600",
    link: "/energy/iot/daynight"
  }
];

const AUTO_SLIDE_INTERVAL = 5000;
const DRAG_THRESHOLD = 50;

const EnergyBannerSlider = () => {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const dragOffset = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Reset auto slide timer
  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // Start auto slide
  const startTimer = useCallback(() => {
    resetTimer();
    intervalRef.current = setInterval(() => {
      if (!paused && !isDragging) {
        setIndex((prev) => (prev + 1) % slides.length);
      }
    }, AUTO_SLIDE_INTERVAL);
  }, [paused, isDragging, resetTimer]);

  // Auto slide effect
  useEffect(() => {
    startTimer();
    return () => resetTimer();
  }, [startTimer, resetTimer]);

  // Navigation
  const goTo = useCallback((dir: 'prev' | 'next' | number) => {
    resetTimer();
    
    if (typeof dir === 'number') {
      setIndex(dir);
    } else {
      setIndex((prev) =>
        dir === "next"
          ? (prev + 1) % slides.length
          : (prev - 1 + slides.length) % slides.length
      );
    }
    
    startTimer();
  }, [resetTimer, startTimer]);

  // Handle detail button click
  const handleDetailClick = useCallback((e: React.MouseEvent, link: string) => {
    e.preventDefault();
    router.push(link);
  }, [router]);

  // Touch/drag events
  const handleStart = useCallback((x: number) => {
    startX.current = x;
    dragOffset.current = 0;
    setIsDragging(true);
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = "none";
      sliderRef.current.style.cursor = "grabbing";
    }
    
    resetTimer();
  }, [resetTimer]);

  const handleMove = useCallback((x: number) => {
    if (!isDragging || startX.current === null) return;
    dragOffset.current = x - startX.current;
    
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(calc(-${index * 100}% + ${dragOffset.current}px))`;
    }
  }, [index, isDragging]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    let newIndex = index;
    if (dragOffset.current > DRAG_THRESHOLD) {
      newIndex = (index - 1 + slides.length) % slides.length;
    } else if (dragOffset.current < -DRAG_THRESHOLD) {
      newIndex = (index + 1) % slides.length;
    }

    setIndex(newIndex);
    setIsDragging(false);
    dragOffset.current = 0;
    startX.current = null;

    if (sliderRef.current) {
      sliderRef.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
      sliderRef.current.style.transform = `translateX(-${newIndex * 100}%)`;
      sliderRef.current.style.cursor = "grab";
    }
    
    startTimer();
  }, [index, isDragging, startTimer]);

  // Slide rendering
  const renderSlides = useCallback(() => (
    slides.map((slide) => (
      <div
        key={slide.id}
        className={`w-full flex-shrink-0 h-full ${slide.bg} flex flex-col md:flex-row items-center justify-center md:justify-between p-6 md:p-12 relative overflow-hidden`}
      >
        <div className="max-w-2xl z-10 space-y-3 md:space-y-4 text-center md:text-left">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {slide.subtitle}
          </div>
          <h2 className={`text-2xl md:text-4xl lg:text-5xl font-bold ${slide.color} leading-tight`}>
            {slide.title}
          </h2>
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <div className={`h-1 w-6 md:w-8 rounded-full bg-gradient-to-r ${slide.highlight}`}></div>
            <div className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">
              {slide.stats}
            </div>
          </div>
          <button 
            onClick={(e) => handleDetailClick(e, slide.link)}
            className={`mt-4 md:mt-6 px-5 md:px-6 py-2 md:py-3 rounded-lg shadow-sm text-sm font-medium text-white ${slide.color.replace('text', 'bg')} hover:opacity-90 transition-opacity duration-300 flex items-center space-x-2 mx-auto md:mx-0`}
          >
            <span>Xem chi tiết</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        
        <div className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] opacity-20 md:opacity-30 transform rotate-12 transition-transform duration-500 hover:scale-110 mt-6 md:mt-0">
          {slide.icon}
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-16 -left-16 sm:-top-20 sm:-left-20 md:-top-24 md:-left-24 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full bg-amber-200/20 dark:bg-amber-800/10 blur-[60px] md:blur-[80px] animate-float" />
          <div className="absolute -bottom-16 -right-16 sm:-bottom-20 sm:-right-20 md:-bottom-24 md:-right-24 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full bg-blue-200/20 dark:bg-blue-800/10 blur-[60px] md:blur-[80px] animate-float-delay" />
        </div>
      </div>
    ))
  ), [handleDetailClick]);

  const renderControls = () => (
    <>
      <button
        onClick={() => goTo("prev")}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 p-1.5 sm:p-2 rounded-full shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-current"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        onClick={() => goTo("next")}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 p-1.5 sm:p-2 rounded-full shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-current"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </>
  );

  const renderDots = () => (
    <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center space-x-2 z-10">
      {slides.map((_, i) => (
        <button
          key={i}
          onClick={() => goTo(i)}
          className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-current ${
            i === index 
              ? 'bg-white dark:bg-gray-300 w-4 sm:w-6' 
              : 'bg-white/50 dark:bg-gray-500/50 w-1.5 sm:w-2 hover:bg-white/80 dark:hover:bg-gray-400/50'
          }`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );

  return (
    <div
      className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg md:shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-700/50 select-none group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => isDragging && handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      <div
        ref={sliderRef}
        className="flex w-full h-64 sm:h-72 md:h-80 lg:h-96 cursor-grab active:cursor-grabbing"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: isDragging 
            ? "none" 
            : "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {renderSlides()}
      </div>

      {renderControls()}
      {renderDots()}

      {/* Animated progress bar (desktop only) */}
      {!isMobile && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50 dark:bg-gray-700/50 overflow-hidden z-10">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 via-green-500 to-purple-500 transition-all duration-500 ease-linear"
            style={{ 
              width: paused || isDragging ? '0%' : '100%',
              animation: paused || isDragging ? 'none' : 'progress 5s linear forwards'
            }}
            key={index}
          />
        </div>
      )}

      {/* Add CSS animation for progress bar */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default EnergyBannerSlider;