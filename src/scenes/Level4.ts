import Phaser from "phaser";

export default class Level4 extends Phaser.Scene {
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  keySpace!: Phaser.Input.Keyboard.Key;
  gravity = 2;
  jumpHeight = 700;
  jumpHold = 150;
  jumpTimer = 0;
  grounded = false;
  constructor() {
    super("Level4");
  }

  preload() {
    this.load.image("skystar", "./assets/Level4/skystar.png");
    this.load.spritesheet("nyxyWalk", "./assets/Level3/NyxyWalk.png", {
      frameWidth: 69,
      frameHeight: 60,
    });
  }
  create() {
    // setup camera
    this.cameras.main.setBackgroundColor(0x2e4482);
    this.cameras.main.setViewport(0, 100, 800, 300);

    // Setup input
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("nyxyWalk", {
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
