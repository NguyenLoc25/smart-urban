import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get, remove, update } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
import GridLayout from "@/components/GridLayout";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, IconButton, Tooltip, CircularProgress, Select, MenuItem } from "@mui/material";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import CreateCollectionButton from "@/components/CreateCollectionButton";

const energyTypes = {
  all: { label: "Tất cả", icon: "🌍" },
  solar: { label: "Năng lượng mặt trời", icon: "☀️" },
  wind: { label: "Năng lượng gió", icon: "🌬️" },
  water: { label: "Năng lượng nước", icon: "💧" },
};

const positions = Array.from({ length: 6 }, (_, row) =>
  Array.from({ length: 6 }, (_, col) => `${row + 1}-${col + 1}`)
).flat();



const SettingEnergy = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editItem, setEditItem] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, "energy/physic-info"));
        if (snapshot.exists()) {
          setData(Object.entries(snapshot.val()).flatMap(([type, items]) =>
            Object.entries(items).map(([id, info]) => ({ id, type, info }))
          ));
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleEditClick = useCallback((item) => {
    setEditItem(item);
    setEditData(item.info);
  }, []);

  const handleSave = useCallback(async () => {
    if (!editItem) return;
    try {
      await update(ref(db, `energy/physic-info/${editItem.type}/${editItem.id}`), editData);
      setData((prev) => prev.map((item) => (item.id === editItem.id ? { ...item, info: editData } : item)));
      setEditItem(null);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
  }, [editData, editItem]);

  const handleDelete = useCallback(async (id, type) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
      try {
        await remove(ref(db, `energy/physic-info/${type}/${id}`));
        setData((prev) => prev.filter((item) => item.id !== id));
        alert("Xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa dữ liệu:", error);
      }
    }
  }, []);

  const columns = useMemo(() => [
    { accessorKey: "type", header: "Loại năng lượng", size: 150 },
    { accessorKey: "info.question_header", header: "Tiêu đề", size: 200 },
    { accessorKey: "info.status", header: "Trạng thái", size: 100 },
    {
      header: "Hành động",
      size: 150,
      Cell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Chỉnh sửa">
            <IconButton onClick={() => handleEditClick(row.original)}>
              <FaEdit color="blue" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton onClick={() => handleDelete(row.original.id, row.original.type)}>
              <FaTrash color="red" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], [handleEditClick, handleDelete]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Thông tin Năng lượng</h2>
      {loading ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
      ) : user ? (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2}>
            <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} sx={{ minWidth: 200 }}>
              {Object.entries(energyTypes).map(([key, { label, icon }]) => (
                <MenuItem key={key} value={key}>{icon} {label}</MenuItem>
              ))}
            </Select>
            <CreateCollectionButton />
          </Box>
          <Box display="flex" gap={4}>
            <Box flex={2}>
              <MaterialReactTable columns={columns} data={data.filter((item) => selectedCategory === "all" || item.type === selectedCategory)} enableSorting enableFilters />
            </Box>
            <Box flex={1} className="p-4 border rounded-lg bg-gray-100">
                <GridLayout />
            </Box>
          </Box>
        </>
      ) : <p className="text-red-500">Vui lòng đăng nhập để xem dữ liệu.</p>}

      {editItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <button onClick={() => setEditItem(null)} className="absolute top-4 right-4">
              <FaTimes className="text-gray-500 hover:text-red-500 text-2xl" />
            </button>
            <h3 className="text-2xl font-bold mb-4 text-center">Chỉnh sửa thông tin</h3>
            <div className="max-h-[400px] overflow-y-auto space-y-4 px-2">
              {Object.entries(editData).map(([key, value]) => key !== "id" && key !== "type" && (
                <div key={key} className="flex flex-col">
                  <label className="font-medium text-gray-700">{key}:</label>
                  <input type="text" value={value} onChange={(e) => setEditData((prev) => ({ ...prev, [key]: e.target.value }))} className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400" />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingEnergy;
