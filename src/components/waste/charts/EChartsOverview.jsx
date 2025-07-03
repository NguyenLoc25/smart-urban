'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import ReactEChartsCore from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  PieChart,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  CanvasRenderer
])

export function EChartsOverview() {
  const containerRef = useRef(null)
  const [ready, setReady] = useState(false)

  // ✅ KHÔNG dùng <boolean> vì file là .jsx
  const [isDarkMode, setIsDarkMode] = useState(() =>
    typeof window !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false
  )

  // Theo dõi thay đổi class="dark"
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark')
      setIsDarkMode(isDark)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    return () => observer.disconnect()
  }, [])

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

    const data = [
      { name: 'Hữu cơ', value: 7150 },
      { name: 'Tái chế được', value: 3510 },
      { name: 'Không tái chế', value: 2340 }
    ]

    const textColor = isDarkMode ? '#f3f4f6' : '#1F2937'
    const tooltipBg = isDarkMode ? '#1f2937ee' : '#ffffffee'
    const tooltipBorder = isDarkMode ? '#374151' : '#ccc'

    return {
      backgroundColor: 'transparent',
      title: {
        text: 'Phân loại rác thải tại TP.HCM năm 2024',
        left: 'center',
        top: 10,
        textStyle: {
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          fontSize: 18,
          fontWeight: 'bold',
          color: textColor
        }
      },
      textStyle: {
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        fontSize: 14,
        fontWeight: 500,
        color: textColor
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        textStyle: {
          color: textColor
        },
        formatter: '{b}: {c} tấn/ngày ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        top: 'center',
        textStyle: {
          fontSize: 14,
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          color: textColor
        }
      },
      series: [
        {
          name: 'Phân loại rác 2024',
          type: 'pie',
          radius: '70%',
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}: {d}%',
            fontSize: 14,
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontWeight: 500,
            color: textColor
          },
          labelLine: {
            length: 20,
            length2: 10,
            smooth: true
          },
          data,
          color: ['#22c55e', '#3b82f6', '#f97316']
        }
      ]
    }
  }, [ready, isDarkMode])

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
