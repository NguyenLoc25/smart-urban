export default function ToggleCard({ label, Icon, isOn, onToggle, disabled }) {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-4 flex flex-col items-center w-40 ${
      disabled ? 'opacity-50 pointer-events-none' : ''
    }`}>
      <Icon className="text-green-600 mb-2" size={32} />
      <p className="font-semibold mb-3">{label}</p>
      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${
          isOn ? 'bg-green-600' : 'bg-gray-300'
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
