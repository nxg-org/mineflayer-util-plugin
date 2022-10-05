import type { Bot, EquipmentDestination, PrioGroups } from "mineflayer";
import { EntityFunctions } from "./entityFunctions";
import { FilterFunctions } from "./filterFunctions";
import { InventoryFunctions } from "./inventoryFunctions";
import { MovementFunctions } from "./movementFunctions";
import { promisify } from "util";
import { PredictiveFunctions } from "./predictiveFunctions";
import { MathFunctions } from "./mathUtil";
import { WorldFunctions } from "./WorldFunctions";
import { RayTraceFunctions } from "./rayTracingFunctions";

/**
 * I don't believe I need any locks, as I'm only going to have one instance of this per bot.
 * This is added to bot context so multiple instances will exist in memory.
 * Therefore, I don't need this. https://www.npmjs.com/package/async-lock
 */

/**
 * I may add listeners to this class, as halting until an item is equipped may be good.
 */

/**
 * I can't inherit from multiple classes. This language sucks.
 * I'm not using mixins. Fuck you, fuck that.
 * I'm just going to segregate these functions into separate categories
 * because once again, fuck you.
 *
 */

export class UtilFunctions {
    public inv: InventoryFunctions;
    public move: MovementFunctions;
    public entity: EntityFunctions;
    public predict: PredictiveFunctions;
    public filters: FilterFunctions;
    public math: MathFunctions;
    public world: WorldFunctions;
    public raytrace: RayTraceFunctions;
    constructor(public bot: Bot) {
        this.inv = new InventoryFunctions(bot);
        this.move = new MovementFunctions(bot);
        this.entity = new EntityFunctions(bot);
        this.predict = new PredictiveFunctions(bot);
        this.filters = new FilterFunctions(bot);
        this.world = new WorldFunctions(bot);
        this.raytrace = new RayTraceFunctions(bot);
        this.math = new MathFunctions();
    }

    sleep = promisify(setTimeout);
}