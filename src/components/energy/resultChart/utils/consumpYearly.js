export function getMonthlyConsumption(year, month) {
    const config = {
        baseYear: 2024,
        baseMonth: 3, // Tháng 3/2024
        baseCapacity: 2623, // GWh
        growthRate: {
            residential: 0.15, // 15%/năm → ~1.25%/tháng
            industrial: 0.053, // 5.3%/năm → ~0.44%/tháng
        },
        monthlyAdjustments: {
            6: 1.25,  // Hè
            7: 1.25,
            8: 1.25,
            12: 1.1    // Đông
        },
        maxCapacity: 3200 // Giới hạn tối đa (nếu cần)
    };

    // Tính số tháng đã qua
    const monthsPassed = (year - config.baseYear) * 12 + (month - config.baseMonth);

    // Tính tăng trưởng theo tháng
    const residentialGrowth = Math.pow(1 + config.growthRate.residential / 12, monthsPassed);
    const industrialGrowth = Math.pow(1 + config.growthRate.industrial / 12, monthsPassed);

    // Tính công suất (60% hộ gia đình, 40% công nghiệp)
    let totalCapacity = config.baseCapacity * (0.6 * residentialGrowth + 0.4 * industrialGrowth);

    // Áp dụng điều chỉnh theo tháng
    if (config.monthlyAdjustments[month]) {
        totalCapacity *= config.monthlyAdjustments[month];
    }

    // Giới hạn tối đa (nếu cần)
    if (config.maxCapacity && totalCapacity > config.maxCapacity) {
        totalCapacity = config.maxCapacity;
    }

    return Math.round(totalCapacity);
}


export const getCityCapacity = (cityCapacity) => {
    return cityCapacity ? Math.round(cityCapacity) : 10;
};