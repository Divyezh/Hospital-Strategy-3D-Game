<div align="center">

# 🏥 MediCity — Autonomous 3D Hospital Strategy & Campus Sim

**A high-fidelity, real-time 3D hospital campus simulation and management experience built with Next.js, Three.js, React Three Fiber, and Zustand.**

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r174-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Features](#-key-features) • [Controls & Joysticks](#-controls--navigation) • [Transit & City](#-transit-hub--city-transport) • [Architecture](#-architecture) • [Getting Started](#-getting-started)

</div>

---

## 🌟 Overview

**MediCity** brings an entire modern medical ecosystem to life. Featuring a multi-floor hospital, active triage wards, emergency bays, cafeteria plaza, a 6-lane metropolitan boulevard, mass transit stations, auto-rickshaws, city buses, and smart gate checkpoints.

Everything runs in real time directly in the browser with **logarithmic depth buffering**, **crystal-clear atmospheric lighting**, and responsive controls tailored for **Desktop**, **Tablets**, and **Mobile Devices**.

---

## 🚀 Key Features

### 🏢 Living Hospital & Departments
- **13 Interactive Specialized Departments**: Main Lobby, Grand Reception, Emergency (ER) & Triage, ICU, Operating Theatres, Pharmacy, Pathology Lab, Radiology (CT & MRI), Hospital Cafeteria, and Outpatient Clinics.
- **Floor Cutaway System**: Instant cutaway views for **All Floors**, **Ground Floor (G)**, **1st Floor**, and **2nd Floor** with isolated department focusing.
- **Autonomous Human Agents**: Doctors, nurses, surgeons, ward boys, receptionists, visitors, recovering in-patients, and canteen diners moving dynamically.
- **Hospital Canteen Plaza**: Open-air dining with umbrellas, juice & snack kiosks, seating tables, and animated visitors enjoying meals.

### 🚌 Transit Hub & City Transport
- **Central Terminal Bus Station**: Modern glass-curved terminal with tactile curbs, LED arrival matrices, timetable kiosks, and passenger queues.
- **East Commons & West Metro Stations**: Dual-bay transit pavilions with solar canopies.
- **City Bus Fleet (*"101 MEDICITY EXP"*)**: 11.8m low-floor transit buses looping the avenues with realistic decelerations and 3.8s passenger docking cycles.
- **Dedicated Auto-Rickshaw Stand**: 5 designated angled parking bays, illuminated dispatcher kiosk, and active 3-wheeler auto-rickshaws.
- **Taxi Stand**: 4 taxi bays with queue stanchions and active cabs.
- **Autonomous Emergency Ambulance**: High-priority siren response navigation and ER bay patient drop-offs.
- **Smart Security Checkpoints**: Dual-guard entrance with real-time gate barrier telemetry, vehicle queues, and visitor badge counters.

### 🕹️ Full Dual-Mode Joysticks (Mobile & PC)
- **360° Orbit Joystick**: Smooth spherical azimuth orbit and elevation pitch control.
- **World Move Pan Joystick**: Seamlessly glide forward, backward, and strafe across the entire 750m campus, avenues, and city backdrop.
- **Dual Sticks Mode (`🕹️ Dual`)**: Play like a console or mobile game with dedicated left-hand movement and right-hand 360° camera orbit.
- **Auto 360° Orbit Mode**: Hands-free cinematic camera rotation.
- **Collapsible UI**: Slide-in/out department directory with quick-access floating pills designed specifically for mobile and tablet screens.

### 🌅 Dynamic Atmosphere & Audio
- **Day & Night Cycles**: Dynamic sun position and tone mapping for **Morning**, **Noon**, **Golden Hour**, and **Night**.
- **Crystal-Clear View**: Long-range linear fog tuned for sharp, crisp visuals from bird’s-eye and isometric angles.
- **Procedural Campus Audio**: Realistic synthesized ambient soundscapes — vehicle engine hums, sirens, gate chimes, and cafeteria chatter.

---

## 🎮 Controls & Navigation

### Desktop (Keyboard & Mouse)
| Action | Control |
| :--- | :--- |
| **Pan / Move World** | `W`, `A`, `S`, `D` or `Arrow Keys` / Right-Click Drag |
| **Orbit Camera** | Left-Click Drag on Canvas or Orbit Joystick |
| **Zoom In / Out** | Mouse Wheel / On-screen `+` and `-` buttons |
| **Toggle Debug HUD** | Press `D` key |
| **Sound Toggle** | Audio button in top-right header |

### Mobile & Tablet (Touch)
| Action | Control |
| :--- | :--- |
| **Move World Joystick** | Push joystick in **Move** mode (or Left stick in **Dual** mode) |
| **360° Orbit Joystick** | Drag thumb knob in **360°** mode (or Right stick in **Dual** mode) |
| **Swipe Presets** | Horizontally swipe the bottom navigation pill bar |
| **Toggle Department List** | Tap `✕ Close` or tap `🏢 Departments` floating pill |
| **Pinch to Zoom** | Two-finger pinch on 3D canvas |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **3D Engine**: [Three.js](https://threejs.org/) & [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/)
- **3D Utilities**: [@react-three/drei](https://github.com/pmndrs/drei) & `three-stdlib`
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Simulation Invariants**: Real-time bounding box collision & teleportation guards

---

## 📂 Project Structure

```
strategy-game/
├── src/
│   ├── app/
│   │   ├── explore/              # 3D Campus Explore Page
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx              # Hospital Strategy Dashboard / Control Room
│   ├── data/
│   │   ├── campus.ts             # Campus boundary, road lanes & backdrop definitions
│   │   └── hospital.ts           # Hospital departments, room metadata & camera presets
│   ├── explore/
│   │   ├── scene/
│   │   │   ├── AutoRickshawMesh.tsx       # 3D Auto-Rickshaw model
│   │   │   ├── CityBusMesh.tsx            # 3D Low-floor Transit Bus model
│   │   │   ├── TaxiCabMesh.tsx            # 3D Yellow Taxi model
│   │   │   ├── TransitHubAndVehicles.tsx  # 3 Bus stations, Rickshaw & Taxi stands
│   │   │   ├── HospitalBuilding.tsx       # Multi-floor hospital cutaway architecture
│   │   │   ├── HospitalCanteenPlaza.tsx   # Open-air cafeteria, stalls & tables
│   │   │   ├── CampusGround.tsx           # 6-lane boulevard, avenues & road grid
│   │   │   ├── CampusVegetation.tsx       # Detailed palm trees & landscaping
│   │   │   ├── CampusPerimeter.tsx        # Security gate & barrier arms
│   │   │   ├── ExploreCamera.tsx          # Dual joystick-driven camera system
│   │   │   ├── ExploreCanvas.tsx          # Main WebGL Canvas (logarithmic depth)
│   │   │   └── ExploreEnvironment.tsx     # Sunlight, shadows & time-of-day sky
│   │   ├── ui/
│   │   │   ├── ExploreControls.tsx        # Responsive UI, drawer & preset bar
│   │   │   ├── ExploreJoystick.tsx        # Virtual 360° orbit & move world joysticks
│   │   │   └── ExploreDebugHud.tsx        # Real-time simulation metrics & FPS
│   │   ├── sim/                           # Road graphs, collision checking & agents
│   │   ├── sound.ts                       # Web Audio API spatial sound generator
│   │   └── store.ts                       # Zustand central simulation store
│   └── sim/
│       └── invariants.ts                  # Collision & velocity invariant monitors
├── public/                                # Static media & sound assets
├── package.json
└── tsconfig.json
```

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.18 or higher recommended)
- `npm` or `yarn` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Divyezh/Hospital-Strategy-3D-Game.git
   cd Hospital-Strategy-3D-Game
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Navigate to [http://localhost:3000/explore](http://localhost:3000/explore) to explore the 3D campus!

---

## 📊 Simulation Invariants & Performance

MediCity includes an integrated simulation health check monitor (`invariants.ts`) running every frame:
- **Vehicle Bounding Boxes**: Continuous OBB intersection checks against walls, security checkpoints, and fences.
- **Instantaneous Velocity Cap**: Detects and logs any abnormal physics jumps or teleports.
- **High-Performance Rendering**: Enabled `logarithmicDepthBuffer`, ACES filmic tone mapping, and instanced geometry for zero z-fighting across large-scale viewing distances.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Developed with ❤️ by <a href="https://github.com/Divyezh">Divyesh</a></sub>
</div>
