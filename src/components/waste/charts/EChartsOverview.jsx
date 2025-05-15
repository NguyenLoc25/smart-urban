'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import ReactEChartsCore from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
  DataZoomComponent,
  ToolboxComponent
])

export function EChartsOverview() {
  const containerRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (containerRef.current?.clientWidth > 0) {
        setReady(true)
      }
    }, 100)
    return () => clearTimeout(timeout)
  }, [])

  const option = useMemo(() => {
    if (!ready) return null

    const years = ['2018', '2019', '2020', '2021', '2022', '2023']
    const dataOrganic = [6500, 6400, 6300, 6200, 6100, 6000]
    const dataNonRecyclable = [2500, 2600, 2700, 2800, 2900, 3000]
    const dataRecyclable = [1000, 1000, 1000, 1000, 1000, 1000]

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#ffffffee',
        borderColor: '#ccc',
        textStyle: { color: '#111' }
      },
      legend: {
        bottom: 10,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 12 }
      },
      grid: { left: '5%', right: '5%', top: '8%', bottom: '20%', containLabel: true },
      toolbox: {
        feature: {
          saveAsImage: { title: 'Lưu ảnh' },
          restore: { title: 'Khôi phục' },
          dataZoom: { title: { zoom: 'Phóng to', back: 'Thu nhỏ' } },
        },
        right: 15,
        top: 10,
        iconStyle: {
          borderColor: '#4b5563',
          borderWidth: 1.5
        },
        emphasis: {
          iconStyle: {
            color: '#10b981'
          }
        }
      },
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        {
          type: 'slider',
          height: 18,
          bottom: 0,
          start: 0,
          end: 100,
          borderColor: '#d1d5db',
          handleSize: '100%',
          handleStyle: { color: '#10b981' },
          textStyle: { color: '#6b7280' }
        }
      ],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#d1d5db' } },
        axisTick: { show: false },
        axisLabel: { fontSize: 12, color: '#374151' },
        data: years
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#e5e7eb' } },
        axisLabel: { fontSize: 12, color: '#4b5563' }
      },
      series: [
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
          data: dataOrganic
        },
        {
          name: 'Không tái chế',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { width: 3, color: '#f97316' },
          itemStyle: { color: '#f97316' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#f9731688' },
              { offset: 1, color: '#ffffff00' }
            ])
          },
          data: dataNonRecyclable
        },
        {
          name: 'Tái chế được',
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
          data: dataRecyclable
        }
      ]
    }
  }, [ready])

  return (
    <div ref={containerRef} style={{ height: 400, width: '100%' }}>
      {ready && option ? (
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
