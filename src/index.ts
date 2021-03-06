import type { Bot } from "mineflayer";
import { UtilFunctions } from "./utilFunctions";
import {pathfinder} from "mineflayer-pathfinder"

declare module "mineflayer" {
    type PrioGroups = "inventory" | "movement";
    interface Bot {
        util: UtilFunctions;
    }

    interface BotEvents {
        startedEquippingMainHand: () => void;
        startedEquippingOffHand: () => void;
        stoppedEquippingMainHand: () => void;
        stoppedEquippingOffHand: () => void;
        startedEquippingOtherSlot: () => void;
        stoppedEquippingOtherSlot: () => void;
    }
}

declare module "prismarine-entity" {
    // interface Entity {
    //     attributes: { [index: string]: { value: number; modifiers: any[] } };
    // }
}

export default function inject(bot: Bot) {
    if (!bot.pathfinder) bot.loadPlugin(pathfinder)
    bot.util = new UtilFunctions(bot);
}

export { AABB } from "./calcs/aabb";
export { InterceptFunctions } from "./calcs/intercept"
export {AABBUtils, MathUtils} from "./static"
