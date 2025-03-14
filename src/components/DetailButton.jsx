import React from "react";
import { motion } from "framer-motion";

const DetailButton = ({ onClick, isDetailVisible }) => {
  return (
    <motion.button
      onClick={onClick}
      className="absolute top-2 right-2 px-4 py-2 border rounded-lg text-black dark:text-white border-black dark:border-white bg-transparent transition-all duration-300 "
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      whileHover={{ opacity: 0.6 }}
    >
      {isDetailVisible ? "Ẩn chi tiết" : "Xem chi tiết"}
    </motion.button>
  );
};

export default DetailButton;
