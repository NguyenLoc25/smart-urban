import React, { useState, useEffect, lazy, Suspense } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Mapping emails to corresponding components
const emailMapping = JSON.parse(process.env.NEXT_PUBLIC_EMAILS || "{}");

// Dynamically import components based on email
const components = {
  energy: lazy(() => import("@/components/SettingEnergy")),
  // waste: lazy(() => import("@/components/SettingWaste")),
  // home: lazy(() => import("@/components/SettingHome")),
  // garden: lazy(() => import("@/components/SettingGarden")),
};

const SettingPage = () => {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        const settingKey = emailMapping[user.email];
        if (settingKey && components[settingKey]) {
          setComponent(() => components[settingKey]);
        } else {
          setComponent(null);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Đang tải...</p>;
  }

  return Component ? (
    <Suspense fallback={<p className="text-gray-500">Đang tải...</p>}>
      <Component />
    </Suspense>
  ) : (
    <p className="text-red-500">Không có trang cài đặt phù hợp.</p>
  );
};

export default SettingPage;
