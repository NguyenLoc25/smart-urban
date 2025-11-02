
'use client';

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

export default function ClassifyWastePage() {
  const [isClient, setIsClient] = useState(false);
  const [result, setResult] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState(null);

  // Firebase thông tin
  const API_KEY = 'AIzaSyBBDrRw2cqSv8yuiQToX3NR-1B_ci_awZo';
  const DB_URL = 'https://datn-5b6dc-default-rtdb.firebaseio.com';
  const EMAIL = 'waste@project.com';
  const PASSWORD = '123456789';

  // Mapping label -> code
  const LABEL_TO_GROUP = {
    chemical_container: 'N',
    food_waste: 'O',
    paper_box: 'R',
    plastic_bottle: 'R',
  };

  const GROUP_TEXT = {
    O: 'Hữu cơ',
    R: 'Tái chế',
    N: 'Không tái chế',
  };

  const wasteGroups = [
    { code: 'O', name: 'Hữu cơ' },
    { code: 'R', name: 'Tái chế' },
    { code: 'N', name: 'Không tái chế' },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    loginFirebase();
  }, [isClient]);

  useEffect(() => {
    if (!idToken) return;

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [idToken]);

  const loginFirebase = async () => {
    setLoading(true);
    try {
      const loginRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: EMAIL,
            password: PASSWORD,
            returnSecureToken: true,
          }),
        }
      );

      if (!loginRes.ok) {
        setResult({ error: `Đăng nhập thất bại: HTTP ${loginRes.status}` });
        setLoading(false);
        return;
      }

      const loginData = await loginRes.json();
      setIdToken(loginData.idToken);
    } catch (err) {
      console.error(err);
      setResult({ error: err.message });
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!idToken) {
        setResult({ error: 'Chưa có token xác thực' });
        setLoading(false);
        return;
      }

      const rsp = await fetch(`${DB_URL}/waste/ai.json?auth=${idToken}`);
      if (!rsp.ok) {
        setResult({ error: `HTTP ${rsp.status}` });
        setLoading(false);
        return;
      }

      const data = await rsp.json();

      // setImageUrl(
      //   `https://smartwaste-ai-1.onrender.com/static/last_boxed.jpg?t=${Date.now()}`
      // );
      setImageUrl(
        'https://ai.koomaru.com/static/last_boxed.jpg?t=${Date.now()}'
      );




      if (!data || Object.keys(data).length === 0 || !data.label) {
        setLoading(false);
        return;
      }

      const groupCode = LABEL_TO_GROUP[data.label] || 'N';

      setResult({
        label: data.label || 'N/A',
        groupCode: groupCode,
        confidence: data.confidence || 0,
      });
    } catch (err) {
      console.error(err);
      setResult({ error: err.message });
    }
    setLoading(false);
  };

  if (!isClient) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      {/* Tiêu đề */}
      <header className="text-center space-y-1">
        <h1 className="text-4xl font-bold text-emerald-700">
          Phân loại rác tự động
        </h1>
        <p className="text-gray-500 text-sm">
          Dữ liệu từ ESP32-CAM qua Firebase
        </p>
      </header>

      {/* Ảnh */}
      {imageUrl && (
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt="Ảnh kết quả"
            className="rounded-xl shadow-lg max-h-[400px] object-contain border"
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
      )}

      {/* 3 ô nhóm */}
      {result && !result.error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wasteGroups.map((group) => (
            <div
              key={group.code}
              className={`flex flex-col items-center justify-center border rounded-xl p-4 text-center
                ${
                  result.groupCode === group.code
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-gray-100 text-gray-800'
                }`}
            >
              {group.name}
            </div>
          ))}
        </div>
      )}

      {/* Thông tin nhãn */}
      {result && !result.error && (
        <div className="text-center mt-4 text-gray-600 text-sm">
          Nhãn AI:{' '}
          <strong>{result.label}</strong>
          {result.confidence > 0 && (
            <>
              {' · '}Độ tin cậy:{' '}
              {(result.confidence * 100).toFixed(1)}%
            </>
          )}
          {result.groupCode && GROUP_TEXT[result.groupCode] && (
            <>
              {' · '}Loại rác:{' '}
              <strong>{GROUP_TEXT[result.groupCode]}</strong>
            </>
          )}
        </div>
      )}

      {/* Lỗi */}
      {result?.error && (
        <div className="flex items-center justify-center gap-2 text-red-600 mt-4">
          <AlertCircle size={20} />
          {result.error}
        </div>
      )}
    </div>
  );
}
