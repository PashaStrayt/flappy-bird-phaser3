import Phaser from 'phaser';

import { Bird, EndingScreen, Ground, Pipe, StartingScreen } from 'GameObjects';
import { assetsKeys, config } from 'shared';

const MAX_BLOCKS_AMOUNT = 12;
const BLOCK_HEIGHT = 41;
const HOLE_HEIGHT_IN_BLOCKS = 4;

const FALL_DELAY = 400;
const PIPE_TRANSIT_TIME = 500;
const PIPE_CREATION_INTERVAL = 1400;
const PIPE_REMOVAL_INTERVAL = 8000;

const PIPE_VELOCITY = 200;

export class Game extends Phaser.Scene {
  private isGameOver: boolean;
  private isGameStarted: boolean;
  private isBirdFalling: boolean;
  private score!: number;
  private bestScore!: number;
  private lastHoleBlockIndex: number;

  private ground: Ground;
  private pipes: Phaser.Physics.Arcade.Group;
  private bird: Bird;
  private startingScreen: StartingScreen;
  private endingScreen: EndingScreen;
  private scoreText: Phaser.GameObjects.Text;

  private pipeCreator: Phaser.Time.TimerEvent;
  private pipeKiller: Phaser.Time.TimerEvent;
  private scoreUpdater: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: 'Game' });
  }

  public init(): void {
    this.isGameStarted = false;
    this.isGameOver = false;
    this.isBirdFalling = false;
    this.score = -2;
    this.bestScore = Number(localStorage.getItem('best-score'));
    this.lastHoleBlockIndex = 5;
  }

  public preload(): void {
    this.load.pack(
      "pack",
      "assets/pack.json",
      "pack"
    );
  }

  public create(): void {
    // Background
    const background = this.add.image(config.width / 2, config.height / 2, assetsKeys.background);
    background.setInteractive().on('pointerdown', this.pointerHandler.bind(this));

    // Ground
    this.ground = new Ground(this);

    // Pipes
    this.pipes = this.physics.add.group();

    // Bird
    this.bird = new Bird(this);

    // Starting screen
    this.startingScreen = new StartingScreen(this);

    // Ending screen
    this.endingScreen = new EndingScreen(this, this.bestScore);
    this.endingScreen.setVisible(false);

    // Score text
    this.scoreText = this.add.text(config.width / 2, 80, '0', {
      fontFamily: 'Digits',
      fontSize: '42px',
      stroke: '#000',
      strokeThickness: 6
    });
    this.scoreText.setOrigin(0.5).setDepth(1).setVisible(false);

    // Set collisions between bird, ground and pipes
    this.physics.add.collider(this.ground, this.bird).collideCallback = this.killGame.bind(this);
    this.physics.add.collider(this.pipes, this.bird).collideCallback = this.killGame.bind(this);
  }

  public update(): void {
    if (this.isGameStarted && !this.isGameOver && this.isBirdFalling) {
      this.bird.fall();
    }
  }

  private pointerHandler(): void {
    // Case of start game
    if (!this.isGameStarted && !this.isGameOver) {
      this.isGameStarted = true;
      this.isGameOver = false;

      this.startGame();
    }
    // Case where the game continues
    else if (this.isGameStarted && !this.isGameOver) {
      this.isBirdFalling = false;
      this.time.delayedCall(FALL_DELAY, () => this.isBirdFalling = true);

      this.bird.flap();
    }
  }

  private startGame(): void {
    this.startingScreen.setVisible(false);
    this.scoreText.setVisible(true);

    this.bird.startFlying();
    this.time.delayedCall(FALL_DELAY, () => this.isBirdFalling = true);

    this.pipeCreator = this.time.addEvent({
      delay: PIPE_CREATION_INTERVAL,
      startAt: PIPE_TRANSIT_TIME,
      callback: this.createPipe.bind(this, config.width),
      loop: true
    });

    this.pipeKiller = this.time.addEvent({
      delay: PIPE_REMOVAL_INTERVAL,
      callback: this.killPipe.bind(this),
      loop: true
    });

    this.scoreUpdater = this.time.addEvent({
      delay: PIPE_CREATION_INTERVAL,
      callback: this.incrementScore.bind(this),
      loop: true
    });
  }

  private killGame(): void {
    this.isBirdFalling = false;
    this.isGameOver = true;

    this.bird.die();
    this.ground.stopMoving();
    this.pipes.setVelocity(0, 0);

    this.pipeCreator.remove();
    this.pipeKiller.remove();
    this.scoreUpdater.remove();

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('best-score', String(this.score));
    }

    this.endingScreen.setVisible(true);
  }

  private createPipe(x: number): void {
    let holeBlockIndex: number;

    // Increment or decrement hole index relative to last value

    // Case where last hole was at top
    if (this.lastHoleBlockIndex === 1 + 1) {
      holeBlockIndex = ++this.lastHoleBlockIndex;
    }
    // Case where last hole was at bottom
    else if (this.lastHoleBlockIndex === MAX_BLOCKS_AMOUNT - HOLE_HEIGHT_IN_BLOCKS - 1) {
      holeBlockIndex = --this.lastHoleBlockIndex;
    }
    else {
      holeBlockIndex = Math.random() < 0.5 ? ++this.lastHoleBlockIndex : --this.lastHoleBlockIndex;
    }

    new Pipe(this, this.pipes, x, BLOCK_HEIGHT * holeBlockIndex, assetsKeys.pipes.upper, 'upper');
    new Pipe(this, this.pipes, x, BLOCK_HEIGHT * (holeBlockIndex + HOLE_HEIGHT_IN_BLOCKS), assetsKeys.pipes.lower, 'lower');

    this.pipes.setVelocityX(-PIPE_VELOCITY);
  }

  private killPipe(): void {
    const upperPipe = this.pipes.getChildren()[0];
    const lowerPipe = this.pipes.getChildren()[1];

    upperPipe.destroy();
    lowerPipe.destroy();
  }

  private incrementScore(): void {
    this.score++;

    if (this.score > 0) {
      this.scoreText.setText(String(this.score));
    }
  }
}