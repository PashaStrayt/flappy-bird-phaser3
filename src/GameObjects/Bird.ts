import Phaser from 'phaser';

import { assetsKeys, config } from "shared";

const ANIMATION_KEY = 'flying-bird';

export class Bird extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene) {
    super(scene, config.width / 2 - 90, config.height / 2 - 45, assetsKeys.bird);

    this.scale = 1.3;

    this.anims.create({
      key: ANIMATION_KEY,
      frames: this.anims.generateFrameNumbers(assetsKeys.bird, { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.play(ANIMATION_KEY);

    scene.add.existing(this);
  }

  public startFlying(): void {
    // Enable physics
    this.scene.physics.world.enable(this);
    this.setCollideWorldBounds(true);

    // Set gravity velocity
    this.setGravityY(380);

    // Make initial jump
    this.flap();
  }

  public flap(): void {
    // Set jump velocity
    this.setVelocityY(-320);

    // Rotate up
    if (this.angle > -26) {
      this.angle = -30;

      // const avaliableAngle: number = this.angle - 30;

      // if (avaliableAngle < -30) {
      //   this.angle = -30;
      // } else {
      //   this.angle = avaliableAngle;
      // }
    }
  }

  public fall(): void {
    // Rotate down, but not more than 90 degrees
    if (this.angle < 90) {
      this.angle += 0.9;
    }
  }

  public die(): void {
    this.scene.physics.world.disable(this);
    
    this.anims.stop();
  }
}