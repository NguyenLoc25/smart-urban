"use client";

import { useEffect, useState } from "react";
import { auth, db, ref, get } from "@/lib/firebaseConfig";

const HomePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchData(currentUser.email);
      } else {
        setData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchData = async (userEmail) => {
    setLoading(true);
    let dataPath = "";

    if (userEmail === "energy@project.com") dataPath = "energy";
    if (userEmail === "waste@project.com") dataPath = "waste";
    if (userEmail === "home@project.com") dataPath = "home";
    if (userEmail === "garden@project.com") dataPath = "garden";

    if (dataPath) {
      const dataRef = ref(db, dataPath);
      const snapshot = await get(dataRef);
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        setData("Không có dữ liệu.");
      }
    }
    setLoading(false);
  };

  if (!user) return <p>Vui lòng đăng nhập.</p>;
  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      <h2>Xin chào, {user.email}</h2>
      <h3>Dữ liệu của bạn:</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default HomePage;
