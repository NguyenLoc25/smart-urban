import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get, remove, update } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
import GridLayout from "@/components/GridLayout";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, IconButton, Tooltip, CircularProgress, Select, MenuItem, useMediaQuery } from "@mui/material";
import { FaEdit, FaTrash, FaTimes, FaEye } from "react-icons/fa";
import CreateCollectionButton from "@/components/CreateCollectionButton";

const systemEmails = JSON.parse(process.env.NEXT_PUBLIC_EMAILS || "{}");

const energyTypes = {
  all: { label: "Tất cả", icon: "🌍" },
  solar: { label: "Năng lượng mặt trời", icon: "☀️" },
  wind: { label: "Năng lượng gió", icon: "🌬️" },
  hydro: { label: "Năng lượng nước", icon: "💧" },
};

const positions = Array.from({ length: 6 }, (_, row) =>
  Array.from({ length: 6 }, (_, col) => `${row + 1}-${col + 1}`)
).flat();

const SettingEnergy = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editData, setEditData] = useState({});
  const isMobile = useMediaQuery('(max-width:768px)');

  const isSystemUser = useMemo(() => {
    return user && systemEmails.hasOwnProperty(user.email);
  }, [user]);

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

  const handleViewClick = useCallback((item) => {
    setViewItem(item);
  }, []);

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
    { 
      accessorKey: "type", 
      header: "Loại năng lượng", 
      size: isMobile ? 100 : 150,
      Cell: ({ cell }) => (
        <span className="truncate">
          {cell.getValue()}
        </span>
      )
    },
    { 
      accessorKey: "info.question_header", 
      header: "Tiêu đề", 
      size: isMobile ? 150 : 200,
      Cell: ({ cell }) => (
        <span className="truncate">
          {cell.getValue()}
        </span>
      )
    },
    { 
      accessorKey: "info.status", 
      header: "Trạng thái", 
      size: isMobile ? 80 : 100 
    },
    {
      header: "Hành động",
      size: isMobile ? 100 : 150,
      Cell: ({ row }) => (
        <Box display="flex" gap={1}>
          {isSystemUser ? (
            <>
              <Tooltip title="Chỉnh sửa">
                <IconButton size={isMobile ? "small" : "medium"} onClick={() => handleEditClick(row.original)}>
                  <FaEdit color="blue" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xóa">
                <IconButton size={isMobile ? "small" : "medium"} onClick={() => handleDelete(row.original.id, row.original.type)}>
                  <FaTrash color="red" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Xem chi tiết">
              <IconButton size={isMobile ? "small" : "medium"} onClick={() => handleViewClick(row.original)}>
                <FaEye color="green" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ], [handleEditClick, handleDelete, handleViewClick, isSystemUser, isMobile]);

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md dark:shadow-none border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Thông tin Năng lượng</h2>
        {user && isSystemUser && (
          <div className="flex items-center gap-4 w-full md:w-auto">
            <CreateCollectionButton className="w-full md:w-auto" />
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <CircularProgress className="text-blue-500" />
        </div>
      ) : user ? (
        <>
          <div className="mb-6 md:mb-8">
          <Select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)} 
              sx={{ 
                minWidth: isMobile ? '100%' : 220,
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused': {
                  backgroundColor: 'white',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
                  borderColor: '#3b82f6',
                },
                '&:hover': {
                  backgroundColor: '#f9fafb',
                }
              }}
            >
              {Object.entries(energyTypes).map(([key, { label, icon }]) => (
                <MenuItem 
                  key={key} 
                  value={key}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    padding: '10px 16px',
                    fontSize: '0.95rem',
                    color: '#374151',
                    '&:hover': {
                      backgroundColor: '#f3f4f6',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                    }
                  }}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{label}</span>
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <MaterialReactTable 
                columns={columns} 
                data={data.filter((item) => selectedCategory === "all" || item.type === selectedCategory)} 
                enableSorting 
                enableFilters 
                muiTableContainerProps={{
                    sx: { 
                        maxHeight: isMobile ? 'auto' : 'calc(100vh - 320px)',
                        backgroundColor: 'white',
                      }
                }}
                muiTablePaperProps={{
                  sx: {
                    boxShadow: 'none',
                    border: 'none',
                    backgroundColor: 'transparent',
                    width: '100%',
                  }
                }}
                muiTableBodyCellProps={{
                  sx: {
                    borderColor: '#f3f4f6',
                    backgroundColor: 'white',
                    padding: isMobile ? '8px' : '16px',
                  },
                }}
                muiTableHeadCellProps={{
                  sx: {
                    backgroundColor: '#f9fafb',
                    color: '#111827',
                    fontWeight: 600,
                    borderColor: '#e5e7eb',
                    padding: isMobile ? '8px' : '16px',
                  },
                }}
              />
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">Bố cục lưới</h3>
              <GridLayout />
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-red-500 font-medium">Vui lòng đăng nhập để xem dữ liệu.</p>
        </div>
      )}

      {/* Modal xem chi tiết */}
      {viewItem && (
  <div 
    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-2 sm:p-4"
    onClick={(e) => e.target === e.currentTarget && setViewItem(null)}
  >
    <div className="bg-white rounded-xl shadow-2xl w-[90%] sm:max-w-lg max-h-[80vh] flex flex-col border border-gray-200">
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-800">Chi tiết thông tin</h3>
        <button 
          onClick={() => setViewItem(null)} 
          className="text-gray-500 hover:text-red-500 transition-colors p-1"
        >
          <FaTimes className="text-lg sm:text-xl" />
        </button>
      </div>
      <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {Object.entries(viewItem.info).map(([key, value]) => key !== "id" && key !== "type" && (
          <div key={key} className="space-y-1 sm:space-y-2">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {key.replace(/_/g, ' ')}:
            </label>
            <div className="mt-1 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 text-sm sm:text-base">
              {typeof value === 'object' ? JSON.stringify(value) : value}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 sm:p-5 border-t border-gray-200 flex justify-end">
        <button 
          onClick={() => setViewItem(null)} 
          className="px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
)}


      {/* Modal chỉnh sửa */}
      {editItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setViewItem(null)}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">Chỉnh sửa thông tin</h3>
              <button 
                onClick={() => setEditItem(null)} 
                className="text-gray-500 hover:text-red-500 transition-colors p-1"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
              {Object.entries(editData).map(([key, value]) => key !== "id" && key !== "type" && (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/_/g, ' ')}:
                  </label>
                  <input
                    type="text"
                    value={typeof value === 'object' ? JSON.stringify(value) : value}
                    onChange={(e) => setEditData((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                  />
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-gray-200 flex justify-end gap-4">
              <button 
                onClick={() => setEditItem(null)} 
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium"
              >
                Hủy
              </button>
              <button 
                onClick={handleSave} 
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingEnergy;