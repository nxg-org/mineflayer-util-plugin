import type { Bot } from "mineflayer";
import type { Entity } from "prismarine-entity";
import type { Vec3 } from "vec3";
import { AABB } from "./calcs/aabb";

export class EntityFunctions {
    healthSlot: number = 7;
    constructor(public bot: Bot) {
        this.bot.on("spawn", async () => {
            // await this.bot.util.sleep(1000)
            // const slot = this.bot.entity.metadata.slice(5).findIndex((data) => Number(data) === 20);
            // if (slot > 0) {
            //     this.healthSlot = slot + 5;
            // }
            this.healthSlot = Number(this.bot.version.split(".")[1]) <= 16 ? 7 : 9;
        });
    }

    /**
     * TODO: Version specific right now. Generalize. Unknown method.
     *
     * Checks if main hand is activated.
     * @returns boolean
     */
    isMainHandActive(entity?: Entity): boolean {
        return ((entity ?? this.bot.entity).metadata[6] as any) === 1; //as any & (1 | 0)) === (1 | 0);
    }

    /**
     * TODO: Version specific right now. Generalize. Unknown method.
     *
     * Checks if offhand is activated.
     * @returns boolean
     */
    isOffHandActive(entity?: Entity): boolean {
        return ((entity ?? this.bot.entity).metadata[6] as any) === 1; //& (1 | 2)) === (1 | 2);
    }

    /**
     * TODO: Version specific right now. Generalize. Unknown method.
     * @param metadata metadata from Prismarine-Entity Entity.
     * @returns number
     */
    getHealth(entity?: Entity): number {
        entity ??= this.bot.entity;
        const metadata = entity.metadata;
        const healthSlot = this.healthSlot; //metadata[this.healthSlot] ? this.healthSlot : metadata.findIndex((met) => Number(met) > 1 && Number(met) <= 20);
        let health = Number(metadata[healthSlot]);
        if (!health || health === 0) health = entity === this.bot.entity ? this.bot.entity.health ?? 0 : 0;
        if (health === 0) console.log(this.healthSlot, entity.metadata);
        // console.log(health + (Number(metadata[this.healthSlot + 4]) ?? 0))
        return health + (Number(metadata[this.healthSlot + 4]) ?? 0);
    }

    /**
     *
     * @param metadata Must be FULL metadata object.
     * @returns number
     */
    getHealthFromMetadata(metadata: object[]): number {
        return (Number(metadata[this.healthSlot]) + Number(metadata[this.healthSlot + 4])) ?? undefined;
    }

    /**
     * TODO: Version specific right now. Generalize. Unknown method.
     * @param metadata metadata from Prismarine-Entity Entity.
     * @returns
     */
    getHealthChange(packetMetadata: any, entity: Entity) {
        const oldMetadata = entity.metadata;
        const newMetadata = this.parseMetadata(packetMetadata, JSON.parse(JSON.stringify(oldMetadata)));
        return -(this.getHealthFromMetadata(oldMetadata) - this.getHealthFromMetadata(newMetadata)) ;
    }

    getDistanceToEntity(entity: Entity): number {
        return this.getDistanceBetweenEntities(this.bot.entity, entity);
    }

    getDistanceBetweenEntities(first: Entity, second: Entity): number {
        return first.position.distanceTo(second.position);
    }

    getEntityAABB(entity: { position: Vec3; height: number; width?: number }): AABB {
        const w = entity.width ?? entity.height / 2;
        const { x, y, z } = entity.position;
        return new AABB(-w, 0, -w, w, entity.height, w).offset(x, y, z);
    }

    //Stolen from mineflayer.
    private parseMetadata(packetMetadata: any, entityMetadata: any = {}) {
        if (packetMetadata !== undefined) {
            for (const { key, value } of packetMetadata) {
                entityMetadata[key] = value;
            }
        }
        return entityMetadata;
    }
}
