import BaseChart from './base-chart'
import { getYAxisConfig } from '../helpers/chart-helpers'
import { getLayoutConfig, getChartConfig } from '../styles/chart-styles'
import { CHART_COLORS } from '../constants/chart-constants'
import { generateHoverTemplate } from '../helpers/chart-helpers'

const MonthlyChart = ({ data, selectedYear, mobile = false }) => {
  if (!data || data.length === 0) return null

  const filteredData = data.filter(item => item.year === selectedYear)
  const yAxisConfig = getYAxisConfig('monthly')
  const hoverTemplate = generateHoverTemplate('monthly', yAxisConfig.hoverformat, 'GWh')

  const chartData = [
    {
      x: filteredData.map(item => item.month),
      y: filteredData.map(item => item.wind / 1000), // Convert to GWh
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
      x: filteredData.map(item => item.month),
      y: filteredData.map(item => item.solar / 1000),
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
      x: filteredData.map(item => item.month),
      y: filteredData.map(item => item.hydro / 1000),
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
    ...getLayoutConfig('monthly', mobile, selectedYear),
    yaxis: yAxisConfig,
    xaxis: {
      ...getLayoutConfig('monthly', mobile, selectedYear).xaxis,
      title: {
        text: `Tháng (Năm ${selectedYear})`,
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

  return <BaseChart data={chartData} layout={layout} config={getChartConfig('monthly', mobile)} />
}

export default MonthlyChart