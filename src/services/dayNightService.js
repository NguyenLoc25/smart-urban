// src/services/dayNightService.js
import { db, ref, set, get, onValue } from "../lib/firebaseConfig";

const DAY_NIGHT_CYCLE_DURATION = 6 * 60 * 1000; // 24 phút (đổi sang mili giây)
const DAY_DURATION = DAY_NIGHT_CYCLE_DURATION / 2; // 12 phút cho ngày

// Hàm kiểm tra trạng thái ngày/đêm hiện tại
function calculateDayNightStatus() {
  const now = Date.now();
  const currentCycleTime = now % DAY_NIGHT_CYCLE_DURATION;
  const isDay = currentCycleTime < DAY_DURATION;
  
  console.log(`Calculating status: 
    Now: ${now}
    CycleTime: ${currentCycleTime}
    DayDuration: ${DAY_DURATION}
    IsDay: ${isDay}`);
  
  return isDay ? 'isDay' : 'isNight';
}

// Hàm lưu trạng thái ngày/đêm vào Firebase
async function updateDayNightStatus() {
  const status = calculateDayNightStatus();
  try {
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

function startAutoUpdateListener(callback) {
  const statusRef = ref(db, 'dayNight/currentStatus');
  
  // Hàm kiểm tra và cập nhật
  const checkAndUpdate = async (data) => {
    if (!data || data.isManual) return;
    
    const now = Date.now();
    const currentCycleTime = now % DAY_NIGHT_CYCLE_DURATION;
    const shouldBeDay = currentCycleTime < DAY_DURATION;
    const currentShouldBeDay = data.status === 'isDay';
    
    if (shouldBeDay !== currentShouldBeDay) {
      console.log('Auto-updating day/night status');
      await updateDayNightStatus();
      callback(shouldBeDay ? 'isDay' : 'isNight');
    }
  };

  // Lắng nghe thay đổi từ Firebase
  const unsubscribe = onValue(statusRef, (snapshot) => {
    if (snapshot.exists()) {
      checkAndUpdate(snapshot.val());
    }
  });

  // Kiểm tra mỗi giây để đảm bảo không bỏ lỡ
  const intervalId = setInterval(() => {
    get(ref(db, 'dayNight/currentStatus')).then((snapshot) => {
      if (snapshot.exists()) {
        checkAndUpdate(snapshot.val());
      }
    });
  }, 1000);

  return () => {
    unsubscribe();
    clearInterval(intervalId);
  };
}

export { updateDayNightStatus, getCurrentDayNightStatus, startAutoUpdateListener };