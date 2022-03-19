// Source: https://raw.githubusercontent.com/you21979/typescript-vector/master/vector3.ts
// This is an adjusted version of the Source
export interface Vec2 {
  x: number;
  y: number;
}

export class Vector2 implements Vec2 {
  public static create(v1: number | Vec2): Vector2 {
    if (typeof v1 === 'number') return new Vector2(v1, v1);
    return new Vector2(v1.x, v1.y);
  }

  /**
   * Creates a vector from an array of numbers
   * @param primitive An array of numbers (usually returned by a native)
   * @example ```ts
   * const entityPos = GetEntityCoords(entity)
   * const 2dEntityPos = Vector2.fromArray(entityPos[0], entityPos[1])
   * ```
   */
  public static fromArray(primitive: [number, number] | number[]): Vector2 {
    return new Vector2(primitive[0], primitive[1]);
  }

  /**
   * Creates an array of vectors from an array number arrays
   * @param primitives A multi-dimensional array of number arrays
   */
  public static fromArrays(primitives: [number, number][] | number[][]): Vector2[] {
    return primitives.map(prim => new Vector2(prim[0], prim[1]));
  }

  public static clone(v1: Vec2): Vector2 {
    return Vector2.create(v1);
  }

  public static add(v1: Vec2, v2: Vec2 | number): Vector2 {
    if (typeof v2 === 'number') return new Vector2(v1.x + v2, v1.y + v2);
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }

  public static subtract(v1: Vec2, v2: Vec2 | number): Vector2 {
    if (typeof v2 === 'number') return new Vector2(v1.x - v2, v1.y - v2);
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }

  public static multiply(v1: Vec2, v2: Vec2 | number): Vector2 {
    if (typeof v2 === 'number') return new Vector2(v1.x * v2, v1.y * v2);
    return new Vector2(v1.x * v2.x, v1.y * v2.y);
  }

  public static divide(v1: Vec2, v2: Vec2 | number): Vector2 {
    if (typeof v2 === 'number') return new Vector2(v1.x / v2, v1.y / v2);
    return new Vector2(v1.x / v2.x, v1.y / v2.y);
  }

  public static dotProduct(v1: Vec2, v2: Vec2): number {
    return v1.x * v2.x + v1.y * v2.y;
  }

  public static crossProduct(v1: Vec2, v2: Vec2): Vector2 {
    const x = v1.y * v2.x - v1.x * v2.y;
    const y = v1.x * v2.y - v1.x * v2.x;
    return new Vector2(x, y);
  }

  public static normalize(v: Vector2): Vector2 {
    return Vector2.divide(v, v.Length);
  }

  constructor(public x: number, public y: number) {}

  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * The product of the Euclidean magnitudes of this and another Vector3.
   *
   * @param v Vector3 to find Euclidean magnitude between.
   * @returns Euclidean magnitude with another vector.
   */
  public distanceSquared(v: Vec2): number {
    const w: Vector2 = this.subtract(v);
    return Vector2.dotProduct(w, w);
  }

  /**
   * The distance between two Vectors.
   *
   * @param v Vector3 to find distance between.
   * @returns Distance between this and another vector.
   */
  public distance(v: Vec2): number {
    return Math.sqrt(this.distanceSquared(v));
  }

  public get normalize(): Vector2 {
    return Vector2.normalize(this);
  }

  public crossProduct(v: Vec2): Vector2 {
    return Vector2.crossProduct(this, v);
  }

  public dotProduct(v: Vec2): number {
    return Vector2.dotProduct(this, v);
  }

  public add(v: Vec2 | number): Vec2 {
    return Vector2.add(this, v);
  }

  public subtract(v: Vec2 | number): Vector2 {
    return Vector2.subtract(this, v);
  }

  public multiply(v: Vec2 | number): Vector2 {
    return Vector2.multiply(this, v);
  }

  public divide(v: Vec2 | number): Vec2 {
    return Vector2.divide(this, v);
  }

  public toArray(): [number, number] {
    return [this.x, this.y];
  }

  public replace(v: Vec2): void {
    this.x = v.x;
    this.y = v.y;
  }

  public get Length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}
