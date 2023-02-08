import type { Bot } from "mineflayer";
import type { Block } from "prismarine-block";
import { Vec3 } from "vec3";
import AABB from "../calcs/aabb";
import { RaycastIterator } from "../calcs/iterators";
import { AABBUtils } from "../static";

export type Overwrites = { [coord: string]: Block | null };

/**
 * A class dedicated to predictive logic.
 *
 * Currently, this class can predict explosion damages of crystals using a custom world.
 */
export class PredictiveWorld {
    private blocks: Overwrites = {};
    private originalWorld: any;
    constructor(bot: Bot) {
        this.originalWorld = bot.world;
    }

    raycast(from: Vec3, direction: Vec3, range: number, matcher: ((block: Block) => boolean) | null = null) {
        const iter = new RaycastIterator(from, direction, range);
        let pos = iter.next();
        while (pos) {
            const position = new Vec3(pos.x, pos.y, pos.z);
            const block = this.getBlock(position);
            if (block && (!matcher || matcher(block))) {
                const intersect = iter.intersect(block.shapes as any, position);
                if (intersect) {
                    //@ts-expect-error 2
                    block.face = intersect.face;
                    //@ts-expect-error
                    block.intersect = intersect.pos;
                    return block;
                }
            }
            pos = iter.next();
        }
        return null;
    }

    /**
     * this works
     * @param {Block} block
     */
    setBlock(pos: Vec3, block: Block) {
        this.blocks[pos.toString()] ??= block;
    }

    /**
     * @param {Overwrites} blocks Blocks indexed by position.toString()
     */
    setBlocks(blocks: Overwrites) {
        for (const index in blocks) this.blocks[index] = blocks[index];
    }

    /**
     * @param {Vec3} pos
     * @returns {Block | null} Block at position.
     */
    getBlock(pos: Vec3): Block | null {
        const pblock = this.blocks[pos.toString()];
        if (pblock !== undefined && pblock !== null) return pblock;
        return this.originalWorld.getBlock(pos) ?? null;
    }

    removeBlock(pos: Vec3, force: boolean) {
        if (force) {
            delete this.blocks[pos.toString()];
        } else {
            const realBlock = this.originalWorld.getBlock(pos);
            if (realBlock) this.blocks[pos.toString()] = realBlock;
            else delete this.blocks[pos.toString()];
        }
    }

    removeBlocks(positions: Vec3[], force: boolean) {
        positions.forEach((pos) => this.removeBlock(pos, force));
    }

    /**
     * @param playerPos Position of effected entity.
     * @param explosionPos Position of explosion origin.
     * @param block bot.block
     * @returns List of affected blocks that potentially protect the entity.
     */
    getExplosionAffectedBlocks(entityBB: AABB, explosionPos: Vec3): Overwrites {
        let blocks: Overwrites = {};
        const {x: xWidth, y: yWidth, z: zWidth} = entityBB.heightAndWidths();
        const dx = 1 / (xWidth * 2 + 1);
        const dy = 1 / (yWidth * 2 + 1);
        const dz = 1 / (zWidth * 2 + 1);

        const d3 = (1 - Math.floor(1 / dx) * dx) / 2;
        const d4 = (1 - Math.floor(1 / dz) * dz) / 2;

        const pos = new Vec3(0, 0, 0);
        for (pos.y = entityBB.minY; pos.y <= entityBB.maxY; pos.y += yWidth * dy) {
            for (pos.x = entityBB.minX + d3; pos.x <= entityBB.maxX; pos.x += xWidth * dx) {
              for (pos.z = entityBB.minZ + d4; pos.z <= entityBB.maxZ; pos.z += zWidth * dz) {
                    const dir = pos.minus(explosionPos);
                    const range = dir.norm();
                    const potentialBlock = this.raycast(explosionPos, dir.normalize(), range);
                    if (potentialBlock !== null) blocks[potentialBlock.position.toString()] = potentialBlock;
                }
            }
        }
        return blocks;
    }

    loadProtectiveBlocks(playerPos: Vec3, explosionPos: Vec3) {
        this.setBlocks(this.getExplosionAffectedBlocks(AABBUtils.getPlayerAABBRaw(playerPos), explosionPos));
    }
}
