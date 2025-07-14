import { useEffect, useState } from "react";
import { FaTint } from "react-icons/fa";
import { GiWateringCan, GiFruitTree } from "react-icons/gi";

export default function WateringPlant({ isPumping }) {
  const [bloom, setBloom] = useState(false);

  useEffect(() => {
    if (isPumping) {
      setTimeout(() => setBloom(true), 1200);
    } else {
      setBloom(false);
    }
  }, [isPumping]);

  const flowerPositions = [
    { top: "31%", left: "50%" },
    { top: "35%", left: "10%" },
    { top: "50%", left: "80%" },
    { top: "12%", left: "30%" },
    { top: "15%", left: "70%" },
  ];

  const fruitPositions = [
    { top: "19%", left: "10%" },
    { top: "38%", left: "65%" },
    { top: "7%", left: "54%" },
    { top: "37%", left: "34%" },
    { top: "53%", left: "7%" },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-60 h-72 flex items-end justify-center">
        {/* Bình tưới */}
        <div className="absolute top-0 left-6 animate-wiggle z-20">
          <GiWateringCan className="text-blue-600 text-4xl" />
        </div>

        {/* Giọt nước */}
        {isPumping && (
          <div className="absolute top-10 left-12 animate-drip z-10">
            <FaTint className="text-blue-400 text-2xl" />
          </div>
        )}

        {/* Cây và hiệu ứng hoa trái */}
        <div className="relative z-0">
          <GiFruitTree className="text-green-700 text-[150px] drop-shadow-xl" />

          {bloom &&
            flowerPositions.map((pos, index) => (
              <div
                key={`flower-${index}`}
                className="absolute animate-bloom text-xl transform -translate-x-1/2"
                style={{
                  top: pos.top,
                  left: pos.left,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                🌺
              </div>
            ))}

          {bloom &&
            fruitPositions.map((pos, index) => (
              <div
                key={`fruit-${index}`}
                className="absolute animate-bounce text-xl transform -translate-x-1/2"
                style={{
                  top: pos.top,
                  left: pos.left,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                🍎
              </div>
            ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes bloom {
          0% {
            opacity: 0;
            transform: scale(0.2) rotate(-30deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        .animate-bloom {
          animation: bloom 1s ease-out forwards;
        }

        @keyframes drip {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(30px);
            opacity: 0.2;
          }
        }
        .animate-drip {
          animation: drip 0.6s ease-in-out infinite;
        }

        @keyframes wiggle {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-15deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
