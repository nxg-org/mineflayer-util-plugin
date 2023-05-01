import type { Block } from "prismarine-block";
import type { Vec3 } from "vec3";
import { AABB } from "../calcs/aabb";


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
                return getEntityAABBRaw({position: entity.position, height: entity.height + 0.18, width: entity.width})
            case "mob":
            default: //TODO: Implement better AABBs. However, this may just be correct.
                return getEntityAABBRaw({position: entity.position, height: entity.height, width: entity.width})
        }
    }
    
    export function getPlayerAABB(entity: { position: Vec3, height?: number, width?: number }): AABB {
        const w = entity.width ? entity.width / 2 : 0.6 
        return new AABB(-w, 0, -w, w, entity.height ? entity.height + 0.18 : 1.8, w).translateVec(entity.position);
    }

    export function getPlayerAABBRaw(position: Vec3, height = 1.8): AABB {
        return new AABB(-0.6, 0, -0.6, 0.6, height, 0.6).translateVec(position);
    }
    
    export function getEntityAABBRaw(entity: { position: Vec3; height: number; width?: number}) {
        const w = entity.width ? entity.width / 2 : entity.height / 2
        return new AABB(-w, 0, -w, w, entity.height, w).translateVec(entity.position);
    }
}
