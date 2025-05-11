import BaseChart from './base-chart'
import { getYAxisConfig } from '../helpers/chart-helpers'
import { getLayoutConfig, getChartConfig } from '../styles/chart-styles'
import { CHART_COLORS } from '../constants/chart-constants'

const YearlyChart = ({ data, mobile = false }) =>  {
  const chartData = [
    {
      x: data.map(item => item.year),
      y: data.map(item => item.wind),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Điện gió',
      line: { 
        color: CHART_COLORS.wind, 
        width: 3, 
        shape: 'spline' 
      },
      marker: { 
        size: 10, 
        color: CHART_COLORS.wind, 
        symbol: 'circle' 
      },
      hovertemplate: '<b>Năm %{x}</b><br>%{y:,.f} TWh<extra></extra>',
      fill: 'tozeroy',
      fillcolor: `${CHART_COLORS.wind}20`
    },
    {
      x: data.map(item => item.year),
      y: data.map(item => item.solar),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Điện mặt trời',
      line: { 
        color: CHART_COLORS.solar, 
        width: 3, 
        shape: 'spline' 
      },
      marker: { 
        size: 10, 
        color: CHART_COLORS.solar, 
        symbol: 'diamond' 
      },
      hovertemplate: '<b>Năm %{x}</b><br>%{y:,.f} TWh<extra></extra>',
      fill: 'tozeroy',
      fillcolor: `${CHART_COLORS.solar}20`
    },
    {
      x: data.map(item => item.year),
      y: data.map(item => item.hydro),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Thủy điện',
      line: { 
        color: CHART_COLORS.hydro, 
        width: 3, 
        shape: 'spline' 
      },
      marker: { 
        size: 10, 
        color: CHART_COLORS.hydro, 
        symbol: 'square' 
      },
      hovertemplate: '<b>Năm %{x}</b><br>%{y:,.f} TWh<extra></extra>',
      fill: 'tozeroy',
      fillcolor: `${CHART_COLORS.hydro}20`
    }
  ]

  const layout = {
    ...getLayoutConfig('yearly', false),
    yaxis: getYAxisConfig('yearly'),
    legend: { 
      orientation: "h",
      y: -0.25,
      x: 0.5,
      xanchor: 'center',
      font: { 
        size: 12, 
        family: 'Inter, sans-serif', 
        color: '#1f2937' 
      },
      bgcolor: 'rgba(255,255,255,0.9)',
      bordercolor: '#e5e7eb',
      borderwidth: 1
    },
    margin: { t: 30, l: 60, r: 30, b: 80 }
  }

  return <BaseChart data={chartData} layout={layout} config={getChartConfig('yearly', false)} />
}

export default YearlyChart