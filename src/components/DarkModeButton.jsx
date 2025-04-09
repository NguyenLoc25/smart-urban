import { Button } from "@/components/ui/button";
import { Sun, Moon, Palette } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { db, ref, onValue } from "@/lib/firebaseConfig";
import VirtualClock from "@/lib/VirtualClock";

const themes = ["light", "dark"];

const DarkModeButton = () => {
  const [theme, setTheme] = useState("light");
  const [virtualTime, setVirtualTime] = useState(null);
  
  useEffect(() => {
    const clock = new VirtualClock();
    let intervalId;
  
    const init = async () => {
      await clock.postTimeToFirebase(db); // Gọi lần đầu
      intervalId = setInterval(() => clock.postTimeToFirebase(db), 1000); // Tự động cập nhật
    };
  
    init();
  
    return () => {
      clearInterval(intervalId); // Dọn dẹp interval khi unmount
    };
  }, [db]);

  // Lấy và theo dõi thời gian ảo từ Firebase
  useEffect(() => {
    const dbRef = ref(db, 'virtualClock');
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setVirtualTime(data.virtualTime);
        updateThemeBasedOnTime(data.virtualTime);
      }
    });

    return () => unsubscribe();
  }, []);

  // Cập nhật theme dựa trên thời gian ảo
  const updateThemeBasedOnTime = (time) => {
    const virtualDate = new Date(time);
    const hours = virtualDate.getHours();
    
    // Tự động chuyển dark mode từ 18h-6h (6PM-6AM)
    const isNightTime = hours <= 18 || hours > 6;
    console.log("Giờ ảo:", hours, "Đêm tối:", isNightTime); // Kiểm tra giờ ảo và trạng thái đêm tối
    // const isNightTime = hours >0;
    const newTheme = isNightTime ? "dark" : "light";
    
    setTheme(prevTheme => {
      if (prevTheme !== newTheme) {
        applyTheme(newTheme);
        return newTheme;
      }
      return prevTheme;
    });
  };

  // Áp dụng theme vào DOM
  const applyTheme = (themeToApply) => {
    document.documentElement.classList.remove(...themes);
    document.documentElement.classList.add(themeToApply);
    localStorage.setItem("theme", themeToApply);
  };

  // Khởi tạo theme ban đầu
  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme || "light";
    applyTheme(initialTheme);
    setTheme(initialTheme);
  }, []);

  // Icon tương ứng với theme
  const icon = useMemo(() => {
    switch (theme) {
      case "dark": return <Sun className="w-5 h-5" />;
      case "light": return <Moon className="w-5 h-5" />;
      default: return <Palette className="w-5 h-5" />;
    }
  }, [theme]);

  // Chuyển đổi theme thủ công
  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    applyTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <Button variant="outline" onClick={toggleTheme}>
      {icon}
    </Button>
  );
};

export { DarkModeButton };