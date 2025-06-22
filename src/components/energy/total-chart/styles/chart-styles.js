import { Y_AXIS_CONFIG } from '../constants/chart-constants'

export const getChartConfig = (viewMode, isMobile) => ({
  responsive: true,
  scrollZoom: true,
  displaylogo: false,
  modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
  modeBarButtonsToAdd: isMobile ? [] : [
    {
      name: 'Toggle Dark Mode',
      icon: {
        width: 1000,
        height: 1000,
        path: 'M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z',
        transform: 'matrix(1 0 0 -1 0 1000)'
      },
      click: function(gd) {
        document.documentElement.classList.toggle('dark')
      }
    }
  ]
})

export const getLayoutConfig = (viewMode, isMobile, selectedYear) => ({
  xaxis: {
    title: {
      text: viewMode === 'yearly' ? 'Năm' : 
            viewMode === 'monthly' ? `Tháng (Năm ${selectedYear})` : 'Giờ',
      font: { 
        size: isMobile ? 12 : 14, 
        color: '#4b5563', 
        family: 'Inter, sans-serif' 
      }
    },
    gridcolor: '#e5e7eb',
    linecolor: '#e5e7eb',
    tickfont: { 
      size: isMobile ? 10 : 12,
      color: '#4b5563', 
      family: 'Inter, sans-serif' 
    },
    showgrid: true,
    zerolinecolor: '#e5e7eb'
  },
  plot_bgcolor: 'rgba(0,0,0,0)',
  paper_bgcolor: 'rgba(0,0,0,0)',
  hoverlabel: {
    bgcolor: '#1f2937',
    font: { 
      color: 'white', 
      size: isMobile ? 10 : 12, 
      family: 'Inter, sans-serif' 
    },
    bordercolor: '#1f2937'
  },
  transition: {
    duration: 300,
    easing: 'cubic-in-out'
  },
  font: {
    family: 'Inter, sans-serif'
  }
})

export const getYAxisConfig = (viewMode) => Y_AXIS_CONFIG[viewMode] || {
  title: 'Công suất (MW)',
  tickformat: ',.0f',
  hoverformat: ',.0f'
}