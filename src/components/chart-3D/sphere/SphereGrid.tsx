import React, { useMemo } from "react";
import * as THREE from "three";

import { SPHERE_RADIUS } from "../../../constants/chart";
import {
  latitudeCirclePoints,
  meridianPoints,
} from "../../../utils/chart/chartHelpers";

const R = SPHERE_RADIUS;

const GRID_COLOR = new THREE.Color("#4D80FF");
const EQUATOR_COLOR = new THREE.Color("#79B7FF");

const SEGMENTS = 96;

function createGradientGeometry(
  points: THREE.Vector3[],
  color: THREE.Color,
  getIntensity: (point: THREE.Vector3) => number,
) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const colors = new Float32Array(points.length * 3);

  points.forEach((point, index) => {
    const intensity = getIntensity(point);

    colors[index * 3] = color.r * intensity;
    colors[index * 3 + 1] = color.g * intensity;
    colors[index * 3 + 2] = color.b * intensity;
  });

  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 3),
  );

  return geometry;
}

function SphereGrid() {
  /*
   * MERIDIANI
   *
   * Più delicati vicino all'equatore,
   * più presenti verso i poli.
   */
  const meridianGeometries = useMemo(() => {
    const result: THREE.BufferGeometry[] = [];

    for (let lon = 0; lon < 360; lon += 15) {
      const points = meridianPoints(
        R,
        THREE.MathUtils.degToRad(lon),
        SEGMENTS,
      );

      const geometry = createGradientGeometry(
        points,
        GRID_COLOR,
        (point) => {
          const latitude = Math.abs(
            THREE.MathUtils.radToDeg(
              Math.asin(
                THREE.MathUtils.clamp(
                  point.y / R,
                  -1,
                  1,
                ),
              ),
            ),
          );

          const normalized = latitude / 90;

          return (
            0.22 +
            Math.pow(normalized, 1.7) * 0.78
          );
        },
      );

      result.push(geometry);
    }

    return result;
  }, []);

  /*
   * PARALLELI
   *
   * La luminosità aumenta progressivamente
   * andando dall'equatore verso i poli.
   */
  const parallelGeometries = useMemo(() => {
    const result: {
      geometry: THREE.BufferGeometry;
      opacity: number;
    }[] = [];

    for (let lat = -75; lat <= 75; lat += 15) {
      const points = latitudeCirclePoints(
        R,
        THREE.MathUtils.degToRad(lat),
        SEGMENTS,
      );

      const normalized = Math.abs(lat) / 90;

      /*
       * Curva morbida:
       *
       * equatore → molto tenue
       * medie latitudini → progressiva
       * poli → più evidente
       */
      const poleFactor = Math.pow(
        normalized,
        1.8,
      );

      const opacity =
        0.055 +
        poleFactor * 0.18;

      const geometry = createGradientGeometry(
        points,
        lat === 0 ? EQUATOR_COLOR : GRID_COLOR,
        () => 0.75 + poleFactor * 0.25,
      );

      result.push({
        geometry,
        opacity,
      });
    }

    return result;
  }, []);

  return (
    <group>
      {/* =========================
          MERIDIANI
         ========================= */}

      {meridianGeometries.map(
        (geometry, index) => (
          <line key={`meridian-${index}`}>
            <primitive
              object={geometry}
              attach="geometry"
            />

            <lineBasicMaterial
              vertexColors
              transparent
              opacity={0.16}
              depthWrite={false}
              fog={false}
            />
          </line>
        ),
      )}

      {/* =========================
          PARALLELI
         ========================= */}

      {parallelGeometries.map(
        ({ geometry, opacity }, index) => (
          <line key={`parallel-${index}`}>
            <primitive
              object={geometry}
              attach="geometry"
            />

            <lineBasicMaterial
              vertexColors
              transparent
              opacity={opacity}
              depthWrite={false}
              fog={false}
            />
          </line>
        ),
      )}
    </group>
  );
}

export default React.memo(SphereGrid);