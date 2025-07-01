import { db, ref, onValue } from "@/lib/firebaseConfig"; // ✅ dùng db đã export

export function listenToSensorData(callback) {
  const tempRef = ref(db, "garden/nhietdo");
  const humidRef = ref(db, "garden/doam");

  let temp = null;
  let humid = null;

  const checkAndUpdate = () => {
    if (temp !== null && humid !== null) {
      callback({ temperature: temp, humidity: humid });
    }
  };

  onValue(tempRef, (snapshot) => {
    temp = snapshot.val();
    checkAndUpdate();
  });

  onValue(humidRef, (snapshot) => {
    humid = snapshot.val();
    checkAndUpdate();
  });
}
