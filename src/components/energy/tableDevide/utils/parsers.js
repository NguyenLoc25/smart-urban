export const parseFirebaseNumber = (value, defaultValue = 0) => {
    if (typeof value === "number") return value;
    if (value === null || value === undefined) return defaultValue;
  
    try {
      const cleaned = String(value)
        .replace(/%/g, "")
        .replace(/,/g, "")
        .replace(/[^\d.-]/g, "");
  
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? defaultValue : parsed;
    } catch (error) {
      console.error("Error parsing value:", value, error);
      return defaultValue;
    }
  };
  
  export const countModels = (models) => {
    if (!models || !Array.isArray(models)) return {};
    
    const countMap = {};
    models.forEach((model) => {
      if (model) {
        countMap[model] = (countMap[model] || 0) + 1;
      }
    });
    return countMap;
  };