import React from "react";

// A unique, short, professional loader featuring stacked diamonds.
// Each diamond has a smooth, fluid motion for a "perfect" look.
// The entire background uses a gradient from blue to violet.
// We leverage custom keyframes for more refined animations.

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tl from-blue-600 to-violet-600">
      <div className="relative w-16 h-16">
        {/** Outer diamond (smooth spin CW) */}
        <div
          className="absolute w-6 h-6 bg-white top-0 left-1/2"
          style={{
            transform: "translateX(-50%)",
            animation: "spinCW 1.5s ease-in-out infinite",
          }}
        ></div>

        {/** Middle diamond (smooth spin CCW) */}
        <div
          className="absolute w-4 h-4 bg-white opacity-80 bottom-0 left-1/2"
          style={{
            transform: "translateX(-50%)",
            animation: "spinCCW 2s ease-in-out infinite",
          }}
        ></div>

        {/** Inner diamond (smooth pulse) */}
        <div
          className="absolute w-3 h-3 bg-white opacity-60 top-1/2 left-1/2"
          style={{
            transform: "translate(-50%, -50%)",
            animation: "pulseDiamond 1.5s ease-in-out infinite",
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes spinCW {
          0% {
            transform: translateX(-50%) rotate(45deg);
          }
          50% {
            transform: translateX(-50%) rotate(225deg);
          }
          100% {
            transform: translateX(-50%) rotate(405deg);
          }
        }

        @keyframes spinCCW {
          0% {
            transform: translateX(-50%) rotate(45deg);
          }
          50% {
            transform: translateX(-50%) rotate(-135deg);
          }
          100% {
            transform: translateX(-50%) rotate(45deg);
          }
        }

        @keyframes pulseDiamond {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(45deg);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
