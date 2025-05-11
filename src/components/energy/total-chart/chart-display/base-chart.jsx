import dynamic from 'next/dynamic'
import LoadingState from '../states/loading-state'

const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false,
  loading: () => <LoadingState small />
})

const BaseChart = ({ data, layout, config }) => {
  return (
    <Plot
      data={data}
      layout={layout}
      config={config}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  )
}

export default BaseChart