import { Prop, Vehicle, Entity, Model, Color } from '..';
import { Ped } from './';

export class Player {
  private handle: number;
  private ped: Ped | undefined;
  private pvp = false;

  public static fromPedHandle(handle: number): Player {
    return new Player(NetworkGetPlayerIndexFromPed(handle));
  }

  public static fromServerId(serverId: number): Player {
    return new Player(GetPlayerFromServerId(serverId));
  }

  /**
   * @param handle the player handle, or if on the server, their source.
   */
  constructor(handle: number) {
    this.handle = handle;
    if (!IsDuplicityVersion()) {
      this.PvPEnabled = true;
    }
  }

  public get Handle(): number {
    return this.handle;
  }

  /**
   * This is here for compatibility with older versions.
   */
  public get Character(): Ped {
    return this.Ped;
  }

  public get Ped(): Ped {
    const handle = GetPlayerPed(this.handle);

    if (typeof this.ped === 'undefined' || handle !== this.ped.Handle) {
      this.ped = new Ped(handle);
    }

    return this.ped;
  }

  public get ServerId(): number {
    return GetPlayerServerId(this.handle);
  }

  public get Name(): string {
    return GetPlayerName(this.handle);
  }

  public get PvPEnabled(): boolean {
    return this.pvp;
  }

  public set PvPEnabled(value: boolean) {
    NetworkSetFriendlyFireOption(value);
    SetCanAttackFriendly(this.Character.Handle, value, value);
    this.pvp = value;
  }

  public get IsDead(): boolean {
    return IsPlayerDead(this.handle);
  }

  // Should this even be here?
  // public set DisableFiring(value: boolean) {
  //   DisablePlayerFiring(this.handle, value);
  // }

  public get EntityPlayerIsAimingAt(): Ped | Vehicle | Prop | null {
    const [entityHit, entity] = GetEntityPlayerIsFreeAimingAt(this.handle);
    if (entityHit) {
      return Entity.fromHandle(entity);
    }
    return null;
  }

  public get StealthNoise(): number {
    return GetPlayerCurrentStealthNoise(this.handle);
  }

  public get FakeWantedLevel(): number {
    return GetPlayerFakeWantedLevel(this.handle);
  }

  public get PlayerGroup(): number {
    return GetPlayerGroup(this.handle);
  }

  public get HasReserveParachute(): boolean {
    return GetPlayerHasReserveParachute(this.handle);
  }

  public get HealthRechargeLimit(): number {
    return GetPlayerHealthRechargeLimit(this.handle);
  }

  public get IsInvincible(): boolean {
    if (IsDuplicityVersion()) {
      return GetPlayerInvincible(this.handle);
    } else {
      return GetPlayerInvincible_2(this.handle);
    }
  }

  public get MaxArmor(): number {
    return GetPlayerMaxArmour(this.handle);
  }

  public get ParachuteModelOverride(): Model {
    return new Model(GetPlayerParachuteModelOverride(this.handle));
  }

  public get ParachutePackTintIndex(): number {
    return GetPlayerParachutePackTintIndex(this.handle);
  }

  public get ParachuteTintIndex(): number {
    return GetPlayerParachuteTintIndex(this.handle);
  }

  public get ParachuteColorTrailColor(): Color {
    return Color.fromArray(GetPlayerParachuteSmokeTrailColor(this.handle));
  }

  public get ReserveParachuteModelOverride(): Model {
    return new Model(GetPlayerReserveParachuteModelOverride(this.handle));
  }

  public get ReserveParachuteTintIndex(): number {
    return GetPlayerReserveParachuteTintIndex(this.handle);
  }

  public get PlayerRgbColour(): Color {
    return Color.fromArray(GetPlayerRgbColour(this.handle));
  }

  public get Stamina(): number {
    return GetPlayerSprintStaminaRemaining(this.handle);
  }

  public get SprintTimeRemaining(): number {
    return GetPlayerSprintStaminaRemaining(this.handle);
  }

  /**
   * The players melee target?
   */
  public get TargetEntity(): Ped | Vehicle | Prop | null {
    const [entityHit, entity] = GetPlayerTargetEntity(this.handle);
    if (entityHit) {
      return Entity.fromHandle(entity);
    }

    return null;
  }

  public get Team(): number {
    return GetPlayerTeam(this.handle);
  }

  // GetPlayerUnderwaterTimeRemaining

  public CanPedHearPlayer(ped: Ped): boolean {
    return CanPedHearPlayer(this.handle, ped.Handle);
  }
}
