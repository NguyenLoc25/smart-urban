/**
 * app/api/waste/classify/route.js
 *
 * - Nhận file ảnh (multipart/form-data → field “file”)
 * - Tiền xử lý: RGB 640×640, scale 0-1, HWC→CHW
 * - Suy luận ONNX bằng onnxruntime-node
 * - Trả về { label, confidence } hoặc { error }
 */

import { Image } from 'image-js';
import { promises as fs } from 'fs';
import path from 'path';
import {
  Tensor,
  InferenceSession,
  env as ortEnv,
} from 'onnxruntime-node';

/* ─────────── 1. hằng số ─────────── */
const MODEL_PATH = path.join(process.cwd(), 'models', 'best.onnx');
const CLASSES = ['Organic', 'Recyclable', 'Other']; // chỉnh theo model
const CONF_THRESHOLD = 0.25;

/* ─────────── 2. nạp model (cache global) ─────────── */
let session;
async function getSession() {
  if (!session) {
    ortEnv.wasm.numThreads = 1;        // giảm RAM serverless
    session = await InferenceSession.create(MODEL_PATH, {
      executionProviders: ['cuda', 'cpu'], // tự chọn GPU nếu có
    });
  }
  return session;
}

/* ─────────── 3. tiền xử lý ảnh ─────────── */
async function preprocess(buffer) {
  const img = await Image.load(buffer);

  // 3.1 resize 640×640 (letterbox giữ tỷ lệ, thêm nền đen)
  const rgb = img
    .resize({ width: 640, height: 640, preserveAspectRatio: 'fit' })
    .toRGB();

  // 3.2 HWC → CHW + scale 1/255
  const chw = new Float32Array(3 * 640 * 640);
  for (let p = 0, i = 0; p < 640 * 640; p++, i += 3) {
    chw[p]                  = rgb.data[i]     / 255; // R
    chw[p + 640 * 640]      = rgb.data[i + 1] / 255; // G
    chw[p + 2 * 640 * 640]  = rgb.data[i + 2] / 255; // B
  }

  return new Tensor('float32', chw, [1, 3, 640, 640]);
}

/* ─────────── 4. POST handler ─────────── */
export async function POST(request) {
  try {
    // 4.1 đọc multipart; Node 20 có sẵn FormData
    const form = await request.formData();
    const file = form.get('file');
    if (!file || !(file instanceof File)) {
      return Response.json({ error: 'no_file' }, { status: 400 });
    }
    const buf = Buffer.from(await file.arrayBuffer());

    // 4.2 tiền xử lý & suy luận
    const input = await preprocess(buf);
    const sess = await getSession();
    const outputMap = await sess.run({ images: input });
    const out = outputMap[Object.keys(outputMap)[0]]; // tensor [1, N, 6]

    /* 4.3 chọn box có conf cao nhất */
    let best = { conf: 0, cls: -1 };
    for (let i = 0; i < out.dims[1]; i++) {
      const conf = out.data[i * 6 + 4];
      if (conf >= CONF_THRESHOLD && conf > best.conf) {
        best.conf = conf;
        best.cls = Math.round(out.data[i * 6 + 5]);
      }
    }

    if (best.cls === -1 || best.cls >= CLASSES.length) {
      return Response.json({ error: 'nothing_detected' }, { status: 200 });
    }

    const result = {
      label: CLASSES[best.cls],
      confidence: Number(best.conf.toFixed(3)),
    };
    return Response.json(result, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'server_error' }, { status: 500 });
  }
}

/* ─────────── 5. disable Next.js body parser ─────────── */
export const config = {
  api: {
    bodyParser: false, // bắt buộc với multipart
  },
};
