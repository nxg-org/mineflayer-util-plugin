import type { Bot } from "mineflayer";
import { UtilFunctions } from "./utilFunctions"
import {pathfinder} from "mineflayer-pathfinder"

declare module "mineflayer" {
    type PrioGroups = "inventory" | "movement";
    interface Bot {
        util: UtilFunctions;
    }
}


export default function inject(bot: Bot) {
    if (!bot.pathfinder) bot.loadPlugin(pathfinder)
    bot.util = new UtilFunctions(bot);
  
}

export { AABB } from "./calcs/aabb";
export { InterceptFunctions } from "./calcs/intercept"
export {RaycastIterator, BlockFace} from "./calcs/iterators"
export {AABBUtils, MathUtils} from "./static"
