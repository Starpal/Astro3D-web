import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

import Chart3D from "../chart-3D/Chart3D";
import Chart2D from "../chart-2D/Chart2D";
import Legend from "./legend/Legend";

import type { NatalChart } from "../../types/astrology";
import type { ViewMode } from "../../types/chart";

import type { PlanetKey } from "../../constants/chart";

import "./KosmoConsole.css";

interface KosmoConsole {
  chart: NatalChart;
  selectedPlanet: string | null;
  onSelectPlanet: (key: string | null) => void;
}

export default function KosmoConsole({
  chart,
  selectedPlanet,
  onSelectPlanet,
}: KosmoConsole) {
  const [viewMode, setViewMode] = useState<ViewMode>("2d");

  return (
    <div
      className="celestial-chart-viewer"
      style={{
        background:
          "linear-gradient(180deg, #060916 0%, #080c1e 60%, #04080f 100%)",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* UI fuori da Canvas */}
      <Legend viewMode={viewMode} setViewMode={setViewMode} />

      <div
        className="canvas-container"
        style={{
          minHeight: 0,
          flex: 1,
          position: "relative",
        }}
      >
        {/* Nebula overlay DOM */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            background: `
              radial-gradient(
                ellipse 55% 45% at 5% 50%,
                #4020a022 0%,
                transparent 60%
              ),
              radial-gradient(
                ellipse 55% 45% at 95% 50%,
                #401880aa 0%,
                transparent 50%
              )
            `,
          }}
        />
        {/* Chart 2D */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: viewMode === "2d" ? "block" : "none",
          }}
        >
          <Chart2D
            chart={chart}
            onSelectPlanet={onSelectPlanet as (key: PlanetKey | null) => void}
          />
        </div>

        {/* Chart 3D */}

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: viewMode === "2d" ? "none" : "block",
          }}
        >
          <Canvas
            camera={{
              position: [0, 1, 16],
              fov: 95,
            }}
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: "high-performance",
            }}
            style={{
              background: "transparent",
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(new THREE.Color("#06091a"), 1);

              gl.outputColorSpace = THREE.SRGBColorSpace;
            }}
          >
            <ambientLight intensity={0.18} />

            <pointLight
              position={[10, 10, 10]}
              intensity={0.5}
              color="#a0b8ff"
            />

            <pointLight
              position={[-8, -8, 8]}
              intensity={0.3}
              color="#ff8840"
            />

            <Chart3D
              chart={chart}
              selectedPlanet={selectedPlanet as PlanetKey | null}
              onSelectPlanet={(key) => onSelectPlanet(key)}
              viewMode={viewMode}
            />

            <OrbitControls
              target={[0, 0.2, 0]}
              enablePan={false}
              minDistance={8}
              maxDistance={22}
              enableDamping
              dampingFactor={0.08}
              rotateSpeed={0.55}
              autoRotate={false}
              autoRotateSpeed={2}
            />

            <EffectComposer>
              <Bloom
                intensity={1.2}
                luminanceThreshold={0.18}
                luminanceSmoothing={0.9}
                mipmapBlur={false}
              />
            </EffectComposer>
          </Canvas>
        </div>
      </div>
    </div>
  );
}
