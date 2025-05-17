export const energyTypes = {
    all: {
      label: "Tất cả",
      icon: "🌍",
      bgClass: "bg-gray-200 dark:bg-gray-700",
    },
    solar: {
      label: "Năng lượng mặt trời",
      icon: "☀️",
      bgClass: "bg-amber-300 dark:bg-amber-500",
    },
    wind: {
      label: "Năng lượng gió",
      icon: "🌬️",
      bgClass: "bg-teal-400 dark:bg-teal-600",
    },
    hydro: {
      label: "Năng lượng nước",
      icon: "💧",
      bgClass: "bg-blue-400 dark:bg-blue-600",
    },
  };
  
  export const systemEmails = JSON.parse(process.env.NEXT_PUBLIC_EMAILS || "{}");