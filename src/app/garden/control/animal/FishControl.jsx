"use client";

import { useEffect, useState, useRef } from "react";
import { db, ref, set, onValue } from "@/lib/firebaseConfig";
import { Switch } from "@/components/ui/switch";

export default function FishFeeding() {
  const [isFeeding, setIsFeeding] = useState(false);
  const [autoFeed, setAutoFeed] = useState(false);
  const [feedInterval, setFeedInterval] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [waterLevel, setWaterLevel] = useState(null);
  const intervalRef = useRef(null);
  const userHasInteracted = useRef(false);

  const feedOnce = async () => {
    setIsFeeding(true);
    const feedRef = ref(db, "garden/fish/eating");
    try {
      await set(feedRef, true);
      setTimeout(async () => {
        await set(feedRef, false);
        setIsFeeding(false);
      }, 3000);
    } catch (error) {
      console.error("Feed error:", error);
      setIsFeeding(false);
    }
  };

  const startAutoFeed = () => {
    intervalRef.current = setInterval(feedOnce, feedInterval * 1000);
  };

  const stopAutoFeed = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleToggleAutoFeed = (checked) => {
    userHasInteracted.current = true;
    if (checked) {
      setShowModal(true);
    } else {
      setAutoFeed(false);
      stopAutoFeed();
      set(ref(db, "garden/fish/autoFeed"), false);
    }
  };

  const confirmAutoFeed = () => {
    setAutoFeed(true);
    setShowModal(false);
    set(ref(db, "garden/fish/autoFeed"), true);
    startAutoFeed();
  };

  const cancelAutoFeed = () => {
    setShowModal(false);
  };

  const handleManualFeed = () => {
    if (!autoFeed) feedOnce();
  };

  // Lắng nghe mực nước từ Firebase
  useEffect(() => {
    const autoFeedRef = ref(db, "garden/fish/autoFeed");
    const waterRef = ref(db, "garden/fish/waterlevel");

    const unsubAuto = onValue(autoFeedRef, (snapshot) => {
      const isAuto = snapshot.val();
      if (!userHasInteracted.current) {
        setAutoFeed(isAuto);
        if (isAuto) startAutoFeed();
      }
    });

    const unsubWater = onValue(waterRef, (snapshot) => {
      const rawValue = snapshot.val();
      if (typeof rawValue === "number") {
        const percent = Math.min(Math.round(rawValue), 100);
        setWaterLevel(percent);
        console.log("💧 Nhận từ Firebase:", percent);
      }
    });

    return () => {
      stopAutoFeed();
      unsubAuto();
      unsubWater();
    };
  }, []);


  return (
    <>
      <div className="p-4 rounded-xl shadow-md bg-white max-w-sm w-full space-y-4 mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold">🐟 Fish</h2>
          <Switch checked={autoFeed} onCheckedChange={handleToggleAutoFeed} />
        </div>

        <div className="text-sm text-gray-700">
          🌊 Mực nước: {waterLevel !== null ? `${waterLevel}%` : "đang tải..."}
        </div>

        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${waterLevel || 0}%` }}
          ></div>
        </div>

        <button
          onClick={handleManualFeed}
          disabled={isFeeding || autoFeed}
          className={`w-full px-4 py-2 rounded-lg text-white font-medium transition text-sm ${
            isFeeding || autoFeed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isFeeding ? "Đang cho ăn..." : "🍤 Cho cá ăn"}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white w-full max-w-xs p-5 rounded-xl shadow-lg space-y-4">
            <h3 className="text-center text-base font-semibold">
              ⏲️ Nhập khoảng thời gian (giây)
            </h3>
            <input
              type="number"
              min="3"
              value={feedInterval}
              onChange={(e) => setFeedInterval(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelAutoFeed}
                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
              >
                Hủy
              </button>
              <button
                onClick={confirmAutoFeed}
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
