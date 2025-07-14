// src/app/garden/control/animal/page.jsx
'use client';

import { useState } from 'react';
import { EggFried, Fish } from 'lucide-react';
import ChickenControl from './ChickenControl';
import FishControl from './FishControl';

export default function AnimalPage() {
  const [tab, setTab] = useState('chicken');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🐔 Vật nuôi</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2">
        <button
          onClick={() => setTab('chicken')}
          className={`flex items-center gap-1 px-4 py-1.5 rounded-t-md border ${
            tab === 'chicken'
              ? 'bg-green-200 border-green-400 text-green-900'
              : 'border-transparent text-gray-500 hover:bg-gray-100'
          }`}
        >
          <EggFried className="w-4 h-4" />
          Gà
        </button>

        <button
          onClick={() => setTab('fish')}
          className={`flex items-center gap-1 px-4 py-1.5 rounded-t-md border ${
            tab === 'fish'
              ? 'bg-green-200 border-green-400 text-green-900'
              : 'border-transparent text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Fish className="w-4 h-4" />
          Cá
        </button>
      </div>

      {/* Tab Content */}
      <div className="">
        {tab === 'chicken' && <ChickenControl />}
        {tab === 'fish' && <FishControl />}
      </div>
    </div>
  );
}
