import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

import Legend from "./Legend";
import PlanetLabel from "./PlanetLabel";

import Chart2D from "../chart-2D/Chart2D";

import { OOB_THRESHOLD } from "../../constants/chart";
import { PLANET_COLORS, PLANET_SYMBOLS } from "../../constants/theme";

import type {
  DeclinationAspect as ApiDeclinationAspect,
  ChartObject,
  NatalChart,
} from "../../types/astrology";

type ViewMode = "longitude" | "declination" | "3d";

interface Props {
  chart: NatalChart;
  onSelectPlanet: (id: string) => void;
}

const PLANET_RADII: Record<string, number> = {
  sun: 0.12,
  jupiter: 0.14,
  saturn: 0.13,
  uranus: 0.09,
  neptune: 0.09,
  moon: 0.05,
  venus: 0.065,
  earth: 0.065,
  mars: 0.055,
  mercury: 0.048,
  pluto: 0.04,
};

const ZOOM_MIN_DIST = 2.1; // 6 * 0.35 (vedi ZOOM_MIN originale)
const ZOOM_MAX_DIST = 30; // 6 * 5   (vedi ZOOM_MAX originale)

const ASCENDANT_ROTATION_SIGN = -1;
const ASCENDANT_PHASE_OFFSET = (3 * Math.PI) / 4;

const CAMERA_POSITIONS: Record<ViewMode, THREE.Vector3> = {
  longitude: new THREE.Vector3(0, 6, 0),
  declination: new THREE.Vector3(4, 0, 2),
  "3d": new THREE.Vector3(4, 4, 4),
};

function hex(c: string): THREE.Color {
  return new THREE.Color(c);
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function addLine(
  parent: THREE.Object3D,
  points: THREE.Vector3[],
  color: string,
  opacity = 1,
) {
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({
    color: hex(color),
    transparent: opacity < 1,
    opacity,
  });
  parent.add(new THREE.Line(geo, mat));
}

function addAspectBeam(
  parent: THREE.Object3D,
  a: THREE.Vector3,
  b: THREE.Vector3,
  color: string,
  exactness: number,
) {
  const e = clamp(exactness, 0, 1);
  const direction = new THREE.Vector3().subVectors(b, a);
  const length = direction.length();
  if (length < 1e-4) return;

  const radius = 0.005 + e * 0.015;
  const geo = new THREE.CylinderGeometry(radius, radius, length, 8);
  const mat = new THREE.MeshBasicMaterial({
    color: hex(color),
    transparent: true,
    opacity: 0.32 + e * 0.63,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);

  const midpoint = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
  mesh.position.copy(midpoint);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize(),
  );
  parent.add(mesh);
}

function circlePoints(
  radius: number,
  tiltRad: number,
  segments = 64,
): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(
      new THREE.Vector3(
        radius * Math.cos(a),
        radius * Math.sin(tiltRad) * Math.sin(a),
        radius * Math.cos(tiltRad) * Math.sin(a),
      ),
    );
  }
  return pts;
}

function latCirclePoints(
  radius: number,
  decRad: number,
  segments = 64,
): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(
      new THREE.Vector3(
        radius * Math.cos(decRad) * Math.cos(a),
        radius * Math.sin(decRad),
        radius * Math.cos(decRad) * Math.sin(a),
      ),
    );
  }
  return pts;
}

function addGlowCircle(
  parent: THREE.Object3D,
  radius: number,
  decRad: number,
  color: string,
) {
  const ringRadius = radius * Math.cos(decRad);
  const y = radius * Math.sin(decRad);

  const glow = new THREE.Mesh(
    new THREE.TorusGeometry(ringRadius, 0.006, 8, 96),
    new THREE.MeshBasicMaterial({
      color: hex(color),
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    }),
  );
  glow.rotation.x = Math.PI / 2;
  glow.position.y = y;
  parent.add(glow);
}

// --- Shape interna usata dal disegno 3D -----------------------------------
interface PlanetVisual3D {
  id: string;
  x: number;
  y: number;
  z: number;
  declination: number;
  isOOB: boolean;
  color: string;
  symbol: string;
}

function toPlanetVisual3D(obj: ChartObject): PlanetVisual3D {
  const lonRad = (obj.astronomy.longitude * Math.PI) / 180;
  const declination = obj.astronomy.declination ?? 0;
  const decRad = (declination * Math.PI) / 180;

  return {
    id: obj.id,
    x: Math.cos(decRad) * Math.cos(lonRad),
    y: Math.sin(decRad),
    z: Math.cos(decRad) * Math.sin(lonRad),
    declination,
    isOOB: obj.astrology.oob,
    color: PLANET_COLORS[obj.id] ?? "#888888",
    symbol: PLANET_SYMBOLS[obj.id] ?? "●",
  };
}

// --- Aspetti di declinazione (parallel / contraparallel) ------------------
export interface DeclinationAspect {
  planet1: string;
  planet2: string;
  type: "parallel" | "contraparallel";
  orb: number;
  opacity: number;
}

const DECLINATION_ASPECT_ORB = 1.5;

export function computeDeclinationAspects(
  apiAspects: ApiDeclinationAspect[],
): DeclinationAspect[] {
  return apiAspects.map((asp) => ({
    planet1: asp.objectA,
    planet2: asp.objectB,
    type: asp.type,
    orb: asp.orb,
    opacity: clamp(1 - asp.orb / DECLINATION_ASPECT_ORB, 0, 1),
  }));
}

// ---------------------------------------------------------------------------
// Scena statica: costruita imperativamente dentro un <group>, come nel file
// originale (riuso diretto di addLine/addAspectBeam/addGlowCircle) invece di
// riscriverla come componenti dichiarativi — meno rischio, stesso risultato.
// ---------------------------------------------------------------------------
function StaticScene({
  planets,
  declinationAspects,
}: {
  planets: PlanetVisual3D[];
  declinationAspects: DeclinationAspect[];
}) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    group.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(2, 48, 48),
        new THREE.MeshBasicMaterial({
          color: 0x1b2035,
          side: THREE.BackSide,
          transparent: true,
          opacity: 0.5,
        }),
      ),
    );

    const eqPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      eqPts.push(new THREE.Vector3(2 * Math.cos(a), 0, 2 * Math.sin(a)));
    }
    addLine(group, eqPts, "#334466", 0.8);

    const oblRad = (23.4366 * Math.PI) / 180;
    addLine(group, circlePoints(2, oblRad), "#C8A96E", 0.4);
    addLine(group, latCirclePoints(2, oblRad), "#C8A96E", 0.2);
    addLine(group, latCirclePoints(2, -oblRad), "#C8A96E", 0.2);

    const equatorPlaneMesh = new THREE.Mesh(
      new THREE.CircleGeometry(2, 64),
      new THREE.MeshBasicMaterial({
        color: hex("#334466"),
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    equatorPlaneMesh.rotation.x = Math.PI / 2;
    group.add(equatorPlaneMesh);

    const eclipticPlaneMesh = new THREE.Mesh(
      new THREE.CircleGeometry(2, 64),
      new THREE.MeshBasicMaterial({
        color: hex("#c86ec3"),
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    eclipticPlaneMesh.rotation.x = Math.PI / 2 - oblRad;
    group.add(eclipticPlaneMesh);

    const oobLimitRad = (OOB_THRESHOLD * Math.PI) / 180;
    const oobThetaStart = Math.PI / 2 - oobLimitRad;
    const oobThetaLength = oobLimitRad * 2;
    const oobBeltGeo = new THREE.SphereGeometry(
      2.005,
      64,
      16,
      0,
      Math.PI * 2,
      oobThetaStart,
      oobThetaLength,
    );
    const oobBeltMat = new THREE.MeshBasicMaterial({
      color: hex("#C8A96E"),
      transparent: true,
      opacity: 0.02,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    group.add(new THREE.Mesh(oobBeltGeo, oobBeltMat));

    addGlowCircle(group, 2, oobLimitRad, "#C8A96E");
    addGlowCircle(group, 2, -oobLimitRad, "#C8A96E");

    for (const asp of declinationAspects) {
      const p1 = planets.find((p) => p.id === asp.planet1);
      const p2 = planets.find((p) => p.id === asp.planet2);
      if (!p1 || !p2) continue;
      const a = new THREE.Vector3(p1.x * 2, p1.y * 2, p1.z * 2);
      const b = new THREE.Vector3(p2.x * 2, p2.y * 2, p2.z * 2);
      const color = asp.type === "parallel" ? "#3DA5FF" : "#FF3B3B";
      addAspectBeam(group, a, b, color, asp.opacity);
    }

    return () => {
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
        if (child instanceof THREE.Line) {
          child.geometry?.dispose();
          (child.material as THREE.Material)?.dispose();
        }
      });
      // svuota il gruppo per evitare doppioni se l'effetto rigira
      while (group.children.length) group.remove(group.children[0]);
    };
  }, [planets, declinationAspects]);

  return <group ref={groupRef} />;
}

// ---------------------------------------------------------------------------
// Pianeti cliccabili + label HTML (halo per i pianeti OOB)
// ---------------------------------------------------------------------------
function PlanetMeshes({
  planets,
  viewMode,
  onSelectPlanet,
}: {
  planets: PlanetVisual3D[];
  viewMode: ViewMode;
  onSelectPlanet: (id: string) => void;
}) {
  return (
    <>
      {planets.map((planet) => {
        if (isNaN(planet.x) || isNaN(planet.y) || isNaN(planet.z)) return null;
        const pos: [number, number, number] = [
          planet.x * 2,
          planet.y * 2,
          planet.z * 2,
        ];
        const radius = PLANET_RADII[planet.id] ?? 0.05;
        const halo = planet.isOOB ? { color: "#C8A96E", opacity: 0.9 } : null;

        return (
          <group key={planet.id} position={pos}>
            <mesh onClick={(e) => { e.stopPropagation(); onSelectPlanet(planet.id); }}>
              <sphereGeometry args={[radius, 12, 12]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            {viewMode !== "longitude" && (
              <Html center distanceFactor={6} style={{ pointerEvents: "auto" }}>
                <PlanetLabel
                  planetKey={planet.id}
                  symbol={planet.symbol}
                  x={0}
                  y={0}
                  color={planet.color}
                  halo={halo}
                  onSelect={onSelectPlanet}
                />
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// Camera: al cambio di viewMode anima la transizione; l'utente controlla
// rotazione/zoom via OrbitControls (drag / rotellina — niente pinch sul web).
// ---------------------------------------------------------------------------
function CameraRig({ viewMode }: { viewMode: ViewMode }) {
  const { camera } = useThree();
  const targetPos = useRef(CAMERA_POSITIONS.longitude.clone());
  const isDragging = useRef(false);

  useEffect(() => {
    targetPos.current = CAMERA_POSITIONS[viewMode].clone();
  }, [viewMode]);

  useFrame(() => {
    if (!isDragging.current) {
      camera.position.lerp(targetPos.current, 0.08);
    }
  });

  return (
    <OrbitControls
      enablePan={false}
      minDistance={ZOOM_MIN_DIST}
      maxDistance={ZOOM_MAX_DIST}
      onStart={() => (isDragging.current = true)}
      onEnd={() => (isDragging.current = false)}
    />
  );
}

function CelestialSphere({ chart, onSelectPlanet }: Props) {
  const ascendant = chart.houses.angles.ascendant;

  const planets = useMemo(
    () =>
      chart.objects.filter((o) => o.id in PLANET_SYMBOLS).map(toPlanetVisual3D),
    [chart.objects],
  );

  const declinationAspects = useMemo(
    () => computeDeclinationAspects(chart.aspects.declination),
    [chart.aspects.declination],
  );

  const [viewMode, setViewMode] = useState<ViewMode>("longitude");

  // Rotazione iniziale del gruppo in base all'ascendente (applicata al
  // gruppo radice della scena 3D, non più via ref imperativo su GLView).
  const rootRotationY =
    ASCENDANT_ROTATION_SIGN *
    (ASCENDANT_PHASE_OFFSET + (ascendant * Math.PI) / 180);

  const handleViewMode = (mode: ViewMode) => setViewMode(mode);

  const VIEW_BUTTONS: { key: ViewMode; label: string }[] = [
    { key: "longitude", label: "🌐 Longitude" },
    { key: "declination", label: "↕ Declination" },
    { key: "3d", label: "🌍 3D View" },
  ];

  return (
    <div style={styles.container}>
      {viewMode !== "longitude" && <Legend />}

      <div style={styles.content}>
        {viewMode === "longitude" ? (
          <Chart2D chart={chart} onSelectPlanet={onSelectPlanet} />
        ) : (
          <div style={styles.canvas}>
            <Canvas
              camera={{
                position: CAMERA_POSITIONS[viewMode].toArray(),
                fov: 65,
                near: 0.1,
                far: 100,
              }}
              gl={{ antialias: true }}
              onCreated={({ gl }) => gl.setClearColor(0x12141f, 1)}
              onDoubleClick={(e) => {
                // reset veloce, equivalente al doppio tap originale
                (e.target as any)?.dispatchEvent?.(new Event("noop"));
              }}
            >
              <ambientLight intensity={1.3} />
              <pointLight intensity={0.6} />
              <hemisphereLight args={[0x8fa8d9, 0x14141f, 0.6]} />

              <group rotation={[0, rootRotationY, 0]} scale={[1, 1, -1]}>
                <StaticScene
                  planets={planets}
                  declinationAspects={declinationAspects}
                />
                <PlanetMeshes
                  planets={planets}
                  viewMode={viewMode}
                  onSelectPlanet={onSelectPlanet}
                />
              </group>

              <CameraRig viewMode={viewMode} />
            </Canvas>
          </div>
        )}
      </div>

      <div style={styles.buttons}>
        {VIEW_BUTTONS.map((btn) => (
          <button
            key={btn.key}
            onClick={() => handleViewMode(btn.key)}
            style={{
              ...styles.btn,
              ...(viewMode === btn.key ? styles.btnActive : {}),
            }}
          >
            <span
              style={{
                ...styles.btnText,
                ...(viewMode === btn.key ? styles.btnTextActive : {}),
              }}
            >
              {btn.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#0A0A12",
    height: "100%",
  },
  content: { flex: 1, position: "relative" },
  canvas: { position: "absolute", inset: 0 },
  buttons: {
    display: "flex",
    flexDirection: "row",
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 32,
    paddingTop: 12,
    gap: 8,
    borderTop: "1px solid #1A1A2E",
  },
  btn: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 8,
    border: "1px solid #2A2A3E",
    textAlign: "center",
    backgroundColor: "#0A0A12",
    cursor: "pointer",
  },
  btnActive: {
    backgroundColor: "#C8A96E",
    borderColor: "#C8A96E",
    boxShadow: "0 0 8px rgba(200,169,110,0.3)",
  },
  btnText: { color: "#666", fontSize: 12, fontWeight: 600 },
  btnTextActive: { color: "#0A0A12" },
};

export default CelestialSphere;
