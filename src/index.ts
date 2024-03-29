import type { Bot } from "mineflayer";
import { UtilFunctions } from "./utilFunctions"

declare module "mineflayer" {

    interface Bot {
        util: UtilFunctions;
    }
}

declare module "prismarine-entity" {
    interface Entity {
        attributes: { [index: string]: { value: number; modifiers: any[] } };
    }
}

export default function inject(bot: Bot) {
    bot.util = new UtilFunctions(bot);
  
}

export { AABB } from "./calcs/aabb";
export { InterceptFunctions } from "./calcs/intercept"
export {RaycastIterator, BlockFace} from "./calcs/iterators"
export {AABBUtils, MathUtils, Task} from "./static"
