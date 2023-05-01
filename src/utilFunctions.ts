import type { Bot } from "mineflayer";
import { Vec3 } from "vec3";
import { EntityFunctions } from "./entityFunctions";
import { FilterFunctions } from "./filterFunctions";
import { InventoryFunctions } from "./inventoryFunctions";
import { MovementFunctions } from "./movementFunctions";
import { PredictiveFunctions } from "./predictiveFunctions";
import { RayTraceFunctions } from "./rayTracingFunctions";
import { MathUtils } from "./static";




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
  public raytrace: RayTraceFunctions;
  constructor(public bot: Bot) {
    this.inv = new InventoryFunctions(bot);
    this.move = new MovementFunctions(bot);
    this.entity = new EntityFunctions(bot);
    this.predict = new PredictiveFunctions(bot);
    this.filters = new FilterFunctions(bot);
    this.raytrace = new RayTraceFunctions(bot);
  }

  public getViewDir() {
    return new Vec3
    (
      -Math.sin(this.bot.entity.yaw) * Math.cos(this.bot.entity.pitch),
      Math.sin(this.bot.entity.pitch),
      -Math.cos(this.bot.entity.yaw) * Math.cos(this.bot.entity.pitch)
    );
  }
}
