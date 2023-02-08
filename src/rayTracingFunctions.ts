import { Bot } from "mineflayer";
import type { Block } from "prismarine-block";
import type { Entity } from "prismarine-entity";
import { Vec3 } from "vec3";
import AABB from "./calcs/aabb";
import { BlockFace, RaycastIterator } from "./calcs/iterators";
import { AABBUtils } from "./static";

type RayAddtion = { intersect: Vec3; face: BlockFace };
export type EntityRaycastReturn = (Block | Entity) & RayAddtion;
export class RayTraceFunctions {
  constructor(private bot: Bot) {}

  entityRaytrace(startPos: Vec3, dir: Vec3, maxDistance = 3.5, matcher?: (e: Entity) => boolean) {
    const aabbMap: { [id: string]: AABB } = {};

    Object.values(this.bot.entities)
      .filter((e) => e.username !== this.bot.entity.username)
      .forEach((e) => (aabbMap[e.id] = AABBUtils.getEntityAABB(e)));

    return this.entityRaytraceRaw(startPos, dir, aabbMap, maxDistance, matcher);
  }

  entityRaytraceRaw(
    startPos: Vec3,
    dir: Vec3,
    aabbMap: { [id: string]: AABB },
    maxDistance = 3.5,
    matcher?: (e: Entity) => boolean
  ): EntityRaycastReturn | null {

    matcher ||= (e) => true;
    Object.entries(aabbMap).forEach(([id, bb]) => {
      if (bb.distanceToVec(eyePos) > maxDistance) delete aabbMap[id];
    });

    dir = dir.normalize();
    let returnVal = this.bot.world.raycast(startPos, dir, maxDistance) as (Block & RayAddtion) | null;
    if (returnVal && Object.keys(aabbMap).length === 0) return returnVal;
    maxDistance = returnVal?.intersect.distanceTo(startPos) ?? maxDistance;

    const eyePos = this.bot.entity.position.offset(0, this.bot.entity.height, 0);
    const iterator = new RaycastIterator(startPos, dir, maxDistance);

    for (const id in aabbMap) {
      const aabb = aabbMap[id];
      const pt = aabb.bottomMiddlePoint();
      const entity = this.bot.entities[id];
      const intersect = iterator.intersect(aabb.toShapeFromBottomMiddle(), pt);
      if (intersect) {
        const entityDir = pt.minus(eyePos);
        const sign = Math.sign(entityDir.dot(dir));
        if (sign !== -1) {
          const dist = eyePos.distanceTo(intersect.pos);
          if (dist <= maxDistance) {
            maxDistance = dist;
            if (matcher(entity)) {
              returnVal = entity as any;
              returnVal!.intersect = intersect.pos;
              returnVal!.face = intersect.face;
            }
          }
        }
      }
    }

    return returnVal;
  }

  entityAtEntityCursor(entity: Entity, maxDistance: number = 3.5): Entity | null {
    const block = this.bot.blockAtCursor(maxDistance) as Block & { intersect: Vec3 };
    maxDistance = block?.intersect.distanceTo(this.bot.entity.position) ?? maxDistance;

    const entities = Object.values(this.bot.entities).filter(
      (e) =>
        e.type !== "object" && e.username !== entity.username && e.position.distanceTo(entity.position) <= maxDistance
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
      const w = (e.height >= 1.62 && e.height <= 1.99) || e.height === 2.9 ? 0.3 : e.height / 2;

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
