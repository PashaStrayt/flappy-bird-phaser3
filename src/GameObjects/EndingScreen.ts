import Phaser from 'phaser';

import { assetsKeys, config } from "shared";

export class EndingScreen extends Phaser.Physics.Arcade.Group {
  private gameOverText: Phaser.GameObjects.Text;
  private bestScoreText: Phaser.GameObjects.Text;
  private restartButton: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, bestScore: number) {
    super(scene.physics.world, scene, { allowGravity: false });

    // Game over
    this.gameOverText = new Phaser.GameObjects.Text(scene, config.width / 2, 200, 'GAME OVER', {
      fontFamily: 'Flappy Bird Regular',
      fontSize: '72px',
      color: '#FCA048',
      shadow: {
        offsetX: 6,
        offsetY: 6,
        color: '#000',
        stroke: true
      },
      stroke: '#FFF',
      strokeThickness: 5,
    });
    this.gameOverText.setOrigin(0.5);
    this.add(this.gameOverText, true);

    // Best score
    this.bestScoreText = new Phaser.GameObjects.Text(scene, config.width / 2, 268, `BEST LAST SCORE ${bestScore}`, {
      fontFamily: 'Digits',
      fontSize: '34px',
      stroke: '#000',
      strokeThickness: 6
    });
    this.bestScoreText.setOrigin(0.5);
    this.add(this.bestScoreText, true);

    // Restart button
    this.restartButton = this.create(config.width / 2, 360, assetsKeys.restartButton);
    this.restartButton.scale = 1.2;
    this.restartButton.setInteractive().on('pointerdown', () => scene.scene.restart());

    this.setDepth(1);
    scene.add.existing(this);
  }
}