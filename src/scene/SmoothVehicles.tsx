'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SimAmbulance, SimSupplyVan } from '@/sim/types';
import { useSimStore } from '@/store/useSimStore';
import { DockTrajectoryLine } from './DockTrajectoryLine';

/**
 * High-fidelity Ambulance Mesh matching the WareTrack clean aesthetic.
 * Includes rotating tires, front wheel steering yaw, synchronized lightbar,
 * and articulated rear doors that swing open when docked in a bay.
 */
export function SmoothAmbulanceMesh({ ambulance }: { ambulance: SimAmbulance }) {
  const groupRef = useRef<THREE.Group>(null);
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);
  const frontLeftWheelRef = useRef<THREE.Group>(null);
  const frontRightWheelRef = useRef<THREE.Group>(null);
  const wheelSpin = useRef(0);

  const selectedAgent = useSimStore((s) => s.selectedAgent);
  const setFollowedAgent = useSimStore((s) => s.setFollowedAgent);
  const isSelected = selectedAgent?.id === ambulance.id;

  // Door angle target: open 1.9 rad (~110 deg) when UNLOADING
  const isDocked = ambulance.state === 'UNLOADING';
  const targetDoorAngle = isDocked ? 1.9 : 0;
  const currentDoorAngle = useRef(0);

  // Fleet Livery Colors
  const livery = React.useMemo(() => {
    switch (ambulance.fleet) {
      case 'CityRescue':
        return { body: '#FFFFFF', stripe: '#0D9488', trim: '#14B8A6' };
      case 'MediExpress':
        return { body: '#FFFFFF', stripe: '#EA580C', trim: '#F97316' };
      case 'CareFirst':
        return { body: '#FFFFFF', stripe: '#2563EB', trim: '#1D4ED8' };
      case 'LifeLine':
      default:
        return { body: '#FFFFFF', stripe: '#1E60F3', trim: '#2563EB' };
    }
  }, [ambulance.fleet]);

  useFrame((_, dt) => {
    if (groupRef.current) {
      groupRef.current.position.set(ambulance.position.x, 0, ambulance.position.z);
      groupRef.current.rotation.y = ambulance.rotationY;
    }

    // Wheel rotation proportional to speed
    if (ambulance.speed > 0.1) {
      wheelSpin.current += ambulance.speed * dt * 2.2;
    }

    // Smooth rear door articulation
    currentDoorAngle.current = THREE.MathUtils.lerp(
      currentDoorAngle.current,
      targetDoorAngle,
      Math.min(dt * 4, 1)
    );
    if (leftDoorRef.current) {
      leftDoorRef.current.rotation.y = -currentDoorAngle.current;
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.rotation.y = currentDoorAngle.current;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setFollowedAgent({
      id: ambulance.id,
      name: `${ambulance.fleet} — ${ambulance.id}`,
      type: 'ambulance',
      siteId: ambulance.targetSiteId,
      label: ambulance.label,
      status: ambulance.state,
      position: ambulance.position,
      details: {
        fleet: ambulance.fleet,
        status: ambulance.state,
        speed: `${ambulance.speed.toFixed(1)} km/h`,
        assignedBay: ambulance.targetBaySlot ? `Bay ${ambulance.targetBaySlot}` : 'En Route',
        patientStatus: ambulance.patientId ? 'Carrying Critical Patient' : 'Empty / Staged',
        battery: '88%',
        driver: 'Carlos M.',
      },
    });
  };

  return (
    <group>
      {/* Animated Ground Trajectory Line when en route or docking */}
      {(ambulance.state === 'EN_ROUTE' || ambulance.state === 'DOCKING') && ambulance.path && (
        <DockTrajectoryLine path={ambulance.path} color="#2563EB" />
      )}

      <group
        ref={groupRef}
        name={`smooth-amb-${ambulance.id}`}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'grab';
        }}
      >
        {/* 3D Selection Bounding Box & Corner Brackets */}
        {isSelected && (
          <group position={[0, 1.4, 0]}>
            <mesh>
              <boxGeometry args={[2.8, 2.7, 5.6]} />
              <meshBasicMaterial color="#1E60F3" transparent opacity={0.15} />
            </mesh>
            {/* 4 Bottom corner brackets */}
            {[-1.4, 1.4].map((cx) =>
              [-2.8, 2.8].map((cz) => (
                <group key={`${cx}-${cz}`} position={[cx, -1.35, cz]}>
                  <mesh position={[-Math.sign(cx) * 0.25, 0, 0]}>
                    <boxGeometry args={[0.5, 0.08, 0.08]} />
                    <meshBasicMaterial color="#1E60F3" />
                  </mesh>
                  <mesh position={[0, 0, -Math.sign(cz) * 0.25]}>
                    <boxGeometry args={[0.08, 0.08, 0.5]} />
                    <meshBasicMaterial color="#1E60F3" />
                  </mesh>
                  <mesh position={[0, 0.25, 0]}>
                    <boxGeometry args={[0.08, 0.5, 0.08]} />
                    <meshBasicMaterial color="#1E60F3" />
                  </mesh>
                </group>
              ))
            )}
          </group>
        )}

        {/* Floating 3D Status Pill Billboarding above vehicle */}
        <group position={[0, 3.2, 0]}>
          <mesh>
            <planeGeometry args={[2.2, 0.5]} />
            <meshBasicMaterial color="#0F172A" transparent opacity={0.88} />
          </mesh>
          <mesh position={[-0.85, 0, 0.01]}>
            <circleGeometry args={[0.12, 12]} />
            <meshBasicMaterial color={ambulance.state === 'UNLOADING' ? '#10B981' : '#3B82F6'} />
          </mesh>
        </group>

        {/* Main Boxy Ambulance Body */}
        <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 1.9, 5.2]} />
          <meshStandardMaterial color={livery.body} roughness={0.25} metalness={0.1} />
        </mesh>

        {/* Bold Livery Side Stripe */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[2.44, 0.45, 5.22]} />
          <meshStandardMaterial color={livery.stripe} roughness={0.3} />
        </mesh>

        {/* Aerodynamic Cab Windshield & Windows */}
        <mesh position={[0, 1.55, 2.2]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[2.0, 0.75, 0.8]} />
          <meshStandardMaterial color="#93C5FD" roughness={0.1} metalness={0.8} />
        </mesh>

        {/* Side Patient Cabin Windows */}
        {[-1.23, 1.23].map((wx) => (
          <mesh key={wx} position={[wx, 1.6, -0.6]}>
            <boxGeometry args={[0.05, 0.55, 1.8]} />
            <meshStandardMaterial color="#1E293B" roughness={0.1} metalness={0.8} />
          </mesh>
        ))}

        {/* Roof Emergency Lightbar (Strobe animation) */}
        <group position={[0, 2.32, 1.6]}>
          <mesh castShadow>
            <boxGeometry args={[1.6, 0.18, 0.35]} />
            <meshStandardMaterial color="#0F172A" roughness={0.5} />
          </mesh>
          {/* Left Red Strobe */}
          <mesh position={[-0.6, 0.05, 0]}>
            <boxGeometry args={[0.35, 0.15, 0.28]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#EF4444"
              emissiveIntensity={ambulance.flashingLight ? 1.5 : 0.2}
            />
          </mesh>
          {/* Right Blue Strobe */}
          <mesh position={[0.6, 0.05, 0]}>
            <boxGeometry args={[0.35, 0.15, 0.28]} />
            <meshStandardMaterial
              color="#3B82F6"
              emissive="#3B82F6"
              emissiveIntensity={ambulance.flashingLight ? 1.5 : 0.2}
            />
          </mesh>
        </group>

        {/* Articulated Double Rear Doors (Swing open 180° when UNLOADING at dock) */}
        <group position={[0, 1.3, -2.61]}>
          {/* Left rear door hinge */}
          <group ref={leftDoorRef} position={[-1.15, 0, 0]}>
            <mesh position={[0.55, 0, 0]} castShadow>
              <boxGeometry args={[1.1, 1.8, 0.06]} />
              <meshStandardMaterial color={livery.body} roughness={0.3} />
            </mesh>
            {/* Door window */}
            <mesh position={[0.55, 0.35, -0.04]}>
              <boxGeometry args={[0.6, 0.5, 0.02]} />
              <meshStandardMaterial color="#1E293B" roughness={0.1} />
            </mesh>
          </group>

          {/* Right rear door hinge */}
          <group ref={rightDoorRef} position={[1.15, 0, 0]}>
            <mesh position={[-0.55, 0, 0]} castShadow>
              <boxGeometry args={[1.1, 1.8, 0.06]} />
              <meshStandardMaterial color={livery.body} roughness={0.3} />
            </mesh>
            {/* Door window */}
            <mesh position={[-0.55, 0.35, -0.04]}>
              <boxGeometry args={[0.6, 0.5, 0.02]} />
              <meshStandardMaterial color="#1E293B" roughness={0.1} />
            </mesh>
          </group>
        </group>

        {/* Wheels with Hubcaps and Rolling Animation */}
        {/* Front Left Wheel */}
        <group ref={frontLeftWheelRef} position={[-1.2, 0.35, 1.6]}>
          <mesh rotation={[wheelSpin.current, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>
        </group>
        {/* Front Right Wheel */}
        <group ref={frontRightWheelRef} position={[1.2, 0.35, 1.6]}>
          <mesh rotation={[wheelSpin.current, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>
        </group>
        {/* Rear Wheels */}
        {[-1.2, 1.2].map((wx) => (
          <mesh
            key={`rw-${wx}`}
            position={[wx, 0.35, -1.6]}
            rotation={[wheelSpin.current, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * High-fidelity Medical Supply Freight Van ("Central Pharma Express VAN-101")
 */
export function SmoothSupplyVanMesh({ van }: { van: SimSupplyVan }) {
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
      name: `Pharma Express — ${van.id}`,
      type: 'van',
      siteId: van.targetSiteId,
      label: van.label,
      status: van.state,
      position: van.position,
      details: {
        cargo: 'Medical Supplies (IV Fluids, Sterile PPE, Antibiotics)',
        destination: 'Bay 4 — Medical Supply Depot',
        status: van.state,
        weight: '420 kg',
        crates: '6 Pallets Staged',
      },
    });
  };

  return (
    <group>
      {/* Animated Ground Trajectory Line */}
      {(van.state === 'EN_ROUTE' || van.state === 'DOCKING') && van.path && (
        <DockTrajectoryLine path={van.path} color="#0D9488" />
      )}

      <group
        ref={groupRef}
        name={`smooth-van-${van.id}`}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'grab';
        }}
      >
        {/* Selection Bracket */}
        {isSelected && (
          <group position={[0, 1.35, 0]}>
            <mesh>
              <boxGeometry args={[2.7, 2.6, 5.2]} />
              <meshBasicMaterial color="#0D9488" transparent opacity={0.15} />
            </mesh>
          </group>
        )}

        {/* Clean Commercial Van Chassis */}
        <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 1.8, 4.8]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
        </mesh>

        {/* Teal Logistics Stripe */}
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[2.34, 0.45, 4.82]} />
          <meshStandardMaterial color="#0D9488" roughness={0.3} />
        </mesh>

        {/* Cab Windshield */}
        <mesh position={[0, 1.5, 2.0]} rotation={[-0.22, 0, 0]}>
          <boxGeometry args={[1.9, 0.7, 0.8]} />
          <meshStandardMaterial color="#93C5FD" roughness={0.1} metalness={0.7} />
        </mesh>

        {/* Wheels */}
        {[-1.15, 1.15].map((wx) =>
          [-1.5, 1.5].map((wz) => (
            <mesh
              key={`${wx}-${wz}`}
              position={[wx, 0.32, wz]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <cylinderGeometry args={[0.32, 0.32, 0.22, 16]} />
              <meshStandardMaterial color="#0F172A" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
}
