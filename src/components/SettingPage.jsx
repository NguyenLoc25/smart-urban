import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get, remove, update } from "firebase/database";
import { FaSolarPanel, FaWind, FaWater, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { db } from "@/lib/firebaseConfig";
import CreateCollectionButton from "@/components/CreateCollectionButton";

const ICONS = {
  solar: <FaSolarPanel className="text-yellow-400 text-6xl" />,
  wind: <FaWind className="text-blue-400 text-6xl" />,
  water: <FaWater className="text-teal-400 text-6xl" />,
};

const categories = ["solar", "wind", "water"];

const SettingEnergy = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [editItem, setEditItem] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dataRef = ref(db, "energy/physic-info");
      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        const rawData = snapshot.val();
        let formattedData = [];

        Object.keys(rawData).forEach((type) => {
          Object.keys(rawData[type]).forEach((id) => {
            formattedData.push({
              id,
              type,
              info: rawData[type][id],
            });
          });
        });

        setData(formattedData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setEditData(item.info);
  };

  const handleSaveEdit = async () => {
    try {
      await update(ref(db, `energy/physic-info/${editItem.type}/${editItem.id}`), editData);
      setData(
        data.map((item) =>
          item.id === editItem.id ? { ...item, info: { ...editData } } : item
        )
      );
      alert("Cập nhật thành công!");
      setEditItem(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa không?")) return;
    try {
      await remove(ref(db, `energy/physic-info/${type}/${id}`));
      setData(data.filter((item) => item.id !== id));
      alert("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa dữ liệu:", error);
    }
  };

  const sortedData = [...data]
    .filter((item) => item.type === selectedCategory)
    .sort((a, b) => a.info.question_header?.localeCompare(b.info.question_header || ""));

  return (
    <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-6 tracking-wide">
        Thông tin Năng lượng
      </h2>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg text-lg font-semibold transition-all duration-200 
                ${selectedCategory === category ? "bg-blue-500 text-white shadow-lg" : "bg-white border text-gray-700 hover:bg-gray-200"}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.toUpperCase()}
            </button>
          ))}
        </div>
        <CreateCollectionButton />
      </div>

      {user ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedData.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 shadow-md hover:shadow-2xl rounded-2xl border border-gray-200 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center gap-5 mb-4">
                {ICONS[item.type]}
                <h3 className="text-xl font-semibold text-gray-800 uppercase">
                  {item.info.question_header || "Không có tên"}
                </h3>
              </div>

              <ul className="text-gray-700 space-y-2 border-t pt-4">
                {Object.keys(item.info)
                  .filter((key) => key !== "energy_type" && key !== "id")
                  .map((key) => (
                    <li key={key} className="flex justify-between py-1 text-gray-900">
                      <span className="font-medium">{key}:</span>
                      <span>{item.info[key]}</span>
                    </li>
                  ))}
              </ul>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleEditClick(item)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
                >
                  <FaEdit /> Sửa
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.type)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                >
                  <FaTrash /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-500 text-center mt-6 text-lg font-medium">
          Vui lòng đăng nhập để xem dữ liệu.
        </p>
      )}

{editItem && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
      <button onClick={() => setEditItem(null)} className="absolute top-4 right-4">
        <FaTimes className="text-gray-500 hover:text-red-500 text-2xl" />
      </button>
      
      <h3 className="text-2xl font-bold mb-4 text-center">Chỉnh sửa thông tin</h3>

      <div className="max-h-[400px] overflow-y-auto space-y-4 px-2">
        {Object.keys(editData).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="font-medium text-gray-700">{key}:</label>
            <input
              type="text"
              value={editData[key]}
              onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSaveEdit}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Lưu
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default SettingEnergy;
