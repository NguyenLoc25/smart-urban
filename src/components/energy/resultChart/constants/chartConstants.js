export const chartLayout = {
    margin: { t: 20, b: 80, l: 60, r: 40 },
    xaxis: { 
      tickangle: 0,
      tickfont: { size: 11, color: '#6b7280' },
      automargin: true,
      gridcolor: '#f3f4f6',
      color: '#9ca3af',
      linecolor: '#374151',
      zerolinecolor: '#374151'
    },
    yaxis: { 
      tickfont: { size: 11, color: '#6b7280' },
      gridcolor: '#f3f4f6',
      color: '#9ca3af',
      linecolor: '#374151',
      zerolinecolor: '#374151'
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    hoverlabel: {
      bgcolor: '#000000',
      font: { 
        size: 12,
        color: '#ffffff'
      },
      bordercolor: '#000000'
    },
    font: {
      color: '#9ca3af'
    }
  };
  
  export const chartConfig = { 
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'hoverCompareCartesian', 'hoverClosestCartesian'],
    modeBarButtonsToAdd: [{ 
      name: 'Tải xuống',
      icon: { 
        'width': 500,
        'height': 500,
        'path': 'M450 0H50C22.4 0 0 22.4 0 50v400c0 27.6 22.4 50 50 50h400c27.6 0 50-22.4 50-50V50c0-27.6-22.4-50-50-50zM238.4 409.6c0 11.2-9.6 20.8-20.8 20.8s-20.8-9.6-20.8-20.8V256l-68.8 68.8c-4 4-9.6 6.4-14.4 6.4s-10.4-2.4-14.4-6.4c-8.8-8.8-8.8-22.4 0-31.2l96-96c8.8-8.8 22.4-8.8 31.2 0l96 96c8.8 8.8 8.8 22.4 0 31.2-8.8 8.8-22.4 8.8-31.2 0l-68.8-68.8v153.6z',
        'transform': 'matrix(1 0 0 -1 0 500)'
      },
      click: function(gd) { 
        Plotly.downloadImage(gd, {format: 'png', width: 800, height: 600, filename: 'bieu-do-san-luong-dien'});
      }
    }]
  };