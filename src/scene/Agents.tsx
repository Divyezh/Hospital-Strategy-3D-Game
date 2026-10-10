'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { simEngine } from '@/sim/engine';
import { SimAmbulance, SimOrderly, SimPatient, SimSupplyVan, SimStaff, Acuity } from '@/sim/types';
import { useSimStore } from '@/store/useSimStore';
import { CONFIG } from '@/data/config';

// 3D Selection Brackets (Translucent blue box with corner brackets per spec)
function SelectionBrackets({ size = [3.0, 2.5, 5.8] }: { size?: [number, number, number] }) {
  const [sx, sy, sz] = size.map((v) => v / 2);
  const color = CONFIG.colors.accentRoyalBlue;

  return (
    <group position={[0, sy, 0]}>
      {/* Translucent boundary box */}
      <mesh>
        <boxGeometry args={size} />
        <meshBasicMaterial color={color} transparent opacity={0.12} wireframe={false} />
      </mesh>

      {/* 4 Bottom corner brackets */}
      {[
        [-sx, -sy, -sz],
        [sx, -sy, -sz],
        [-sx, -sy, sz],
        [sx, -sy, sz],
      ].map(([cx, cy, cz], idx) => {
        const signX = Math.sign(cx);
        const signZ = Math.sign(cz);
        return (
          <group key={`b-${idx}`} position={[cx, cy, cz]}>
            <mesh position={[-signX * 0.3, 0, 0]}>
              <boxGeometry args={[0.6, 0.08, 0.08]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[0, 0, -signZ * 0.3]}>
              <boxGeometry args={[0.08, 0.08, 0.6]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[0.08, 0.6, 0.08]} />
              <meshBasicMaterial color={color} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Bobbing Triage Map Pin (Red Critical, Amber Medium, Green Low, Blue Scheduled)
export function TriageMapPin({ triage, height = 2.8 }: { triage: Acuity; height?: number }) {
  const pinRef = useRef<THREE.Group>(null);

  const pinColors: Record<Acuity, string> = {
    Critical: '#EF4444',
    Medium: '#F59E0B',
    Low: '#10B981',
    Scheduled: '#3B82F6',
  };

  const color = pinColors[triage] || '#3B82F6';

  useFrame(({ clock }) => {
    if (pinRef.current) {
      // Bobbing up and down gently
      const t = clock.getElapsedTime();
      pinRef.current.position.y = height + Math.sin(t * 4.5) * 0.18;
      pinRef.current.rotation.y = t * 1.5;
    }
  });

  return (
    <group ref={pinRef} position={[0, height, 0]}>
      {/* Upper sphere head */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      {/* Lower tapered cone point */}
      <mesh position={[0, 0.15, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.24, 0.45, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* Small white center dot */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

// Ambulance 3D Mesh with 4 Fleets and Flashing Lightbars
function AmbulanceMesh({ ambulance }: { ambulance: SimAmbulance }) {
  const groupRef = useRef<THREE.Group>(null);
  const leftBeaconRef = useRef<THREE.Mesh>(null);
  const rightBeaconRef = useRef<THREE.Mesh>(null);

  const selectedAgent = useSimStore((s) => s.selectedAgent);
  const setFollowedAgent = useSimStore((s) => s.setFollowedAgent);
  const isSelected = selectedAgent?.id === ambulance.id;

  // Fleet livery colors
  const fleetTheme = React.useMemo(() => {
    switch (ambulance.fleet) {
      case 'CityRescue':
        return { body: '#F8FAFC', stripe: '#0D9488', roof: '#FFFFFF' };
      case 'MediExpress':
        return { body: '#F8FAFC', stripe: '#EA580C', roof: '#FFFFFF' };
      case 'CareFirst':
        return { body: '#1E40AF', stripe: '#FFFFFF', roof: '#1D4ED8' };
      case 'LifeLine':
      default:
        return { body: '#F8FAFC', stripe: '#2F5BEA', roof: '#FFFFFF' };
    }
  }, [ambulance.fleet]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(ambulance.position.x, ambulance.position.y || 0, ambulance.position.z);
      groupRef.current.rotation.y = ambulance.rotationY;
    }

    // Flashing emergency beacons
    if (ambulance.flashingLight) {
      const isRedPhase = Math.sin(ambulance.beaconPhase) > 0;
      if (leftBeaconRef.current) {
        (leftBeaconRef.current.material as THREE.MeshBasicMaterial).color.set(
          isRedPhase ? '#EF4444' : '#1E293B'
        );
      }
      if (rightBeaconRef.current) {
        (rightBeaconRef.current.material as THREE.MeshBasicMaterial).color.set(
          !isRedPhase ? '#3B82F6' : '#1E293B'
        );
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setFollowedAgent({
      id: ambulance.id,
      name: `${ambulance.fleet} ${ambulance.id}`,
      type: 'ambulance',
      siteId: ambulance.targetSiteId,
      label: ambulance.label,
      status: ambulance.state,
      position: ambulance.position,
      details: {
        fleet: ambulance.fleet,
        speed: `${ambulance.speed.toFixed(1)} m/s`,
        targetBay: ambulance.targetBaySlot ? `Bay ${ambulance.targetBaySlot}` : 'En Route',
      },
    });
  };

  return (
    <group
      ref={groupRef}
      name={`amb-${ambulance.id}`}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'grab';
      }}
    >
      {isSelected && <SelectionBrackets size={[3.2, 2.6, 5.8]} />}

      {/* Main Ambulance Body (Chassis Box) */}
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 1.7, 5.0]} />
        <meshStandardMaterial color={fleetTheme.body} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Fleet Livery Stripe along sides */}
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[2.36, 0.4, 5.02]} />
        <meshStandardMaterial color={fleetTheme.stripe} roughness={0.4} />
      </mesh>

      {/* Cabin Windshield (Forward +Z) */}
      <mesh position={[0, 1.35, 2.15]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[1.9, 0.7, 0.7]} />
        <meshStandardMaterial color="#93C5FD" roughness={0.1} metalness={0.7} />
      </mesh>

      {/* Rear Ambulance Doors (+-Z) */}
      <mesh position={[0, 1.1, -2.52]}>
        <boxGeometry args={[1.8, 1.4, 0.05]} />
        <meshStandardMaterial color={fleetTheme.stripe} />
      </mesh>

      {/* Emergency Lightbar on Roof */}
      <group position={[0, 2.1, 0.6]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.18, 0.4]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        {/* Left beacon (Red) */}
        <mesh ref={leftBeaconRef} position={[-0.55, 0.12, 0]}>
          <boxGeometry args={[0.35, 0.16, 0.28]} />
          <meshBasicMaterial color={ambulance.flashingLight ? '#EF4444' : '#64748B'} />
        </mesh>
        {/* Right beacon (Blue) */}
        <mesh ref={rightBeaconRef} position={[0.55, 0.12, 0]}>
          <boxGeometry args={[0.35, 0.16, 0.28]} />
          <meshBasicMaterial color={ambulance.flashingLight ? '#3B82F6' : '#64748B'} />
        </mesh>
      </group>

      {/* 4 Wheels */}
      {[-1.15, 1.15].map((wx, i) =>
        [-1.6, 1.5].map((wz, j) => (
          <group key={`${i}-${j}`} position={[wx, 0.35, wz]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.36, 0.36, 0.26, 12]} />
              <meshStandardMaterial color="#1E293B" roughness={0.8} />
            </mesh>
            {/* Wheel rim */}
            <mesh rotation={[0, 0, Math.PI / 2]} position={[wx > 0 ? 0.08 : -0.08, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.12, 8]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
            </mesh>
          </group>
        ))
      )}

      {/* Blue Animated Docking Route Line when DOCKING */}
      {ambulance.state === 'DOCKING' && (
        <mesh position={[0, -1.05, 3.0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.4, 5.0]} />
          <meshBasicMaterial color={CONFIG.colors.accentRoyalBlue} opacity={0.65} transparent />
        </mesh>
      )}
    </group>
  );
}

// Logistics Courier Supply Van (Delivers Medicine Crates from Pharmacy Depot)
function SupplyVanMesh({ van }: { van: SimSupplyVan }) {
  const groupRef = useRef<THREE.Group>(null);
  const selectedAgent = useSimStore((s) => s.selectedAgent);
  const setFollowedAgent = useSimStore((s) => s.setFollowedAgent);
  const isSelected = selectedAgent?.id === van.id;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(van.position.x, 0, van.position.z);
      groupRef.current.rotation.y = van.rotationY;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setFollowedAgent({
      id: van.id,
      name: `Supply Van ${van.id}`,
      type: 'van',
      siteId: van.targetSiteId,
      label: van.label,
      status: van.state,
      position: van.position,
      details: {
        cargo: '3 Medicine Crates (Oxygen, Saline, Gloves)',
        destination: van.targetSiteId,
      },
    });
  };

  return (
    <group
      ref={groupRef}
      name={`van-${van.id}`}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'grab';
      }}
    >
      {isSelected && <SelectionBrackets size={[2.8, 2.4, 5.2]} />}

      {/* Van Body */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.7, 4.6]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>

      {/* Teal Logistics Stripe */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[2.24, 0.4, 4.62]} />
        <meshStandardMaterial color="#0D9488" roughness={0.4} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 1.3, 1.9]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[1.8, 0.65, 0.6]} />
        <meshStandardMaterial color="#93C5FD" roughness={0.1} metalness={0.6} />
      </mesh>

      {/* Green Cross Logistics Emblem on Roof */}
      <group position={[0, 1.98, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <planeGeometry args={[1.0, 0.35]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
        <mesh>
          <planeGeometry args={[0.35, 1.0]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
      </group>

      {/* Wheels */}
      {[-1.1, 1.1].map((wx, i) =>
        [-1.4, 1.3].map((wz, j) => (
          <mesh key={`${i}-${j}`} position={[wx, 0.32, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.22, 12]} />
            <meshStandardMaterial color="#1E293B" roughness={0.8} />
          </mesh>
        ))
      )}
    </group>
  );
}

// Orderly pushing Wheeled Stretcher Cart or Wheelchair
function OrderlyMesh({ orderly }: { orderly: SimOrderly }) {
  const groupRef = useRef<THREE.Group>(null);
  const selectedAgent = useSimStore((s) => s.selectedAgent);
  const setFollowedAgent = useSimStore((s) => s.setFollowedAgent);
  const isSelected = selectedAgent?.id === orderly.id;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.set(orderly.position.x, 0, orderly.position.z);
      groupRef.current.rotation.y = orderly.rotationY;

      // Gentle walking bob
      if (orderly.state !== 'IDLE' && orderly.state !== 'REST') {
        const bob = Math.sin(clock.getElapsedTime() * 7) * 0.04;
        groupRef.current.position.y = bob;
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setFollowedAgent({
      id: orderly.id,
      name: orderly.name,
      type: 'orderly',
      siteId: orderly.siteId,
      label: orderly.label,
      status: orderly.state,
      position: orderly.position,
      details: {
        energy: `${orderly.energy}%`,
        task: orderly.state === 'TRANSPORTING' ? 'Transporting Patient' : 'On Standby',
      },
    });
  };

  return (
    <group
      ref={groupRef}
      name={`ord-${orderly.id}`}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'grab';
      }}
    >
      {isSelected && <SelectionBrackets size={[1.6, 2.2, 3.2]} />}

      {/* Orderly Human Figure (Scrubs) */}
      <group position={[0, 0, -1.2]}>
        {/* Body capsule */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <capsuleGeometry args={[0.22, 0.55, 4, 8]} />
          <meshStandardMaterial color="#0284C7" roughness={0.5} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#FED7AA" roughness={0.4} />
        </mesh>
        {/* White Nurse Cap */}
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[0.22, 0.08, 0.18]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Stretcher Cart Frame */}
      <group position={[0, 0, 0.2]}>
        {/* Metal mattress tray */}
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.12, 2.1]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Foam mattress */}
        <mesh position={[0, 0.82, 0]} castShadow>
          <boxGeometry args={[0.82, 0.1, 2.0]} />
          <meshStandardMaterial color="#BAE6FD" roughness={0.6} />
        </mesh>
        {/* Stretcher legs */}
        {[-0.38, 0.38].map((lx, i) =>
          [-0.8, 0.8].map((lz, j) => (
            <group key={`${i}-${lz}`} position={[lx, 0.35, lz]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.04, 0.04, 0.7, 6]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
              {/* Caster wheel */}
              <mesh position={[0, -0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.06, 8]} />
                <meshStandardMaterial color="#1E293B" />
              </mesh>
            </group>
          ))
        )}
        {/* IV Pole & Drip Bag */}
        <group position={[0.42, 0.7, 0.8]}>
          <mesh position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.3, 6]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
          </mesh>
          <mesh position={[0, 1.25, -0.05]}>
            <boxGeometry args={[0.1, 0.18, 0.06]} />
            <meshStandardMaterial color="#38BDF8" transparent opacity={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// Patient with Bobbing Triage Map Pin
function PatientMesh({ patient }: { patient: SimPatient }) {
  const groupRef = useRef<THREE.Group>(null);
  const selectedAgent = useSimStore((s) => s.selectedAgent);
  const setFollowedAgent = useSimStore((s) => s.setFollowedAgent);
  const isSelected = selectedAgent?.id === patient.id;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(patient.position.x, 0, patient.position.z);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setFollowedAgent({
      id: patient.id,
      name: `${patient.name} (${patient.id})`,
      type: 'patient',
      siteId: patient.siteId,
      label: patient.label,
      status: patient.stage,
      position: patient.position,
      details: {
        condition: patient.condition,
        triage: patient.triage,
        vitals: `HR ${patient.vitals.hr} | SpO2 ${patient.vitals.spo2}% | BP ${patient.vitals.bp}`,
        stage: patient.stage,
      },
    });
  };

  return (
    <group
      ref={groupRef}
      name={`pt-${patient.id}`}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'grab';
      }}
    >
      {isSelected && <SelectionBrackets size={[1.8, 2.4, 2.4]} />}

      {/* Patient Figure (Lying on stretcher or walking) */}
      <mesh position={[0, 0.88, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.65, 4, 8]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.6} />
      </mesh>

      {/* Bobbing Triage Map Pin per spec (Red Critical, Amber Medium, Green Low, Blue Scheduled) */}
      <TriageMapPin triage={patient.triage} height={2.5} />
    </group>
  );
}

// Master Active Agents Layer Component
export function Agents() {
  return (
    <group name="active-agents-layer">
      {/* Ambulances in motion across the road network */}
      {simEngine.ambulances.map((amb) => (
        <AmbulanceMesh key={amb.id} ambulance={amb} />
      ))}

      {/* Supply Logistics Vans delivering medicine crates */}
      {simEngine.supplyVans.map((van) => (
        <SupplyVanMesh key={van.id} van={van} />
      ))}

      {/* Orderlies with Stretcher Carts */}
      {simEngine.orderlies.map((ord) => (
        <OrderlyMesh key={ord.id} orderly={ord} />
      ))}

      {/* Patients with Bobbing Triage Pins */}
      {simEngine.patients.map((pt) => (
        <PatientMesh key={pt.id} patient={pt} />
      ))}
    </group>
  );
}
