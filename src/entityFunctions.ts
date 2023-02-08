import type { Bot } from "mineflayer";
import type { Entity } from "prismarine-entity";
import type { Vec3 } from "vec3";
import { AABB } from "./calcs/aabb";
import { AABBUtils } from "./static";

export class EntityFunctions {
    healthSlot: number = 7;
    constructor(public bot: Bot) {
       this.healthSlot = Number(this.bot.version.split(".")[1]) <= 16 ? 7 : 9;
    }

    /**
     * TODO: Version specific right now. Generalize. Unknown method.
     *
     * Checks if main hand is activated.
     * @returns boolean
     */
    isMainHandActive(entity?: Entity): boolean {
        return ((entity ?? this.bot.entity).metadata[6] as any) === 2; //as any & (1 | 0)) === (1 | 0);
    }

    /**
     * TODO: Version specific right now. Generalize. Unknown method.
     *
     * Checks if offhand is activated.
     * @returns boolean
     */
    isOffHandActive(entity?: Entity): boolean {
        return ((entity ?? this.bot.entity).metadata[6] as any) === 3; //& (1 | 2)) === (1 | 2);
    }

    /**
     * TODO: Version specific right now. Generalize. Unknown method.
     * @param metadata metadata from Prismarine-Entity Entity.
     * @returns number
     */
    getHealth(entity?: Entity): number {
        entity ??= this.bot.entity;
        const metadata = entity.metadata;
        let health = Number(metadata[this.healthSlot]);
        if (!health || health === 0) health = entity === this.bot.entity ? this.bot.entity.health ?? 0 : 0;
        return health + (Number(metadata[this.healthSlot + 4]) ?? 0);
    }

    /**
     *
     * @param metadata Must be FULL metadata object.
     * @returns number
     */
    getHealthFromMetadata(metadata: object[]): number {
        return Number(metadata[this.healthSlot]) + Number(metadata[this.healthSlot + 4]) ?? undefined;
    }

    /**
     * TODO: Version specific right now. Generalize. Unknown method.
     * @param metadata metadata from Prismarine-Entity Entity.
     * @returns
     */
    getHealthChange(packetMetadata: any, entity: Entity) {
        const oldHealth = this.getHealthFromMetadata(entity.metadata);
        const newHealth = this.getHealthFromMetadata(this.parseMetadata(packetMetadata, entity.metadata));
        return newHealth - oldHealth;
    }

    entityDistance(entity: Entity): number {
        return this.bot.entity.position.distanceTo(entity.position);
    }

    eyeDistanceToEntity(entity: Entity): number {
        return AABBUtils.getEntityAABB(entity).distanceToVec(this.bot.entity.position.offset(0, this.bot.entity.height, 0));
    }

    eyeDistanceBetweenEntities(first: Entity, second: Entity): number {
        return AABBUtils.getEntityAABB(second).distanceToVec(first.position.offset(0, first.height, 0));
    }
    
    private parseMetadata(packetMetadata: any, entityMetadata: any = {}) {
        if (packetMetadata !== undefined) {
            for (const { key, value } of packetMetadata) {
                entityMetadata[key] = value;
            }
        }
        return entityMetadata;
    }
}
