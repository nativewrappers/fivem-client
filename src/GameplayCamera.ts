import { Vector3 } from './utils';

/**
 * The current rendering gameplay camera
 */
export abstract class GameplayCamera {
  /**
   * Get the world position of gameplay camera.
   */
  public static get Position(): Vector3 {
    return Vector3.fromArray(GetGameplayCamCoords());
  }

  /**
   * Get the rotation of gameplay camera.
   */
  public static get Rotation(): Vector3 {
    return Vector3.fromArray(GetGameplayCamRot(2));
  }

  /**
   * Get the forward vector of gameplay camera.
   */
  public static get ForwardVector(): Vector3 {
    const rotation = Vector3.multiply(this.Rotation, Math.PI / 180);
    return Vector3.normalize(
      new Vector3(
        -Math.sin(rotation.z) * Math.abs(Math.cos(rotation.x)),
        Math.cos(rotation.z) * Math.abs(Math.cos(rotation.x)),
        Math.sin(rotation.x),
      ),
    );
  }

  /**
   * Get the pitch of the gameplay camera relative to player.
   */
  public static get RelativePitch(): number {
    return GetGameplayCamRelativePitch();
  }

  /**
   * Set gameplay camera pitch relative to player.
   */
  public static set RelativePitch(pitch: number) {
    SetGameplayCamRelativePitch(pitch, 1);
  }

  /**
   * Get heading of gameplay camera.
   */
  public static get RelativeHeading(): number {
    return GetGameplayCamRelativeHeading();
  }

  /**
   * Get heading of gameplay camera.
   */
  public static set RelativeHeading(heading: number) {
    SetGameplayCamRelativeHeading(heading);
  }
}
