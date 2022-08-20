import Phaser from "phaser";

export default class Level2 extends Phaser.Scene {
  moveSpeed = 150;
  animSpeed = 10;
  bulletSpeed = 500;
  shootDelay = 100;
  enemySpeed = 100;
  enemySpawnSpeed = 500;
  maxEnemySpawnSpeed = 60;
  difficultyCurve = 8;
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  keys: any;
  stepSound!: Phaser.Sound.BaseSound;
  direction: string = "down";
  shootTimer = 0;
  enemySpawnTimer = 500;
  bullets!: Phaser.Physics.Arcade.Group;
  enemies!: Phaser.Physics.Arcade.Group;
  enemyBullets!: Phaser.Physics.Arcade.Group;
  bulletLifeSpan = 200;
  spawning = false;
  tutorialImage!: Phaser.GameObjects.Sprite;
  power = 0;
  maxPower = 320;
  powerBarFill!: Phaser.GameObjects.Rectangle;
  zapHealthFill!: Phaser.GameObjects.Rectangle;
  remaining = 120;
  remainingText!: Phaser.GameObjects.Text;
  phase2 = false;
  zapState = 0;
  zapdos!: Phaser.Physics.Arcade.Group;
  zapdosHP = 6600;
  victorySound!: Phaser.Sound.BaseSound;
  finished = false;
  deathSound!: Phaser.Sound.BaseSound;
  zapShootTimer = 0;
  zapShootDelay = 100;

  constructor() {
    super("Level2");
  }
  preload() {
    this.load.spritesheet("pikachu", "./assets/Level2/pikachu.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("bolt", "./assets/Level2/bolt.png");
    this.load.image("absol", "./assets/Level2/absol.png");
    this.load.image("wasd", "./assets/Level2/wasd.png");
    this.load.spritesheet("zapdos", "./assets/Level2/zapdos.png", {
      frameWidth: 145,
      frameHeight: 106,
    });
    this.load.image("fireball", "./assets/Level2/fireball.png");

    this.load.audio("step", "./assets/Level2/footstep_grass.mp3");
    this.load.audio("zap", "./assets/Level2/zaps.mp3");
    this.load.audio("zapcry", "./assets/Level2/zapcry.ogg");
    this.load.audio("victorySound", "./assets/victory.mp3");
    this.load.audio("pika", "./assets/Level2/pika.mp3");
    this.load.audio("music", "./assets/Level2/finalstretch.mp3");
    this.load.audio("absol", "./assets/Level2/absol.mp3");
  }

  create() {
    this.remaining = 120;
    this.enemySpawnSpeed = 500;
    this.enemySpawnTimer = 500;
    this.power = 0;
    this.phase2 = false;
    this.zapdosHP = 6600;
    this.zapState = 0;
    this.spawning = false;
    this.sound.stopAll();

    // sounds
    this.deathSound = this.sound.add("pika");
    this.deathSound.on("play", () => {
      this.scene.pause();
    });
    this.deathSound.on("complete", () => {
      this.scene.restart();
    });

    // ending
    this.victorySound = this.sound.add("victorySound");
    this.victorySound.on("complete", () => {
      this.scene.start("Level3");
    });

    // WASD image
    if (!this.spawning) {
      this.tutorialImage = this.add
        .sprite(150, 50, "wasd")
        .setScale(0.5)
        .setOrigin(0, 0);
    }

    // Power bar
    this.add.text(5, 10, "POWER");
    this.powerBarFill = this.add
      .rectangle(60, 8, 0, 20, 0xffea00)
      .setOrigin(0, 0);
    this.add.rectangle(60, 8, 300, 20, 0x38372d).setOrigin(0, 0).setDepth(-1);

    // Remaining count
    this.remainingText = this.add.text(
      570,
      10,
      `Remaining pokemon: ${this.remaining}`
    );

    // physics groups
    this.bullets = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();

    // On bullet collision
    this.physics.add.collider(this.bullets, this.enemies, (obj, other) => {
      obj.destroy();
      other.destroy();
      if (this.power < this.maxPower) {
        this.power += 5;
        this.shootDelay = 120 - this.power / 3;
        this.powerBarFill.width = this.power;
      }
      this.remaining--;
      if (this.remaining <= 0) {
        this.spawning = false;
        this.phase2 = true;
        this.remainingText.destroy();
        this.enemies.getChildren().forEach((obj) => {
          obj.destroy();
        });
      }
      if (this.remainingText.active) {
        this.remainingText.text = `Remaining pokemon: ${this.remaining}`;
      }
      this.enemySpawnTimer = 0;
    });

    // Setup input
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Set Background colour
    this.cameras.main.setBackgroundColor(0x175703);

    // Create animations
    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("pikachu", { start: 0, end: 3 }),
      frameRate: this.animSpeed,
      repeat: -1,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("pikachu", { start: 4, end: 7 }),
      frameRate: this.animSpeed,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("pikachu", { start: 8, end: 11 }),
      frameRate: this.animSpeed,
      repeat: -1,
    });

    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("pikachu", {
        start: 12,
        end: 15,
      }),
      frameRate: this.animSpeed,
      repeat: -1,
    });

    this.anims.create({
      key: "default",
      frames: this.anims.generateFrameNumbers("zapdos", { start: 0, end: 28 }),
      repeat: -1,
    });

    // Setup player
    this.player = this.physics.add.sprite(100, 100, "pikachu");
    this.player.body.setSize(20, 25, true);
    this.player.body.setOffset(21, 32);
    this.player.setDepth(1);
    this.player.body.setCollideWorldBounds(true);

    // Player collision with enemy
    this.physics.add.collider(this.player, this.enemies, (obj, other) => {
      this.power -= 30;
      this.powerBarFill.width = this.power;
      this.shootDelay = 120 - this.power / 3;
      if (this.power < 0) {
        this.deathSound.play();
      } else {
        other.destroy();
      }
    });

    // enemy bullet collide with player
    this.physics.add.collider(this.player, this.enemyBullets, () => {
      this.deathSound.play();
    });

    // Setup sounds
    this.stepSound = this.sound.add("step");
    this.stepSound.addMarker({
      name: "stepSound",
      duration: 0.2,
      config: {
        volume: 0.5,
      },
    });

    // start powerup
    const powerup = this.physics.add.sprite(600, 500, "bolt").setScale(0.5);
    this.physics.add.collider(this.player, powerup, (obj, other) => {
      this.power = 10;
      this.powerBarFill.width = this.power;
      this.shootDelay = 120 - this.power;
      this.input.setDefaultCursor("url(assets/Level2/target.cur), pointer");
      other.destroy();
    });
  }

  update(time: number, delta: number) {
    // Zapdos phase
    if (this.phase2) {
      if (this.zapState == 0) {
        this.sound.play("zapcry");
        // Zapdos
        this.zapdos = this.physics.add.group();
        const zapSprite = this.zapdos.create(0, 0, "zapdos");
        zapSprite.play("default");
        zapSprite.setScale(3);
        zapSprite.body.setSize(130, 30);
        zapSprite.body.setOffset(10, 35);
        const zapCollider = this.physics.add.existing(
          this.add.rectangle(0, 0, 100, 250)
        );
        (zapCollider.body as any).setOffset(15, 20);
        this.zapdos.add(zapCollider);
        this.zapdos.setXY(340, -150);
        this.zapdos.setVelocityY(800);
        this.zapState = 1;
        // Zap collisions
      } else if (
        (this.zapdos.getChildren()[0] as any).y > 140 &&
        this.zapState == 1
      ) {
        this.powerBarFill.width = 500;
        this.shootDelay = 5;
        this.sound.play("music");
        this.zapdos.setVelocity(0, 0);
        this.zapHealthFill = this.add
          .rectangle(200, 50, 300, 10, 0xff0000)
          .setOrigin(0, 0)
          .setDepth(1);
        this.add
          .rectangle(200, 50, 300, 10, 0x000000)
          .setOrigin(0, 0)
          .setDepth(0);
        // player collision
        this.physics.add.overlap(this.zapdos, this.player, () => {
          this.deathSound.play();
        });
        // bullet collision
        this.physics.add.overlap(this.zapdos, this.bullets, (obj, other) => {
          other.destroy();
          this.zapdosHP -= 10;
          this.zapHealthFill.width = this.zapdosHP / 22;

          // Ambush at 20% hp
          if (this.zapdosHP < 1800) {
            if (this.zapState == 2) {
              this.sound.play("zapcry");
              this.zapdos.setVelocityY(300);
              this.zapState = 3;
            } else if (
              this.zapState == 3 &&
              (this.zapdos.getChildren()[0] as any).y > 400
            ) {
              this.zapdos.setVelocityY(-150);
              this.zapState = 4;
            } else if (
              this.zapState == 4 &&
              (this.zapdos.getChildren()[0] as any).y < 140
            ) {
              this.zapdos.setVelocityY(0);
              this.zapState = 5;
            }
          }

          // Kill
          if (this.zapdosHP <= 0 && !this.finished) {
            this.enemyBullets.getChildren().forEach((obj) => {
              obj.destroy();
            });
            this.sound.stopAll();
            this.sound.play("zapcry");
            this.finished = true;
            this.shootDelay = 9999999;
            this.zapHealthFill.destroy();
            this.zapdos.rotate(Math.PI);
            this.victorySound.play();
            this.cameras.main.fadeOut(3000);
            this.player.setActive(false);
          }
        });
        this.zapState = 2;
      }

      if (this.zapState == 2 || this.zapState == 5) {
        this.zapShootTimer -= delta / 8;
        if (this.zapShootTimer <= 0) {
          if (this.enemyBullets.getLength() > 100) {
            this.enemyBullets.getChildren()[0].destroy();
          }
          const zapBullet = this.enemyBullets
            .create(300, 100, "fireball")
            .setScale(0.2);
          this.physics.moveTo(
            zapBullet,
            Math.random() * 400 + this.player.x - 200,
            Math.random() * 400 + this.player.y - 200,
            130
          );
          this.zapShootDelay = this.zapdosHP / 100;
          this.zapShootTimer = this.zapShootDelay;
        }
      }
    }
    if (this.spawning) {
      // Spawn enemies
      if (this.power > 0) {
        this.enemySpawnTimer -= delta / 8;
      }
    }
    if (this.spawning && this.enemySpawnTimer <= 0) {
      // cap out difficulty for obvious reasons
      if (this.enemySpawnSpeed > this.maxEnemySpawnSpeed) {
        this.enemySpawnSpeed -= this.difficultyCurve;
      }
      this.enemySpawnTimer = this.enemySpawnSpeed;
      const spawnSide = Math.floor(Math.random() * 4);

      const spawnX =
        spawnSide <= 1
          ? Math.random() * this.cameras.main.width
          : spawnSide == 3
          ? this.cameras.main.width
          : 0;

      const spawnY =
        spawnSide >= 2
          ? Math.random() * this.cameras.main.height
          : spawnSide == 1
          ? this.cameras.main.height
          : 0;

      this.enemies.create(spawnX, spawnY, "absol").setScale(0.4);
      this.sound.play("absol");
    }

    // Move enemies towards player
    if (this.spawning) {
      this.enemies.getChildren().forEach((enemy) => {
        this.physics.moveToObject(enemy, this.player, this.enemySpeed);
      });
    }

    this.bullets.getChildren().forEach((bullet) => {
      bullet.setState((bullet.state as number) - 1);
      if ((bullet.state as number) <= 0) {
        bullet.destroy();
      }
    });

    // Movement
    let moveY = +this.keys.down!.isDown - this.keys.up?.isDown;
    let moveX = +this.keys.right!.isDown - this.keys.left.isDown;
    this.player.setVelocity(moveX * this.moveSpeed, moveY * this.moveSpeed);

    if (Math.abs(moveX) + Math.abs(moveY) != 0 && !this.stepSound.isPlaying) {
      this.stepSound.play("stepSound", {
        rate: 0.9 + Math.random() * 0.2,
      });
    }

    if (!this.spawning && !this.phase2 && (moveX || moveY)) {
      this.spawning = true;
      this.tutorialImage.destroy();
    }

    if (moveX) {
      this.direction = moveX > 0 ? "right" : "left";
    } else if (moveY) {
      this.direction = moveY > 0 ? "down" : "up";
    } else {
      this.player.stop();
    }
    if (this.direction) {
      this.player.play(this.direction, true);
    }
    this.shootTimer += delta / 8;
    if (this.power > 0 && this.shootTimer > this.shootDelay) {
      this.shootTimer = 0;
      this.sound.play("zap");
      const bullet = this.bullets
        .create(this.player.x, this.player.y + 10, "bolt")
        .setScale(0.4);
      bullet.setState(this.bulletLifeSpan);
      this.physics.moveTo(
        bullet,
        this.game.input.mousePointer.x,
        this.game.input.mousePointer.y,
        this.bulletSpeed
      );
      // this.physics.moveToObject(bullet, nearestEnemy, this.bulletSpeed);
      const angle =
        Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x) -
        Math.PI / 2;

      bullet.rotation = angle;
    }
  }
}
