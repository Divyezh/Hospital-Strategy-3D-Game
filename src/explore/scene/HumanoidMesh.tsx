'use client';

import React from 'react';
import * as THREE from 'three';
import { EXPLORE_TOKENS } from '@/explore/tokens';

export type HumanoidRole =
  | 'guard'
  | 'doctor'
  | 'nurse'
  | 'surgeon'
  | 'receptionist'
  | 'patient'
  | 'visitor'
  | 'ward_boy'
  | 'barista'
  | 'chef'
  | 'canteen_worker';

export type PatientStatus = 'curing' | 'stable' | 'critical' | 'recovering';

export type HoldingItem =
  | 'none'
  | 'clipboard'
  | 'iv_stand'
  | 'medicine_tray'
  | 'crutch'
  | 'stretcher'
  | 'wheelchair'
  | 'coffee_cup'
  | 'food_tray';

interface HumanoidMeshProps {
  role: HumanoidRole;
  walkPhase?: number; // 0 to 2PI for leg/arm swing
  isSitting?: boolean;
  isLying?: boolean;
  holdingItem?: HoldingItem;
  patientStatus?: PatientStatus;
  breathPhase?: number;
  shirtColorOverride?: string;
  pantsColorOverride?: string;
  hairColorOverride?: string;
  skinColorOverride?: string;
  isDrinking?: boolean;
  isWorking?: boolean;
}

export function HumanoidMesh({
  role,
  walkPhase = 0,
  isSitting = false,
  isLying = false,
  holdingItem = 'none',
  patientStatus = 'curing',
  breathPhase = 0,
  shirtColorOverride,
  pantsColorOverride,
  hairColorOverride,
  skinColorOverride,
  isDrinking = false,
  isWorking = false,
}: HumanoidMeshProps) {
  // Skin colors and styling
  let skinColor = skinColorOverride || '#E0AC69';
  let hairColor = hairColorOverride || '#3A2E2B';

  let shirtColor = '#3B82F6';
  let pantsColor = '#1E293B';
  let hasCap = false;
  let capColor = '#1E2C44';

  switch (role) {
    case 'barista':
      shirtColor = '#3E2723';
      pantsColor = '#1F2937';
      hasCap = true;
      capColor = '#3E2723';
      break;
    case 'chef':
      shirtColor = '#F8FAFC';
      pantsColor = '#334155';
      hasCap = true;
      capColor = '#FFFFFF';
      break;
    case 'canteen_worker':
      shirtColor = '#D97706';
      pantsColor = '#1E293B';
      hasCap = true;
      capColor = '#D97706';
      break;
    case 'guard':
      shirtColor = EXPLORE_TOKENS.colors.securityNavy;
      pantsColor = '#182438';
      hasCap = true;
      capColor = EXPLORE_TOKENS.colors.securityNavy;
      break;
    case 'doctor':
      shirtColor = EXPLORE_TOKENS.colors.doctorWhite;
      pantsColor = '#334155';
      break;
    case 'nurse':
      shirtColor = EXPLORE_TOKENS.colors.scrubsTeal;
      pantsColor = EXPLORE_TOKENS.colors.scrubsTeal;
      break;
    case 'ward_boy':
      shirtColor = '#0D9488'; // Hospital Teal / Jade utility uniform
      pantsColor = '#1E293B'; // Navy blue pants
      hasCap = false;
      break;
    case 'surgeon':
      shirtColor = EXPLORE_TOKENS.colors.scrubsGreen;
      pantsColor = EXPLORE_TOKENS.colors.scrubsGreen;
      hasCap = true;
      capColor = EXPLORE_TOKENS.colors.scrubsGreen;
      break;
    case 'receptionist':
      shirtColor = '#F472B6';
      pantsColor = '#334155';
      break;
    case 'patient':
      shirtColor = '#93C5FD'; // Light blue hospital gown
      pantsColor = '#BFDBFE';
      break;
    case 'visitor':
    default:
      shirtColor = '#F59E0B';
      pantsColor = '#475569';
      break;
  }

  if (shirtColorOverride) shirtColor = shirtColorOverride;
  if (pantsColorOverride) pantsColor = pantsColorOverride;

  // Alive breathing motion & limb kinematics
  const breath = Math.sin(breathPhase) * 0.015;
  const legSwing = isSitting || isLying ? 0 : Math.sin(walkPhase) * 0.48;
  const armSwing = isSitting || isLying ? 0 : Math.sin(walkPhase + Math.PI) * 0.45;

  // Lying down pose (for patients resting in hospital beds)
  if (isLying) {
    const isCuring = patientStatus === 'curing' || patientStatus === 'recovering';
    return (
      <group position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Head on pillow */}
        <mesh position={[0, 0.85, 0.18 + breath]} castShadow>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.87, 0.19 + breath]}>
          <sphereGeometry args={[0.185, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
          <meshStandardMaterial color={hairColor} roughness={0.8} />
        </mesh>

        {/* Breathing Torso with Hospital Gown */}
        <mesh position={[0, 0.45, 0.14 + breath * 1.5]} castShadow>
          <boxGeometry args={[0.42, 0.58, 0.22]} />
          <meshStandardMaterial color={shirtColor} roughness={0.6} />
        </mesh>

        {/* Arms resting on sides / bed rail */}
        <mesh position={[-0.26, 0.45, 0.12]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.09, 0.52, 0.09]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        <mesh position={[0.26, 0.45, 0.12]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.09, 0.52, 0.09]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>

        {/* Legs under light hospital blanket */}
        <mesh position={[0, -0.3, 0.13]}>
          <boxGeometry args={[0.44, 0.9, 0.2]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
        </mesh>

        {/* Curing Vitals Status Beacon (Pulsing Green for Curing) */}
        {isCuring && (
          <mesh position={[0.3, 0.9, 0.25]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color="#10B981"
              emissive="#10B981"
              emissiveIntensity={1.5 + Math.sin(breathPhase * 3) * 1.0}
            />
          </mesh>
        )}
      </group>
    );
  }

  // Left arm rotation
  let leftArmRot: [number, number, number] = [armSwing, 0, 0];
  if (holdingItem === 'food_tray') {
    leftArmRot = [Math.PI / 2.5, 0, 0.2];
  } else if (isWorking) {
    leftArmRot = [Math.PI / 3 + Math.sin(breathPhase * 3) * 0.2, 0, 0.1];
  } else if (holdingItem === 'stretcher' || holdingItem === 'wheelchair') {
    leftArmRot = [Math.PI / 3, 0, 0];
  } else if (holdingItem === 'clipboard') {
    leftArmRot = [Math.PI / 3.5, 0, 0.2];
  } else if (isSitting) {
    leftArmRot = [Math.PI / 3.8 + Math.sin(breathPhase * 0.8) * 0.05, 0, 0.1];
  }

  // Right arm rotation
  let rightArmRot: [number, number, number] = [-armSwing, 0, 0];
  if (holdingItem === 'food_tray') {
    rightArmRot = [Math.PI / 2.5, 0, -0.2];
  } else if (isDrinking) {
    const sip = (Math.sin(breathPhase * 2.0) + 1) / 2;
    rightArmRot = [Math.PI * 0.42 + sip * 0.44, 0, -0.35 * sip];
  } else if (isWorking) {
    rightArmRot = [Math.PI / 2.8 + Math.cos(breathPhase * 3.2) * 0.2, 0, -0.1];
  } else if (holdingItem === 'coffee_cup') {
    rightArmRot = [Math.PI / 2.5, 0, -0.15];
  } else if (holdingItem === 'stretcher' || holdingItem === 'wheelchair') {
    rightArmRot = [Math.PI / 3, 0, 0];
  } else if (isSitting) {
    rightArmRot = [Math.PI / 3.8 + Math.cos(breathPhase * 0.8) * 0.05, 0, -0.1];
  }

  // Standing / Walking / Sitting Pose
  return (
    <group position={[0, isSitting ? -0.35 : 0, 0]}>
      {/* Head */}
      <mesh position={[0, 1.55 + breath, 0]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Hair or Cap */}
      {hasCap ? (
        <group position={[0, 1.62 + breath, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
            <meshStandardMaterial color={capColor} roughness={0.5} />
          </mesh>
          {role === 'guard' && (
            <mesh position={[0, -0.02, 0.2]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[0.22, 0.02, 0.12]} />
              <meshStandardMaterial color="#0F172A" />
            </mesh>
          )}
        </group>
      ) : (
        <mesh position={[0, 1.64 + breath, -0.02]} castShadow>
          <sphereGeometry args={[0.185, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
          <meshStandardMaterial color={hairColor} roughness={0.8} />
        </mesh>
      )}

      {/* Breathing Torso */}
      <mesh position={[0, 1.1 + breath, 0]} castShadow>
        <boxGeometry args={[0.42, 0.58, 0.24]} />
        <meshStandardMaterial color={shirtColor} roughness={0.6} />
      </mesh>

      {/* Role-Specific Chest Accessories */}
      {role === 'doctor' && (
        <mesh position={[0, 1.25 + breath, 0.13]}>
          <boxGeometry args={[0.24, 0.18, 0.02]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
      )}
      {role === 'guard' && (
        <mesh position={[0.1, 1.25 + breath, 0.13]}>
          <boxGeometry args={[0.06, 0.08, 0.02]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.9} />
        </mesh>
      )}
      {role === 'ward_boy' && (
        <mesh position={[0.08, 1.22 + breath, 0.13]}>
          <boxGeometry args={[0.08, 0.1, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
      )}
      {role === 'nurse' && (
        <mesh position={[-0.1, 1.22 + breath, 0.13]}>
          <boxGeometry args={[0.06, 0.08, 0.02]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.4} />
        </mesh>
      )}

      {/* Left Arm */}
      <group position={[-0.26, 1.3 + breath, 0]} rotation={leftArmRot}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.1]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        <mesh position={[0, -0.48, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>

        {/* Held Clipboard for Nurses */}
        {holdingItem === 'clipboard' && (
          <group position={[0.08, -0.48, 0.12]} rotation={[-0.4, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.18, 0.25, 0.02]} />
              <meshStandardMaterial color="#92400E" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.012]}>
              <boxGeometry args={[0.15, 0.21, 0.005]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
            </mesh>
          </group>
        )}
      </group>

      {/* Right Arm */}
      <group position={[0.26, 1.3 + breath, 0]} rotation={rightArmRot}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.1]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        <mesh position={[0, -0.48, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>

        {/* Held Cup for Diners / Coffee lovers */}
        {(isDrinking || holdingItem === 'coffee_cup') && (
          <group position={[0, -0.48, 0.1]} rotation={[0.2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.05, 0.04, 0.12, 10]} />
              <meshStandardMaterial color="#F9FAFB" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.052, 0.052, 0.02, 10]} />
              <meshStandardMaterial color="#92400E" />
            </mesh>
          </group>
        )}

        {/* Holding Crutch for Recovering Patient */}
        {holdingItem === 'crutch' && (
          <group position={[0.05, -0.5, 0]} rotation={[0, 0, 0]}>
            <mesh position={[0, -0.3, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 1.3]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[0.06, 0.04, 0.18]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
          </group>
        )}
      </group>

      {/* Held Food Tray between both hands */}
      {holdingItem === 'food_tray' && (
        <group position={[0, 1.05 + breath, 0.38]}>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.03, 0.3]} />
            <meshStandardMaterial color="#B91C1C" roughness={0.4} />
          </mesh>
          {/* Burger box */}
          <mesh position={[-0.1, 0.04, 0]}>
            <boxGeometry args={[0.12, 0.07, 0.12]} />
            <meshStandardMaterial color="#FBBF24" />
          </mesh>
          {/* Drink cup */}
          <mesh position={[0.12, 0.06, -0.05]}>
            <cylinderGeometry args={[0.04, 0.03, 0.12, 8]} />
            <meshStandardMaterial color="#EF4444" />
          </mesh>
        </group>
      )}

      {/* Left Leg */}
      <group
        position={[-0.12, 0.82, 0]}
        rotation={isSitting ? [Math.PI / 2, 0, 0] : [legSwing, 0, 0]}
      >
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.14, 0.8, 0.14]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>
        <mesh position={[0, -0.82, 0.06]} castShadow>
          <boxGeometry args={[0.14, 0.08, 0.22]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>

      {/* Right Leg */}
      <group
        position={[0.12, 0.82, 0]}
        rotation={isSitting ? [Math.PI / 2, 0, 0] : [-legSwing, 0, 0]}
      >
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.14, 0.8, 0.14]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>
        <mesh position={[0, -0.82, 0.06]} castShadow>
          <boxGeometry args={[0.14, 0.08, 0.22]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>
    </group>
  );
}
