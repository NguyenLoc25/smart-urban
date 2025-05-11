export const CHART_COLORS = {
    wind: '#10b981',
    solar: '#f59e0b',
    hydro: '#3b82f6',
    consumption: '#8b5cf6',
    grid: '#64748b'
  }
  
  export const Y_AXIS_CONFIG = {
    yearly: {
      title: 'Công suất (TWh)',
      tickformat: ',.f',
      hoverformat: ',.f'
    },
    monthly: {
      title: 'Công suất (GWh)',
      tickformat: ',..0f',
      hoverformat: ',..0f'
    },
    hourly: {
      title: 'Công suất (GWh)',
      tickformat: ',..0f',
      hoverformat: ',..0f'
    }
  }
  
  export const MOBILE_CHART_CONFIG = {
    lineWidth: 2,
    markerSize: 6,
    fontSize: 10,
    margin: { t: 20, l: 50, r: 20, b: 70 }
  }
  
  export const DESKTOP_CHART_CONFIG = {
    lineWidth: 3,
    markerSize: 10,
    fontSize: 12,
    margin: { t: 30, l: 60, r: 30, b: 80 }
  }