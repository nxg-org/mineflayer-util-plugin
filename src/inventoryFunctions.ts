import { Bot, EquipmentDestination } from "mineflayer";
import { Item } from "prismarine-item";
import { promisify } from "util";
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
        // if (value) this.bot.emit("startedEquippingOtherSlot");
        // else this.bot.emit("stoppedEquippingOtherSlot");
        this._equippingOtherSlot = value;
    }

    public get equippingOtherSlot(): boolean {
        return this._equippingOtherSlot;
    }

    public set equippingMainHand(value: boolean) {
        if (this._equippingMainHand === value) return;
        // if (value) this.bot.emit("startedEquippingMainHand");
        // else this.bot.emit("stoppedEquippingMainHand");
        this._equippingMainHand = value;
    }

    public get equippingMainHand(): boolean {
        return this._equippingMainHand;
    }

    public set equippingOffHand(value: boolean) {
        if (this._equippingOffHand === value) return;
        // if (value) this.bot.emit("startedEquippingOffHand");
        // else this.bot.emit("stoppedEquippingOffHand");
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
            ...(["hand", "head", "torso", "legs", "feet", "off-hand"]
                .filter((name) => name !== current))
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
        if (metadata) return this.getAllItems().find((item) => item.type === itemId && item.metadata === metadata) ?? null;
        else return this.getAllItems().find((item) => item.type === itemId) ?? null;
    }

    findItem(name: string, metadata?: number): Item | null {
        if (metadata) return this.getAllItems().find((item) => item.name === name && item.metadata === metadata) ?? null;
        else return this.getAllItems().find((item) => item.name === name) ?? null;
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
