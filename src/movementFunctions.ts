import type { Bot } from "mineflayer";
import type { Vec3 } from "vec3";

export class MovementFunctions {
    constructor(private bot: Bot) {}

    forceLook(yaw: number, pitch: number, update: boolean = false, onGround?: boolean) {
        const notchianYawAndPitch = { yaw: this.bot.util.math.toNotchianYaw(yaw), pitch: this.bot.util.math.toNotchianPitch(pitch) };
        this.bot._client.write("look", { ...notchianYawAndPitch, onGround: onGround ?? this.bot.entity.onGround });
        if (update) {
            this.bot.look(yaw, pitch, true);
        }
    }

    forceLookAt(pos: Vec3, update: boolean = false, onGround?: boolean) {
        const { yaw, pitch } = this.bot.util.math.pointToYawAndPitch(this.bot, pos);
        const nyp = { yaw: this.bot.util.math.toNotchianYaw(yaw), pitch: this.bot.util.math.toNotchianPitch(pitch) };
        this.bot._client.write("look", { ...nyp, onGround: onGround ?? this.bot.entity.onGround });
        if (update) {
            this.bot.look(yaw, pitch, true);
        }
    }

    lazyTeleport(endPos: Vec3) {}
}
