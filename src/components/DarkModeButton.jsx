import { Button } from "@/components/ui/button";
import { Sun, Moon, Palette } from "lucide-react";


// Component DarkModeButton
const themes = ["light", "dark"];

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

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove(...themes);
      document.documentElement.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const icon = useMemo(() => {
    switch (theme) {
      case "dark":
        return <Sun className="w-5 h-5" />;
      case "light":
        return <Moon className="w-5 h-5" />;
      default:
        return <Palette className="w-5 h-5" />;
    }
  }, [theme]);

  const nextTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return <Button variant="outline" onClick={nextTheme}>{icon}</Button>;
};

export { DarkModeButton };