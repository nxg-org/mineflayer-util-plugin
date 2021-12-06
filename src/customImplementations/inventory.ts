import type { Bot, EquipmentDestination } from "mineflayer";
import type { Item } from "prismarine-item";
import assert from "assert";
import { promisify } from "util";
const sleep = promisify(setTimeout);

const QUICK_BAR_COUNT = 9;
const QUICK_BAR_START = 36;

let nextQuickBarSlot = 0;

//lazy. will fix this later.

export class CustomInventoryFunctions {
    armorSlots = {
        head: 5,
        torso: 6,
        legs: 7,
        feet: 8,
    } as any;

    constructor(private bot: Bot) {
        if (!bot.supportFeature("doesntHaveOffHandSlot")) {
            this.armorSlots["off-hand"] = 45;
        }
    }

    async equip(item: Item, destination: EquipmentDestination) {
        if (item == null || typeof item !== "object") {
            throw new Error("Invalid item object in equip (item is null or typeof item is not object)");
        }
        if (!destination || destination === null) {
            destination = "hand";
        }
        const sourceSlot = item.slot;
        let destSlot = this.getDestSlot(destination);

        if (sourceSlot === destSlot) {
            // don't need to do anything
            return;
        }

        if (destination !== "hand") {
            await this.bot.moveSlotItem(sourceSlot, destSlot);
            return;
        }

        if (
            destSlot >= QUICK_BAR_START &&
            destSlot < QUICK_BAR_START + QUICK_BAR_COUNT &&
            sourceSlot >= QUICK_BAR_START &&
            sourceSlot < QUICK_BAR_START + QUICK_BAR_COUNT
        ) {
            // all we have to do is change the quick bar selection
            this.bot.setQuickBarSlot(sourceSlot - QUICK_BAR_START);
            return;
        }

        // find an empty slot on the quick bar to put the source item in
        destSlot = this.bot.inventory.firstEmptySlotRange(QUICK_BAR_START, QUICK_BAR_START + QUICK_BAR_COUNT);
        if (destSlot == null) {
            // LRU cache for the quick bar items
            destSlot = QUICK_BAR_START + nextQuickBarSlot;
            nextQuickBarSlot = (nextQuickBarSlot + 1) % QUICK_BAR_COUNT;
        }
        this.setQuickBarSlot(destSlot - QUICK_BAR_START);
        await this.bot.moveSlotItem(sourceSlot, destSlot);
    }

    setQuickBarSlot(slot: number) {
        assert.ok(slot >= 0);
        assert.ok(slot < 9);
        if (this.bot.quickBarSlot === slot) return;
        this.bot.quickBarSlot = slot;
        this.bot._client.write("held_item_slot", {
            slotId: slot,
        });
        this.bot.updateHeldItem();
    }

    getDestSlot(destination: EquipmentDestination) {
        if (destination === "hand") {
            return QUICK_BAR_START + this.bot.quickBarSlot;
        } else {
            const destSlot = this.armorSlots[destination];
            assert.ok(destSlot != null, `invalid destination: ${destination}`);
            return destSlot;
        }
    }
}
