"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from 'next/navigation';

const slides = [
  {
    id: 1,
    title: "TỔNG QUAN HỆ THỐNG IoT",
    subtitle: "Giám sát năng lượng tái tạo thời gian thực",
    bg: "bg-gradient-to-br from-amber-100 via-white to-blue-100 dark:from-amber-900/30 dark:via-gray-900 dark:to-blue-900/30",
    icon: "🌐",
    stats: "Kết nối 150+ thiết bị IoT",
    color: "text-amber-600 dark:text-amber-300",
    highlight: "from-amber-400 to-amber-600",
    link: "/energy/iot"  // Added link for IoT overview
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
    link: "/energy/iot/windplace"  // Added link for wind farm
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
    link: "/energy/iot/solarplace"  // Added link for solar farm
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
    link: "/energy/iot/daynight"  // Added link for day/night cycle
  }
];

const EnergyBannerSlider = () => {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);
  const startX = useRef(null);
  const dragOffset = useRef(0);

  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto slide (disabled on mobile)
  useEffect(() => {
    if (paused || isMobile) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [paused, isMobile]);

  // Navigation
  const goTo = (dir) => {
    setIndex((prev) =>
      dir === "next"
        ? (prev + 1) % slides.length
        : (prev - 1 + slides.length) % slides.length
    );
  };

  // Handle touch/drag events
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
    const threshold = isMobile ? 50 : 80; // Smaller threshold for mobile
    let newIndex = index;

    if (dragOffset.current > threshold) {
      newIndex = (index - 1 + slides.length) % slides.length;
    } else if (dragOffset.current < -threshold) {
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
  };

  // Handle detail button click
  const handleDetailClick = (e, link) => {
    e.preventDefault();
    router.push(link);
  };

  // Mobile-optimized slide rendering
  const renderSlides = () => (
    slides.map((slide) => (
      <div
        key={slide.id}
        className={`w-full flex-shrink-0 h-full ${slide.bg} flex flex-col md:flex-row items-center justify-center md:justify-between p-6 md:p-12 relative overflow-hidden`}
      >
        <div className="max-w-2xl z-10 space-y-3 md:space-y-4 text-center md:text-left">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {isMobile ? slide.subtitle.split(' ').slice(0, 3).join(' ') + '...' : slide.subtitle}
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
        
        {/* Icon - hidden on small mobile, smaller on medium mobile */}
        <div className="hidden xs:block text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] opacity-20 md:opacity-30 transform rotate-12 transition-transform duration-500 hover:scale-110 mt-6 md:mt-0">
          {slide.icon}
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-16 -left-16 sm:-top-20 sm:-left-20 md:-top-24 md:-left-24 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full bg-amber-200/20 dark:bg-amber-800/10 blur-[60px] md:blur-[80px] animate-float" />
          <div className="absolute -bottom-16 -right-16 sm:-bottom-20 sm:-right-20 md:-bottom-24 md:-right-24 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full bg-blue-200/20 dark:bg-blue-800/10 blur-[60px] md:blur-[80px] animate-float-delay" />
        </div>
      </div>
    ))
  );

  // Mobile-friendly controls
  const renderControls = () => (
    <>
      <button
        onClick={() => goTo("prev")}
        className="hidden sm:block absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 p-1.5 sm:p-2 rounded-full shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        onClick={() => goTo("next")}
        className="hidden sm:block absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 p-1.5 sm:p-2 rounded-full shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </>
  );

  // Mobile swipe indicators
  const renderSwipeHint = () => (
    <div className="sm:hidden absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-2 z-10">
      <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17l-5-5 5-5M21 17l-5-5 5-5"/>
        </svg>
        <span>Vuốt để chuyển</span>
      </div>
    </div>
  );

  const renderDots = () => (
    <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center space-x-2 z-10">
      {slides.map((_, i) => (
        <button
          key={i}
          onClick={() => setIndex(i)}
          className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-300 ${
            i === index ? 'bg-white dark:bg-gray-300 w-4 sm:w-6' : 'bg-white/50 dark:bg-gray-500/50 w-1.5 sm:w-2'
          }`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );

  return (
    <div
      className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg md:shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-700/50 select-none group"
      onMouseEnter={() => !isMobile && setPaused(true)}
      onMouseLeave={() => !isMobile && setPaused(false)}
      onMouseDown={(e) => !isMobile && handleStart(e.clientX)}
      onMouseMove={(e) => !isMobile && isDragging && handleMove(e.clientX)}
      onMouseUp={() => !isMobile && handleEnd()}
      onTouchStart={(e) => isMobile && handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => isMobile && handleMove(e.touches[0].clientX)}
      onTouchEnd={() => isMobile && handleEnd()}
    >
      <div
        ref={sliderRef}
        className="flex w-full h-64 sm:h-72 md:h-80 lg:h-96 cursor-grab active:cursor-grabbing"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: isDragging ? "none" : `transform ${isMobile ? '0.5s' : '0.7s'} cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        {renderSlides()}
      </div>

      {renderControls()}
      {isMobile ? renderSwipeHint() : renderDots()}

      {/* Animated progress bar (desktop only) */}
      {!isMobile && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50 dark:bg-gray-700/50 overflow-hidden z-10">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 via-green-500 to-purple-500 transition-all duration-500 ease-linear"
            style={{ 
              width: paused ? '0%' : '100%',
              animation: paused ? 'none' : 'progress 5s linear forwards'
            }}
            key={index}
          />
        </div>
      )}
    </div>
  );
};

export default EnergyBannerSlider;
