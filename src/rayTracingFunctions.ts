import { Bot } from "mineflayer";
import { Vec3 } from "vec3";
import { RaycastIterator } from "./calcs/iterators";
import type { Entity } from "prismarine-entity";

function getViewDirection(pitch: number, yaw: number) {
    const csPitch = Math.cos(pitch);
    const snPitch = Math.sin(pitch);
    const csYaw = Math.cos(yaw);
    const snYaw = Math.sin(yaw);
    return new Vec3(-snYaw * csPitch, snPitch, -csYaw * csPitch);
}

export class RayTraceFunctions {
    constructor(private bot: Bot) {}

    blockAtEntityCursor(
        { position, height, yaw, pitch }: { position: Vec3; height: number; yaw: number; pitch: number },
        maxDistance = 256,
        matcher = null
    ) {
        const eyePosition = position.offset(0, height, 0);
        const viewDirection = getViewDirection(pitch, yaw);
        return this.bot.world.raycast(eyePosition, viewDirection, maxDistance, matcher);
    }

    entityAtCursor(maxDistance: number = 3.5) {
        return this.entityAtEntityCursor(this.bot.entity, maxDistance);
    }

    entityAtEntityCursor(entity: Entity, maxDistance: number = 3.5) {
        const block = this.blockAtEntityCursor(entity, maxDistance);
        maxDistance = block?.intersect.distanceTo(this.bot.entity.position) ?? maxDistance;

        const entities = Object.values(this.bot.entities).filter(
            (e) => e.type !== "object" && e.username !== entity.username && e.position.distanceTo(entity.position) <= maxDistance
        );

        const dir = new Vec3(
            -Math.sin(entity.yaw) * Math.cos(entity.pitch),
            Math.sin(entity.pitch),
            -Math.cos(entity.yaw) * Math.cos(entity.pitch)
        );
        const iterator = new RaycastIterator(entity.position.offset(0, entity.height, 0), dir.normalize(), maxDistance);

        let targetEntity = null;
        let targetDist = maxDistance;

        for (let i = 0; i < entities.length; i++) {
            const e = entities[i];
            const w = e.height >= 1.62 && e.height <= 1.99 || e.height === 2.9 ? 0.3 : e.height / 2;

            const shapes = [[-w, 0, -w, w, e.height + (e.height === 1.62 ? 0.18 : 0), w]];
            const intersect = iterator.intersect(shapes as any, e.position);
            if (intersect) {
                const entityDir = e.position.minus(entity.position); // Can be combined into 1 line
                const sign = Math.sign(entityDir.dot(dir));
                if (sign !== -1) {
                    const dist = entity.position.distanceTo(intersect.pos);
                    if (dist < targetDist) {
                        targetEntity = e;
                        targetDist = dist;
                    }
                }
            }
        }
        return targetEntity;
    }
}
