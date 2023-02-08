import { Vec3 } from "vec3";
function lerp(f: number, f2: number, f3: number) {
  return f2 + f * (f3 - f2);
}

// type RobPointsArrayFuckYou = [minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number]
type AABBPoints = [minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number];
type MinAndMaxPoints = [min: [x: number, y: number, z: number], max: [x: number, y: number, z: number]];
type Vec3AABB = [min: Vec3, max: Vec3];

const emptyVec = new Vec3(0, 0, 0)

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

  static fromBlock(min: Vec3) {
    return new AABB(min.x, min.y, min.z, min.x + 1.0, min.y + 1.0, min.z + 1.0);
  }


  static fromShape(pts: AABBPoints, offset = emptyVec) {
    return new AABB(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]).offsetVec(offset)
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

  minPoint(): Vec3 {
    return new Vec3(this.minX, this.minY, this.minZ);
  }

  maxPoint(): Vec3 {
    return new Vec3(this.maxX, this.maxY, this.maxZ);
  }

  bottomMiddlePoint(): Vec3 {
    return new Vec3(lerp(0.5, this.minX, this.maxX), this.minY, lerp(0.5, this.minZ, this.maxZ));
  }

  heightAndWidths(): Vec3 {
    return new Vec3(this.maxX - this.minX, this.maxY - this.minY, this.maxZ - this.minZ);
  }

  toArray(): AABBPoints {
    return [this.minX, this.minY, this.minZ, this.maxX, this.maxY, this.maxZ];
  }

  minAndMaxArrays(): MinAndMaxPoints {
    return [
      [this.minX, this.minY, this.minZ],
      [this.maxX, this.maxY, this.maxZ],
    ];
  }

  toVecs(): Vec3AABB {
    return [new Vec3(this.minX, this.minY, this.minZ), new Vec3(this.maxX, this.maxY, this.maxZ)];
  }

  /**
   * Compatible with Iterators from prismarine-world.
   * Used like a block for prismarine-world.
   * @returns {number[][]} single element long array of shapes.
   */
  toShapeFromMin(): AABBPoints[] {
    return [[0, 0, 0, this.maxX - this.minX, this.maxY - this.minY, this.maxZ - this.minZ]];
  }

  /**
   * Compatible with Iterators from prismarine-world.
   * Used with the entity's actual position for prismarine-world.
   * @returns {number[][]} single element long array of shapes.
   */
  toShapeFromBottomMiddle(): AABBPoints[] {
    const wx = lerp(0.5, this.minX, this.maxX);
    const wz = lerp(0.5, this.minX, this.maxX);
    return [[-wx, 0, -wz, wx, this.maxY - this.minY, wz]];
  }

  toVertices() {
    return [
      new Vec3(this.minX, this.minY, this.minZ),
      new Vec3(this.minX, this.minY, this.maxZ),
      new Vec3(this.minX, this.maxY, this.minZ),
      new Vec3(this.minX, this.maxY, this.maxZ),
      new Vec3(this.maxX, this.minY, this.minZ),
      new Vec3(this.maxX, this.minY, this.maxZ),
      new Vec3(this.maxX, this.maxY, this.minZ),
      new Vec3(this.maxX, this.maxY, this.maxZ),
    ];
  }

  floor() {
    this.minX = Math.floor(this.minX);
    this.minY = Math.floor(this.minY);
    this.minZ = Math.floor(this.minZ);
    this.maxX = Math.floor(this.maxX);
    this.maxY = Math.floor(this.maxY);
    this.maxZ = Math.floor(this.maxZ);
    return this;
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
  offsetVec(vec: Vec3) {
    this.minX += vec.x;
    this.minY += vec.y;
    this.minZ += vec.z;
    this.maxX += vec.x;
    this.maxY += vec.y;
    this.maxZ += vec.z;
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

  xzIntersectsRay(org: Vec3, dir: Vec3): { x: number; z: number } | null {
    const d = this.distanceFromRay(org, dir, true);
    return d === Infinity ? null : { x: org.x + dir.x * d, z: org.z + dir.z * d };
  }

  intersectsRay(org: Vec3, dir: Vec3) {
    const d = this.distanceFromRay(org, dir);
    return d === Infinity ? null : new Vec3(org.x + dir.x * d, org.y + dir.y * d, org.z + dir.z * d);
  }

  //TODO: Better check for hit reg of PLANES.
  xzIntersectsSegment(org: Vec3, dest: Vec3): { x: number; z: number } | null {
    const dir = dest.clone().subtract(org).normalize();
    const d = this.distanceFromRay(org, dir, true);
    return d > dest.distanceTo(org) || d < 0 ? null : { x: org.x + dir.x * d, z: org.z + dir.z * d };
  }

  //TODO: Better check for hit reg of PLANES.
  intersectsSegment(org: Vec3, dest: Vec3) {
    const dir = dest.clone().subtract(org).normalize();
    const d = this.distanceFromRay(org, dir);
    return d > dest.distanceTo(org) || d < 0 ? null : new Vec3(org.x + dir.x * d, org.y + dir.y * d, org.z + dir.z * d);
  }

  distanceFromRay(origin: Vec3, direction: Vec3, xz: boolean = false) {
    const ro = origin.toArray();
    const rd = direction.clone().normalize().toArray();
    const aabb = this.minAndMaxArrays();
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

  public intersect(aABB: AABB) {
    const d = Math.max(this.minX, aABB.minX);
    const d2 = Math.max(this.minY, aABB.minY);
    const d3 = Math.max(this.minZ, aABB.minZ);
    const d4 = Math.min(this.maxX, aABB.maxX);
    const d5 = Math.min(this.maxY, aABB.maxY);
    const d6 = Math.min(this.maxZ, aABB.maxZ);
    return new AABB(d, d2, d3, d4, d5, d6);
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

  xzDistanceToVec(pos: Vec3): number {
    let dx = Math.max(this.minX - pos.x, 0, pos.x - this.maxX);
    let dz = Math.max(this.minZ - pos.z, 0, pos.z - this.maxZ);
    return Math.sqrt(dx * dx + dz * dz);
  }

  distanceToVec(pos: Vec3): number {
    let dx = Math.max(this.minX - pos.x, 0, pos.x - this.maxX);
    let dy = Math.max(this.minY - pos.y, 0, pos.y - this.maxY);
    let dz = Math.max(this.minZ - pos.z, 0, pos.z - this.maxZ);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  public expandTowards(vec3: Vec3): AABB {
    return this.expandTowardsCoords(vec3.x, vec3.y, vec3.z);
  }

  public expandTowardsCoords(d: number, d2: number, d3: number): AABB {
    let d4 = this.minX;
    let d5 = this.minY;
    let d6 = this.minZ;
    let d7 = this.maxX;
    let d8 = this.maxY;
    let d9 = this.maxZ;
    if (d < 0.0) {
      d4 += d;
    } else if (d > 0.0) {
      d7 += d;
    }
    if (d2 < 0.0) {
      d5 += d2;
    } else if (d2 > 0.0) {
      d8 += d2;
    }
    if (d3 < 0.0) {
      d6 += d3;
    } else if (d3 > 0.0) {
      d9 += d3;
    }
    return new AABB(d4, d5, d6, d7, d8, d9);
  }

  public moveCoords(d: number, d2: number, d3: number): AABB {
    return new AABB(this.minX + d, this.minY + d2, this.minZ + d3, this.maxX + d, this.maxY + d2, this.maxZ + d3);
  }

  public move(vec3: Vec3): AABB {
    return new AABB(
      this.minX + vec3.x,
      this.minY + vec3.y,
      this.minZ + vec3.z,
      this.maxX + vec3.x,
      this.maxY + vec3.y,
      this.maxZ + vec3.z
    );
  }

  public intersectsCoords(d: number, d2: number, d3: number, d4: number, d5: number, d6: number): boolean {
    return this.minX < d4 && this.maxX > d && this.minY < d5 && this.maxY > d2 && this.minZ < d6 && this.maxZ > d3;
  }

  public collidesAABB(aABB: AABB): boolean {
    return this.collidesCoords(aABB.minX, aABB.minY, aABB.minZ, aABB.maxX, aABB.maxY, aABB.maxZ);
  }

  public collidesCoords(d: number, d2: number, d3: number, d4: number, d5: number, d6: number): boolean {
    return (
      this.minX <= d4 && this.maxX >= d && this.minY <= d5 && this.maxY >= d2 && this.minZ <= d6 && this.maxZ >= d3
    );
  }

  public getCenter(): Vec3 {
    return new Vec3(lerp(0.5, this.minX, this.maxX), lerp(0.5, this.minY, this.maxY), lerp(0.5, this.minZ, this.maxZ));
  }
}

export default AABB;
