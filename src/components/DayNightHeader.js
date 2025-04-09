// src/components/DayNightHeader.js
import { useState, useEffect } from 'react';
import { db, ref, set } from '../lib/firebaseConfig';
import { getCurrentDayNightStatus, updateDayNightStatus } from '../services/dayNightService';
import styles from './DayNightHeader.module.css';

const DAY_NIGHT_CYCLE_DURATION = 24 * 60 * 1000; // 24 phút
const DAY_DURATION = DAY_NIGHT_CYCLE_DURATION / 2; // 12 phút

export default function DayNightHeader() {
  const [status, setStatus] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    fetchStatus();
    
    const timer = setInterval(() => {
      updateTimeLeft();
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const currentStatus = await getCurrentDayNightStatus();
      setStatus(currentStatus);
      updateTimeLeft();
    } catch (error) {
      console.error("Error fetching status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTimeLeft = () => {
    if (!status) return;
    
    const now = Date.now();
    const currentCycleTime = now % DAY_NIGHT_CYCLE_DURATION;
    
    if (status === 'isDay') {
      setTimeLeft(Math.max(0, DAY_DURATION - currentCycleTime));
    } else {
      if (currentCycleTime < DAY_DURATION) {
        setTimeLeft(Math.max(0, DAY_DURATION - currentCycleTime));
      } else {
        setTimeLeft(Math.max(0, DAY_NIGHT_CYCLE_DURATION - currentCycleTime));
      }
    }
  };

  const toggleStatus = async () => {
    setIsLoading(true);
    try {
      const newStatus = status === 'isDay' ? 'isNight' : 'isDay';
      await set(ref(db, 'dayNight/currentStatus'), {
        status: newStatus,
        lastUpdated: Date.now(),
        isManual: true
      });
      setStatus(newStatus);
      setIsManual(true);
    } catch (error) {
      console.error("Error toggling status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetToAuto = async () => {
    setIsLoading(true);
    try {
      await updateDayNightStatus();
      await set(ref(db, 'dayNight/currentStatus/isManual'), false);
      const currentStatus = await getCurrentDayNightStatus();
      setStatus(currentStatus);
      setIsManual(false);
    } catch (error) {
      console.error("Error resetting status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (!status) return null;

  return (
    <div className={`${styles.container} ${status === 'isDay' ? styles.isDay : styles.isNight}`}>
      <div className={styles.statusInfo}>
        <span className={styles.name}>
          {status === 'isDay' ? 'Day' : 'Night'}
          {isManual && (
            <span 
              className={styles.manualIndicator}
              title="Manual mode is active. The day/night cycle won't auto-update until reset."
            >
              *
            </span>
          )}
        </span>
        <span className={styles.subname}>Change in: {formatTime(timeLeft)}</span>
      </div>
      
      <button 
        onClick={toggleStatus}
        disabled={isLoading}
        className={styles.toggleButton}
        title="Toggle Day/Night"
      >
        {status === 'isDay' ? '🌞' : '🌙'}
      </button>
      
      {isManual && (
        <button 
          onClick={resetToAuto}
          disabled={isLoading}
          className={styles.resetButton}
          title="Reset to auto cycle"
        >
          Reset
        </button>
      )}
    </div>
  )}