import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

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

const EditModal = ({ open, onClose, item, onSave }) => {
  const [editData, setEditData] = useState(item?.info || {});

  useEffect(() => {
    setEditData(item?.info || {});
  }, [item]);

  const handleSubmit = () => {
    onSave(editData);
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="dark:bg-gray-800 dark:text-white">
        Chỉnh sửa thiết bị
      </DialogTitle>
      <DialogContent className="dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 py-4">
          {Object.entries(editData)
            .filter(([key]) => key !== "id" && key !== "type" && key !== "uuid")
            .map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {getLabel(key, item.type)}
                </label>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  type={key === 'created_at' ? "datetime-local" : "text"}
                  value={
                    key === 'created_at' ? value.slice(0, 16) :
                    (typeof value === "object" ? JSON.stringify(value) : value)
                  }
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      [key]: key === 'created_at' ? `${e.target.value}:00.000Z` : e.target.value,
                    }))
                  }
                  className="dark:bg-gray-700 dark:text-white"
                  InputLabelProps={{
                    shrink: key === 'created_at' ? true : undefined,
                  }}
                />
              </div>
            ))}
        </div>
      </DialogContent>
      <DialogActions className="dark:bg-gray-800">
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;