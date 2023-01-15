import Phaser from 'phaser';

import { config } from "shared";

export class StartingScreen extends Phaser.Physics.Arcade.Group {
  private title: Phaser.GameObjects.Text;
  private message: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene, { allowGravity: false });

    // Title
    this.title = new Phaser.GameObjects.Text(scene, config.width / 2, 42, 'flappyBird', {
      fontFamily: 'Flappy Bird Regular',
      fontSize: '72px',
      shadow: {
        offsetX: 0,
        offsetY: 6,
        color: '#543847',
        fill: true
      },
      stroke: '#543847',
      strokeThickness: 5
    });
    this.title.setOrigin(0.5);
    this.add(this.title, true);

    // Message
    this.message = new Phaser.GameObjects.Text(scene, config.width / 2, 160, 'Get Ready!', {
      fontFamily: 'Flappy Bird Regular',
      fontSize: '72px',
      color: '#58D858',
      shadow: {
        offsetX: 6,
        offsetY: 6,
        color: '#000',
        stroke: true
      },
      stroke: '#FFF',
      strokeThickness: 5,
    });
    this.message.setOrigin(0.5);
    this.add(this.message, true);

    // Control hint
    this.create(config.width / 2 + 28, 278, 'control-hint');

    scene.add.existing(this);
  }
}