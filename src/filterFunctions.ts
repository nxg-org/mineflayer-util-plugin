import type { Entity } from "prismarine-entity";
import type { Bot } from "mineflayer";
import type { Vec3 } from "vec3";

/**
 * TODO: Inherit other bot names. May need to communciate to a server for this one. Or perhaps reference this once?
 */
export class FilterFunctions {
    public specificNames: string[] = [];
    public botNames: string[] = [];
    constructor(private bot: Bot) {}

    addBotName(name: string): void {
        this.botNames.push(name);
    }

    getNearestEntity(func: (entity: Entity, ...args: any[]) => boolean, ...args: any[]): Entity | null {
        return this.bot.nearestEntity((entity: Entity) => func(entity, ...args));
    }

    static getNearestEntity(bot: Bot, func: (entity: Entity, ...args: any[]) => boolean, ...args: any[]): Entity | null {
        return bot.nearestEntity((entity: Entity) => func(entity, ...args));
    }

    allButOtherBotsFilter(): Entity | null {
        return this.getNearestEntity((e: Entity) => e.type === "player" && (!this.botNames?.includes(e.username ?? "") ?? true));
    }

    static allButOtherBotsFilter(bot: Bot, ...names: string[]): Entity | null {
        return FilterFunctions.getNearestEntity(bot, (e: Entity) => e.type === "player" && !names.includes(e.username ?? ""));
    }

    specificNamesFilter(): Entity | null {
        return this.getNearestEntity((e: Entity) => e.type === "player" && (this.specificNames?.includes(e.username ?? "") ?? true));
    }

    static specificNamesFilter(bot: Bot, ...names: string[]): Entity | null {
        return FilterFunctions.getNearestEntity(bot, (e: Entity) => e.type === "player" && names.includes(e.username ?? ""));
    }

    nearestCrystalFilter(): Entity | null {
        return this.getNearestEntity((e: Entity) => e.name === "ender_crystal");
    }

    static nearestCrystalFilter(bot: Bot): Entity | null {
        return FilterFunctions.getNearestEntity(bot, (e: Entity) => e.name === "ender_crystal");
    }

    entityAtPosition(position: Vec3) {
        return this.getNearestEntity((entity: Entity) => entity.position.offset(-0.5, -1, -0.5).equals(position));
    }

    static entityAtPosition(bot: Bot, position: Vec3) {}
}
