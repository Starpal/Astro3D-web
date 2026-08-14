import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import type { NatalChart, DeclinationAspect } from "../../types/astrology";
import type { ViewMode } from "../../types/chart";

import { PLANET_COLORS, PLANET_SYMBOLS } from "../../constants/theme";

import { SPHERE_RADIUS, type PlanetKey } from "../../constants/chart";

import { sphericalToVector } from "../../utils/chart/chartHelpers";

import PlanetLayer from "./sphere/planet/PlanetLayer";
import SphereGrid from "./sphere/SphereGrid";
import OOBBelt from "./sphere/OOBBelt";
import AngleMarkers from "./sphere/AngleMarkers";
import AspectLines from "./sphere/AspectLines";
// import Starfield from "./Starfield";

const R = SPHERE_RADIUS;

export interface PlanetVisual {
  id: PlanetKey;
  position: THREE.Vector3;

  longitude: number;
  declination: number;

  symbol: string;
  color: string;

  isRetrograde: boolean;
  isOOB: boolean;
}

export interface Chart3DProps {
  chart: NatalChart;
  selectedPlanet?: PlanetKey | null;
  onSelectPlanet?: (planet: PlanetKey | null) => void;
  autoRotate?: boolean;
  viewMode: ViewMode;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function computeDeclinationAspects(aspects: DeclinationAspect[]) {
  return aspects.map((aspect) => ({
    ...aspect,
    opacity: clamp(1 - aspect.orb / 1.5, 0, 1),
  }));
}

function toPlanetVisual(obj: NatalChart["objects"][number]): PlanetVisual {
  return {
    id: obj.id as PlanetKey,

    longitude: obj.astronomy.longitude,
    declination: obj.astronomy.declination ?? 0,

    position: sphericalToVector(
      obj.astronomy.longitude,
      obj.astronomy.declination ?? 0,
      R,
    ),

    symbol: PLANET_SYMBOLS[obj.id] ?? "●",
    color: PLANET_COLORS[obj.id] ?? "#888",

    isRetrograde: (obj.astronomy.speedLongitude ?? 0) < 0,

    isOOB: obj.astrology.oob,
  };
}

export default function Chart3D({
  chart,
  selectedPlanet = null,
  onSelectPlanet,
  autoRotate = false,
  viewMode,
}: Chart3DProps) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
  });

  const planets = useMemo(
    () =>
      chart.objects.filter((o) => o.id in PLANET_SYMBOLS).map(toPlanetVisual),
    [chart.objects],
  );

  const declinationAspects = useMemo(
    () => computeDeclinationAspects(chart.aspects.declination),
    [chart.aspects.declination],
  );

  // const rootRotationY =
  //   ASCENDANT_ROTATION_SIGN *
  //   (ASCENDANT_PHASE_OFFSET +
  //     THREE.MathUtils.degToRad(chart.houses.angles.ascendant));
  const rootRotationY = THREE.MathUtils.degToRad(
    chart.houses.angles.ascendant + 180,
  );

  return (
    <group ref={groupRef} rotation={[0, rootRotationY, 0]}>
      {/* <Starfield /> */}

      <SphereGrid />

      <OOBBelt />

      {/*  <AngleMarkers angles={chart.houses.angles} /> */}

      <AspectLines
        planets={planets}
        longitudinalAspects={chart.aspects.longitudinal}
        declinationAspects={declinationAspects}
        viewMode={viewMode}
      />

      <PlanetLayer
        planets={planets}
        selectedPlanet={selectedPlanet}
        onSelectPlanet={onSelectPlanet}
      />
    </group>
  );
}
