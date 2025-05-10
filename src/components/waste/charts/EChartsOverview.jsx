'use client'

import { useEffect, useRef, useState } from 'react'
import ReactEChartsCore from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer
])

export function EChartsOverview() {
  const containerRef = useRef(null) // ✅ đã bỏ <HTMLDivElement>
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (containerRef.current && containerRef.current.clientWidth > 0) {
        setReady(true)
      }
    }, 100)

    return () => clearTimeout(timeout)
  }, [])

  const option = {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { fontSize: 13 } },
    grid: { left: '3%', right: '4%', bottom: '12%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5']
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '{value}' }
    },
    series: [
      {
        name: 'Nhựa',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3, color: '#3b82f6' },
        itemStyle: { color: '#3b82f6' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3b82f688' },
            { offset: 1, color: '#ffffff00' }
          ])
        },
        data: [400, 300, 200, 278, 189]
      },
      {
        name: 'Hữu cơ',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3, color: '#22c55e' },
        itemStyle: { color: '#22c55e' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#22c55e88' },
            { offset: 1, color: '#ffffff00' }
          ])
        },
        data: [240, 139, 980, 390, 480]
      }
    ]
  }

  return (
    <div ref={containerRef} style={{ height: 400, width: '100%' }}>
      {ready ? (
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: '100%', width: '100%' }}
        />
      ) : (
        <div className="text-sm text-gray-400 italic">Đang tải biểu đồ...</div>
      )}
    </div>
  )
}
