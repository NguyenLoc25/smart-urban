// firebaseDayNightService.js
import { db } from '../../lib/firebaseAdmin.js'; 

const DAY_NIGHT_CYCLE_DURATION = 6 * 60 * 1000;
const DAY_DURATION = DAY_NIGHT_CYCLE_DURATION / 2;

function getDayNightStatus() {
  const now = Date.now();
  const currentCycleTime = now % DAY_NIGHT_CYCLE_DURATION;
  return currentCycleTime < DAY_DURATION ? 'isDay' : 'isNight';
}

async function writeDayNightStatusToDB_Admin(status) {
  await db.ref('waste/dayNight/currentStatus').set({
    status,
    lastUpdated: Date.now()
  });
}

export { getDayNightStatus, writeDayNightStatusToDB_Admin };
