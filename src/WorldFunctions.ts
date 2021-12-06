import type { Bot } from "mineflayer";
import type { Block } from "prismarine-block";
import { AABB } from "./calcs/aabb";
import type { Vec3 } from "vec3";

export class WorldFunctions {
    constructor (private bot: Bot) {}


    getBlockAABB(block: Block, height: number = 1) {
        const {x, y, z} = block.position
        return new AABB(x, y, z, x + 1, y + height, z + 1)
    }

    getBlockPosAABB(block: Vec3, height: number = 1) {
        const {x, y, z} = block.floored()
        return new AABB(x, y, z, x + 1, y + height, z + 1)
    }
}