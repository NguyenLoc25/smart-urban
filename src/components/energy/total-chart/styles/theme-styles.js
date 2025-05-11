export const lightTheme = {
    bgColor: '#ffffff',
    textColor: '#1f2937',
    borderColor: '#e5e7eb',
    cardBg: '#f9fafb',
    chartBg: 'rgba(0,0,0,0)',
    gridColor: '#e5e7eb'
  }
  
  export const darkTheme = {
    bgColor: '#111827',
    textColor: '#f3f4f6',
    borderColor: '#374151',
    cardBg: '#1f2937',
    chartBg: 'rgba(0,0,0,0)',
    gridColor: '#374151'
  }
  
  export const getThemeStyles = (isDark) => 
    isDark ? darkTheme : lightTheme