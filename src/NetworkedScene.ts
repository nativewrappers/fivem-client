import type { Vector3 } from ".";
export class NetworkedScene {
	private scene = 0;
	constructor(
		pos: Vector3,
		rot: Vector3,
		rotationOrder: number,
		holdLastFrame: boolean,
		looped: boolean,
		sceneHash: number,
		animTime: number,
		animSpeed: number,
	) {
		this.scene = NetworkCreateSynchronisedScene(
			pos.x,
			pos.y,
			pos.z,
			rot.x,
			rot.y,
			rot.z,
			rotationOrder,
			holdLastFrame,
			looped,
			sceneHash,
			animTime + 0.0,
			animSpeed + 0.0,
		);
	}
}
