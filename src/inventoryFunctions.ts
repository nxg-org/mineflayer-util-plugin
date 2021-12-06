import { Bot, EquipmentDestination } from "mineflayer";
import { Item } from "prismarine-item";
import { promisify } from "util";
import { BuiltInPriorityOptions } from "./utilFunctions";
const sleep = promisify(setTimeout);

/**
 * Error codes:
 *
 * 0 = completed successfully.
 *
 * 1 = Item is already equipped.
 *
 * 2 = Item could not be found.
 *
 * 3 = We are currently equipping an item.
 */
export class InventoryFunctions {
    private _equippingMainHand: boolean = false;
    private _equippingOffHand: boolean = false;
    private _equippingOtherSlot: boolean = false;
    public usingMainHand: boolean = false;
    public usingOffHand: boolean = false;

    constructor(public bot: Bot) {}

    public set equippingOtherSlot(value: boolean) {
        if (this._equippingOtherSlot === value) return;
        if (value) this.bot.emit("startedEquippingOtherSlot");
        else this.bot.emit("stoppedEquippingOtherSlot");
        this._equippingOtherSlot = value;
    }

    public get equippingOtherSlot(): boolean {
        return this._equippingOtherSlot;
    }

    public set equippingMainHand(value: boolean) {
        if (this._equippingMainHand === value) return;
        if (value) this.bot.emit("startedEquippingMainHand");
        else this.bot.emit("stoppedEquippingMainHand");
        this._equippingMainHand = value;
    }

    public get equippingMainHand(): boolean {
        return this._equippingMainHand;
    }

    public set equippingOffHand(value: boolean) {
        if (this._equippingOffHand === value) return;
        if (value) this.bot.emit("startedEquippingOffHand");
        else this.bot.emit("stoppedEquippingOffHand");
        this._equippingOffHand = value;
    }

    public get equippingOffHand(): boolean {
        return this._equippingOffHand;
    }

    getAllItems(): Item[] {
        return [
            ...this.bot.inventory.items(),
            ...["hand", "head", "torso", "legs", "feet", "off-hand"].map(
                (name) => this.bot.inventory.slots[this.bot.getEquipmentDestSlot(name)]
            ),
        ].filter((e) => !!e);
    }

    getAllItemsExceptCurrent(current: EquipmentDestination): Item[] {
        return [
            ...this.bot.inventory.items(),
            ...["hand", "head", "torso", "legs", "feet", "off-hand"]
                .filter((name) => name !== current)
                .map((name) => this.bot.inventory.slots[this.bot.getEquipmentDestSlot(name)]),
        ].filter((e) => !!e);
    }

    getHandWithItem(offhand?: boolean): Item | null {
        return this.bot.inventory.slots[this.bot.getEquipmentDestSlot(this.getHand(offhand))];
    }

    getHand(offhand: boolean = false): "hand" | "off-hand" {
        return offhand ? "off-hand" : "hand";
    }

    findItemByID(itemId: number, metadata?: number): Item | null {
        const potentialMatches = this.getAllItems().filter((item) => item.type === itemId);
        if (metadata) return potentialMatches.find((item) => item.metadata === metadata) ?? null;
        return potentialMatches[0] ?? null;
    }

    findItem(name: string, metadata?: number) {
        //[...this.getAllItems(), this.bot.inventory.selectedItem!]
        const potentialMatches = this.getAllItems().filter((item) => item?.name.includes(name));
        if (metadata) return potentialMatches.find((item) => item.metadata === metadata) ?? null;
        return potentialMatches[0] ?? null;
    }

    //alias.
    has(name: string, metadata?: number) {
        return !!this.findItem(name, metadata);
    }

    async equipItemRaw(item: Item, dest: EquipmentDestination): Promise<boolean> {
        if (this.bot.inventory.slots[this.bot.getEquipmentDestSlot(dest)] === item) return true;
        await this.bot.equip(item, dest);
        return false;
    }

    async equipItem(name: string, dest: EquipmentDestination, options: BuiltInPriorityOptions): Promise<number> {
        if (this.bot.inventory.slots[this.bot.getEquipmentDestSlot(dest)]?.name.includes(name)) return 1;
        const item = this.getAllItemsExceptCurrent(dest).find((item) => item?.name.includes(name));
        if (!!item) {
            await this.bot.util.builtInsPriority(options, this.bot.equip, item, dest);
            return 0;
        }
        return 2;
    }

    async equipMainHand(name: string, options: BuiltInPriorityOptions = { group: "inventory", priority: 1 }): Promise<number> {
        while (this._equippingMainHand) {
            await sleep(0);
        }
        return await this.equipMainHandNoWait(name, options);
    }

    async equipOffHand(name: string, options: BuiltInPriorityOptions = { group: "inventory", priority: 1 }): Promise<number> {
        while (this._equippingOffHand) {
            await sleep(0);
        }
        return await this.equipOffHandNoWait(name, options);
    }

    async equipSlot(
        name: string,
        destination: EquipmentDestination,
        options: BuiltInPriorityOptions = { group: "inventory", priority: 1 }
    ): Promise<number> {
        while (this._equippingOtherSlot) {
            await sleep(0);
        }
        return await this.equipSlotNoWait(name, destination, options);
    }

    async equipMainHandNoWait(name: string, options: BuiltInPriorityOptions): Promise<number> {
        if (this._equippingMainHand) return 3;
        this._equippingMainHand = true;
        const result = await this.equipItem(name, "hand", options);
        this._equippingMainHand = false;
        return result;
    }

    async equipOffHandNoWait(name: string, options: BuiltInPriorityOptions): Promise<number> {
        if (this._equippingOffHand) return 3;
        this.equippingOffHand = true;
        const result = await this.equipItem(name, "off-hand", options);
        this.equippingOffHand = false;
        return result;
    }

    async equipSlotNoWait(name: string, dest: EquipmentDestination, options: BuiltInPriorityOptions) {
        if (this._equippingOtherSlot) return 3;
        this.equippingOtherSlot = true;
        const result = await this.equipItem(name, dest, options);
        this.equippingOtherSlot = false;
        return result;
    }

    async customEquip(item: Item, destination: EquipmentDestination, retries: number = 1) {
        for (let i = 0; i < retries; i++) {
            try {
                await this.bot.equip(item, destination);
                return true;
            } catch (error) {
                if (this.bot.inventory.selectedItem) {
                    const slot = this.bot.inventory.firstEmptyInventorySlot(false) || -999;
                    try {
                        await this.bot.clickWindow(slot, 0, 0);
                    } catch (error) {
                        return false;
                    }
                }
            }
        }
        return false;
    }
}
