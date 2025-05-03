import { useState, useEffect } from 'react';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Kiểm tra nếu code đang chạy trên phía client (không phải server-side rendering)
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Thêm event listener khi component mount
    window.addEventListener('resize', handleResize);
    
    // Gọi ngay lập tức để lấy kích thước ban đầu
    handleResize();

    // Cleanup function để remove event listener khi component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array nghĩa là effect chỉ chạy một lần khi mount

  return windowSize;
};

export default useWindowSize;