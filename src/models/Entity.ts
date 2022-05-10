import { Blip } from '../Blip';
import { ForceType } from '../enums';
import { Game } from '../Game';
import { MaterialHash, WeaponHash } from '../hashes';
import { Model } from '../Model';
import { Quaternion, Vector3 } from '../utils';
import { EntityBoneCollection, Ped, Prop, Vehicle } from './';
import { EntityBone } from './EntityBone';
import cfx, { StateBagChangeHandler } from '../cfx';

export class Entity {
  public static fromHandle(handle: number): Ped | Vehicle | Prop | null {
    switch (GetEntityType(handle)) {
      case 1:
        return new Ped(handle);
      case 2:
        return new Vehicle(handle);
      case 3:
        return new Prop(handle);
      default:
        return null;
    }
  }

  public static fromNetworkId(networkId: number): Ped | Vehicle | Prop | null {
    return this.fromHandle(NetworkGetEntityFromNetworkId(networkId));
  }

  protected handle: number;
  protected bones: EntityBoneCollection | undefined;
  protected stateBagCookies: number[] = [];

  constructor(handle: number) {
    this.handle = handle;
  }

  public get Handle(): number {
    return this.handle;
  }

  /**
   * @returns if the entity is a networked entity or local entity
   */
  public get IsNetworked(): boolean {
    return NetworkGetEntityIsNetworked(this.handle);
  }

  public set IsNetworked(networked: boolean) {
    if (networked) {
      NetworkRegisterEntityAsNetworked(this.handle);
    } else {
      NetworkUnregisterNetworkedEntity(this.handle);
    }
  }

  public get NetworkId(): number {
    return NetworkGetNetworkIdFromEntity(this.handle);
  }

  public get State(): StateBagInterface {
    return cfx.Entity(this.handle).state;
  }

  public AddStateBagChangeHandler(
    keyFilter: string | null,
    handler: StateBagChangeHandler,
  ): number {
    const stateBagName = this.IsNetworked
      ? `entity:${this.NetworkId}`
      : `localEntity:${this.handle}`;
    // keyFilter is casted to any because it can take a null value.
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const cookie = AddStateBagChangeHandler(keyFilter as any, stateBagName, handler);
    this.stateBagCookies.push(cookie);
    return cookie;
  }

  /**
   * A short hand function for AddStateBagChangeHandler, this gets automatically cleaned up on entity deletion.
   * @param keyFilter the key to filter for or null
   * @param handler the function to handle the change
   * @returns a cookie to be used in RemoveStateBagChangeHandler
   */
  public listenForStateChange(keyFilter: string | null, handler: StateBagChangeHandler): number {
    return this.AddStateBagChangeHandler(keyFilter, handler);
  }

  public removeStateListener(tgtCookie: number): void {
    this.stateBagCookies = this.stateBagCookies.filter(cookie => {
      const isCookie = cookie == tgtCookie;
      if (isCookie) RemoveStateBagChangeHandler(cookie);
      return isCookie;
    });
  }

  public get Health(): number {
    return GetEntityHealth(this.handle);
  }

  public set Health(amount: number) {
    SetEntityHealth(this.handle, amount);
  }

  public get MaxHealth(): number {
    return GetEntityMaxHealth(this.handle);
  }

  public set MaxHealth(amount: number) {
    SetEntityMaxHealth(this.handle, amount);
  }

  public set IsDead(value: boolean) {
    if (value) {
      SetEntityHealth(this.handle, 0);
    } else {
      SetEntityHealth(this.handle, 200);
    }
  }

  public get IsDead(): boolean {
    return IsEntityDead(this.handle);
  }

  public get IsAlive(): boolean {
    return !IsEntityDead(this.handle);
  }

  /**
   * @deprecated use [[IsDead]] instead
   */
  public isDead(): boolean {
    return IsEntityDead(this.handle);
  }

  /**
   * @deprecated use [[IsAlive]] instead
   */
  public isAlive(): boolean {
    return !this.isDead();
  }

  public get Model(): Model {
    return new Model(GetEntityModel(this.handle));
  }

  /**
   * Returns if the entity is set as a mission entity and will not be cleaned up by the engine
   */
  public get IsMissionEntity(): boolean {
    return IsEntityAMissionEntity(this.handle);
  }

  /**
   * Sets if the entity is a mission entity and will not be cleaned up by the engine
   */
  public set IsMissionEntity(value: boolean) {
    if (value) {
      SetEntityAsMissionEntity(this.handle, false, false);
    } else {
      SetEntityAsNoLongerNeeded(this.handle);
    }
  }

  public get Position(): Vector3 {
    const coords = GetEntityCoords(this.handle, false);
    return new Vector3(coords[0], coords[1], coords[2]);
  }

  public set Position(position: Vector3) {
    SetEntityCoords(this.handle, position.x, position.y, position.z, false, false, false, true);
  }

  public set PositionNoOffset(position: Vector3) {
    SetEntityCoordsNoOffset(this.handle, position.x, position.y, position.z, true, true, true);
  }

  public get Rotation(): Vector3 {
    const rotation = GetEntityRotation(this.handle, 2);
    return new Vector3(rotation[0], rotation[1], rotation[2]);
  }

  public set Rotation(rotation: Vector3) {
    SetEntityRotation(this.handle, rotation.x, rotation.y, rotation.z, 2, true);
  }

  public get Quaternion(): Quaternion {
    const quaternion = GetEntityQuaternion(this.handle);
    return new Quaternion(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
  }

  public set Quaternion(quaternion: Quaternion) {
    SetEntityQuaternion(this.handle, quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  }

  public get Heading(): number {
    return GetEntityHeading(this.handle);
  }

  public set Heading(heading: number) {
    SetEntityHeading(this.handle, heading);
  }

  public get IsPositionFrozen(): boolean {
    return IsEntityPositionFrozen(this.handle);
  }

  public set IsPositionFrozen(value: boolean) {
    FreezeEntityPosition(this.handle, value);
  }

  public get Velocity(): Vector3 {
    const velocity = GetEntityVelocity(this.handle);
    return new Vector3(velocity[0], velocity[1], velocity[2]);
  }

  public set Velocity(velocity: Vector3) {
    SetEntityVelocity(this.handle, velocity.x, velocity.y, velocity.z);
  }

  public get RotationVelocity(): Vector3 {
    const velocity = GetEntityRotationVelocity(this.handle);
    return new Vector3(velocity[0], velocity[1], velocity[2]);
  }

  public set MaxSpeed(value: number) {
    SetEntityMaxSpeed(this.handle, value);
  }

  public set HasGravity(value: boolean) {
    SetEntityHasGravity(this.handle, value);
  }

  public get HeightAboveGround(): number {
    return GetEntityHeightAboveGround(this.handle);
  }

  public get SubmersionLevel(): number {
    return GetEntitySubmergedLevel(this.handle);
  }

  public get LodDistance(): number {
    return GetEntityLodDist(this.handle);
  }

  public set LodDistance(value: number) {
    SetEntityLodDist(this.handle, value);
  }

  public get IsVisible(): boolean {
    return IsEntityVisible(this.handle);
  }

  public set IsVisible(value: boolean) {
    SetEntityVisible(this.handle, value, false);
  }

  public get IsOccluded(): boolean {
    return IsEntityOccluded(this.handle);
  }

  public get IsOnScreen(): boolean {
    return IsEntityOnScreen(this.handle);
  }

  public get IsUpright(): boolean {
    return IsEntityUpright(this.handle, 0);
  }

  public get IsUpsideDown(): boolean {
    return IsEntityUpsidedown(this.handle);
  }

  public get IsInAir(): boolean {
    return IsEntityInAir(this.handle);
  }

  public get IsInWater(): boolean {
    return IsEntityInWater(this.handle);
  }

  /**
   * @deprecated use [[IsMissionEntity]] instead as its more obvious as what it does
   */
  public get IsPersistent(): boolean {
    return IsEntityAMissionEntity(this.handle);
  }

  /**
   * @deprecated use [[IsMissionEntity]] instead as its more obvious as what it does
   */
  public set IsPersistent(value: boolean) {
    if (value) {
      SetEntityAsMissionEntity(this.handle, true, false);
    } else {
      SetEntityAsNoLongerNeeded(this.handle);
    }
  }

  public get IsOnFire(): boolean {
    return IsEntityOnFire(this.handle);
  }

  public set IsInvincible(value: boolean) {
    SetEntityInvincible(this.handle, value);
  }

  public set IsOnlyDamagedByPlayer(value: boolean) {
    SetEntityOnlyDamagedByPlayer(this.handle, value);
  }

  public get Opacity(): number {
    return GetEntityAlpha(this.handle);
  }

  /**
   * Sets how transparent an entity is, if you want to reset the alpha level use [[resetOpacity]] instead;
   */
  public set Opacity(value: number) {
    SetEntityAlpha(this.handle, value, false);
  }

  public resetOpacity(): void {
    ResetEntityAlpha(this.handle);
  }

  public get HasCollided(): boolean {
    return HasEntityCollidedWithAnything(this.handle);
  }

  public get MaterialCollidingWith(): MaterialHash {
    return GetLastMaterialHitByEntity(this.handle);
  }

  public get IsCollisionEnabled(): boolean {
    return !GetEntityCollisonDisabled(this.handle);
  }

  public set IsCollisionEnabled(value: boolean) {
    SetEntityCollision(this.handle, value, false);
  }

  public set IsRecordingCollisions(value: boolean) {
    SetEntityRecordsCollisions(this.handle, value);
  }

  public get Bones(): EntityBoneCollection {
    if (!this.bones) {
      this.bones = new EntityBoneCollection(this);
    }
    return this.bones;
  }

  public get AttachedBlip(): Blip | null {
    const handle: number = GetBlipFromEntity(this.handle);

    if (DoesBlipExist(handle)) {
      return new Blip(handle);
    }

    return null;
  }

  public attachBlip(): Blip {
    return new Blip(AddBlipForEntity(this.handle));
  }

  public setNoCollision(entity: Entity, toggle: boolean): void {
    SetEntityNoCollisionEntity(this.handle, entity.Handle, toggle);
  }

  public hasClearLosToEntity(entity: Entity, traceType = 17): boolean {
    return HasEntityClearLosToEntity(this.handle, entity.Handle, traceType);
  }

  public hasClearLosToEntityInFront(entity: Entity): boolean {
    return HasEntityClearLosToEntityInFront(this.handle, entity.Handle);
  }

  public hasBeenDamagedBy(entity: Entity): boolean {
    return HasEntityBeenDamagedByEntity(this.handle, entity.Handle, true);
  }

  public hasBeenDamagedByWeapon(weapon: WeaponHash): boolean {
    return HasEntityBeenDamagedByWeapon(this.handle, Number(weapon), 0);
  }

  public hasBeenDamagedByAnyWeapon(): boolean {
    return HasEntityBeenDamagedByWeapon(this.handle, 0, 2);
  }

  public hasBeenDamagedByAnyMeleeWeapon(): boolean {
    return HasEntityBeenDamagedByWeapon(this.handle, 0, 1);
  }

  public clearLastWeaponDamage(): void {
    ClearEntityLastWeaponDamage(this.handle);
  }

  public isInArea(minBounds: Vector3, maxBounds: Vector3): boolean {
    return IsEntityInArea(
      this.handle,
      minBounds.x,
      minBounds.y,
      minBounds.z,
      maxBounds.x,
      maxBounds.y,
      maxBounds.z,
      false,
      false,
      0,
    );
  }

  public isInAngledArea(origin: Vector3, edge: Vector3, angle: number): boolean {
    return IsEntityInAngledArea(
      this.handle,
      origin.x,
      origin.y,
      origin.z,
      edge.x,
      edge.y,
      edge.z,
      angle,
      false,
      true,
      0,
    );
  }

  public isInRangeOf(position: Vector3, range: number): boolean {
    const v = Vector3.subtract(this.Position, position);

    return v.dotProduct(v) < range * range;
  }

  public isNearEntity(entity: Entity, bounds: Vector3): boolean {
    return IsEntityAtEntity(
      this.handle,
      entity.Handle,
      bounds.x,
      bounds.y,
      bounds.z,
      false,
      true,
      0,
    );
  }

  public isTouching(entity: Entity): boolean {
    return IsEntityTouchingEntity(this.handle, entity.Handle);
  }

  public isTouchingModel(model: Model): boolean {
    return IsEntityTouchingModel(this.handle, model.Hash);
  }

  public getOffsetPosition(offset: Vector3): Vector3 {
    const o = GetOffsetFromEntityInWorldCoords(this.handle, offset.x, offset.y, offset.z);

    return new Vector3(o[0], o[1], o[2]);
  }

  public getPositionOffset(worldCoords: Vector3): Vector3 {
    const o = GetOffsetFromEntityGivenWorldCoords(
      this.handle,
      worldCoords.x,
      worldCoords.y,
      worldCoords.z,
    );

    return new Vector3(o[0], o[1], o[2]);
  }

  public attachTo(
    entity: Entity,
    position: Vector3,
    rotation: Vector3,
    collisions = false,
    unk9 = true,
    useSoftPinning = true,
    rotationOrder = 1,
  ): void {
    if (this.handle == entity.Handle) {
      throw new Error(
        'You cannot attach an entity to the same entity this will result in a crash!',
      );
    }
    AttachEntityToEntity(
      this.handle,
      entity.Handle,
      -1,
      position.x,
      position.y,
      position.z,
      rotation.x,
      rotation.y,
      rotation.z,
      unk9,
      useSoftPinning,
      collisions,
      IsEntityAPed(entity.Handle),
      rotationOrder,
      true,
    );
  }

  /*
   * Attaches an entity to another entity via a bone
   * @example
   * ```typescript
   * const ply = Game.PlayerPed;
   * const bag = await World.createProp(new Model('ba_prop_battle_bag_01b'), ply.Position, true, true, true);
   * bag.attachToBone(
   *     ply.Bones.getBone(64113),
   *     new Vector3(0.12, -0.25, 0.0),
   *     new Vector3(105.0, 50.0, 190.0)
   * )
   * ```
   */
  public attachToBone(
    entityBone: EntityBone,
    position: Vector3,
    rotation: Vector3,
    collisions = false,
    unk9 = true,
    useSoftPinning = true,
    rotationOrder = 1,
  ): void {
    if (this.handle == entityBone.Owner.Handle) {
      throw new Error(
        'You cannot attach an entity to the same entity this will result in a crash!',
      );
    }
    AttachEntityToEntity(
      this.handle,
      entityBone.Owner.Handle,
      entityBone.Index,
      position.x,
      position.y,
      position.z,
      rotation.x,
      rotation.y,
      rotation.z,
      unk9,
      useSoftPinning,
      collisions,
      IsEntityAPed(entityBone.Owner.Handle),
      rotationOrder,
      true,
    );
  }

  public detach(): void {
    DetachEntity(this.handle, true, true);
  }

  public isAttached(): boolean {
    return IsEntityAttached(this.handle);
  }

  public isAttachedTo(entity: Entity): boolean {
    return IsEntityAttachedToEntity(this.handle, entity.Handle);
  }

  public getEntityAttachedTo(): Ped | Vehicle | Prop | null {
    return Entity.fromHandle(GetEntityAttachedTo(this.handle));
  }

  public applyForce(
    direction: Vector3,
    rotation: Vector3,
    forceType: ForceType = ForceType.MaxForceRot2,
  ): void {
    ApplyForceToEntity(
      this.handle,
      Number(forceType),
      direction.x,
      direction.y,
      direction.z,
      rotation.x,
      rotation.y,
      rotation.z,
      0,
      false,
      true,
      true,
      false,
      true,
    );
  }

  public applyForceRelative(
    direction: Vector3,
    rotation: Vector3,
    forceType: ForceType = ForceType.MaxForceRot2,
  ): void {
    ApplyForceToEntity(
      this.handle,
      Number(forceType),
      direction.x,
      direction.y,
      direction.z,
      rotation.x,
      rotation.y,
      rotation.z,
      0,
      true,
      true,
      true,
      false,
      true,
    );
  }

  /**
   * Removes all particle effects from the entity
   */
  public removePtfxEffects(): void {
    RemoveParticleFxFromEntity(this.handle);
  }

  public removeAllParticleEffects(): void {
    this.removePtfxEffects();
  }

  public exists(): boolean {
    return DoesEntityExist(this.handle) ? true : false;
  }

  public delete(): void {
    if (this.handle !== Game.PlayerPed.Handle) {
      this.IsMissionEntity = true;
      DeleteEntity(this.handle);
      for (const cookie of this.stateBagCookies) {
        RemoveStateBagChangeHandler(cookie);
      }
    }
  }

  /**
   * @deprecated use [[IsMissionEntity]] setter as false instead.
   */
  public markAsNoLongerNeeded(): void {
    SetEntityAsNoLongerNeeded(this.Handle);
  }
}
