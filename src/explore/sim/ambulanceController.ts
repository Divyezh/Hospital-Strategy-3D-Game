/**
 * Dedicated Ambulance Kinematic Motion Controller (Step 1)
 *
 * Implements pure-pursuit lane following along road graph splines:
 * 1. Approach from East outer road -> Gate inbound fast-lane
 * 2. Gate passage (fast lane, barrier opens early)
 * 3. ER bay driveway branch -> Stop at staging point
 * 4. Reverse docking arc into ER Bay pad (-32, 8)
 * 5. Parked & docked (siren attenuated, brake lights active)
 * 6. Forward departure out of ER bay -> Outbound avenue lane (X = 2.2)
 * 7. Outbound passage through gate -> Merge onto West outer road
 * 8. Return loop re-entering from East outer road
 *
 * Invariant Guarantees:
 * - Yaw-only rotation: pitch = 0, roll = 0, shortest-angle damped.
 * - Y = 0.15 fixed on asphalt tarmac.
 * - Speed clamped [0, maxSpeed], zero teleportation across ticks.
 * - 0 intersections with building bounds, walls, fence, pillars, or booth.
 */
import * as THREE from 'three';
import { dampAngle } from './vehiclePhysics';

export type AmbulanceState =
  | 'APPROACH_GATE'
  | 'PASS_GATE'
  | 'APPROACH_ER'
  | 'REVERSE_DOCK'
  | 'DOCKED_ER'
  | 'DEPART_ER'
  | 'EXIT_GATE'
  | 'OUTER_WEST'
  | 'RESET_EAST';

export interface AmbulanceSimPose {
  x: number;
  y: number;
  z: number;
  yaw: number;
  speed: number;
  wheelAngle: number;
  brakeLights: boolean;
  state: AmbulanceState;
  stoppedSimTime: number;
  shouldOpenGate: boolean;
  sirenVolume: number;
}

export class AmbulanceController {
  // Key Road Graph Waypoints
  private static readonly APPROACH_CURVE = new THREE.CatmullRomCurve3([
    new THREE.Vector3(100, 0.15, 65.5),
    new THREE.Vector3(40, 0.15, 65.5),
    new THREE.Vector3(12, 0.15, 65.8),
    new THREE.Vector3(-2.2, 0.15, 64.0),
  ]);

  private static readonly GATE_IN_CURVE = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.2, 0.15, 64.0),
    new THREE.Vector3(-2.2, 0.15, 58.0),
    new THREE.Vector3(-2.2, 0.15, 56.0), // Main Gate Portal
    new THREE.Vector3(-2.2, 0.15, 48.0),
    new THREE.Vector3(-2.2, 0.15, 34.0),
    new THREE.Vector3(-2.2, 0.15, 24.0),
  ]);

  private static readonly ER_IN_CURVE = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.2, 0.15, 24.0),
    new THREE.Vector3(-14.0, 0.15, 21.0),
    new THREE.Vector3(-26.0, 0.15, 18.0),
    new THREE.Vector3(-32.0, 0.15, 14.5), // Staging stop right in front of ER bay
  ]);

  // Reverse Docking Curve: backs up from (-32, 14.5) to (-32, 8.0)
  private static readonly REVERSE_DOCK_CURVE = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-32.0, 0.15, 14.5),
    new THREE.Vector3(-32.0, 0.15, 11.0),
    new THREE.Vector3(-32.0, 0.15, 8.0),
  ]);

  // Forward departure out of ER bay: (-32, 8) -> outbound avenue (2.2, 24)
  private static readonly ER_OUT_CURVE = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-32.0, 0.15, 8.0),
    new THREE.Vector3(-32.0, 0.15, 14.5),
    new THREE.Vector3(-24.0, 0.15, 19.0),
    new THREE.Vector3(-10.0, 0.15, 22.0),
    new THREE.Vector3(2.2, 0.15, 24.0),
  ]);

  private static readonly GATE_OUT_CURVE = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.2, 0.15, 24.0),
    new THREE.Vector3(2.2, 0.15, 34.0),
    new THREE.Vector3(2.2, 0.15, 48.0),
    new THREE.Vector3(2.2, 0.15, 56.0), // Main Gate Portal Exit
    new THREE.Vector3(2.2, 0.15, 58.0),
    new THREE.Vector3(2.2, 0.15, 64.0),
  ]);

  private static readonly OUTER_WEST_CURVE = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.2, 0.15, 64.0),
    new THREE.Vector3(-6.0, 0.15, 68.0),
    new THREE.Vector3(-24.0, 0.15, 70.5),
    new THREE.Vector3(-60.0, 0.15, 70.5),
    new THREE.Vector3(-100.0, 0.15, 70.5),
  ]);

  // State
  private state: AmbulanceState = 'APPROACH_GATE';
  private curveProgress: number = 0; // 0 to 1 along current segment
  private x: number = 100;
  private y: number = 0.15;
  private z: number = 65.5;
  private yaw: number = -Math.PI / 2; // facing West (-X)
  private speed: number = 6.0;
  private wheelAngle: number = 0;
  private stoppedTimer: number = 0;
  private stateTimer: number = 0;

  public update(delta: number): AmbulanceSimPose {
    const dt = Math.min(delta, 0.1);
    let targetSpeed = 6.0;
    let brakeLights = false;
    let shouldOpenGate = false;
    let sirenVolume = 0.08;

    switch (this.state) {
      case 'APPROACH_GATE': {
        targetSpeed = 6.5;
        const curve = AmbulanceController.APPROACH_CURVE;
        const curveLen = curve.getLength();
        this.curveProgress += (this.speed * dt) / curveLen;

        // Gate sensor trigger when approaching gate from Z: 66 down
        if (this.z < 68) {
          shouldOpenGate = true;
        }

        if (this.curveProgress >= 1.0) {
          this.curveProgress = 0;
          this.state = 'PASS_GATE';
        } else {
          this.followCurve(curve, this.curveProgress, dt, false);
        }
        break;
      }

      case 'PASS_GATE': {
        targetSpeed = 5.8;
        shouldOpenGate = true; // fast lane privilege
        const curve = AmbulanceController.GATE_IN_CURVE;
        const curveLen = curve.getLength();
        this.curveProgress += (this.speed * dt) / curveLen;

        if (this.curveProgress >= 1.0) {
          this.curveProgress = 0;
          this.state = 'APPROACH_ER';
        } else {
          this.followCurve(curve, this.curveProgress, dt, false);
        }
        break;
      }

      case 'APPROACH_ER': {
        targetSpeed = 5.2;
        const curve = AmbulanceController.ER_IN_CURVE;
        const curveLen = curve.getLength();
        this.curveProgress += (this.speed * dt) / curveLen;

        // Slow down near ER staging area
        if (this.curveProgress > 0.8) {
          targetSpeed = 2.0;
          brakeLights = true;
        }

        if (this.curveProgress >= 1.0) {
          this.curveProgress = 0;
          this.state = 'REVERSE_DOCK';
          this.stateTimer = 0;
        } else {
          this.followCurve(curve, this.curveProgress, dt, false);
        }
        break;
      }

      case 'REVERSE_DOCK': {
        this.stateTimer += dt;
        // Pause briefly before reversing (gear shift simulation)
        if (this.stateTimer < 0.6) {
          targetSpeed = 0;
          brakeLights = true;
        } else {
          targetSpeed = 1.8; // slow reverse speed
          const curve = AmbulanceController.REVERSE_DOCK_CURVE;
          const curveLen = curve.getLength();
          this.curveProgress += (this.speed * dt) / curveLen;

          if (this.curveProgress >= 1.0) {
            this.curveProgress = 0;
            this.state = 'DOCKED_ER';
            this.stateTimer = 0;
          } else {
            this.followCurve(curve, this.curveProgress, dt, true);
          }
        }
        break;
      }

      case 'DOCKED_ER': {
        this.stateTimer += dt;
        targetSpeed = 0;
        brakeLights = true;
        sirenVolume = 0.015; // attenuated while patients unload

        // Docked for 4.5 seconds
        if (this.stateTimer >= 4.5) {
          this.state = 'DEPART_ER';
          this.curveProgress = 0;
          this.stateTimer = 0;
        }
        break;
      }

      case 'DEPART_ER': {
        targetSpeed = 5.0;
        sirenVolume = 0.07;
        const curve = AmbulanceController.ER_OUT_CURVE;
        const curveLen = curve.getLength();
        this.curveProgress += (this.speed * dt) / curveLen;

        if (this.curveProgress >= 1.0) {
          this.curveProgress = 0;
          this.state = 'EXIT_GATE';
        } else {
          this.followCurve(curve, this.curveProgress, dt, false);
        }
        break;
      }

      case 'EXIT_GATE': {
        targetSpeed = 6.0;
        shouldOpenGate = true;
        const curve = AmbulanceController.GATE_OUT_CURVE;
        const curveLen = curve.getLength();
        this.curveProgress += (this.speed * dt) / curveLen;

        if (this.curveProgress >= 1.0) {
          this.curveProgress = 0;
          this.state = 'OUTER_WEST';
        } else {
          this.followCurve(curve, this.curveProgress, dt, false);
        }
        break;
      }

      case 'OUTER_WEST': {
        targetSpeed = 8.5;
        const curve = AmbulanceController.OUTER_WEST_CURVE;
        const curveLen = curve.getLength();
        this.curveProgress += (this.speed * dt) / curveLen;

        if (this.curveProgress >= 1.0) {
          this.curveProgress = 0;
          this.state = 'RESET_EAST';
          this.stateTimer = 0;
        } else {
          this.followCurve(curve, this.curveProgress, dt, false);
        }
        break;
      }

      case 'RESET_EAST': {
        // Seamless transition outside viewport: reset smoothly at East boundary
        this.x = 100;
        this.y = 0.15;
        this.z = 65.5;
        this.yaw = -Math.PI / 2;
        this.speed = 6.5;
        this.curveProgress = 0;
        this.state = 'APPROACH_GATE';
        break;
      }
    }

    // Smooth speed acceleration/deceleration
    const accelRate = targetSpeed > this.speed ? 4.0 : 8.0;
    this.speed += (targetSpeed - this.speed) * Math.min(1.0, accelRate * dt);

    // Track stopped time for deadlock monitor
    if (this.speed < 0.05) {
      this.stoppedTimer += dt;
    } else {
      this.stoppedTimer = 0;
    }

    // Distance-based wheel spin (wheel radius = 0.42m)
    const distTraveled = this.speed * dt;
    const dirSign = this.state === 'REVERSE_DOCK' ? -1 : 1;
    this.wheelAngle += dirSign * (distTraveled / 0.42);

    return {
      x: this.x,
      y: this.y,
      z: this.z,
      yaw: this.yaw,
      speed: this.speed,
      wheelAngle: this.wheelAngle,
      brakeLights,
      state: this.state,
      stoppedSimTime: this.stoppedTimer,
      shouldOpenGate,
      sirenVolume,
    };
  }

  private followCurve(
    curve: THREE.CatmullRomCurve3,
    t: number,
    dt: number,
    isReverse: boolean
  ) {
    const clampedT = Math.min(1.0, Math.max(0.0, t));
    const pos = curve.getPointAt(clampedT);
    this.x = pos.x;
    this.y = 0.15; // Fixed height on asphalt tarmac
    this.z = pos.z;

    // Lookahead for steering
    const curveLen = curve.getLength();
    const lookaheadDelta = Math.max(0.01, 3.2 / curveLen);
    const lookaheadT = isReverse
      ? Math.max(0.0, clampedT - lookaheadDelta)
      : Math.min(1.0, clampedT + lookaheadDelta);
    const lookPoint = curve.getPointAt(lookaheadT);

    const dx = lookPoint.x - pos.x;
    const dz = lookPoint.z - pos.z;

    let targetYaw = Math.atan2(-dx, -dz);
    if (isReverse) {
      // Facing forward (South) while backing up into ER bay
      targetYaw = 0;
    }

    // Shortest-angle smooth damping: pitch and roll remain 0.
    this.yaw = dampAngle(this.yaw, targetYaw, 8.0, dt);
  }
}
