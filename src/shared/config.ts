import { Game } from "Game";

export const config = {
  width: 1024,
  height: 600,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  type: Phaser.AUTO,
  parent: 'app',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      // debug: true
    }
  },
  scene: [Game]
};