"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import BannerSlider from "@/components/waste/BannerSlider";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-400/10 to-green-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start pb-8">
        {/* Enhanced Banner */}
        <div className="w-full max-w-6xl mx-auto px-6 mt-6">
          <div className="aspect-[669/180] overflow-hidden rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm">
            <BannerSlider
              effect="fade"
              imageClassName="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative flex flex-col lg:flex-row items-center justify-between max-w-7xl w-full px-6 mt-12 gap-12">
          {/* Enhanced Text content */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 backdrop-blur-sm">
                <span className="text-sm font-medium text-green-700 dark:text-green-300">🌍 Thân thiện với môi trường</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Smart Waste
                </span>
              </h1>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-2xl">
              Hệ thống quản lý rác thải thông minh hiện đại nhất
              <br className="hidden lg:block" />
              <span className="font-semibold text-green-600 dark:text-green-400">Thu gom • Phân loại • Tái chế • Tự động hóa</span>
            </p>

            <div className="flex justify-center lg:justify-start">
              <Link href="/waste/dashboard">
                <Button className="px-8 py-4 text-lg rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold">
                  🚀 Bắt đầu giám sát
                </Button>
              </Link>
            </div>


          </div>

          {/* Enhanced Animation Container */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-2 border-green-200 dark:border-green-700 animate-pulse"></div>
              <div className="absolute inset-4 rounded-full border-2 border-blue-200 dark:border-blue-700 animate-pulse animation-delay-1000"></div>
              
              {/* Main animation container */}
              <div className="relative w-72 h-72 lg:w-80 lg:h-80 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-6 flex items-center justify-center border border-white/20 backdrop-blur-sm">
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <DotLottieReact
                    src="https://lottie.host/c990c666-beb3-4493-85b8-f6cab1bbfc00/WHpCpAh6KY.lottie"
                    autoplay
                    loop
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full shadow-lg animate-bounce"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg animate-bounce animation-delay-500"></div>
              <div className="absolute top-1/2 -left-8 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg animate-bounce animation-delay-1000"></div>
            </div>
          </div>
        </section>


      </div>
    </div>
  );
}