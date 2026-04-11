import type { Bot } from "mineflayer";
import { Vec3 } from "vec3";
import { MathUtils } from "./static";

const LOOK_EPSILON = 1e-2;

export function lerp(f: number, f2: number, f3: number) {
  return f2 + f * (f3 - f2);
}

function* interpolate(start: Vec3, end: Vec3, steps = 1) {
  for (let i = 0; i < steps; i++) {
    yield new Vec3(lerp(i / steps, start.x, end.x), lerp(i / steps, start.y, end.y), lerp(i / steps, start.z, end.z));
  }
}

function deltaRad(a: number, b: number) {
  const pi = Math.PI;
  const tau = Math.PI * 2;
  let delta = (a - b) % tau;
  if (delta < -pi) delta += tau;
  else if (delta > pi) delta -= tau;
  return delta;
}

type PendingLookSync = {
  yaw: number;
  pitch: number;
  epsilon: number;
  resolve: () => void;
  reject: (error: Error) => void;
};

export class MovementFunctions {
  private lastSentYaw = NaN;
  private lastSentPitch = NaN;
  private pendingLookSync: PendingLookSync | null = null;
  private readonly trackSentRotation: () => void;

  constructor(private bot: Bot) {
    this.trackSentRotation = this.captureSentRotation.bind(this);
    this.bot.on("spawn", this.trackSentRotation); // should clear the sent rotation when the bot respawns, 
    this.bot.on("move", this.trackSentRotation);
  }

  private captureSentRotation() {
    this.lastSentYaw = this.bot.entity.yaw;
    this.lastSentPitch = this.bot.entity.pitch;
    this.resolvePendingLookSync();
  }

  private isRotationSynced(yaw: number, pitch: number, epsilon: number = LOOK_EPSILON) {
    if (!Number.isFinite(this.lastSentYaw) || !Number.isFinite(this.lastSentPitch)) return false;

    return (
      Math.abs(deltaRad(yaw, this.lastSentYaw)) < epsilon &&
      Math.abs(deltaRad(pitch, this.lastSentPitch)) < epsilon
    );
  }

  private resolvePendingLookSync() {
    const pending = this.pendingLookSync;
    if (!pending) return;
    if (!this.isRotationSynced(pending.yaw, pending.pitch, pending.epsilon)) return;

    this.pendingLookSync = null;
    pending.resolve();
  }

  private waitForLookSync(yaw: number, pitch: number, epsilon: number = LOOK_EPSILON) {
    if (this.pendingLookSync) {
      const error = new Error("MovementFunctions lookSync was overwritten by a newer lookSync/lookAtSync call before it synced.");
      const pending = this.pendingLookSync;
      this.pendingLookSync = null;
      pending.reject(error);
    }

    if (this.isRotationSynced(yaw, pitch, epsilon)) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      const pending = { yaw, pitch, epsilon, resolve, reject };
      this.pendingLookSync = pending;
      this.resolvePendingLookSync();
    });
  }

  async lookSync(yaw: number, pitch: number, force: boolean = true, epsilon: number = LOOK_EPSILON) {
    const activeRequest = { yaw, pitch, epsilon };
    const sync = this.waitForLookSync(yaw, pitch, epsilon);

    try {
      await this.bot.look(yaw, pitch, force);
      await sync;
    } catch (error) {
      if (
        this.pendingLookSync?.yaw === activeRequest.yaw &&
        this.pendingLookSync?.pitch === activeRequest.pitch &&
        this.pendingLookSync?.epsilon === activeRequest.epsilon
      ) {
        this.pendingLookSync = null;
      }
      throw error;
    }
  }

  async lookAtSync(pos: Vec3, force: boolean = true, epsilon: number = LOOK_EPSILON) {
    const { yaw, pitch } = MathUtils.pointToYawAndPitch(this.bot, pos);
    await this.lookSync(yaw, pitch, force, epsilon);
  }

  forceLook(yaw: number, pitch: number, update: boolean = false, onGround?: boolean) {
    const notchianYawAndPitch = { yaw: MathUtils.toNotchianYaw(yaw), pitch: MathUtils.toNotchianPitch(pitch) };
    this.bot._client.write("look", { ...notchianYawAndPitch, onGround: onGround ?? this.bot.entity.onGround });
    if (update) {
      this.bot.look(yaw, pitch, true);
      this.bot.entity.pitch = pitch;
      this.bot.entity.yaw = yaw;
    }
  }

  forceLookAt(pos: Vec3, update: boolean = false, onGround?: boolean) {
    const { yaw, pitch } = MathUtils.pointToYawAndPitch(this.bot, pos);
    const nyp = { yaw: MathUtils.toNotchianYaw(yaw), pitch: MathUtils.toNotchianPitch(pitch) };
    this.bot._client.write("look", { ...nyp, onGround: onGround ?? this.bot.entity.onGround });
    if (update) {
      this.bot.look(yaw, pitch, true);
      this.bot.entity.pitch = pitch;
      this.bot.entity.yaw = yaw;
    }
  }

  lazyTeleport(endPos: Vec3, steps = 1, update = false) {
    for (const pos of interpolate(this.bot.entity.position, endPos, steps)) {
      const block = this.bot.blockAt(pos.offset(0, -0.01, 0));
      if (!block) break;
      this.bot._client.write("position", { ...pos, onGround: block.transparent });
    }
    if (update) this.bot.entity.position.set(endPos.x, endPos.y, endPos.z); 
  }
}
