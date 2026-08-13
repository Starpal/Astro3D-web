import React, { useMemo } from "react";
import * as THREE from "three";

import { SPHERE_RADIUS } from "../../../constants/chart";
import {
  latitudeCirclePoints,
  meridianPoints,
} from "../../../utils/chart/chartHelpers";

const R = SPHERE_RADIUS;

const GRID_COLOR = "#4D80FF";

function SphereGrid() {
  
  const geometries = useMemo(() => {
    const result: {
      geometry: THREE.BufferGeometry;
      opacity: number;
    }[] = [];

    //
    // Paralleli
    //
    for (let lat = -75; lat <= 75; lat += 15) {
      const pts = latitudeCirclePoints(R, THREE.MathUtils.degToRad(lat), 96);

      result.push({
        geometry: new THREE.BufferGeometry().setFromPoints(pts),
        opacity: lat === 0 ? 0.35 : 0.18,
      });
    }

    //
    // Meridiani
    //
    for (let lon = 0; lon < 360; lon += 15) {
      const pts = meridianPoints(R, THREE.MathUtils.degToRad(lon), 96);

      result.push({
        geometry: new THREE.BufferGeometry().setFromPoints(pts),
        opacity: 0.15,
      });
    }

    return result;
  }, []);

  return (
    <group>
      {geometries.map((line, index) => (
        <line key={index}>
          <primitive object={line.geometry} attach="geometry" />

          <lineBasicMaterial
            color={GRID_COLOR}
            transparent
            opacity={line.opacity}
            depthWrite={false}
            fog={false}
          />
        </line>
      ))}

      {/* Piano equatoriale */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R, 96]} />

        <meshBasicMaterial
          color="#334466"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default React.memo(SphereGrid);
