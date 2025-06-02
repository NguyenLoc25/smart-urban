export const energyTypes = {
    hydro: {
      name: "Thủy điện",
      maxSlots: 2,
      color: "blue",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      models: [],
    },
    wind: {
      name: "Điện gió",
      maxSlots: 50,
      color: "green",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      models: [],
    },
    solar: {
      name: "Điện mặt trời",
      maxSlots: 4000000,
      color: "amber",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      models: [],
    }
  };
  
  export const colorClasses = {
    blue: {
      bg: "bg-blue-500",
      bgLight: "bg-blue-100",
      text: "text-blue-600",
      bgDark: "dark:bg-blue-900/30",
      textDark: "dark:text-blue-400"
    },
    green: {
      bg: "bg-green-300",
      bgLight: "bg-green-100",
      text: "text-green-600",
      bgDark: "dark:bg-green-900/30",
      textDark: "dark:text-green-400"
    },
    amber: {
      bg: "bg-amber-500",
      bgLight: "bg-amber-100",
      text: "text-amber-600",
      bgDark: "dark:bg-amber-900/30",
      textDark: "dark:text-amber-400"
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-600 dark:text-purple-400"
    },
    red: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400"
    }
  };

  