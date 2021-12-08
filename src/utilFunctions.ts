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

type priorityStored = [priority: number, executor: () => Promise<void> | void];
export type BuiltInPriorityOptions = { group: PrioGroups; priority: number; returnIfRunning?: boolean; errCancel?: boolean };
export type CustomPriorityOptions = { priority: number; group?: PrioGroups; returnIfRunning?: boolean; errCancel?: boolean };
export class UtilFunctions {
    public inv: InventoryFunctions;
    public move: MovementFunctions;
    public entity: EntityFunctions;
    public predict: PredictiveFunctions;
    public filters: FilterFunctions;
    public math: MathFunctions;
    public world: WorldFunctions;
    public raytrace: RayTraceFunctions;
    private builtInsPriorityStore: Partial<{ [funcName: string]: priorityStored[] }>;
    private customPriorityStore: Partial<{ [funcName: string]: priorityStored[] }>;
    private builtInCurrentExecuting: { [funcName: string]: priorityStored | undefined };
    private customCurrentExecuting: { [funcName: string]: priorityStored | undefined };
    constructor(public bot: Bot) {
        this.inv = new InventoryFunctions(bot);
        this.move = new MovementFunctions(bot);
        this.entity = new EntityFunctions(bot);
        this.predict = new PredictiveFunctions(bot);
        this.filters = new FilterFunctions(bot);
        this.world = new WorldFunctions(bot);
        this.raytrace = new RayTraceFunctions(bot);
        this.math = new MathFunctions();
        this.builtInsPriorityStore = {};
        this.customPriorityStore = {};
        this.builtInCurrentExecuting = {};
        this.customCurrentExecuting = {};
    }

    sleep = promisify(setTimeout);

    isBuiltInsEmpty(name?: string) {
        if (name) {
            return !this.builtInsPriorityStore[name]?.length || !this.builtInCurrentExecuting[name];
        } else {
            return !Object.values(this.builtInsPriorityStore).length || !Object.values(this.builtInCurrentExecuting).length;
        }
    }

    isCustomEmpty(name?: string) {
        if (name) {
            return !this.customPriorityStore[name]?.length && !this.customCurrentExecuting[name];
        } else {
            return !Object.values(this.customPriorityStore).length && !Object.values(this.customCurrentExecuting).length;
        }
    }

    /**
     *
     * @param object \{priority, errCancel} => priority of function (highest order first), throw error if already running a function.
     * @param func any custom function.
     * @param args the arguments of passed in function.
     * @returns Error if errCancel and already executing, otherwise result of function.
     */
    customPriority<K extends (...args: any) => any>(
        { priority, group, returnIfRunning, errCancel }: CustomPriorityOptions,
        func: K,
        ...args: Parameters<K>
    ): number | Promise<ReturnType<K> | Error> {
        const name = group ?? func.name ?? "anonymous";
        const actionQueue = (this.customPriorityStore[name] ??= []);
        // console.log("custom", group ?? func.name ?? "anonymous", actionQueue, this.isCustomEmpty(name))
        if (errCancel && actionQueue.length > 1) throw "already executing";
        if (returnIfRunning && !this.isCustomEmpty(name)) return 1;
        // console.log("running.")
        return new Promise(async (res, rej) => {
            const currentlyExecuting = actionQueue.shift();
            if (currentlyExecuting) this.customCurrentExecuting[group ?? currentlyExecuting[1].name ?? "anonymous"] = currentlyExecuting;
            const index = actionQueue.findIndex(([prio]) => priority > prio);
            actionQueue.splice(index === -1 ? actionQueue.length : index, 0, [
                priority,
                async () => {
                    try {
                        res(await func(...(args as any)));
                    } catch (e) {
                        rej(e);
                    }
                    actionQueue.shift();
                    await actionQueue[0]?.[1]();
                },
            ]);
            if (currentlyExecuting) {
                actionQueue.unshift(currentlyExecuting);
                this.customCurrentExecuting[group ?? currentlyExecuting[1].name ?? "anonymous"] = undefined;
            } else await actionQueue[0][1]();
        });
    }

    builtInsPriority<K extends (...args: any) => any>(
        { group, priority, returnIfRunning, errCancel }: BuiltInPriorityOptions,
        func: K,
        ...args: Parameters<K>
    ): number | Promise<ReturnType<K> | Error> {
        const actionQueue = (this.builtInsPriorityStore[group] ??= []);
        // console.log("builtin", group, actionQueue)
        if (errCancel && !this.isBuiltInsEmpty(group)) throw "already executing";
        if (returnIfRunning && !this.isBuiltInsEmpty(group)) return 1;
        return new Promise(async (res, rej) => {
            const currentlyExecuting = actionQueue.shift();
            if (currentlyExecuting) this.customCurrentExecuting[group] = currentlyExecuting;
            const index = actionQueue.findIndex(([prio]) => priority > prio);
            actionQueue.splice(index === -1 ? actionQueue.length : index, 0, [
                priority,
                async () => {
                    try {
                        res(await func.bind(this.bot)(...(args as any)));
                    } catch (e) {
                        rej(e);
                    }
                    actionQueue.shift();
                    await actionQueue[0]?.[1]();
                },
            ]);
            if (currentlyExecuting) {
                actionQueue.unshift(currentlyExecuting);
                this.builtInCurrentExecuting[group] = undefined;
            } else await actionQueue[0][1]();
        });
    }
}
