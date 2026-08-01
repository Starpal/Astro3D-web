import { useMemo } from "react";
import * as THREE from "three";

import type {
  LongitudinalAspect,
  DeclinationAspect,
} from "../../../types/astrology";
import type { ViewMode } from "../../../types/chart";

import type { PlanetVisual } from "../Chart3D";

import { ASPECT_COLOR } from "../../../constants/theme";

/**
 * Cambia questo flag per confrontare facilmente
 * il rendering classico (Line) con quello Beam.
 */
const USE_BEAMS = true;

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

interface AspectLine {
  key: string;
  color: string;
  opacity: number;
  positions: Float32Array;
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
    opacity: 0.32 + exactness * 0.63,
    radius: 0.005 + exactness * 0.015,
    length,
    midpoint,
    quaternion,
  };
}

/**
 * Versione semplice con Line.
 */
function createAspectLine(
  key: string,
  start: THREE.Vector3,
  end: THREE.Vector3,
  color: string,
  opacity: number,
): AspectLine {
  return {
    key,
    color,
    opacity,
    positions: new Float32Array([
      start.x,
      start.y,
      start.z,
      end.x,
      end.y,
      end.z,
    ]),
  };
}

export default function AspectLines({
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

  const lines = useMemo(() => {
    const result: AspectLine[] = [];

    /**
     * Linee classiche
     */
    for (const aspect of longitudinalAspects) {
      const a = planetMap.get(aspect.objectA);
      const b = planetMap.get(aspect.objectB);

      if (!a || !b) continue;

      result.push(
        createAspectLine(
          `${aspect.objectA}-${aspect.objectB}-${aspect.type}`,
          a.position,
          b.position,
          ASPECT_COLOR[aspect.type] ?? "#888",
          Math.max(0.25, 0.65 - aspect.orb * 0.06),
        ),
      );
    }

    /**
     * Paralleli / Contraparalleli
     */
    for (const aspect of declinationAspects) {
      const a = planetMap.get(aspect.objectA);
      const b = planetMap.get(aspect.objectB);

      if (!a || !b) continue;

      result.push(
        createAspectLine(
          `${aspect.objectA}-${aspect.objectB}-${aspect.type}`,
          a.position,
          b.position,
          aspect.type === "parallel" ? "#3DA5FF" : "#FF3B3B",
          aspect.opacity,
        ),
      );
    }

    return result;
  }, [planetMap, longitudinalAspects, declinationAspects]);

  /**
   * ------------------------------------------------------------------
   * Beam (vecchio Chart3D)
   * ------------------------------------------------------------------
   */
  if (USE_BEAMS) {
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

  /**
   * ------------------------------------------------------------------
   * Linee classiche
   * ------------------------------------------------------------------
   */
  return (
    <group>
      {lines.map((line) => (
        <line key={line.key}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[line.positions, 3]}
            />
          </bufferGeometry>

          <lineBasicMaterial
            color={line.color}
            transparent
            opacity={line.opacity}
            depthWrite={false}
            fog={false}
          />
        </line>
      ))}
    </group>
  );
}
