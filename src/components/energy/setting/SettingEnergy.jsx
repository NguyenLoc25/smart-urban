import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get, remove, update } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  CircularProgress,
  Select,
  MenuItem,
  useMediaQuery,
  TextField,
} from "@mui/material";
import { FaEdit, FaTrash, FaTimes, FaEye } from "react-icons/fa";
import CreateCollectionButton from "@/components/energy/setting/CreateCollectionButton";

// Constants
const systemEmails = JSON.parse(process.env.NEXT_PUBLIC_EMAILS || "{}");

const energyTypes = {
  all: {
    label: "Tất cả",
    icon: "🌍",
    bgClass: "bg-gray-200 dark:bg-gray-700",
  },
  solar: {
    label: "Năng lượng mặt trời",
    icon: "☀️",
    bgClass: "bg-amber-300 dark:bg-amber-500",
  },
  wind: {
    label: "Năng lượng gió",
    icon: "🌬️",
    bgClass: "bg-teal-400 dark:bg-teal-600",
  },
  hydro: {
    label: "Năng lượng nước",
    icon: "💧",
    bgClass: "bg-blue-400 dark:bg-blue-600",
  },
};

const getStatusColor = (status) => {
  return status === "Active" ? "#4caf50" : "#9e9e9e";
};

// Helper Components
const AuthRequiredMessage = () => (
  <div className="text-center py-16">
    <div className="mx-auto w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
      <svg
        className="w-8 h-8 text-red-500 dark:text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
      Authentication Required
    </h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
      Please sign in to view energy data and analytics
    </p>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      ))}
    </div>
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
  </div>
);

const EnergyTypeCard = ({ type, stat, onClick }) => {
  const { icon, bgClass, label } = energyTypes[type];
  
  return (
    <div 
      className={`${bgClass} rounded-xl p-5 shadow-sm cursor-pointer transition-all hover:shadow-md text-white`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-90">{label}</p>
          <p className="text-2xl font-bold mt-2">
            {stat.power || 0} <span className="text-sm font-normal">kW</span>
          </p>
        </div>
        <div className="relative">
          <span className="text-3xl opacity-90">{icon}</span>
          {stat.status && (
            <span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
              style={{ backgroundColor: getStatusColor(stat.status) }}
            />
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs opacity-80">Utilization</span>
        <span className="text-sm font-medium">
          {stat.percentage || 0}%
        </span>
      </div>
      <div className="mt-2 h-1.5 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full"
          style={{ width: `${stat.percentage || 0}%` }}
        />
      </div>
    </div>
  );
};

const DetailModal = ({ open, onClose, item }) => {
  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="dark:bg-gray-800 dark:text-white">
        Device Details
      </DialogTitle>
      <DialogContent className="dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 py-4">
          {Object.entries(item.info)
            .filter(([key]) => key !== "id" && key !== "type")
            .map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {key.replace(/_/g, " ")}
                </label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 text-sm">
                  {typeof value === "object" ? JSON.stringify(value) : value}
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
      <DialogActions className="dark:bg-gray-800">
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
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
        Edit Device
      </DialogTitle>
      <DialogContent className="dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 py-4">
          {Object.entries(editData)
            .filter(([key]) => key !== "id" && key !== "type")
            .map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {key.replace(/_/g, " ")}
                </label>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={
                    typeof value === "object" ? JSON.stringify(value) : value
                  }
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
            ))}
        </div>
      </DialogContent>
      <DialogActions className="dark:bg-gray-800">
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CategorySelector = ({ selectedCategory, onChange }) => (
  <div className="mb-8">
    <Select
      value={selectedCategory}
      onChange={(e) => onChange(e.target.value)}
      className="w-full sm:w-64"
      sx={{
        "& .MuiSelect-select": {
          py: 1.5,
          borderRadius: "12px",
          backgroundColor: "background.paper",
          color: "text.primary",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
      }}
    >
      {Object.entries(energyTypes).map(([key, { label, icon }]) => (
        <MenuItem key={key} value={key}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className="font-medium">{label}</span>
          </div>
        </MenuItem>
      ))}
    </Select>
  </div>
);

const EnergyOverview = ({ summary, onCategorySelect }) => (
  <div className="lg:col-span-3">
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        Energy Overview
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(energyTypes)
          .filter(([type]) => type !== "all")
          .map(([type, { icon, bgClass }]) => {
            const stat = summary[type] || {};
            return (
              <EnergyTypeCard
                key={type}
                type={type}
                stat={stat}
                onClick={() => onCategorySelect(type)}
              />
            );
          })}
      </div>
    </div>
  </div>
);

const EnergyDataTable = ({ data, columns, isMobile, isSystemUser, onView, onEdit, onDelete }) => (
  <div className="lg:col-span-2">
    <div className="bg-gray-800 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs overflow-hidden">
      <MaterialReactTable
        columns={columns}
        data={data}
        enableSorting
        enableFilters
        muiTableContainerProps={{
          sx: {
            maxHeight: isMobile ? "auto" : "calc(100vh - 320px)",
          },
        }}
        muiTablePaperProps={{
          sx: {
            boxShadow: "none",
            border: "none",
            backgroundColor: "transparent",
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: "background.default",
            color: "text.primary",
            fontWeight: 600,
            borderBottom: "1px solid",
            borderColor: "divider",
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            borderBottom: "1px solid",
            borderColor: "divider",
          },
        }}
      />
    </div>
  </div>
);


// Main Component
const SettingEnergy = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const isMobile = useMediaQuery("(max-width:768px)");

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
        setLoading(true);
        const snapshot = await get(ref(db, "energy/physic-info"));
        if (snapshot.exists()) {
          const rawData = Object.entries(snapshot.val()).flatMap(([type, items]) =>
            Object.entries(items).map(([id, info]) => ({ id, type, info }))
          );
          setData(rawData);
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

  const handleSave = useCallback(
    async (editData) => {
      if (!editItem) return;
      try {
        await update(
          ref(db, `energy/physic-info/${editItem.type}/${editItem.id}`),
          editData
        );
        setData((prev) =>
          prev.map((item) =>
            item.id === editItem.id ? { ...item, info: editData } : item
          )
        );
        alert("Cập nhật thành công!");
      } catch (error) {
        console.error("Lỗi khi cập nhật dữ liệu:", error);
      }
    },
    [editItem]
  );

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

  const columns = useMemo(
    () => [
      {
        accessorKey: "type",
        header: "Loại năng lượng",
        size: isMobile ? 100 : 150,
      },
      {
        accessorKey: "info.device_name",
        header: "Tiêu đề",
        size: isMobile ? 150 : 200,
      },
      {
        accessorKey: "info.status",
        header: "Trạng thái",
        size: isMobile ? 100 : 120,
        Cell: ({ cell }) => (
          <span
            style={{
              color: cell.getValue() === "Active" ? "#4caf50" : "#9e9e9e",
              fontWeight: 500,
            }}
          >
            {cell.getValue() === "Active" ? "Hoạt động" : "Không hoạt động"}
          </span>
        ),
      },
      {
        header: "Hành động",
        size: isMobile ? 100 : 150,
        Cell: ({ row }) => (
          <Box display="flex" gap={1}>
            <Tooltip title="Xem chi tiết">
              <IconButton
                size={isMobile ? "small" : "medium"}
                onClick={() => setViewItem(row.original)}
              >
                <FaEye color="green" />
              </IconButton>
            </Tooltip>
            {isSystemUser && (
              <>
                <Tooltip title="Chỉnh sửa">
                  <IconButton
                    size={isMobile ? "small" : "medium"}
                    onClick={() => setEditItem(row.original)}
                  >
                    <FaEdit color="blue" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xóa">
                  <IconButton
                    size={isMobile ? "small" : "medium"}
                    onClick={() => handleDelete(row.original.id, row.original.type)}
                  >
                    <FaTrash color="red" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        ),
      },
    ],
    [handleDelete, isSystemUser, isMobile]
  );

  const summary = useMemo(() => {
    const result = {};
    let totalPower = 0;

    const parsePower = (value, type) => {
      if (typeof value === "number") return value;
      if (typeof value !== "string") return 0;

      const numValue = parseFloat(value.replace(/[^\d.-]/g, "")) || 0;

      switch (type) {
        case "solar":
          return numValue / 1000;
        case "wind":
        case "hydro":
          return numValue * 1000;
        default:
          return numValue;
      }
    };

    Object.keys(energyTypes).forEach((type) => {
      if (type === "all") return;

      const items = data.filter((d) => d.type === type);
      const power = items.reduce((sum, item) => {
        const itemPower = parsePower(item.info.power, type);
        return sum + itemPower;
      }, 0);

      const status = items.some((item) => item.info.status === "Active")
        ? "Active"
        : "Inactive";
      result[type] = { power, status };
      totalPower += power;
    });

    const allPower = Object.values(result).reduce(
      (sum, item) => sum + item.power,
      0
    );
    result.all = {
      power: allPower,
      status: Object.values(result).some((item) => item.status === "Active")
        ? "Active"
        : "Inactive",
    };

    Object.keys(result).forEach((type) => {
      result[type].percentage =
        totalPower > 0 ? ((result[type].power / totalPower) * 100).toFixed(1) : 0;
      result[type].power = parseFloat(result[type].power.toFixed(2));
    });

    return result;
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Energy Information Dashboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitor and manage your energy resources
          </p>
        </div>

        {user && isSystemUser && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <CreateCollectionButton className="w-full sm:w-auto" />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6">
        {loading ? (
          <LoadingSkeleton />
        ) : !user ? (
          <AuthRequiredMessage />
        ) : (
          <>
            <CategorySelector 
              selectedCategory={selectedCategory}
              onChange={setSelectedCategory}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
              {selectedCategory === "all" ? (
                <EnergyOverview 
                  summary={summary} 
                  onCategorySelect={setSelectedCategory}
                />
              ) : (
                <>
                  <EnergyDataTable 
                    data={data.filter(item => item.type === selectedCategory)}
                    columns={columns}
                    isMobile={isMobile}
                    isSystemUser={isSystemUser}
                    onView={setViewItem}
                    onEdit={setEditItem}
                    onDelete={handleDelete}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <DetailModal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        item={viewItem}
      />
      <EditModal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        item={editItem}
        onSave={handleSave}
      />
    </div>
  );
};

export default SettingEnergy;