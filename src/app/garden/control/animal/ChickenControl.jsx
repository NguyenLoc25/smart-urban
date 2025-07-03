"use client";

import { useEffect, useState, useRef } from "react";
import { db, ref, set, onValue } from "@/lib/firebaseConfig";
import { Switch } from "@/components/ui/switch";

export default function ChickenFeeding() {
  const [isFeeding, setIsFeeding] = useState(false);
  const [autoFeed, setAutoFeed] = useState(false);
  const [feedInterval, setFeedInterval] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const intervalRef = useRef(null);
  const userHasInteracted = useRef(false);

  const feedOnce = async () => {
    setIsFeeding(true);
    const feedRef = ref(db, "garden/chicken/eating");
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
    intervalRef.current = setInterval(() => {
      feedOnce();
    }, feedInterval * 1000);
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
      set(ref(db, "garden/chicken/autoFeed"), false);
    }
  };

  const confirmAutoFeed = () => {
    setAutoFeed(true);
    setShowModal(false);
    set(ref(db, "garden/chicken/autoFeed"), true);
    startAutoFeed();
  };

  const cancelAutoFeed = () => {
    setShowModal(false);
  };

  const handleManualFeed = () => {
    if (!autoFeed) feedOnce();
  };

  useEffect(() => {
    const autoFeedRef = ref(db, "garden/chicken/autoFeed");
    const tempRef = ref(db, "garden/chicken/heating/temperature");
    const humiRef = ref(db, "garden/chicken/heating/humidity");

    const unsubAuto = onValue(autoFeedRef, (snapshot) => {
      const isAuto = snapshot.val();
      if (!userHasInteracted.current) {
        setAutoFeed(isAuto);
        if (isAuto) startAutoFeed();
      }
    });

    const unsubTemp = onValue(tempRef, (snapshot) => {
      setTemperature(snapshot.val());
    });

    const unsubHumi = onValue(humiRef, (snapshot) => {
      setHumidity(snapshot.val());
    });

    return () => {
      stopAutoFeed();
      unsubAuto();
      unsubTemp();
      unsubHumi();
    };
  }, []);

  return (
    <>
      <div className="p-4 rounded-xl shadow-md bg-white max-w-sm w-full space-y-4 mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold">🐔 Chicken</h2>
          <Switch checked={autoFeed} onCheckedChange={handleToggleAutoFeed} />
        </div>

        {/* Temperature and Humidity */}
        <div className="text-sm text-gray-700">
          🌡️ Nhiệt độ: {temperature !== null ? `${temperature} °C` : "đang tải..."}
        </div>
        <div className="text-sm text-gray-700">
          💧 Độ ẩm: {humidity !== null ? `${humidity} %` : "đang tải..."}
        </div>

        {/* Feeding Button */}
        <button
          onClick={handleManualFeed}
          disabled={isFeeding || autoFeed}
          className={`w-full px-4 py-2 rounded-lg text-white font-medium transition text-sm ${
            isFeeding || autoFeed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {isFeeding ? "Đang cho ăn..." : "🌽 Cho gà ăn"}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white w-full max-w-xs p-5 rounded-xl shadow-lg space-y-4">
            <h3 className="text-center text-base font-semibold">⏲️ Nhập khoảng thời gian (giây)</h3>
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
                className="px-4 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
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

