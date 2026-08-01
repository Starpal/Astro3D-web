import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Starfield — Background sphere with 2400+ stars
 * Distributed across a sphere at radius 28-42 units, with varying opacity & colors
 */
export default function Starfield() {
  const { geometry, material } = useMemo(() => {
    const count = 2400;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spherical coordinates: distribute uniformly across sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 28 + Math.random() * 14; // radius 28–42

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Vary star size for depth
      sizes[i] = Math.random() * 0.14 + 0.05;

      // Slight color variation: mostly blue/white, some yellow/orange
      const tint = Math.random();
      if (tint > 0.15) {
        // Warm stars (10%)
        colors[i * 3] = 0.95;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 0.7;
      } else {
        // Cool stars (90%)
        colors[i * 3] = 0.85 + Math.random() * 0.15;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 1.0;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.12,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.3,
      vertexColors: true,
      fog: false,
    });

    return { geometry: geo, material: mat };
  }, []);

  return <points geometry={geometry} material={material} />;
}
