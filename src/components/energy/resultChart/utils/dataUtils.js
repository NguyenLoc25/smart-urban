export const calculateMonthlySum = (entries) => {
  const monthlyGroups = {};
  
  entries.forEach(entry => {
    const monthKey = `${entry.year}-${String(entry.month).padStart(2, '0')}`;
    
    if (!monthlyGroups[monthKey]) {
      monthlyGroups[monthKey] = {
        year: entry.year,
        month: entry.month,
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

  // Chuyển đổi thành mảng và sắp xếp theo thời gian (mới nhất đầu tiên)
  const sortedMonths = Object.values(monthlyGroups).sort((a, b) => {
    return new Date(b.year, b.month - 1) - new Date(a.year, a.month - 1);
  });

  return sortedMonths;
};
  
  export const calculateEquivalent = (dailyData, monthlySum) => {
    const totalConsumption = dailyData.reduce((sum, day) => sum + day.production, 0);
    return Math.round(totalConsumption / (300 * (monthlySum.length || 1)));
  };