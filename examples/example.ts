import { createBot, EquipmentDestination } from "mineflayer";
import shit from "../src/index";
import { Vec3 } from "vec3";
import type { Entity } from "prismarine-entity";

let target: Entity | null;

const bot = createBot({
    username: "utilTesting",
    host: process.argv[2] ?? "localhost",
    port: Number(process.argv[3]) ?? 25565,
});

bot.loadPlugin(shit);

const emptyVec = new Vec3(0, 0, 0);

bot.on("chat", async (username, message) => {
    const split = message.split(" ");
    switch (split[0]) {
        case "look":
            target = bot.nearestEntity((e) => (e.username ?? e.name) === split[1]);
            if (!target) return console.log("no entity");
            bot.util.move.forceLookAt(target.position, true);
            break;
        case "equip":
            const item = bot.util.inv.getAllItems().find((i) => i.name.includes(split[1]));
            if (!item) return console.log("no item");
            if (["hand", "off-hand"].includes(split[2])) {
                bot.util.inv.customEquip(item, split[2] as EquipmentDestination);
            }

            break;
        case "health":
            const health = bot.util.entity.getHealth();
            bot.chat(`${health}`);
            break;

        case "whatAmILookingAt":
            target = bot.nearestEntity((e) => (e.username ?? e.name) === username);
            if (!target) return console.log("no entity");
            const player = bot.util.raytrace.entityAtEntityCursor(target, 256);
            if (player) {
                console.log(player);
                bot.chat(`${player.username ?? player.name} at ${player.position}`);
            } else {
                const block = bot.util.raytrace.blockAtEntityCursor(target, 256); //includes face and intersect. That's very nice.
                if (block) {
                    console.log(block);
                    bot.chat(`${block.name} at ${block.position}`);
                } else {
                    bot.chat("You're not looking at anything.");
                }
            }
            break;
        default:
            console.log(username, bot.entity.username);
            if (username !== bot.entity.username) bot.chat("unknown command: " + message);
            break;
    }
});
