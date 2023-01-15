import Phaser from 'phaser';

export class Pipe extends Phaser.Physics.Arcade.Image {
  constructor(
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.Group,
    x: number,
    y: number,
    key: string,
    orientation: 'upper' | 'lower'
  ) {
    super(scene, x, y, key);

    this.scale = 1.4;
    
    if (orientation === 'upper') {
      // Set origin to bottom left corner
      this.setOrigin(0, 1);
    } else if (orientation === 'lower') {
      // Set origin to top left corner
      this.setOrigin(0);
    }

    group.add(this);
    this.scene.add.existing(this);

    (this.body as Phaser.Physics.Arcade.Body).allowGravity = false;
  }
}