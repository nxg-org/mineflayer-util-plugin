import type { Bot } from "mineflayer";
import { UtilFunctions } from "./utilFunctions"
import md from "minecraft-data"

declare module "mineflayer" {

    interface Bot {
        util: UtilFunctions;
        registry: md.IndexedData;
    }
}


export default function inject(bot: Bot) {
    bot.util = new UtilFunctions(bot);
  
}

export { AABB } from "./calcs/aabb";
export { InterceptFunctions } from "./calcs/intercept"
export {RaycastIterator, BlockFace} from "./calcs/iterators"
export {AABBUtils, MathUtils} from "./static"
