import { useMemo } from "react";
import { Html } from "@react-three/drei";

import { SPHERE_RADIUS } from "../../../constants/chart";
import { sphericalToVector } from "../../../utils/chart/chartHelpers";

const R = SPHERE_RADIUS;

interface AngleMarkersProps {
  angles: {
    ascendant: number;
    descendant: number;
    mc: number;
    ic: number;
  };
}

export default function AngleMarkers({ angles }: AngleMarkersProps) {
  const asc = useMemo(
    () => sphericalToVector(angles.ascendant, 0, R * 1.22),
    [angles.ascendant],
  );

  const dsc = useMemo(
    () => sphericalToVector(angles.descendant, 0, R * 1.22),
    [angles.descendant],
  );

  // Per ora manteniamo MC/IC sull'equatore.
  // In futuro potranno usare declinazione reale oppure
  // coordinate equatoriali.
  const mc = useMemo(
    () => sphericalToVector(angles.mc, 0, R * 1.22),
    [angles.mc],
  );

  const ic = useMemo(
    () => sphericalToVector(angles.ic, 0, R * 1.22),
    [angles.ic],
  );

  const labels = [
    { label: "ASC", color: "#FFD580", position: asc },
    { label: "DSC", color: "#FFD580", position: dsc },
    { label: "MC", color: "#7FE8C8", position: mc },
    { label: "IC", color: "#7FE8C8", position: ic },
  ];

  return (
    <group>
      {/* ASC ↔ DSC */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([asc.x, asc.y, asc.z, dsc.x, dsc.y, dsc.z]),
              3,
            ]}
          />
        </bufferGeometry>

        <lineBasicMaterial
          color="#FFD580"
          transparent
          opacity={0.35}
          depthWrite={false}
          fog={false}
        />
      </line>

      {/* MC ↔ IC */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([mc.x, mc.y, mc.z, ic.x, ic.y, ic.z]), 3]}
          />
        </bufferGeometry>

        <lineBasicMaterial
          color="#7FE8C8"
          transparent
          opacity={0.28}
          depthWrite={false}
          fog={false}
        />
      </line>

      {labels.map(({ label, color, position }) => (
        <group key={label}>
          {/* piccolo marker */}
          <mesh position={position}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshBasicMaterial color={color} transparent opacity={0.9} />
          </mesh>

          <Html
            position={[position.x, position.y, position.z]}
            center
            distanceFactor={10}
            zIndexRange={[15, 0]}
            occlude={false}
          >
            <div
              style={{
                color,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                pointerEvents: "none",
                userSelect: "none",
                textShadow: `0 0 8px ${color}aa,
                             0 0 12px ${color}55`,
              }}
            >
              {label}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
