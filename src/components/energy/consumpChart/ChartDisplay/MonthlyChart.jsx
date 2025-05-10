import Plot from 'react-plotly.js';

const MonthlyChart = ({ monthlySum }) => (
    <Plot
      data={[{
        x: monthlySum.map(item => item.month),
        y: monthlySum.map(item => item.sum / 1000000),
        type: 'bar',
        marker: { 
          color: monthlySum.map(item => 
            item.sum > 1000000 ? '#ef4444' : '#f97316'
          ),
          line: { width: 1, color: 'rgba(0,0,0,0.1)' }
        },
        hovertemplate: '<b>Tháng %{x}</b><br>TB: %{y:,.3f} GWh<extra></extra>'
      }]}
      layout={{
        margin: { t: 10, b: 60, l: 50, r: 20 },
        xaxis: { 
          tickangle: 0,
          tickfont: { size: 10, color: '#6b7280' },
          automargin: true,
          gridcolor: '#f3f4f6',
          color: '#9ca3af',
          linecolor: '#374151',
          zerolinecolor: '#374151'
        },
        yaxis: { 
          tickfont: { size: 10, color: '#6b7280' },
          gridcolor: '#f3f4f6',
          color: '#9ca3af',
          linecolor: '#374151',
          zerolinecolor: '#374151'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        hoverlabel: {
          bgcolor: '#000000',
          font: { size: 11, color: '#ffffff' }
        },
        font: { color: '#9ca3af' }
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: '100%', height: '100%' }}
    />
  );
  
  export default MonthlyChart;