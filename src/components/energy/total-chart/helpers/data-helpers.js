export const validateEnergyData = (data) => {
    if (!data) return false
    
    const requiredFields = ['yearly', 'monthly', 'hourly']
    const hasRequiredFields = requiredFields.every(field => field in data)
    
    if (!hasRequiredFields) return false
  
    // Validate each data type
    return Object.entries(data).every(([key, value]) => {
      if (!Array.isArray(value)) return false
      
      if (key === 'yearly') {
        return value.every(item => 
          'year' in item && 
          'wind' in item && 
          'solar' in item && 
          'hydro' in item
        )
      }
      
      if (key === 'monthly') {
        return value.every(item => 
          'year' in item && 
          'month' in item && 
          'wind' in item && 
          'solar' in item && 
          'hydro' in item
        )
      }
      
      if (key === 'hourly') {
        return value.every(item => 
          'hour' in item && 
          'wind' in item && 
          'solar' in item && 
          'hydro' in item
        )
      }
      
      return true
    })
  }
  
  export const processRawData = (rawData) => {
    try {
      return {
        yearly: rawData.yearly.map(item => ({
          year: parseInt(item.year),
          wind: parseFloat(item.wind),
          solar: parseFloat(item.solar),
          hydro: parseFloat(item.hydro)
        })),
        monthly: rawData.monthly.map(item => ({
          year: parseInt(item.year),
          month: parseInt(item.month),
          wind: parseFloat(item.wind),
          solar: parseFloat(item.solar),
          hydro: parseFloat(item.hydro)
        })),
        hourly: rawData.hourly.map(item => ({
          hour: parseInt(item.hour),
          wind: parseFloat(item.wind),
          solar: parseFloat(item.solar),
          hydro: parseFloat(item.hydro)
        }))
      }
    } catch (error) {
      console.error('Data processing error:', error)
      return null
    }
  }