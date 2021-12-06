import type { Bot } from "mineflayer";
import { UtilFunctions } from "./utilFunctions";
import { PredictiveWorld } from "./worldRelated/predictiveWorld";

declare module "mineflayer" {
    type PrioGroups = "inventory" | "movement";
    interface Bot {
        util: UtilFunctions,
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
    interface Entity {
        attributes: { [index: string]:  {value: number, modifiers: any[] }},
    }
}

export default function inject(bot: Bot) {
    bot.util = new UtilFunctions(bot);
}