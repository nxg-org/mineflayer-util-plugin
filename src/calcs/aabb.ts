import { Vec3 } from "vec3";

export class AABB {
    public minX: number;
    public minY: number;
    public minZ: number;
    public maxX: number;
    public maxY: number;
    public maxZ: number;

    constructor(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
        this.minX = x0;
        this.minY = y0;
        this.minZ = z0;
        this.maxX = x1;
        this.maxY = y1;
        this.maxZ = z1;
    }

    static fromVecs(min: Vec3, max: Vec3) {
        return new AABB(min.x, min.y, min.z, max.x, max.y, max.z);
    }

    set(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
        this.minX = x0;
        this.minY = y0;
        this.minZ = z0;
        this.maxX = x1;
        this.maxY = y1;
        this.maxZ = z1;
    }

    clone() {
        return new AABB(this.minX, this.minY, this.minZ, this.maxX, this.maxY, this.maxZ);
    }

    toArray() {
        return [this.minX, this.minY, this.minZ, this.maxX, this.maxY, this.maxZ];
    }

    toMinAndMaxArrays() {
        return { 0: [this.minX, this.minY, this.minZ], 1: [this.maxX, this.maxY, this.maxZ] };
    }

    toVecs() {
        return { 0: new Vec3(this.minX, this.minY, this.minZ), 1: new Vec3(this.maxX, this.maxY, this.maxZ) };
    }

    floor() {
        this.minX = Math.floor(this.minX);
        this.minY = Math.floor(this.minY);
        this.minZ = Math.floor(this.minZ);
        this.maxX = Math.floor(this.maxX);
        this.maxY = Math.floor(this.maxY);
        this.maxZ = Math.floor(this.maxZ);
    }

    extend(dx: number, dy: number, dz: number) {
        if (dx < 0) this.minX += dx;
        else this.maxX += dx;

        if (dy < 0) this.minY += dy;
        else this.maxY += dy;

        if (dz < 0) this.minZ += dz;
        else this.maxZ += dz;

        return this;
    }

    contract(x: number, y: number, z: number) {
        this.minX += x;
        this.minY += y;
        this.minZ += z;
        this.maxX -= x;
        this.maxY -= y;
        this.maxZ -= z;
        return this;
    }

    expand(x: number, y: number, z: number) {
        this.minX -= x;
        this.minY -= y;
        this.minZ -= z;
        this.maxX += x;
        this.maxY += y;
        this.maxZ += z;
        return this;
    }

    offset(x: number, y: number, z: number) {
        this.minX += x;
        this.minY += y;
        this.minZ += z;
        this.maxX += x;
        this.maxY += y;
        this.maxZ += z;
        return this;
    }

    computeOffsetX(other: AABB, offsetX: number) {
        if (other.maxY > this.minY && other.minY < this.maxY && other.maxZ > this.minZ && other.minZ < this.maxZ) {
            if (offsetX > 0.0 && other.maxX <= this.minX) {
                offsetX = Math.min(this.minX - other.maxX, offsetX);
            } else if (offsetX < 0.0 && other.minX >= this.maxX) {
                offsetX = Math.max(this.maxX - other.minX, offsetX);
            }
        }
        return offsetX;
    }

    computeOffsetY(other: AABB, offsetY: number) {
        if (other.maxX > this.minX && other.minX < this.maxX && other.maxZ > this.minZ && other.minZ < this.maxZ) {
            if (offsetY > 0.0 && other.maxY <= this.minY) {
                offsetY = Math.min(this.minY - other.maxY, offsetY);
            } else if (offsetY < 0.0 && other.minY >= this.maxY) {
                offsetY = Math.max(this.maxY - other.minY, offsetY);
            }
        }
        return offsetY;
    }

    computeOffsetZ(other: AABB, offsetZ: number) {
        if (other.maxX > this.minX && other.minX < this.maxX && other.maxY > this.minY && other.minY < this.maxY) {
            if (offsetZ > 0.0 && other.maxZ <= this.minZ) {
                offsetZ = Math.min(this.minZ - other.maxZ, offsetZ);
            } else if (offsetZ < 0.0 && other.minZ >= this.maxZ) {
                offsetZ = Math.max(this.maxZ - other.minZ, offsetZ);
            }
        }
        return offsetZ;
    }

    intersects(other: AABB) {
        return (
            this.minX < other.maxX &&
            this.maxX > other.minX &&
            this.minY < other.maxY &&
            this.maxY > other.minY &&
            this.minZ < other.maxZ &&
            this.maxZ > other.minZ
        );
    }

    xzIntersectsRay(origin: Vec3, direction: Vec3): { x: number; z: number } | null {
        const d = this.distanceFromRay(origin, direction);
        return d === Infinity ? null : { x: origin.x + direction.x * d, z: origin.z + direction.z * d };
    }

    intersectsRay(origin: Vec3, direction: Vec3) {
        const d = this.distanceFromRay(origin, direction);
        return d === Infinity ? null : new Vec3(origin.x + direction.x * d, origin.y + direction.y * d, origin.z + direction.z * d);
    }

    distanceFromRay(origin: Vec3, direction: Vec3, xz: boolean = false) {
        const ro = origin.toArray();
        const rd = direction.normalize().toArray();
        const aabb = this.toMinAndMaxArrays();
        const dims = ro.length; // will change later.
        const dif = xz ? 2 : 1;
        let lo = -Infinity;
        let hi = +Infinity;
        // let test = origin.clone()

        for (let i = 0; i < dims; i += dif) {
            let dimLo = (aabb[0][i] - ro[i]) / rd[i];
            let dimHi = (aabb[1][i] - ro[i]) / rd[i];

            if (dimLo > dimHi) {
                let tmp = dimLo;
                dimLo = dimHi;
                dimHi = tmp;
            }
            if (dimHi < lo || dimLo > hi) {
                return Infinity;
            }

            if (dimLo > lo) lo = dimLo;
            if (dimHi < hi) hi = dimHi;
        }

        return lo > hi ? Infinity : lo;
    }

    equals(other: AABB): boolean {
        return (
            this.minX === other.minX &&
            this.minY === other.minY &&
            this.minZ === other.minZ &&
            this.maxX === other.maxX &&
            this.maxY === other.maxY &&
            this.maxZ === other.maxZ
        );
    }

    distanceTo(pos: Vec3, heightOffset: number = 0): number {
        const { x, y, z } = pos.offset(0, heightOffset, 0);
        let dx = Math.max(this.minX - x, 0, x - this.maxX);
        let dy = Math.max(this.minY - y, 0, y - this.maxY);
        let dz = Math.max(this.minZ - z, 0, z - this.maxZ);
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}

export default AABB;
