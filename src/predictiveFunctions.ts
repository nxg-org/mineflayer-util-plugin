import type { Effects } from "minecraft-data";
import type { Bot } from "mineflayer";
import type { Entity } from "prismarine-entity";
import type { Item, NormalizedEnchant } from "prismarine-item";
import md from "minecraft-data";
import { Vec3 } from "vec3";
import { Overwrites, PredictiveWorld } from "./worldRelated/predictiveWorld";
import type { Block } from "prismarine-block";
import AABB from "./calcs/aabb";
import { AABBUtils } from "./static";

const armorPieces = ["head", "torso", "legs", "feet"];

// https://minecraft.fandom.com/wiki/Explosion
// Use bot.world, there's no typing yet.
function calcExposure(playerPos: Vec3, explosionPos: Vec3, world: any) {
  const dx = 1 / (0.6 * 2 + 1);
  const dy = 1 / (1.8 * 2 + 1);
  const dz = 1 / (0.6 * 2 + 1);

  const d3 = (1 - Math.floor(1 / dx) * dx) / 2;
  const d4 = (1 - Math.floor(1 / dz) * dz) / 2;

  let sampled = 0;
  let exposed = 0;
  const pos = new Vec3(0, 0, 0);
  for (pos.y = playerPos.y; pos.y <= playerPos.y + 1.8; pos.y += 1.8 * dy) {
    for (pos.x = playerPos.x - 0.3 + d3; pos.x <= playerPos.x + 0.3; pos.x += 0.6 * dx) {
      for (pos.z = playerPos.z - 0.3 + d4; pos.z <= playerPos.z + 0.3; pos.z += 0.6 * dz) {
        const dir = pos.minus(explosionPos);
        const range = dir.norm();
        if (world.raycast(explosionPos, dir.normalize(), range) === null) {
          exposed++;
        }
        sampled++;
      }
    }
  }
  return exposed / sampled;
}

function calcExposureAABB(entityBB: AABB, explosionPos: Vec3, world: any /* prismarine-world*/) {
  const xWidth = entityBB.maxX - entityBB.minX;
  const yWidth = entityBB.maxY - entityBB.minY;
  const zWidth = entityBB.maxZ - entityBB.minZ;
  const dx = 1 / (xWidth * 2 + 1);
  const dy = 1 / (yWidth * 2 + 1);
  const dz = 1 / (zWidth * 2 + 1);

  const d3 = (1 - Math.floor(1 / dx) * dx) / 2;
  const d4 = (1 - Math.floor(1 / dz) * dz) / 2;

  let sampled = 0;
  let exposed = 0;
  const pos = new Vec3(0, 0, 0);
  for (pos.y = entityBB.minY; pos.y <= entityBB.maxY; pos.y += yWidth * dy) {
    for (pos.x = entityBB.minX + d3; pos.x <= entityBB.maxX; pos.x += xWidth * dx) {
      for (pos.z = entityBB.minZ + d4; pos.z <= entityBB.maxZ; pos.z += zWidth * dz) {
        const dir = pos.minus(explosionPos);
        const range = dir.norm();
        if (world.raycast(explosionPos, dir.normalize(), range) === null) {
          exposed++;
        }
        sampled++;
      }
    }
  }
  return exposed / sampled;
}

// https://minecraft.fandom.com/wiki/Armor#Damage_protection
function getDamageAfterAbsorb(damages: number, armorValue: number, toughness: number) {
  const var3 = 2 + toughness / 4;
  const var4 = Math.min(Math.max(armorValue - damages / var3, armorValue * 0.2), 20);
  return damages * (1 - var4 / 25);
}

// https://minecraft.fandom.com/wiki/Attribute#Operations
function getAttributeValue(prop: any) {
  let X = prop.value;
  for (const mod of prop.modifiers) {
    if (mod.operation !== 0) continue;
    X += mod.amount;
  }
  let Y = X;
  for (const mod of prop.modifiers) {
    if (mod.operation !== 1) continue;
    Y += X * mod.amount;
  }
  for (const mod of prop.modifiers) {
    if (mod.operation !== 2) continue;
    Y += Y * mod.amount;
  }
  return Y;
}

function getDamageWithEnchantments(damage: number, equipment: Item[]) {
  const enchantments = equipment.some((e) => !!e)
    ? equipment
        .map(
          (armor) =>
            armor?.enchants
              .map((enchant) => {
                switch (enchant?.name) {
                  case "protection":
                    return enchant.lvl;
                  case "blast_protection":
                    return enchant.lvl * 2;
                  default:
                    return 0;
                }
              })
              .reduce((b: number, a: number) => b + a, 0) ?? [0]
        )
        .reduce((b: number, a: number) => b + a, 0)
    : 0;
  return damage * (1 - Math.min(enchantments, 20) / 25);
}

const DIFFICULTY_VALUES = {
  peaceful: 0,
  easy: 1,
  normal: 2,
  hard: 3,
};


export class PredictiveFunctions {
  private damageMultiplier: number; // for 1.12+ 8 for 1.8 TODO check when the change occur (likely 1.9)
  private armorToughnessKey: string; // was renamed in 1.16
  private armorProtectionKey: string;

  private resistanceIndex = 11;

  public world: PredictiveWorld;

  constructor(private bot: Bot) {
    const effects = bot.registry.effects;
    for (const effectId in effects) {
      const effect = effects[effectId];
      if (effect.name.includes("esistance")) {
        this.resistanceIndex = Number(effectId);
        break;
      }
    }
    this.damageMultiplier = bot.registry.version[">="]("1.9") ? 8 : 7; // for 1.12+ 8 for 1.8 TODO check when the change occur (likely 1.9)
    this.armorToughnessKey = bot.registry.version[">="]("1.16")
      ? "minecraft:generic.armor_toughness"
      : "generic.armorToughness"; // was renamed in 1.16
    this.armorProtectionKey = bot.registry.version[">="]("1.16") ? "minecraft:generic.armor" : "generic.armor"; // was renamed in 1.16

    this.world = new PredictiveWorld(bot);
  }

  //There's a mistyping in mineflayer. Effect[] is not accurate. You cannot map over it.
  getDamageWithEffects(damage: number, effects: { [id: string]: { id: number; amplifier: number; duration: number } }) {
    const resistanceLevel = effects?.[this.resistanceIndex]?.amplifier ?? 0;
    return damage * (1 - resistanceLevel / 5);
  }

  placeBlocks(blocks: Overwrites) {
    this.world.setBlocks(blocks);
  }

  removePredictedBlocks(positions: Vec3[], force: boolean = false) {
    this.world.removeBlocks(positions, force);
  }

  selfExplosionDamage(sourcePos: Vec3, power: number, rawDamages = false) {
    const distance = this.bot.entity.position.distanceTo(sourcePos);
    const radius = 2 * power;
    if (distance >= radius) return 0;
    const exposure = calcExposure(this.bot.entity.position, sourcePos, this.world);
    const impact = (1 - distance / radius) * exposure;
    let damages = Math.floor((impact * impact + impact) * this.damageMultiplier * power + 1);
    // The following modifiers are constant for the input bot.entity and doesnt depend
    // on the source position, so if the goal is to compare between positions they can be
    // ignored to save computations
    if (!rawDamages && (this.bot.entity as any).attributes[this.armorProtectionKey]) {
      const armor = getAttributeValue(this.bot.entity.attributes[this.armorProtectionKey]);
      const armorToughness = getAttributeValue(this.bot.entity.attributes[this.armorToughnessKey]);
      damages = getDamageAfterAbsorb(damages, armor, armorToughness);
      damages = getDamageWithEnchantments(damages, this.bot.entity.equipment);
      damages = this.getDamageWithEffects(damages, this.bot.entity.effects as any);
      damages *= DIFFICULTY_VALUES[this.bot.game.difficulty] * 0.5;
    }
    return Math.floor(damages);
  }

  getExplosionDamage(targetEntity: Entity, sourcePos: Vec3, power: number, rawDamages = false) {
    const distance = targetEntity.position.distanceTo(sourcePos);
    const radius = 2 * power;
    if (distance >= radius) return 0;
    const exposure = calcExposureAABB(AABBUtils.getEntityAABB(targetEntity), sourcePos, this.world);
    const impact = (1 - distance / radius) * exposure;
    let damages = Math.floor((impact * impact + impact) * this.damageMultiplier * power + 1);
    // The following modifiers are constant for the input targetEntity and doesnt depend
    // on the source position, so if the goal is to compare between positions they can be
    // ignored to save computations
    if (!rawDamages && (targetEntity as any).attributes[this.armorProtectionKey]) {
      const armor = getAttributeValue(targetEntity.attributes[this.armorProtectionKey]);
      const armorToughness = getAttributeValue(targetEntity.attributes[this.armorToughnessKey]);
      damages = getDamageAfterAbsorb(damages, armor, armorToughness);
      damages = getDamageWithEnchantments(damages, targetEntity.equipment);
      damages = this.getDamageWithEffects(damages, targetEntity.effects as any);

      if (targetEntity.type === "player") {
        damages *= DIFFICULTY_VALUES[this.bot.game.difficulty] * 0.5;
      }
    }
    return Math.floor(damages);
  }
}
