import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get, remove, update } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
import { useMediaQuery } from "@mui/material";

import PageHeader from "./PageHeader";
import CategorySelector from "./CategorySelector";
import EnergyOverview from "./EnergyOverview";
import EnergyDataTable from "./EnergyDataTable";
import DetailModal from "./DetailModal";
import EditModal from "./EditModal";
import LoadingSkeleton from "./LoadingSkeleton";
import AuthRequiredMessage from "./AuthRequiredMessage";
import { energyTypes, systemEmails } from "./constants";

const useEnergyData = (user) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return { data, loading };
};

const useSummaryData = (data) => {
  return useMemo(() => {
    const result = {};
    let totalPower = 0;

    const parsePower = (value, type) => {
      if (typeof value === "number") return value;
      if (typeof value !== "string") return 0;

      const numValue = parseFloat(value.replace(/[^\d.-]/g, "")) || 0;

      switch (type) {
        case "solar":
          return numValue / 1000000;
        case "wind":
        case "hydro":
          return numValue;
        default:
          return numValue;
      }
    };

    Object.keys(energyTypes).forEach((type) => {
      if (type === "all") return;

      const items = data.filter((d) => d.type === type);
      const power = items.reduce((sum, item) => {
        const itemPower = parsePower(item.info.power, type) * (item.info.quantity || 1);
        return sum + itemPower;
      }, 0);

      const status = items.some((item) => item.info.status === "Active")
        ? "Active"
        : "Inactive";
      result[type] = { power, status, quantity: items.length };
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
};

const MainContent = ({ 
  loading, 
  user, 
  selectedCategory, 
  onCategorySelect, 
  summary, 
  data, 
  columns, 
  isMobile, 
  isSystemUser, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  if (loading) return <LoadingSkeleton />;
  if (!user) return <AuthRequiredMessage />;

  return (
    <>
      <CategorySelector 
        selectedCategory={selectedCategory}
        onChange={onCategorySelect}
      />
      
      {selectedCategory === "all" ? (
        <EnergyOverview 
          summary={summary} 
          onCategorySelect={onCategorySelect}
        />
      ) : (
        <EnergyDataTable 
          data={data.filter(item => item.type === selectedCategory)}
          columns={columns}
          isMobile={isMobile}
          isSystemUser={isSystemUser}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

const SettingEnergy = () => {
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const isMobile = useMediaQuery("(max-width:768px)");

  const isSystemUser = useMemo(() => {
    return user && systemEmails.hasOwnProperty(user.email);
  }, [user]);

  const { data, loading } = useEnergyData(user);
  const summary = useSummaryData(data);

  const handleSave = useCallback(
    async (editData) => {
      if (!editItem) return;
      try {
        await update(
          ref(db, `energy/physic-info/${editItem.type}/${editItem.id}`),
          editData
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
        alert("Xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa dữ liệu:", error);
      }
    }
  }, []);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200">
      <PageHeader user={user} isSystemUser={isSystemUser} />

      <div className="p-6">
        <MainContent 
          loading={loading}
          user={user}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          summary={summary}
          data={data}
          isMobile={isMobile}
          isSystemUser={isSystemUser}
          onView={setViewItem}
          onEdit={setEditItem}
          onDelete={handleDelete}
        />
      </div>

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