import React, { useMemo } from "react";
import * as THREE from "three";

import type {
  LongitudinalAspect,
  DeclinationAspect,
} from "../../../types/astrology";
import type { ViewMode } from "../../../types/chart";

import type { PlanetVisual } from "../Chart3D";

import { ASPECT_COLOR } from "../../../constants/theme";


interface VisualDeclinationAspect extends DeclinationAspect {
  opacity: number;
}

interface AspectLinesProps {
  planets: PlanetVisual[];
  longitudinalAspects: LongitudinalAspect[];
  declinationAspects: VisualDeclinationAspect[];
  viewMode: ViewMode;
}

interface AspectBeam {
  key: string;
  color: string;
  opacity: number;

  midpoint: THREE.Vector3;
  quaternion: THREE.Quaternion;

  radius: number;
  length: number;
}

/**
 * Ricrea la matematica del vecchio addAspectBeam()
 * ma restituisce i dati necessari al JSX invece
 * di creare direttamente Mesh e Material.
 */
function createAspectBeam(
  key: string,
  start: THREE.Vector3,
  end: THREE.Vector3,
  color: string,
  exactness: number,
): AspectBeam | null {
  const direction = new THREE.Vector3().subVectors(end, start);

  const length = direction.length();

  if (length < 0.0001) return null;

  const midpoint = new THREE.Vector3()
    .addVectors(start, end)
    .multiplyScalar(0.5);

  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize(),
  );

  return {
    key,
    color,
    opacity: 0.55 + exactness * 0.45,
    radius: 0.018 + exactness * 0.032,
    length,
    midpoint,
    quaternion,
  };
}

function AspectLines({
  planets,
  longitudinalAspects,
  declinationAspects,
  viewMode,
}: AspectLinesProps) {
  /**
   * lookup velocissimo
   * id -> pianeta
   */
  const planetMap = useMemo(
    () => new Map<string, PlanetVisual>(planets.map((p) => [p.id, p])),
    [planets],
  );

  const explorerView = viewMode === "3d-explorer";

  const beams = useMemo(() => {
    const result: AspectBeam[] = [];

    /**
     * Aspetti longitudinali
     */
    if (explorerView) {
      for (const aspect of longitudinalAspects) {
        const a = planetMap.get(aspect.objectA);
        const b = planetMap.get(aspect.objectB);

        if (!a || !b) continue;

        const exactness = Math.max(0, Math.min(1, 1 - aspect.orb / 10));

        const beam = createAspectBeam(
          `${aspect.objectA}-${aspect.objectB}-${aspect.type}`,
          a.position,
          b.position,
          ASPECT_COLOR[aspect.type] ?? "#888",
          exactness,
        );

        if (beam) result.push(beam);
      }
    }
    /**
     * Aspetti di declinazione
     */
    for (const aspect of declinationAspects) {
      const a = planetMap.get(aspect.objectA);
      const b = planetMap.get(aspect.objectB);

      if (!a || !b) continue;

      const beam = createAspectBeam(
        `${aspect.objectA}-${aspect.objectB}-${aspect.type}`,
        a.position,
        b.position,
        aspect.type === "parallel" ? "#3DA5FF" : "#FF3B3B",
        aspect.opacity,
      );

      if (beam) result.push(beam);
    }

    return result;
  }, [planetMap, longitudinalAspects, declinationAspects, viewMode]);

    return (
      <group>
        {beams.map((beam) => (
          <mesh
            key={beam.key}
            position={beam.midpoint}
            quaternion={beam.quaternion}
          >
            <cylinderGeometry
              args={[beam.radius, beam.radius, beam.length, 8]}
            />

            <meshBasicMaterial
              color={beam.color}
              transparent
              opacity={beam.opacity}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    );
}

export default React.memo(AspectLines);
