'use client';

import { useState, useEffect } from 'react';
import { Loader2, Upload, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const DETECT_URL  = process.env.NEXT_PUBLIC_DETECT_URL;
const SNAP_URL    = process.env.NEXT_PUBLIC_SNAPSHOT_URL;   // API /snapshot → JSON + base64
const CAPTURE_URL = process.env.NEXT_PUBLIC_CAPTURE_URL;    // /capture → JPEG liên tục

export default function ClassifyWastePage() {
  const [mode,    setMode]  = useState('upload');   // 'upload' | 'esp'
  const [preview, setPrev]  = useState(null);       // URL ảnh hiển thị
  const [result,  setRes]   = useState(null);       // kết quả AI
  const [loading, setLoad]  = useState(false);      // spinner

  /* ----- auto-refresh ảnh /capture mỗi 2 s khi ở chế độ ESP32-CAM ----- */
  useEffect(() => {
    if (mode !== 'esp') return;
    const id = setInterval(() => {
      setPrev(`${CAPTURE_URL}?t=${Date.now()}`);    // tránh cache
    }, 2000);
    return () => clearInterval(id);
  }, [mode]);

  /* ----- upload file từ máy ----- */
  const handleSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPrev(URL.createObjectURL(file));
    await classifyFile(file);
  };

  /* ----- gọi AI /detect ----- */
  async function classifyFile(blob) {
    setRes(null);
    setLoad(true);
    try {
      const form = new FormData();
      form.append('file', blob, 'image.jpg');
      const rsp  = await fetch(DETECT_URL, { method: 'POST', body: form });
      if (!rsp.ok) throw new Error(`HTTP ${rsp.status}`);
      const data = await rsp.json();
      if (data.error) throw new Error(data.error);
      setRes({ label: data.label, code: data.code, group: data.group, confidence: data.conf });
    } catch (err) {
      console.error(err);
      setRes({ error: 'Không phân loại được!' });
    }
    setLoad(false);
  }

  /* ----- bấm nút “Chụp / Phân loại” → /snapshot ----- */
  const shootEspCam = async () => {
    if (loading) return;
    setLoad(true);
    setRes(null);
    try {
      const rsp = await fetch(`${SNAP_URL}?t=${Date.now()}`);
      if (!rsp.ok) throw new Error(`HTTP ${rsp.status}`);
      const { label, code, group, conf, error, image } = await rsp.json();
      if (error) throw new Error(error);
      setPrev(`data:image/jpeg;base64,${image}`);
      setRes({ label, code, group, confidence: conf });
    } catch (err) {
      console.error(err);
      setRes({ error: 'Không lấy được ảnh từ ESP32-CAM!' });
    }
    setLoad(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* --- tiêu đề --- */}
      <header className="text-center space-y-1">
        <h1 className="text-4xl font-bold text-emerald-700">Phân loại rác tự động</h1>
        <p className="text-gray-500 text-sm">
          Chụp hoặc tải ảnh để hệ thống AI nhận diện loại rác
        </p>
      </header>

      {/* --- nút chọn chế độ --- */}
      <div className="flex justify-center gap-4">
        <ModeBtn m="upload" mode={mode} setMode={setMode} icon={<Upload size={18}/>}>
          Upload ảnh
        </ModeBtn>
        <ModeBtn m="esp" mode={mode} setMode={setMode} icon={<Camera size={18}/>}>
          ESP32-CAM
        </ModeBtn>
      </div>

      {/* --- upload file --- */}
      {mode === 'upload' && (
        <label className="flex items-center gap-2 cursor-pointer
                           px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl w-fit mx-auto">
          <Upload size={18}/> Chọn ảnh
          <input type="file" accept="image/*" className="hidden" onChange={handleSelect}/>
        </label>
      )}

      {/* --- ESP32-CAM --- */}
      {mode === 'esp' && (
        <div className="flex flex-col items-center space-y-4">
          {preview && (
            <img src={preview} alt="snapshot"
                 className="rounded-xl shadow-lg max-h-[400px] object-contain border"/>
          )}
          <button
            onClick={shootEspCam}
            disabled={loading}
            className={`px-5 py-2 rounded-xl font-semibold ${
              loading ? 'bg-gray-400 cursor-not-allowed'
                       : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}>
            {loading ? 'Đang xử lý…' : 'Chụp / Phân loại'}
          </button>
        </div>
      )}

      {/* --- loading spinner --- */}
      {loading && (
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <Loader2 className="animate-spin"/> <span>Đang suy luận…</span>
        </div>
      )}

      {/* --- kết quả thành công --- */}
      {result && !result.error && (
        <Card className="flex flex-col md:flex-row items-center gap-4 p-4 bg-green-50 rounded-xl">
          <CheckCircle2 size={40} className="text-green-600"/>
          <div>
            <p className="text-lg font-semibold">
              Phân loại:&nbsp;
              <span className="font-bold text-emerald-700">{result.group}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({result.label} • {result.code})
              </span>
            </p>
            {Number.isFinite(result.confidence) && (
              <p className="text-sm text-gray-700">
                Độ tin cậy: {(result.confidence * 100).toFixed(1)}%
              </p>
            )}
          </div>
        </Card>
      )}

      {/* --- lỗi --- */}
      {result?.error && (
        <Card className="flex items-center gap-4 p-4 bg-red-100 rounded-xl">
          <AlertCircle size={32} className="text-red-600"/>
          <p className="text-red-800">{result.error}</p>
        </Card>
      )}
    </div>
  );
}

/* ====== component nút chuyển chế độ ====== */
function ModeBtn({ m, mode, setMode, icon, children }) {
  const active = mode === m;
  return (
    <button
      onClick={() => setMode(m)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold shadow-sm ${
        active ? 'bg-emerald-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
      {icon}{children}
    </button>
  );
}
