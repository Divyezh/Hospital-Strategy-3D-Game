'use client';

import React, { useMemo } from 'react';
import { Environment as DreiEnvironment, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing';
import { useExploreStore } from '@/explore/store';
import { EXPLORE_TOKENS } from '@/explore/tokens';

export function ExploreEnvironment() {
  const quality = useExploreStore((s) => s.quality);
  const timeOfDay = useExploreStore((s) => s.timeOfDay);

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
          ambientIntensity: 0.95,
          fogColor: '#E0F2FE',
          fogNear: 400,
          fogFar: 1100,
        };
      case 'night':
        return {
          sky: EXPLORE_TOKENS.colors.skyNight,
          ground: '#182433',
          sunColor: '#93C5FD',
          sunIntensity: 0.55,
          sunPos: [40, 50, -40] as [number, number, number],
          ambientIntensity: 0.35,
          fogColor: '#0F172A',
          fogNear: 320,
          fogFar: 900,
        };
      case 'golden':
      default:
        return {
          sky: '#F0F7FF',
          ground: '#CBD5E1',
          sunColor: '#FEF3C7',
          sunIntensity: 2.3,
          sunPos: [65, 48, 52] as [number, number, number],
          ambientIntensity: 0.92,
          fogColor: '#F0F7FF',
          fogNear: 380,
          fogFar: 1000,
        };
    }
  }, [timeOfDay]);

  return (
    <>
      {/* Crystal Clear Sky Background & Distant Horizon Fog */}
      <color attach="background" args={[lightConfig.sky]} />
      <fog attach="fog" args={[lightConfig.fogColor, lightConfig.fogNear, lightConfig.fogFar]} />

      {/* Balanced Sky/Ground Hemisphere Light */}
      <hemisphereLight
        args={[lightConfig.sky, lightConfig.ground, lightConfig.ambientIntensity]}
        position={[0, 60, 0]}
      />

      {/* Warm Golden Key Sunlight with Soft PCF Shadows */}
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
        intensity={0.4}
        color="#BFD9F2"
      />

      {/* Offline Procedural Lightformer Environment Reflection */}
      <DreiEnvironment resolution={256}>
        {/* Soft overhead dome reflection */}
        <Lightformer
          form="rect"
          intensity={1.2}
          color="#FFFFFF"
          scale={[80, 80, 1]}
          position={[0, 45, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        {/* Warm sun-facing reflection */}
        <Lightformer
          form="circle"
          intensity={1.8}
          color="#FFE9CC"
          scale={[35, 35, 1]}
          position={[40, 25, 35]}
          target={[0, 0, 0]}
        />
        {/* Teal-blue horizon rim fill */}
        <Lightformer
          form="ring"
          intensity={0.9}
          color="#BFD9F2"
          scale={[70, 70, 1]}
          position={[-35, 15, -35]}
          target={[0, 0, 0]}
        />
      </DreiEnvironment>

      {/* Cinematic Post-Processing when medium or high quality */}
      {quality !== 'low' && (
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.92}
            luminanceSmoothing={0.2}
            intensity={0.2}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.1} darkness={0.12} />
          <SMAA />
        </EffectComposer>
      )}
    </>
  );
}
