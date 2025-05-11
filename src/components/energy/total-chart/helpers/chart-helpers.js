// helpers/chart-helpers.js

/**
 * Converts data units based on view mode
 * @param {number} value - The original value
 * @param {string} viewMode - Current view mode ('yearly', 'monthly', 'hourly')
 * @returns {number} Converted value
 */
export const convertDataUnit = (value, viewMode) => {
    switch(viewMode) {
      case 'yearly': 
        return value; // TWh
      case 'monthly':
        return value / 1000; // Convert to GWh
      case 'hourly': 
        return value / 1000000; // Convert to GWh
      default:
        return value;
    }
  }
  
  /**
   * Gets the display unit for current view mode
   * @param {string} viewMode - Current view mode
   * @returns {string} Display unit
   */
  export const getDisplayUnit = (viewMode) => {
    switch(viewMode) {
      case 'yearly': return 'TWh';
      case 'monthly': return 'GWh';
      case 'hourly': return 'GWh';
      default: return 'MW';
    }
  }
  
  /**
   * Gets Y-axis configuration for Plotly chart
   * @param {string} viewMode - Current view mode
   * @returns {object} Y-axis configuration
   */
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
  }

  
  /**
   * Filters data by selected year
   * @param {Array} data - Original data array
   * @param {number} year - Selected year
   * @returns {Array} Filtered data
   */
  export const filterDataByYear = (data, year) => {
    if (!data || !Array.isArray(data)) return [];
    return data.filter(item => item.year === year);
  }
  
  /**
   * Gets available years from monthly data
   * @param {Array} monthlyData - Monthly data array
   * @returns {Array} Sorted array of unique years
   */
  export const getAvailableYears = (monthlyData) => {
    if (!monthlyData || !Array.isArray(monthlyData)) return [];
    return [...new Set(monthlyData.map(item => item.year))].sort((a, b) => a - b);
  }
  
  /**
   * Generates hover template for Plotly traces
   * @param {string} viewMode - Current view mode
   * @param {string} hoverFormat - Format string for values
   * @param {string} unit - Display unit
   * @returns {string} Hover template string
   */
  export const generateHoverTemplate = (viewMode, hoverFormat, unit) => {
    const xLabel = viewMode === 'yearly' ? 'Năm %{x}' : 
                   viewMode === 'monthly' ? 'Tháng %{x}' : 'Giờ %{x}';
    return `<b>${xLabel}</b><br>%{y:${hoverFormat}} ${unit}<extra></extra>`;
  }
  
  /**
   * Gets initial range for mobile view
   * @param {string} viewMode - Current view mode
   * @returns {Array|null} Range array or null
   */
  export const getInitialRange = (viewMode) => {
    if (viewMode === 'yearly') return [2020, 2023];
    if (viewMode === 'hourly') return [0, 3];
    return null;
  }