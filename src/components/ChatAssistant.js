'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import mqtt from 'mqtt';
import { FaRobot, FaTimes, FaPaperPlane, FaTrash } from 'react-icons/fa';

const MQTT_URI = process.env.NEXT_PUBLIC_MQTT_URI;
const TOPIC_F2 = 'home/floor2/light/set';

export default function ChatAssistant() {
  const router = useRouter();
  const clientRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [height] = useState(400);

  useEffect(() => {
    clientRef.current = mqtt.connect(MQTT_URI, {
      clientId: 'mqtt_' + Math.random().toString(16).substr(2, 8),
      clean: true,
      reconnectPeriod: 1000,
    });

    clientRef.current.on('connect', () => console.log('✅ MQTT connected'));
    clientRef.current.on('error', err => console.error('⚠️ MQTT error', err));

    return () => {
      clientRef.current && clientRef.current.end();
    };
  }, []);

  const turnFloor2LightOn = () =>
    new Promise((resolve, reject) => {
      const client = clientRef.current;
      if (client && client.connected) {
        client.publish(TOPIC_F2, 'ON', err => (err ? reject(err) : resolve()));
      } else {
        reject(new Error('MQTT chưa kết nối'));
      }
    });

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userInput = input.trim();
    const newMessages = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const lower = userInput.toLowerCase();

    if (lower.includes('mở đèn tầng 2')) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Đang bật đèn tầng 2…' }]);
      try {
        await turnFloor2LightOn();
        setMessages(prev => [...prev, { role: 'assistant', content: '✅ Đèn tầng 2 đã bật' }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'assistant', content: '❌ Bật đèn không thành công' }]);
      }
      setLoading(false);
      return;
    }

    if (lower.includes('tầng 1')) {
      setMessages(prev => [...prev, { role: 'assistant', content: '🔁 Đang chuyển đến tầng 1...' }]);
      router.push('/home/floor1');
      setLoading(false);
      return;
    }

    if (lower.includes('tầng 2')) {
      setMessages(prev => [...prev, { role: 'assistant', content: '🔁 Đang chuyển đến tầng 2...' }]);
      router.push('/home/floor2');
      setLoading(false);
      return;
    }

    if (lower.includes('tầng 3')) {
      setMessages(prev => [...prev, { role: 'assistant', content: '🔁 Đang chuyển đến tầng 3...' }]);
      router.push('/home/floor3');
      setLoading(false);
      return;
    }

    // ❗ Gọi AI chat API
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server trả về lỗi: ${res.status} - ${text}`);
      }

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: '🤖 Không nhận được phản hồi từ AI' }]);
      }
    } catch (err) {
      console.error('❌ Lỗi gọi API:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Lỗi gọi AI: ' + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
          title="Trợ lý ảo"
        >
          <FaRobot size={24} />
        </button>
      ) : (
        <div
          className="w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col resize-y overflow-hidden"
          style={{ height }}
        >
          <div className="flex items-center justify-between p-3 bg-blue-600 text-white">
            <span className="font-semibold">Trợ lý ảo</span>
            <div className="flex gap-2">
              <button onClick={clearMessages} title="Xóa lịch sử">
                <FaTrash />
              </button>
              <button onClick={() => setIsOpen(false)} title="Đóng">
                <FaTimes />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm" style={{ maxHeight: height - 110 }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-2 ${msg.role === 'assistant' ? 'text-left' : 'justify-end'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    <FaRobot size={12} />
                  </div>
                )}
                <div
                  className={`p-2 rounded-lg max-w-[80%] ${
                    msg.role === 'assistant' ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white ml-auto'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500">Đang trả lời...</div>}
          </div>
          <div className="p-2 flex gap-2 border-t border-gray-300">
            <input
              type="text"
              className="flex-1 px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-900 outline-none"
              placeholder="Hỏi gì đó..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
