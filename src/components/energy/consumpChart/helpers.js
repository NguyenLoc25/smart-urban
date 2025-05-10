export const calculateMonthlySum = (entries) => {
    const monthlyGroups = {};
    
    entries.forEach(entry => {
      const monthKey = `${entry.year}-${entry.month}`;
      
      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = {
          sum: 0,
          count: 0,
          monthName: new Date(entry.year, entry.month - 1).toLocaleString('vi-VN', { 
            month: 'short', 
            year: 'numeric' 
          })
        };
      }
      
      monthlyGroups[monthKey].sum += entry.production;
      monthlyGroups[monthKey].count += 1;
    });
  
    return Object.values(monthlyGroups).map(group => ({
      month: group.monthName,
      sum: group.sum
    }));
  };
  
  export const calculateEquivalent = (dailyData, monthCount) => {
    const totalConsumption = dailyData.reduce((sum, day) => sum + day.production, 0);
    // Average household consumption of 300 kWh/month
    return Math.round(totalConsumption / (300 * (monthCount || 1)));
  };