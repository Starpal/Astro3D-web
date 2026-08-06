import React, { useMemo } from "react";
import * as THREE from "three";

import {
  SPHERE_RADIUS,
  OBLIQUITY,
} from "../../../constants/chart";

import {
  circlePoints,
} from "../../../utils/chart/chartHelpers";

const R = SPHERE_RADIUS;
const OBL = OBLIQUITY;

const COLOR = "#C8A96E";

function OOBBelt() {
  const oblRad = THREE.MathUtils.degToRad(OBL);

  /**
   * Tropici
   */
  const beltRadius = R * Math.cos(oblRad);
  const beltY = R * Math.sin(oblRad);

  /**
   * Geometria della linea dell'eclittica
   */
  const eclipticGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(
      circlePoints(R, oblRad, 128),
    );
  }, [oblRad]);

  /**
   * Geometrie dei torus
   */
  const coreGeometry = useMemo(
    () => new THREE.TorusGeometry(beltRadius, 0.018, 12, 256),
    [beltRadius],
  );

  const glowGeometry = useMemo(
    () => new THREE.TorusGeometry(beltRadius, 0.006, 8, 256),
    [beltRadius],
  );

  const haloGeometry = useMemo(
    () => new THREE.TorusGeometry(beltRadius + 0.05, 0.004, 8, 256),
    [beltRadius],
  );

  /**
   * Fascia OOB
   * (esattamente come il vecchio Chart3D)
   */
  const oobGeometry = useMemo(() => {
    const thetaStart = Math.PI / 2 - oblRad;
    const thetaLength = oblRad * 2;

    return new THREE.SphereGeometry(
      R * 1.002,
      96,
      24,
      0,
      Math.PI * 2,
      thetaStart,
      thetaLength,
    );
  }, [oblRad]);

  const rotation: [number, number, number] = [Math.PI / 2, 0, 0];

  return (
    <group>

      {/* ===========================
          ECLITTICA
      ============================ */}

      <line>
        <primitive object={eclipticGeometry} attach="geometry" />

        <lineBasicMaterial
          color={COLOR}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </line>

      {/* ===========================
          FASCIA OOB
      ============================ */}

      <mesh geometry={oobGeometry}>
        <meshBasicMaterial
          color={COLOR}
          transparent
          opacity={0.025}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* ===========================
          TROPICO NORD
      ============================ */}

      <group
        position={[0, beltY, 0]}
        rotation={rotation}
      >
        <mesh geometry={coreGeometry}>
          <meshStandardMaterial
            color="#ffb638"
            emissive="#ff9020"
            emissiveIntensity={2.2}
            metalness={0.15}
            roughness={0.25}
          />
        </mesh>

        <mesh geometry={glowGeometry}>
          <meshStandardMaterial
            color="#ffd080"
            emissive="#ff8800"
            emissiveIntensity={1.2}
            transparent
            opacity={0.6}
            depthWrite={false}
          />
        </mesh>

        <mesh geometry={haloGeometry}>
          <meshStandardMaterial
            color="#ffb24a"
            emissive="#ff8c00"
            emissiveIntensity={0.7}
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ===========================
          TROPICO SUD
      ============================ */}

      <group
        position={[0, -beltY, 0]}
        rotation={rotation}
      >
        <mesh geometry={coreGeometry}>
          <meshStandardMaterial
            color="#ffb638"
            emissive="#ff9020"
            emissiveIntensity={2.2}
            metalness={0.15}
            roughness={0.25}
          />
        </mesh>

        <mesh geometry={glowGeometry}>
          <meshStandardMaterial
            color="#ffd080"
            emissive="#ff8800"
            emissiveIntensity={1.2}
            transparent
            opacity={0.6}
            depthWrite={false}
          />
        </mesh>

        <mesh geometry={haloGeometry}>
          <meshStandardMaterial
            color="#ffb24a"
            emissive="#ff8c00"
            emissiveIntensity={0.7}
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </mesh>
      </group>

    </group>
  );
}

export default React.memo(OOBBelt);