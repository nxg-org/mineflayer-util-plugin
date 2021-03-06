import type { Bot } from "mineflayer";
import type { Entity } from "prismarine-entity";
import type { Vec3 } from "vec3";
import { goals, Movements } from "mineflayer-pathfinder";
import md from "minecraft-data";

const { GoalCompositeAll, GoalInvert, GoalFollow } = goals;

export class MovementFunctions {
    public goalArray = new GoalCompositeAll();
    constructor(private bot: Bot) {
        this.movements = new Movements(bot, md(bot.version));
    }

    public set movements(movements: Movements) {
        this.bot.pathfinder.setMovements(movements);
    }

    public get movements(): Movements {
        return this.movements;
    }

    /**
     * Fuckin' mineflayer-pathfinder still doesn't have typings.
     * Pain in my goddamn ass.
     * @returns have the goal changed
     */
    addGoal(goal: any): boolean {
        if (this.goalArray.goals.find((inGoal) => inGoal === goal)) return false;
        this.goalArray.push(goal);
        return true;
    }

    /**
     * Sets current goal and clears all others.
     * @param goal any type of mineflayer-pathfinder goal.
     * @returns have the goal changed
     */
    setOnlyGoal(goal: any, dynamic: boolean = false): boolean {
        const goalArr = [goal];
        if (this.goalArray.goals === goalArr) return false;
        this.goalArray.goals = goalArr;
        this.bot.pathfinder.setGoal(this.goalArray, dynamic);
        return true;
    }

    /**
     * Reset all goals inside the goal array to none.
     * @returns have the goals changed
     */
    stop(): boolean {
        if (this.goalArray.goals.length === 0) return false;
        this.goalArray.goals = [];
        this.bot.pathfinder.setGoal(null);
        return true;
    }

    /**
     * Retreat from current entity.
     * @param entity Prismarine-Entity Entity
     * @returns have the goals changed.
     */
    retreatFromEntity(entity: Entity, distance: number, dynamic: boolean = true): boolean {
        const oldGoals = this.goalArray.goals.length;
        this.goalArray.goals = this.goalArray.goals.filter(
            (goal: any) => goal.goal?.entity?.id === entity.id && goal.goal?.rangeSq === distance * distance
        );
        if (oldGoals !== this.goalArray.goals.length || this.goalArray.goals.length === 0) {
            this.goalArray.push(new GoalFollow(entity!, distance));
            this.goalArray.push(new GoalInvert(new GoalFollow(entity!, distance - 1)));
            this.bot.pathfinder.setGoal(this.goalArray, dynamic);
            return true;
        }
        return false;
    }

    /**
     * Follow entity with a specific range. Will not approach past a certain distance either.
     * @param entity Prismarine-Entity Entity
     * @returns have the goals changed
     */
    followEntityWithRespectRange(entity: Entity, followDistance: number, invertDistance?: number): boolean {
        const oldGoals = this.goalArray.goals.length;
        this.goalArray.goals = (this.goalArray.goals as any[]).filter((goal) => {
            return goal.entity?.id === entity.id && goal.rangeSq === followDistance * followDistance;
        });

        if (oldGoals !== this.goalArray.goals.length || !this.bot.pathfinder.isMoving() || this.goalArray.goals.length === 0) {
            if (this.goalArray.goals.length > 0) {
                this.goalArray.goals = [];
            }
            this.goalArray.push(new GoalFollow(entity, followDistance));
            this.goalArray.push(new GoalInvert(new GoalFollow(entity, invertDistance ?? followDistance - 0.5)));
            this.bot.pathfinder.setGoal(this.goalArray, true);
            return true;
        }

        return false;
    }

    forceLook(yaw: number, pitch: number, update: boolean = false, onGround?: boolean) {
        const notchianYawAndPitch = { yaw: this.bot.util.math.toNotchianYaw(yaw), pitch: this.bot.util.math.toNotchianPitch(pitch) };
        this.bot._client.write("look", { ...notchianYawAndPitch, onGround: onGround ?? this.bot.entity.onGround });
        if (update) {
            this.bot.look(yaw, pitch, true);
        }
    }

    forceLookAt(pos: Vec3, update: boolean = false, onGround?: boolean) {
        const { yaw, pitch } = this.bot.util.math.pointToYawAndPitch(this.bot, pos);
        const nyp = { yaw: this.bot.util.math.toNotchianYaw(yaw), pitch: this.bot.util.math.toNotchianPitch(pitch) };
        this.bot._client.write("look", { ...nyp, onGround: onGround ?? this.bot.entity.onGround });
        if (update) {
            this.bot.look(yaw, pitch, true);
        }
    }

    lazyTeleport(endPos: Vec3) {}
}
