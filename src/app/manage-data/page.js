"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { ref, get } from "firebase/database";
import CreateCollectionButton from "@/components/CreateCollectionButton";

const ManageDataPage = () => {
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

    // Xác định đường dẫn dữ liệu theo email người dùng
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
        setData(null);
      }
    }
    setLoading(false);
  };

  if (!user) return <p>Vui lòng đăng nhập.</p>;
  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
        <CreateCollectionButton />
      <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Quản lý dữ liệu Firebase
        </h1>
        {data ? (
          <ul className="list-disc list-inside space-y-2">
            {Object.keys(data).map((key) => (
              <li key={key} className="text-gray-700 font-medium">
                <span className="font-bold text-indigo-500">{key}: </span>
                {JSON.stringify(data[key])}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Không có dữ liệu.</p>
        )}
      </div>
    </div>
  );
};

export default ManageDataPage;
