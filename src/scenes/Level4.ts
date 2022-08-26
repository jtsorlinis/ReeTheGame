import Phaser from "phaser";

function varyNum(value: number, percent: number) {
  let res = Math.random() * (2 * (percent / 100)) + (1 - percent / 100);
  return value * res;
}

export default class Level4 extends Phaser.Scene {
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  keySpace!: Phaser.Input.Keyboard.Key;
  gravity = 2;
  jumpHeight = 700;
  jumpHold = 150;
  jumpTimer = 0;
  grounded = false;
  spawnTimer = 0;
  spawnDelay!: number;
  monsterSpeed!: number;
  initialMonsterSpeed!: number;
  constructor() {
    super("Level4");
  }

  preload() {
    this.load.image("skystar", "./assets/Level4/skystar.png");
    this.load.spritesheet("nyxyWalk", "./assets/Level3/NyxyWalk.png", {
      frameWidth: 69,
      frameHeight: 60,
    });
    this.load.spritesheet("enemy1", "./assets/Level4/enemy1.png", {
      frameWidth: 100,
      frameHeight: 78,
    });
  }
  create() {
    // Reset variables
    this.spawnDelay = 2500;
    this.initialMonsterSpeed = 500;
    this.monsterSpeed = this.initialMonsterSpeed;

    // Wait 3 seconds before spawning first wave
    this.spawnTimer = 3000;

    // setup camera
    this.cameras.main.setBackgroundColor(0x2e4482);
    this.cameras.main.setViewport(0, 100, 800, 300);

    // Setup input
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // Animations
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("nyxyWalk", {
        start: 0,
        end: 3,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "enemy1walk",
      frames: this.anims.generateFrameNumbers("enemy1", {
        start: 0,
        end: 3,
      }),
      frameRate: 12,
      repeat: -1,
    });

    // Add player
    this.jumpTimer = this.jumpHold;

    this.player = this.physics.add
      .sprite(80, 300, "nyxyWalk")
      .setOrigin(0.5, 1)
      .setScale(0.75)
      .play("walk");

    // Add background
    let stars = this.add.particles("skystar").setDepth(-100);
    let deathZone = new Phaser.Geom.Rectangle(-50, 0, 50, 300);

    stars.createEmitter({
      x: 1000,
      y: { min: 0, max: 280 },
      speedX: { min: -80, max: -120 },
      scale: 0.03,
      frequency: 100,
      lifespan: 30000,
      deathZone: { source: deathZone, type: "onEnter" },
    });

    stars.createEmitter({
      x: 1000,
      y: { min: 0, max: 290 },
      speedX: { min: -180, max: -220 },
      scale: 0.05,
      frequency: 150,
      lifespan: 30000,
      deathZone: { source: deathZone, type: "onEnter" },
    });

    stars.createEmitter({
      x: 1000,
      y: { min: 0, max: 280 },
      speedX: { min: -280, max: -320 },
      scale: 0.07,
      frequency: 500,
      lifespan: 30000,
      deathZone: { source: deathZone, type: "onEnter" },
    });
  }

  update(time: number, delta: number): void {
    // spawning
    if (this.spawnTimer <= 0) {
      this.physics.add
        .sprite(900, 330, "enemy1")
        .setSize(50, 40)
        .setOrigin(0.5, 1)
        .setScale(1.5)
        .play("enemy1walk")
        .setVelocityX(varyNum(-this.monsterSpeed, 10));
      this.spawnTimer = varyNum(this.spawnDelay, 80);
      this.spawnDelay -= 50;
      console.log(this.spawnDelay);
      this.monsterSpeed += 10;
    }
    this.spawnTimer -= delta;

    // Input and movement
    if (!this.grounded) {
      this.player.body.velocity.y += this.gravity * delta;
      this.jumpTimer -= delta;
    }
    if (this.player.y > 300) {
      this.player.body.velocity.y = 0;
      this.player.y = 300;
      this.grounded = true;
      this.jumpTimer = this.jumpHold;
    }
    if (this.keySpace.isDown && this.jumpTimer > 0) {
      this.player.body.velocity.y = -this.jumpHeight;
      this.grounded = false;
    } else {
    }

    if (
      this.keySpace.isUp &&
      !this.grounded &&
      this.player.body.velocity.y < 0
    ) {
      this.player.body.velocity.y += this.gravity * delta * 2;
      this.jumpTimer = 0;
    }
  }
}
