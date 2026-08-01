import type { PlanetVisual } from "../../Chart3D";
import type { PlanetKey } from "../../../../constants/chart";

import PlanetLabel from "./PlanetLabel";

interface PlanetLayerProps {
  planets: PlanetVisual[];
  selectedPlanet?: PlanetKey | null;
  onSelectPlanet?: (planet: PlanetKey | null) => void;
}

export default function PlanetLayer({
  planets,
  selectedPlanet,
  onSelectPlanet,
}: PlanetLayerProps) {
  return (
    <>
      {planets.map((planet) => {
        const selected = selectedPlanet === planet.id;

        return (
          <group key={planet.id} position={planet.position}>
            {/* Glow sphere */}
            <mesh>
              <sphereGeometry args={[0.13, 18, 18]} />

              <meshStandardMaterial
                color={planet.color}
                emissive={planet.color}
                emissiveIntensity={selected ? 4 : 2}
                transparent
                opacity={0.85}
              />
            </mesh>

            {/* Click area */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();

                onSelectPlanet?.(selected ? null : planet.id);
              }}
            >
              <sphereGeometry args={[0.28, 12, 12]} />

              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            <PlanetLabel
              planet={planet}
              selected={selected}
              onClick={() => onSelectPlanet?.(selected ? null : planet.id)}
            />
          </group>
        );
      })}
    </>
  );
}
