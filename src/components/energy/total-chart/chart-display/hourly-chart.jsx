
import BaseChart from './base-chart'
import { getYAxisConfig } from '../helpers/chart-helpers'
import { getLayoutConfig, getChartConfig } from '../styles/chart-styles'
import { CHART_COLORS } from '../constants/chart-constants'
import { generateHoverTemplate } from '../helpers/chart-helpers'

const HourlyChart = ({ data, mobile = false }) => {
  if (!data || data.length === 0) return null

    // Convert hour values from 0-23 to 1-24
  const hours = data.map(item => item.hour)

  const yAxisConfig = getYAxisConfig('hourly')
  const hoverTemplate = generateHoverTemplate('hourly', yAxisConfig.hoverformat, 'GWh')

  const chartData = [
    {
      x: hours,
      y: data.map(item => item.wind / 1000000), // Convert to GWh
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Điện gió',
      line: { 
        color: CHART_COLORS.wind, 
        width: mobile ? 2 : 3,
        shape: 'spline' 
      },
      marker: { 
        size: mobile ? 6 : 10,
        color: CHART_COLORS.wind,
        symbol: 'circle' 
      },
      hovertemplate: hoverTemplate,
      fill: 'tozeroy',
      fillcolor: `${CHART_COLORS.wind}20`
    },
    {
      x: hours,
      y: data.map(item => item.solar / 1000000),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Điện mặt trời',
      line: { 
        color: CHART_COLORS.solar, 
        width: mobile ? 2 : 3,
        shape: 'spline' 
      },
      marker: { 
        size: mobile ? 6 : 10,
        color: CHART_COLORS.solar,
        symbol: 'diamond' 
      },
      hovertemplate: hoverTemplate,
      fill: 'tozeroy',
      fillcolor: `${CHART_COLORS.solar}20`
    },
    {
      x: hours,
      y: data.map(item => item.hydro / 1000000),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Thủy điện',
      line: { 
        color: CHART_COLORS.hydro, 
        width: mobile ? 2 : 3,
        shape: 'spline' 
      },
      marker: { 
        size: mobile ? 6 : 10,
        color: CHART_COLORS.hydro,
        symbol: 'square' 
      },
      hovertemplate: hoverTemplate,
      fill: 'tozeroy',
      fillcolor: `${CHART_COLORS.hydro}10`
    }
  ]

  const layout = {
    ...getLayoutConfig('hourly', mobile),
    yaxis: {
      ...yAxisConfig,
      title: {
        text: yAxisConfig.title,
        font: { 
          size: mobile ? 12 : 14, 
          color: '#4b5563', 
          family: 'Inter, sans-serif' 
        }
      },
      gridcolor: '#e5e7eb',
      linecolor: '#e5e7eb',
      tickfont: { 
        size: mobile ? 10 : 12,
        color: '#4b5563', 
        family: 'Inter, sans-serif' 
      },
      rangemode: 'tozero',
      zerolinecolor: '#e5e7eb'
    },
    xaxis: {
      ...getLayoutConfig('hourly', mobile).xaxis,
      title: {
        text: 'Giờ',
        font: { 
          size: mobile ? 12 : 14, 
          color: '#4b5563', 
          family: 'Inter, sans-serif' 
        }
      },
      gridcolor: '#e5e7eb',
      linecolor: '#e5e7eb',
      tickfont: { 
        size: mobile ? 10 : 12,
        color: '#4b5563', 
        family: 'Inter, sans-serif' 
      },
      showgrid: true,
      zerolinecolor: '#e5e7eb',
      range: [5, 15] // Hiển thị từ giờ 5 đến giờ 15
    },
    legend: { 
      orientation: "h",
      y: mobile ? -0.3 : -0.25,
      x: 0.5,
      xanchor: 'center',
      font: { 
        size: mobile ? 10 : 12, 
        family: 'Inter, sans-serif', 
        color: '#1f2937' 
      },
      bgcolor: 'rgba(255,255,255,0.9)',
      bordercolor: '#e5e7eb',
      borderwidth: 1
    },
    margin: { 
      t: mobile ? 20 : 30,
      l: mobile ? 50 : 60,
      r: mobile ? 20 : 30,
      b: mobile ? 70 : 80 
    },
    hoverlabel: {
      bgcolor: '#1f2937',
      font: { 
        color: 'white', 
        size: mobile ? 10 : 12, 
        family: 'Inter, sans-serif' 
      },
      bordercolor: '#1f2937'
    }
  }

  const config = {
    ...getChartConfig('hourly', mobile),
    scrollZoom: true,
    modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
    modeBarButtonsToAdd: mobile ? [] : [
      {
        name: 'Toggle Dark Mode',
        icon: {
          width: 1000,
          height: 1000,
          path: 'M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z',
          transform: 'matrix(1 0 0 -1 0 1000)'
        },
        click: function(gd) {
          // Function to toggle dark mode
        }
      }
    ]
  }

  return <BaseChart data={chartData} layout={layout} config={getChartConfig('hourly', mobile)} />
}

export default HourlyChart