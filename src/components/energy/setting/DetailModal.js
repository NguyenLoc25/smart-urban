import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const getLabel = (key, type) => {
  const labels = {
    energy_type: "Loại năng lượng",
    device_name: "Tên thiết bị",
    quantity: "Số lượng (chiếc)",
    power: type === 'solar' ? "Công suất (W)" : "Công suất (MW)",
    efficiency: "Hiệu suất (%)",
    created_at: "Ngày lắp đặt",
    size: type === 'solar' ? "Kích thước (mm)" : "Kích thước (m)",
    origin: "Nguồn gốc",
    weight: "Trọng lượng (kg)",
    flow_rate: "Lưu lượng (m³/s)",
    head_height: "Chiều cao đầu (m)",
    turbine_type: "Loại tuabin",
    status: "Trạng thái",
  };
  return labels[key] || key.replace(/_/g, " ");
};

const DetailModal = ({ open, onClose, item }) => {
  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="dark:bg-gray-800 dark:text-white">
        Chi tiết thiết bị
      </DialogTitle>
      <DialogContent className="dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 py-4">
          {Object.entries(item.info)
            .filter(([key]) => key !== "id" && key !== "type" && key !== "uuid")
            .map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {getLabel(key, item.type)}
                </label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 text-sm">
                  {key === 'created_at' ? formatDateTime(value) : 
                   (typeof value === "object" ? JSON.stringify(value) : value)}
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
      <DialogActions className="dark:bg-gray-800">
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailModal;