export const getYAxisConfig = (viewMode) => {
    switch(viewMode) {
      case 'yearly':
        return {
          title: 'Công suất (TWh)',
          tickformat: ',.f',
          hoverformat: ',.f'
        };
      case 'monthly':
        return {
          title: 'Công suất (GWh)',
          tickformat: ',..0f',
          hoverformat: ',..0f'
        };
      case 'hourly':
        return {
          title: 'Công suất (GWh)',
          tickformat: ',..0f',
          hoverformat: ',..0f'
        };
      default:
        return {
          title: 'Công suất (MW)',
          tickformat: ',.0f',
          hoverformat: ',.0f'
        };
    }
  };
  
  export const getDisplayUnit = (viewMode) => {
    switch(viewMode) {
      case 'yearly': return 'TWh';
      case 'monthly': return 'GWh';
      case 'hourly': return 'GWh';
      default: return 'MW';
    }
  };
  
  export const convertDataUnit = (value, viewMode) => {
    switch(viewMode) {
      case 'yearly': 
        return value;
      case 'monthly':
        return value / 1000;
      case 'hourly': 
        return value / 1000000;
      default:
        return value;
    }
  };