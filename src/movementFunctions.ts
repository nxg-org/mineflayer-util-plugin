import type { Bot } from "mineflayer";
import { Vec3 } from "vec3";
import { MathUtils } from "./static";

export function lerp(f: number, f2: number, f3: number) {
  return f2 + f * (f3 - f2);
}

function* interpolate(start: Vec3, end: Vec3, steps = 1) {
  for (let i = 0; i < steps; i++) {
    yield new Vec3(lerp(i / steps, start.x, end.x), lerp(i / steps, start.y, end.y), lerp(i / steps, start.z, end.z));
  }
}

export class MovementFunctions {
  constructor(private bot: Bot) {}

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
