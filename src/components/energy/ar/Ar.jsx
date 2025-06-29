import { useState, useEffect } from 'react';

const PixelIcon = ({ name, size = 24, color = 'currentColor' }) => {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    fetch(`https://pixelarticons.com/icons/${name}.svg`)
      .then(res => res.text())
      .then(svg => setSvg(svg))
      .catch(() => setSvg('<svg/>'));
  }, [name]);

  return (
    <span
      style={{
        display: 'inline-flex',
        width: size,
        height: size,
        fill: color
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

const MONSTER_DATA = {
  ghost: {
    pixels: ['1,1', '3,1', '1,3', '2,3', '3,3', '2,4'],
    color: '#818cf8'
  },
  slime: {
    pixels: ['2,1', '1,2', '2,2', '3,2', '2,3'],
    color: '#4ade80'
  },
  skull: {
    pixels: ['1,1', '3,1', '2,2', '1,3', '2,3', '3,3', '2,4'],
    color: '#f87171'
  },
  eyeball: {
    pixels: ['2,1', '1,2', '2,2', '3,2', '2,3'],
    color: '#facc15'
  },
  bat: {
    pixels: ['0,2', '1,1', '2,2', '3,1', '4,2', '2,3'],
    color: '#a78bfa'
  },
  robot: {
    pixels: ['1,1', '2,1', '3,1', '1,2', '3,2', '2,3', '1,4', '3,4'],
    color: '#60a5fa'
  }
};

const Monster = ({ x, y, type, size = 24 }) => {
  const monster = MONSTER_DATA[type] || MONSTER_DATA.ghost;
  const { pixels, color } = monster;
  const gridUnit = size / 5;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="relative h-full">
        {pixels.map((pos, i) => {
          const [px, py] = pos.split(',').map(Number);
          return (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                width: `${gridUnit}px`,
                height: `${gridUnit}px`,
                left: `${px * gridUnit}px`,
                top: `${py * gridUnit}px`,
                backgroundColor: color,
                opacity: 0.9
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const RectangleARVideo = () => {
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [pixels, setPixels] = useState([]);
  const [monsters, setMonsters] = useState([]);

  useEffect(() => {
    const newPixels = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 2 + 1),
      x: Math.random() * 97,
      y: Math.random() * 97,
      delay: Math.random() * 5,
      color: `rgb(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, 255)`,
      speed: Math.random() * 2 + 0.5
    }));
    setPixels(newPixels);

    const monsterTypes = Object.keys(MONSTER_DATA);
    const newMonsters = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      x: Math.random() * 78 + 10,
      y: Math.random() * 78 + 10,
      type: monsterTypes[Math.floor(Math.random() * monsterTypes.length)],
      size: Math.floor(Math.random() * 20 + 20),
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2
    }));
    setMonsters(newMonsters);

    const interval = setInterval(() => {
      setPixels(prev =>
        prev.map(pixel => ({
          ...pixel,
          y: (pixel.y + pixel.speed) % 100,
          x: ((pixel.x + (Math.random() - 0.3) + 100) % 100)
        }))
      );

      setMonsters(prev =>
        prev.map(monster => {
          let newX = monster.x + monster.speedX;
          let newY = monster.y + monster.speedY;
          let newSpeedX = monster.speedX;
          let newSpeedY = monster.speedY;

          if (newX < 5 || newX > 95) newSpeedX *= -1;
          if (newY < 5 || newY > 95) newSpeedY *= -1;

          newX = Math.max(0, Math.min(100, newX));
          newY = Math.max(0, Math.min(100, newY));

          return {
            ...monster,
            x: newX,
            y: newY,
            speedX: newSpeedX,
            speedY: newSpeedY
          };
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleOpenAR = () => {
    const newTab = window.open('https://my-webar.vercel.app/', '_blank');
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
      setIsPopupBlocked(true);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-4xl h-[500px] rounded-xl overflow-hidden bg-gray-900 shadow-xl border border-gray-700">
        {/* Background particles */}
        <div className="absolute inset-0">
          {pixels.map(pixel => (
            <div
              key={pixel.id}
              className="absolute rounded-sm"
              style={{
                width: `${pixel.size}px`,
                height: `${pixel.size}px`,
                left: `${pixel.x}%`,
                top: `${pixel.y}%`,
                backgroundColor: pixel.color,
                opacity: 0.5,
                animation: `pixelFloat ${pixel.speed * 2}s infinite ${pixel.delay}s`,
                filter: 'blur(0.5px)'
              }}
            />
          ))}
        </div>

        {/* Monsters */}
        <div className="absolute inset-0">
          {monsters.map(monster => (
            <Monster 
              key={monster.id}
              x={monster.x}
              y={monster.y}
              type={monster.type}
              size={monster.size}
            />
          ))}
        </div>

        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(to right, #333 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />

        {/* UI Elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div 
              className="mb-6 p-5 bg-gray-800/50 rounded-full border-2 border-indigo-400/50 hover:border-indigo-400 transition-all duration-300 cursor-pointer hover:scale-110"
              onClick={handleOpenAR}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <PixelIcon 
                name={isHovering ? "ar" : "world"} 
                size={50} 
                color={isHovering ? "#818cf8" : "#6366f1"} 
              />
            </div>

            <button
              onClick={handleOpenAR}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="px-6 py-3 bg-gray-800/70 hover:bg-indigo-600/70 border border-gray-600 hover:border-indigo-400 text-white font-mono transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <span className="text-lg">{isHovering ? 'ENTER AR EXPERIENCE' : 'START AR EXPERIENCE'}</span>
              <PixelIcon 
                name={isHovering ? "arrow-right" : "power"} 
                size={18} 
                color="white" 
              />
            </button>

            {isPopupBlocked && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded text-center">
                <a
                  href="https://my-webar.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline font-mono text-sm flex items-center gap-1"
                >
                  <PixelIcon name="external" size={14} />
                  OPEN IN NEW TAB
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RectangleARVideo;