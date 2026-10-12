'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Environment as DreiEnvironment, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing';
import { useExploreStore } from '@/explore/store';
import { EXPLORE_TOKENS } from '@/explore/tokens';

export function ExploreEnvironment() {
  const quality = useExploreStore((s) => s.quality);
  const timeOfDay = useExploreStore((s) => s.timeOfDay);
  const isNight = timeOfDay === 'night';
  const isGolden = timeOfDay === 'golden';

  // Time of day lighting parameters - Crystal Clear High Quality Architecture
  const lightConfig = useMemo(() => {
    switch (timeOfDay) {
      case 'morning':
        return {
          sky: '#E0F2FE',
          ground: '#CBD5E1',
          sunColor: '#FFFBEB',
          sunIntensity: 2.2,
          sunPos: [65, 55, 55] as [number, number, number],
          sunDiscPos: [180, 110, 140] as [number, number, number],
          ambientIntensity: 0.9,
          fogColor: '#E0F2FE',
          fogNear: 380,
          fogFar: 1000,
        };
      case 'noon':
        return {
          sky: '#E0F2FE',
          ground: '#CBD5E1',
          sunColor: '#FFFFFF',
          sunIntensity: 2.4,
          sunPos: [30, 85, 30] as [number, number, number],
          sunDiscPos: [40, 220, 40] as [number, number, number],
          ambientIntensity: 0.95,
          fogColor: '#E0F2FE',
          fogNear: 400,
          fogFar: 1100,
        };
      case 'night':
        return {
          sky: '#0A1128', // Deep Midnight Blue
          ground: '#0F172A',
          sunColor: '#93C5FD',
          sunIntensity: 0.75,
          sunPos: [-40, 60, -50] as [number, number, number], // Moon directional light
          sunDiscPos: [0, -100, 0] as [number, number, number],
          ambientIntensity: 0.42,
          fogColor: '#070E20',
          fogNear: 320,
          fogFar: 900,
        };
      case 'golden':
      default:
        return {
          sky: '#FEF3C7',
          ground: '#CBD5E1',
          sunColor: '#F59E0B',
          sunIntensity: 2.3,
          sunPos: [65, 48, 52] as [number, number, number],
          sunDiscPos: [190, 85, 120] as [number, number, number],
          ambientIntensity: 0.92,
          fogColor: '#FEF3C7',
          fogNear: 380,
          fogFar: 1000,
        };
    }
  }, [timeOfDay]);

  // Procedural field of twinkling night stars
  const stars = useMemo(() => {
    const starList: [number, number, number, number][] = [];
    for (let i = 0; i < 140; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * (Math.PI / 2.2); // Upper sky hemisphere
      const radius = 320 + Math.random() * 40;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi) + 20;
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const size = 0.5 + Math.random() * 0.9;
      starList.push([x, y, z, size]);
    }
    return starList;
  }, []);

  return (
    <>
      {/* Sky Background & Distant Horizon Fog */}
      <color attach="background" args={[lightConfig.sky]} />
      <fog attach="fog" args={[lightConfig.fogColor, lightConfig.fogNear, lightConfig.fogFar]} />

      {/* Balanced Sky/Ground Hemisphere Light */}
      <hemisphereLight
        args={[lightConfig.sky, lightConfig.ground, lightConfig.ambientIntensity]}
        position={[0, 60, 0]}
      />

      {/* Primary Key Sunlight / Moonlight with Soft PCF Shadows */}
      <directionalLight
        position={lightConfig.sunPos}
        intensity={lightConfig.sunIntensity}
        color={lightConfig.sunColor}
        castShadow
        shadow-mapSize-width={quality === 'low' ? 1024 : 2048}
        shadow-mapSize-height={quality === 'low' ? 1024 : 2048}
        shadow-camera-near={5}
        shadow-camera-far={260}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
      />

      {/* Cool Horizon Bounce Fill */}
      <directionalLight
        position={[-45, 25, -45]}
        intensity={isNight ? 0.2 : 0.4}
        color={isNight ? '#1E293B' : '#BFD9F2'}
      />

      {/* =========================================================================
          THE SUN IN THE SKY (Visible during Morning, Noon, Golden Sunset)
         ========================================================================= */}
      {!isNight && (
        <group position={lightConfig.sunDiscPos}>
          {/* Intense Core Glowing Solar Sphere */}
          <mesh>
            <sphereGeometry args={[11.0, 32, 32]} />
            <meshBasicMaterial color="#FFFBEB" />
          </mesh>

          {/* Inner Golden Corona Flare Layer */}
          <mesh>
            <sphereGeometry args={[16.5, 32, 32]} />
            <meshBasicMaterial
              color="#FDE047"
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Outer Radiant Atmospheric Solar Aura */}
          <mesh>
            <sphereGeometry args={[26.0, 24, 24]} />
            <meshBasicMaterial
              color="#F59E0B"
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Sunray Glow Disc Ring */}
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <ringGeometry args={[12.0, 38.0, 32]} />
            <meshBasicMaterial
              color="#FEF08A"
              transparent
              opacity={0.25}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      {/* =========================================================================
          THE MOON IN THE SKY (Visible during Night Mode with Craters & Halo)
         ========================================================================= */}
      {isNight && (
        <group position={[-160, 145, -180]}>
          {/* Main Luminous 3D Moon Body */}
          <mesh>
            <sphereGeometry args={[9.5, 32, 32]} />
            <meshStandardMaterial
              color="#F1F5F9"
              emissive="#E0F2FE"
              emissiveIntensity={1.8}
              roughness={0.7}
            />
          </mesh>

          {/* Dark Basaltic Lunar Maria / Crater Formations on Moon Face */}
          {[
            { pos: [1.8, 2.2, 8.8] as [number, number, number], r: 2.2 },
            { pos: [-2.5, 0.8, 8.6] as [number, number, number], r: 2.8 },
            { pos: [-0.8, -2.4, 8.7] as [number, number, number], r: 2.0 },
            { pos: [2.6, -1.2, 8.5] as [number, number, number], r: 1.8 },
            { pos: [-3.2, -1.8, 8.2] as [number, number, number], r: 1.6 },
          ].map((c, i) => (
            <mesh key={`crater-${i}`} position={c.pos}>
              <sphereGeometry args={[c.r, 12, 12]} />
              <meshStandardMaterial color="#64748B" roughness={0.9} />
            </mesh>
          ))}

          {/* Inner Ethereal Moonlight Halo Glow */}
          <mesh>
            <sphereGeometry args={[14.0, 24, 24]} />
            <meshBasicMaterial
              color="#93C5FD"
              transparent
              opacity={0.45}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Outer Celestial Moonlight Corona Atmosphere */}
          <mesh>
            <sphereGeometry args={[25.0, 24, 24]} />
            <meshBasicMaterial
              color="#60A5FA"
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Night Sky Twinkling Stars Field */}
          <group position={[160, -145, 180]}>
            {stars.map(([sx, sy, sz, ssize], idx) => (
              <mesh key={`star-${idx}`} position={[sx, sy, sz]}>
                <sphereGeometry args={[ssize, 6, 6]} />
                <meshBasicMaterial
                  color="#FFFFFF"
                  transparent
                  opacity={0.85}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* Offline Procedural Lightformer Environment Reflection */}
      <DreiEnvironment resolution={256}>
        <Lightformer
          form="rect"
          intensity={isNight ? 0.5 : 1.2}
          color="#FFFFFF"
          scale={[80, 80, 1]}
          position={[0, 45, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <Lightformer
          form="circle"
          intensity={isNight ? 0.8 : 1.8}
          color={isNight ? '#93C5FD' : '#FFE9CC'}
          scale={[35, 35, 1]}
          position={[40, 25, 35]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="ring"
          intensity={isNight ? 0.4 : 0.9}
          color="#BFD9F2"
          scale={[70, 70, 1]}
          position={[-35, 15, -35]}
          target={[0, 0, 0]}
        />
      </DreiEnvironment>

      {/* Cinematic Post-Processing Bloom & Vignette */}
      {quality !== 'low' && (
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={isNight ? 0.65 : 0.9}
            luminanceSmoothing={0.3}
            intensity={isNight ? 0.95 : 0.22}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.1} darkness={isNight ? 0.35 : 0.12} />
          <SMAA />
        </EffectComposer>
      )}
    </>
  );
}
