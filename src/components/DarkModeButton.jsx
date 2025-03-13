import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Palette } from "lucide-react";

const themes = ["light", "dark", "blue", "sepia"];

const DarkModeButton = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove(...themes);
      document.documentElement.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const nextTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <Button variant="outline" onClick={nextTheme}>
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Palette className="w-5 h-5" />
      )}
    </Button>
  );
};

export default DarkModeButton;
