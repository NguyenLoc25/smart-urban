'use client';

import clsx from 'clsx';

export function Switch({ checked, onCheckedChange }) {
  const toggle = () => {
    onCheckedChange?.(!checked);
  };

  return (
    <button
      onClick={toggle}
      className={clsx(
        'w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300',
        checked ? 'bg-green-500' : 'bg-gray-300'
      )}
    >
      <div
        className={clsx(
          'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300',
          checked ? 'translate-x-6' : 'translate-x-0'
        )}
      />
    </button>
  );
}

