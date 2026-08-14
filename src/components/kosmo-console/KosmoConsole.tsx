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

import nebula2 from "../../assets/nebula2.png";

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
        position: "relative",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <div
        className="canvas-container"
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Space background */}
        <img
          src={nebula2}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.32,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
          }}
        />

        {/* Floating controls */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 16,
            zIndex: 20,
          }}
        >
          <Legend
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>

        {/* Chart 2D */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: viewMode === "2d" ? "block" : "none",
            zIndex: 1,
          }}
        >
          <Chart2D
            chart={chart}
            onSelectPlanet={
              onSelectPlanet as (key: PlanetKey | null) => void
            }
          />
        </div>

        {/* Chart 3D */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: viewMode === "2d" ? "none" : "block",
            zIndex: 1,
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
              alpha: true,
              powerPreference: "high-performance",
            }}
            style={{
              background: "transparent",
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(
                new THREE.Color("#06091a"),
                0,
              );

              gl.outputColorSpace =
                THREE.SRGBColorSpace;
            }}
          >
            <ambientLight intensity={0.18} />

            <pointLight
              position={[10, 10, 10]}
              intensity={0.5}
              color="#a0b8ff"
            />

            <Chart3D
              chart={chart}
              selectedPlanet={
                selectedPlanet as PlanetKey | null
              }
              onSelectPlanet={(key) =>
                onSelectPlanet(key)
              }
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
                intensity={0.75}
                luminanceThreshold={0.28}
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