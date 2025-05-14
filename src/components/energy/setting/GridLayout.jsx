const GridLayout = () => {
  return (
    <div className="h-full w-full relative rounded-2xl overflow-hidden p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/30">
      {/* Enhanced glow effects with smoother animation */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-200/40 dark:bg-amber-800/30 blur-[100px] animate-pulse-slow"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-blue-200/40 dark:bg-blue-800/30 blur-[100px] animate-pulse-slow delay-1000"></div>
      
      {/* Improved grid layout with better spacing */}
      <div className="h-full w-full grid grid-cols-12 grid-rows-1 gap-6 items-stretch">
        {/* Solar Power - Enhanced card design */}
        <div className="col-span-3 h-full bg-gradient-to-br from-amber-50/80 to-amber-100/70 dark:from-amber-900/50 dark:to-amber-800/60 rounded-xl flex flex-col items-center justify-center p-6 border border-amber-200/40 dark:border-amber-700/40 shadow-sm hover:shadow-md hover:shadow-amber-200/20 dark:hover:shadow-amber-900/10 transition-all duration-300 hover:scale-[1.015] group relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ1cmwoI3NvbGFyQmcpIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMSwyIi8+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJzb2xhckJnIiBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSJyZ2JhKDI0NSwxNTgsMTEsMC4xKSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0icmdiYSgyNDUsMTU4LDExLDApIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PC9zdmc+')] opacity-10 dark:opacity-5"></div>
          <div className="text-5xl mb-5 group-hover:animate-pulse transform transition-transform duration-500">☀️</div>
          <div className="text-center z-10">
            <div className="text-lg font-medium text-amber-700/90 dark:text-amber-100/90 mb-1.5 tracking-wide">NĂNG LƯỢNG MẶT TRỜI</div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-300/90">3.2 <span className="text-xl font-normal opacity-80">MW</span></div>
            <div className="mt-3 text-xs font-medium text-amber-600/70 dark:text-amber-400/60 flex items-center justify-center">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span>
              Hoạt động ổn định
            </div>
          </div>
        </div>

        {/* Wind Power - More elegant design */}
        <div className="col-span-3 h-full bg-gradient-to-br from-blue-50/80 to-blue-100/70 dark:from-blue-900/50 dark:to-blue-800/60 rounded-xl flex flex-col items-center justify-center p-6 border border-blue-200/40 dark:border-blue-700/40 shadow-sm hover:shadow-md hover:shadow-blue-200/20 dark:hover:shadow-blue-900/10 transition-all duration-300 hover:scale-[1.015] group relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAsMTVjMCwwLDUtMTAsMTUsLTEwIiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjd2luZEJnKSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1kYXNoYXJyYXk9IjEsMiIvPjxwYXRoIGQ9Ik0zMCwzMGMwLDAsNS0xMCwxNSwtMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCN3aW5kQmcpIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMSwyIi8+PHBhdGggZD0iTTMwLDQ1YzAsMCw1LTEwLDE1LC0xMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ1cmwoI3dpbmRCZykiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2UtZGFzaGFycmF5PSIxLDIiLz48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9IndpbmRCZyIgY3g9IjMwIiBjeT0iMzAiIHI9IjMwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0icmdiYSg1OSwxMzAsMjQ5LDAuMSkiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9InJnYmEoNTksMTMwLDI0OSwwKSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==')] opacity-10 dark:opacity-5"></div>
          <div className="text-5xl mb-5 group-hover:rotate-[30deg] transform transition-transform duration-1000">🌬️</div>
          <div className="text-center z-10">
            <div className="text-lg font-medium text-blue-700/90 dark:text-blue-100/90 mb-1.5 tracking-wide">NĂNG LƯỢNG GIÓ</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-300/90">2.8 <span className="text-xl font-normal opacity-80">MW</span></div>
            <div className="mt-3 text-xs font-medium text-blue-600/70 dark:text-blue-400/60 flex items-center justify-center">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1.5"></span>
              Tốc độ gió 12 km/h
            </div>
          </div>
        </div>

        {/* City Center - Premium metro integration */}
        <div className="col-span-3 h-full bg-gradient-to-br from-gray-50/80 to-gray-100/70 dark:from-gray-800/50 dark:to-gray-700/60 rounded-xl flex flex-col items-center justify-center p-6 border border-gray-300/40 dark:border-gray-600/40 shadow-sm hover:shadow-md hover:shadow-gray-200/20 dark:hover:shadow-gray-900/10 transition-all duration-300 hover:scale-[1.015] group relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9InVybCgjY2l0eUJnKSIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iY2l0eUJnIiB4MT0iMCIgeTE9IjAiIHgyPSI2MCIgeTI9IjYwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0icmdiYSgxMDAsMTE2LDEzOSwwLjA1KSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0icmdiYSgxMDAsMTE2LDEzOSwwKSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==')] opacity-10 dark:opacity-5"></div>
          <div className="text-5xl mb-5 transform transition-transform duration-500 group-hover:translate-y-[-5px]">🏙️</div>
          <div className="text-center z-10">
            <div className="text-lg font-medium text-gray-700/90 dark:text-gray-100/90 mb-1.5 tracking-wide">TRUNG TÂM THÀNH PHỐ</div>
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-300/90">8.3 <span className="text-xl font-normal opacity-80">MW</span></div>
            <div className="mt-3 text-xs font-medium text-gray-600/70 dark:text-gray-400/60 flex items-center justify-center">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-1.5"></span>
              Mức tiêu thụ cao
            </div>
          </div>
          
          {/* Enhanced metro indicator */}
          <div className="absolute bottom-4 left-0 right-0 px-4 z-10">
            <div className="bg-gradient-to-r from-purple-100/90 to-purple-200/80 dark:from-purple-900/50 dark:to-purple-800/60 rounded-lg p-2.5 flex items-center justify-center border border-purple-300/50 dark:border-purple-700/40 shadow-inner backdrop-blur-xs">
              <div className="text-2xl mr-2 animate-pulse-slow">🚇</div>
              <div className="text-xs font-semibold text-purple-800/90 dark:text-purple-200/90 tracking-wide">TUYẾN METRO ĐANG HOẠT ĐỘNG</div>
            </div>
          </div>
        </div>

        {/* Hydro Power - Refined water effect */}
        <div className="col-span-3 h-full bg-gradient-to-br from-cyan-50/80 to-cyan-100/70 dark:from-cyan-900/50 dark:to-cyan-800/60 rounded-xl flex flex-col items-center justify-center p-6 border border-cyan-200/40 dark:border-cyan-700/40 shadow-sm hover:shadow-md hover:shadow-cyan-200/20 dark:hover:shadow-cyan-900/10 transition-all duration-300 hover:scale-[1.015] group relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAsMTVjMCwwLDAsMTUsMTUsMTVTMzAsNDUsMzAsNDVzMC0xNS0xNS0xNVMzMCwxNSwzMCwxNXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNoeWRyb0JnKSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1kYXNoYXJyYXk9IjEsMiIvPjxwYXRoIGQ9Ik0zMCwxNWMwLDAsMCwxNS0xNSwxNVMzMCw0NSwzMCw0NXMwLTE1LDE1LTE1UzMwLDE1LDMwLDE1eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ1cmwoI2h5ZHJvQmcpIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMSwyIi8+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJoeWRyb0JnIiBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSJyZ2JhKDYsMTgyLDIxMiwwLjEpIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSJyZ2JhKDYsMTgyLDIxMiwwKSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==')] opacity-10 dark:opacity-5"></div>
          <div className="text-5xl mb-5 group-hover:animate-bounce-slow transform transition-transform duration-500">💧</div>
          <div className="text-center z-10">
            <div className="text-lg font-medium text-cyan-700/90 dark:text-cyan-100/90 mb-1.5 tracking-wide">THỦY ĐIỆN</div>
            <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-300/90">4.5 <span className="text-xl font-normal opacity-80">MW</span></div>
            <div className="mt-3 text-xs font-medium text-cyan-600/70 dark:text-cyan-400/60 flex items-center justify-center">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-1.5"></span>
              Công suất tối đa
            </div>
          </div>
        </div>
      </div>

      {/* Subtle connecting lines with improved animation */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        {/* Connecting lines between elements with better positioning */}
        <path d="M25%,50% L35%,50%" stroke="url(#solarGradient)" strokeWidth="2" fill="none" strokeDasharray="6" strokeLinecap="round">
          <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M50%,50% L60%,50%" stroke="url(#windGradient)" strokeWidth="2" fill="none" strokeDasharray="6" strokeLinecap="round">
          <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
        </path>
        <path d="M75%,50% L85%,50%" stroke="url(#hydroGradient)" strokeWidth="2" fill="none" strokeDasharray="6" strokeLinecap="round">
          <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.5s" repeatCount="indefinite" begin="1s" />
        </path>
        
        {/* Improved gradients for the lines */}
        <defs>
          <linearGradient id="solarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="windGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="hydroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default GridLayout;