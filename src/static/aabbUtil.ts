import type { Bot } from "mineflayer";
import type { Block } from "prismarine-block";
import { AABB } from "../calcs/aabb";
import type { Vec3 } from "vec3";


export namespace AABBUtils {
    export function getBlockAABB(block: Block, height: number = 1) {
        const { x, y, z } = block.position;
        return new AABB(x, y, z, x + 1, y + height, z + 1);
    }
    
    export function getBlockPosAABB(block: Vec3, height: number = 1) {
        const { x, y, z } = block.floored();
        return new AABB(x, y, z, x + 1, y + height, z + 1);
    }
    
    export function getEntityAABB(entity: {type: string, position: Vec3, height: number,  width?: number}): AABB {
        switch (entity.type) {
            case "player":
                return getPlayerAABB({position: entity.position})
            case "mob":
            default: //TODO: Implement better AABBs. However, this may just be correct.
                return getEntityAABBRaw({position: entity.position, height: entity.height, width: entity.width ?? entity.height})
    
        }
    
    }
    
    export function getPlayerAABB(entity: {position: Vec3}): AABB {
        return getEntityAABBRaw({position: entity.position, height: 1.8, width: 0.3})
    }
    
    export function getEntityAABBRaw(entity: { position: Vec3; height: number; width?: number}) {
        const w = entity.width ? entity.width / 2 : entity.height / 2
        const { x, y, z } = entity.position;
        return new AABB(-w, 0, -w, w, entity.height, w).offset(x, y, z);
    }
}
