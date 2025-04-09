// src/services/dayNightService.js
import { db, ref, set, get } from "../lib/firebaseConfig";

const DAY_NIGHT_CYCLE_DURATION = 24 * 60 * 1000; // 24 phút (đổi sang mili giây)
const DAY_DURATION = DAY_NIGHT_CYCLE_DURATION / 2; // 12 phút cho ngày

// Hàm kiểm tra trạng thái ngày/đêm hiện tại
function calculateDayNightStatus() {
  const now = Date.now();
  const currentCycleTime = now % DAY_NIGHT_CYCLE_DURATION;
  return currentCycleTime < DAY_DURATION ? 'isDay' : 'isNight';
}

// Hàm lưu trạng thái ngày/đêm vào Firebase
// Trong dayNightService.js
async function updateDayNightStatus() {
  const status = calculateDayNightStatus();
  try {
    // Sử dụng set với reference đầy đủ
    await set(ref(db, 'dayNight/currentStatus'), {
      status: status,
      lastUpdated: Date.now()
    });
    console.log('Day/Night status updated:', status);
    return status;
  } catch (error) {
    console.error('Error updating day/night status:', error);
    throw error;
  }
}

// Hàm lấy trạng thái hiện tại (từ cache hoặc tính toán mới)
async function getCurrentDayNightStatus() {
  try {
    // Kiểm tra xem có dữ liệu trong DB không
    const snapshot = await get(ref(db, 'dayNight/currentStatus'));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const now = Date.now();
      
      // Nếu dữ liệu cũ hơn 1 phút thì cập nhật lại
      if (now - data.lastUpdated > 60 * 1000) {
        return await updateDayNightStatus();
      }
      return data.status;
    } else {
      // Nếu không có dữ liệu thì tạo mới
      return await updateDayNightStatus();
    }
  } catch (error) {
    console.error('Error getting day/night status:', error);
    throw error;
  }
}

export { updateDayNightStatus, getCurrentDayNightStatus };