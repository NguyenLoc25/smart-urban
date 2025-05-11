import BaseChart from './base-chart'
import { getYAxisConfig } from '../helpers/chart-helpers'
import { getLayoutConfig, getChartConfig } from '../styles/chart-styles'
import { CHART_COLORS } from '../constants/chart-constants'
import { generateHoverTemplate } from '../helpers/chart-helpers'

const HourlyChart = ({ data, mobile = false }) => {
  if (!data || data.length === 0) return null

  const yAxisConfig = getYAxisConfig('hourly')
  const hoverTemplate = generateHoverTemplate('hourly', yAxisConfig.hoverformat, 'GWh')

  const chartData = [
    {
      x: data.map(item => item.hour),
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
      x: data.map(item => item.hour),
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
      x: data.map(item => item.hour),
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
    yaxis: yAxisConfig,
    xaxis: {
      ...getLayoutConfig('hourly', mobile).xaxis,
      range: mobile ? [0, 3] : null,
      title: {
        text: 'Giờ',
        font: { 
          size: mobile ? 12 : 14, 
          color: '#4b5563', 
          family: 'Inter, sans-serif' 
        }
      }
    },
    margin: { 
      t: mobile ? 20 : 30,
      l: mobile ? 50 : 60,
      r: mobile ? 20 : 30,
      b: mobile ? 70 : 80 
    }
  }

  return <BaseChart data={chartData} layout={layout} config={getChartConfig('hourly', mobile)} />
}

export default HourlyChart