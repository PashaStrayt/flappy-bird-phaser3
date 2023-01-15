import Phaser from 'phaser';

import { assetsKeys, config } from "shared";

const ANIMATION_KEY = 'moving-ground';

export class Ground extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, config.height - 111, assetsKeys.ground);

    this.setOrigin(0);
    
    this.scene.physics.world.enable(this);
    this.setCollideWorldBounds(true);

    this.anims.create({
      key: ANIMATION_KEY,
      frames: this.anims.generateFrameNumbers(assetsKeys.ground, { start: 0, end: 2 }),
      frameRate: 30,
      repeat: -1
    });
    this.anims.play(ANIMATION_KEY);

    this.setDepth(1);
    this.scene.add.existing(this);
  }

  public startMoving(): void {
    if (!this.anims.isPlaying) {
      this.anims.play(ANIMATION_KEY);
    }
  }

  public stopMoving(): void {
    this.anims.stop();
  }
}