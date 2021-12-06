import { Bot } from "mineflayer";
import { Vec3 } from "vec3";

const PI = Math.PI;
const PI_2 = Math.PI * 2;
const TO_RAD = PI / 180;
const TO_DEG = 1 / TO_RAD;
const FROM_NOTCH_BYTE = 360 / 256;
// From wiki.vg: Velocity is believed to be in units of 1/8000 of a block per server tick (50ms)
const FROM_NOTCH_VEL = 1 / 8000;

export class MathFunctions {
    constructor() {}

    toNotchianYaw = (yaw: number) => this.toDegrees(PI - yaw);
    toNotchianPitch = (pitch: number) => this.toDegrees(-pitch);
    fromNotchianYawByte = (yaw: number) => this.fromNotchianYaw(yaw * FROM_NOTCH_BYTE);
    fromNotchianPitchByte = (pitch: number) => this.fromNotchianPitch(pitch * FROM_NOTCH_BYTE);

    euclideanMod(numerator: number, denominator: number) {
        const result = numerator % denominator;
        return result < 0 ? result + denominator : result;
    }

    toRadians(degrees: number) {
        return TO_RAD * degrees;
    }

    toDegrees(radians: number) {
        return TO_DEG * radians;
    }

    fromNotchianYaw(yaw: number) {
        return this.euclideanMod(PI - this.toRadians(yaw), PI_2);
    }

    fromNotchianPitch(pitch: number) {
        return this.euclideanMod(this.toRadians(-pitch) + PI, PI_2) - PI;
    }

    fromNotchVelocity(vel: Vec3) {
        return new Vec3(vel.x * FROM_NOTCH_VEL, vel.y * FROM_NOTCH_VEL, vel.z * FROM_NOTCH_VEL);
    }

    pointToYawAndPitch(bot: Bot, point: Vec3) {
        const delta = point.minus(bot.entity.position.offset(0, bot.entity.height, 0));
        return this.dirToYawAndPitch(delta);
    }

    dirToYawAndPitch(dir: Vec3) {
        const yaw = Math.atan2(-dir.x, -dir.z);
        const groundDistance = Math.sqrt(dir.x * dir.x + dir.z * dir.z);
        const pitch = Math.atan2(dir.y, groundDistance);
        return { yaw: yaw, pitch: pitch };
    }
}
