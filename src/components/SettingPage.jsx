import { db } from "@/lib/firebaseConfig";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onValue, set, push, remove } from "firebase/database";
import CreateCollectionButton from "@/components/CreateCollectionButton";

const categories = ["solar", "water", "wind"];

const SettingEnergy = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [newItem, setNewItem] = useState({ name: "", value: "" });
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadData(selectedCategory);
  }, [selectedCategory]);

  const loadData = (category) => {
    const dataRef = ref(db, category);
    onValue(dataRef, (snapshot) => {
      const fetchedData = snapshot.val();
      setData(
        fetchedData
          ? Object.keys(fetchedData).map((id) => ({ id, ...fetchedData[id] }))
          : []
      );
    });
  };

  const handleAdd = async () => {
    if (!newItem.name || !newItem.value) return;
    try {
      const newRef = push(ref(db, selectedCategory));
      await set(newRef, newItem);
      setNewItem({ name: "", value: "" });
    } catch (error) {
      console.error("Lỗi khi thêm dữ liệu:", error);
    }
  };

  const handleEdit = (id, name, value) => {
    setEditItem({ id, name, value });
  };

  const handleUpdate = async () => {
    if (!editItem || !editItem.name || !editItem.value) return;
    try {
      const itemRef = ref(db, `${selectedCategory}/${editItem.id}`);
      await set(itemRef, { name: editItem.name, value: editItem.value });
      setEditItem(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const itemRef = ref(db, `${selectedCategory}/${id}`);
      await remove(itemRef);
    } catch (error) {
      console.error("Lỗi khi xóa dữ liệu:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <div className="absolute top-6 right-4">
        <CreateCollectionButton />
      </div>
      <h2 className="text-2xl font-bold mb-4">Quản lý {selectedCategory.toUpperCase()}</h2>
      {user ? (
        <div>
          <div className="mb-4 flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`p-2 border ${selectedCategory === category ? "bg-blue-500 text-white" : "bg-white"}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Tên"
              className="p-2 border"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Giá trị"
              className="p-2 border"
              value={newItem.value}
              onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
            />
            <button className="bg-blue-500 text-white p-2" onClick={handleAdd}>
              Thêm
            </button>
          </div>
          <ul className="bg-white shadow-md rounded-lg p-4">
            {data.length > 0 ? (
              data.map((item) => (
                <li key={item.id} className="p-2 border-b flex justify-between">
                  {editItem && editItem.id === item.id ? (
                    <>
                      <input
                        type="text"
                        value={editItem.name}
                        className="p-1 border"
                        onChange={(e) =>
                          setEditItem({ ...editItem, name: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        value={editItem.value}
                        className="p-1 border"
                        onChange={(e) =>
                          setEditItem({ ...editItem, value: e.target.value })
                        }
                      />
                      <button
                        className="bg-green-500 text-white p-1"
                        onClick={handleUpdate}
                      >
                        Lưu
                      </button>
                    </>
                  ) : (
                    <span>
                      {item.name} - {item.value}
                    </span>
                  )}
                  <div>
                    <button
                      className="bg-yellow-500 text-white p-1 mx-1"
                      onClick={() => handleEdit(item.id, item.name, item.value)}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-500 text-white p-1"
                      onClick={() => handleDelete(item.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500">Không có dữ liệu</p>
            )}
          </ul>
        </div>
      ) : (
        <p className="text-red-500">Vui lòng đăng nhập để xem dữ liệu.</p>
      )}
    </div>
  );
};

export default SettingEnergy;