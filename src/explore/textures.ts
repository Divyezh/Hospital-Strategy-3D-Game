/**
 * Procedural canvas textures for realistic PBR rendering without external asset downloads.
 * Generates noise, asphalt aggregate, paving joints, lawn variation, and wood grain.
 */
import * as THREE from 'three';

class TextureCache {
  private cache = new Map<string, THREE.CanvasTexture>();

  get(name: string, generator: () => THREE.CanvasTexture): THREE.CanvasTexture {
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }
    const tex = generator();
    this.cache.set(name, tex);
    return tex;
  }
}

const textureCache = new TextureCache();

/**
 * Asphalt texture with noise grain, subtle color mottling, and optional road stripes
 */
export function getAsphaltTexture(): THREE.CanvasTexture {
  return textureCache.get('asphalt', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base dark asphalt
    ctx.fillStyle = '#565B63';
    ctx.fillRect(0, 0, 512, 512);

    // Aggregate speckles
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 32;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // Subtle tar patches
    ctx.fillStyle = 'rgba(40, 44, 50, 0.25)';
    for (let i = 0; i < 24; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const rw = 20 + Math.random() * 50;
      const rh = 15 + Math.random() * 35;
      ctx.beginPath();
      ctx.ellipse(rx, ry, rw, rh, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(12, 12);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });
}

/**
 * Concrete texture with formwork lines and sand texture
 */
export function getConcreteTexture(): THREE.CanvasTexture {
  return textureCache.get('concrete', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#D9D6CE';
    ctx.fillRect(0, 0, 512, 512);

    // Grain
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 20;
      data[i] = Math.min(255, Math.max(0, data[i] + n));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // Expansion joints
    ctx.strokeStyle = 'rgba(160, 156, 146, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 512, 512);
    ctx.strokeRect(256, 0, 256, 512);
    ctx.strokeRect(0, 256, 512, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });
}

/**
 * Paving stone pattern for pedestrian walkways and plaza
 */
export function getPavingTexture(): THREE.CanvasTexture {
  return textureCache.get('paving', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#C8C4B9';
    ctx.fillRect(0, 0, 512, 512);

    const tileSize = 64;
    const gap = 3;
    for (let y = 0; y < 512; y += tileSize) {
      for (let x = 0; x < 512; x += tileSize) {
        const shade = Math.floor(215 + Math.random() * 25);
        ctx.fillStyle = `rgb(${shade}, ${shade - 3}, ${shade - 8})`;
        ctx.fillRect(x + gap / 2, y + gap / 2, tileSize - gap, tileSize - gap);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(16, 16);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });
}

/**
 * Grass lawn texture with organic sage and deep green tones
 */
export function getGrassTexture(): THREE.CanvasTexture {
  return textureCache.get('grass', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Sage green base
    ctx.fillStyle = '#6E9B66';
    ctx.fillRect(0, 0, 512, 512);

    // Mottled clusters
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 5 + Math.random() * 18;
      const dark = Math.random() > 0.45;
      ctx.fillStyle = dark ? 'rgba(56, 99, 64, 0.22)' : 'rgba(141, 180, 142, 0.25)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(14, 14);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });
}

/**
 * Warm wood texture for benches, pergola, interior accents
 */
export function getWoodTexture(): THREE.CanvasTexture {
  return textureCache.get('wood', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#C9A27A';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle grain lines
    ctx.fillStyle = 'rgba(156, 117, 79, 0.18)';
    for (let i = 0; i < 512; i += 4) {
      const w = 1 + Math.random() * 2;
      ctx.fillRect(0, i, 512, w);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });
}
