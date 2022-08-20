import Phaser from "phaser";

export default class Level3 extends Phaser.Scene {
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors!: {
    left: any;
    right: any;
    up: any;
    down?: Phaser.Input.Keyboard.Key;
    space?: Phaser.Input.Keyboard.Key;
    shift?: Phaser.Input.Keyboard.Key;
  };
  nyxyHungerFill!: Phaser.GameObjects.Rectangle;
  isDead!: boolean;
  moveSpeed = 500;
  spawnTimer = 3000;
  maxEnemyChance = 0.4;
  spawnSpeed!: number;
  foodSpeed!: number;
  maxFoodSpeed = 750;
  minSpawnSpeed = 400;
  nyxHunger!: number;
  chanceOfEnemy!: number;
  chanceOfTreat!: number;
  introText!: Phaser.GameObjects.Text;
  deathSound!: Phaser.Sound.BaseSound;
  victorySound!: Phaser.Sound.BaseSound;
  bgMusic!: Phaser.Sound.BaseSound;
  won!: boolean;
  constructor() {
    super("Level3");
  }

  preload() {
    this.load.spritesheet("nyxySit", "./assets/Level3/NyxySit.png", {
      frameWidth: 42,
      frameHeight: 60,
    });
    this.load.spritesheet("nyxyWalk", "./assets/Level3/NyxyWalk.png", {
      frameWidth: 69,
      frameHeight: 60,
    });

    this.load.image("mydog1", "./assets/Level3/mydog1.png");
    this.load.image("mydog2", "./assets/Level3/mydog2.png");
    this.load.image("treat", "./assets/Level3/schmackos.png");
    this.load.image("pellets", "./assets/Level3/snailPellets.png");

    this.load.image("vom", "./assets/Level3/vomParticle.png");

    this.load.audio("cry", "./assets/Level3/cry.mp3");
    this.load.audio("nom", "./assets/Level3/nom.mp3");
    this.load.audio("nomnomnom", "./assets/Level3/nomnomnom.mp3");
    this.load.audio("tetris", "./assets/Level3/tetris.mp3");
    this.load.audio("victorySound", "./assets/victory.mp3");
  }

  create() {
    // Reset variables
    this.spawnSpeed = 2000;
    this.foodSpeed = 250;
    this.nyxHunger = 100;
    this.chanceOfEnemy = 0.1;
    this.chanceOfTreat = 0.01;
    this.spawnTimer = 5000;
    this.isDead = false;
    this.won = false;

    // reset cursor
    this.input.setDefaultCursor("auto");

    // BG music
    this.bgMusic = this.sound.add("tetris", { volume: 0.2 });
    this.bgMusic.play({
      loop: true,
    });

    // ending
    this.victorySound = this.sound.add("victorySound");
    this.victorySound.on("complete", () => {
      this.scene.start("Victory");
    });

    // Death sound
    this.deathSound = this.sound.add("cry");
    this.deathSound.on("play", () => {
      this.player.stop();
      this.bgMusic.stop();
    });
    this.deathSound.on("complete", () => {
      this.scene.restart();
    });

    // draw ui
    this.add
      .text(5, 5, "Nyxy Hunger:", {
        color: "0x0000",
      })
      .setDepth(2);
    this.add.rectangle(125, 5, 270, 16, 0x333333).setOrigin(0, 0).setDepth(2);
    this.nyxyHungerFill = this.add
      .rectangle(125, 5, 1, 16, 0x00b300)
      .setOrigin(0, 0)
      .setDepth(3);

    // draw message
    this.introText = this.add
      .text(200, 300, "DO THE IMPOSSIBLE\n\nSATIATE THE NYXY", {
        align: "center",
        fontSize: "30px",
      })
      .setOrigin(0.5, 0.5);

    // Set Background colour
    this.cameras.main.setBackgroundColor(0x87ceeb);
    this.cameras.main.setViewport(200, 0, 400, 600);

    // Load animations
    this.anims.create({
      key: "sit",
      frames: this.anims.generateFrameNumbers("nyxySit", {
        start: 0,
        end: 3,
      }),
      frameRate: 12,
      repeat: -1,
    });

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
    this.player = this.physics.add.sprite(200, 570, "nyxySit").play("sit");

    // Setup input
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  // Spawn enemy
  spawnEnemy() {
    const enemy = this.physics.add
      .sprite(Math.random() * (this.cameras.main.width - 40) + 20, 0, "pellets")
      .setScale(0.4)
      .setVelocityY(this.foodSpeed)
      .setName("enemy");

    this.physics.add.overlap(this.player, enemy, (player, enemy) => {
      // particles
      this.add.particles("vom").createEmitter({
        x: this.player.x,
        y: 550,
        angle: {
          min: -110,
          max: -70,
        },
        speed: 500,
        gravityY: 500,
        scale: 0.5,
        lifespan: [],
        quantity: 10,
      });

      enemy.destroy();
      this.isDead = true;
      this.spawnTimer = 10000000;
      this.deathSound.play();
      this.player.flipY = true;
    });
  }

  // Spawn food
  spawnFood(isTreat: boolean) {
    let foodSprite: string;
    if (isTreat) {
      foodSprite = "treat";
      this.chanceOfTreat = 0.01;
    } else {
      const foods = ["mydog1", "mydog2"];
      foodSprite = foods[Math.floor(Math.random() * foods.length)];
      this.chanceOfTreat += 0.01;
    }
    const food = this.physics.add
      .sprite(
        Math.random() * (this.cameras.main.width - 40) + 20,
        0,
        foodSprite
      )
      .setScale(0.4)
      .setSize(115, 115)
      .setOffset(23, 15)
      .setVelocityY(this.foodSpeed)
      .setName("food");

    this.physics.add.overlap(this.player, food, (player, food) => {
      this.sound.play(isTreat ? "nomnomnom" : "nom", {
        rate: 1 + Math.random() * 0.5,
      });
      this.nyxHunger += (isTreat ? 15000 : 8000) / this.foodSpeed;
      food.destroy();
    });
  }

  update(time: number, delta: number) {
    if (this.nyxHunger <= 0 && !this.isDead) {
      this.isDead = true;
      this.spawnTimer = 10000000;
      this.deathSound.play();
      this.player.flipY = true;
    }
    if (this.nyxHunger > 270 && !this.won) {
      this.won = true;
      this.bgMusic.stop();
      this.cameras.main.fade(3000);
      this.victorySound.play();
      this.spawnTimer = 100000;
      this.children
        .getAll("name", "food" as any)
        .forEach((obj) => obj.destroy());

      this.children
        .getAll("name", "enemy" as any)
        .forEach((obj) => obj.destroy());
    }
    const dt = delta / 1000;
    // update hunger
    if (this.nyxHunger >= 0) {
      this.nyxyHungerFill.displayWidth = this.nyxHunger;
    }
    this.nyxHunger -= dt * 10;

    // Spawn enemies/food
    if (this.spawnTimer <= 0) {
      if (this.introText) {
        this.introText.destroy();
      }
      const rand = Math.random();
      rand > this.chanceOfEnemy
        ? this.spawnFood(rand < this.chanceOfTreat)
        : this.spawnEnemy();

      if (this.chanceOfEnemy < this.maxEnemyChance) {
        this.chanceOfEnemy += 0.01;
      }

      this.spawnTimer = this.spawnSpeed;
      if (this.spawnSpeed > this.minSpawnSpeed) {
        this.spawnSpeed -= 20;
      }
      if (this.foodSpeed < this.maxFoodSpeed) {
        this.foodSpeed += 5;
      }
    }
    this.spawnTimer -= delta;

    // Player movement
    if (this.cursors.left.isDown && this.player.x > 21 && !this.isDead) {
      this.player.play("walk", true);
      this.player.flipX = true;
      this.player.x -= this.moveSpeed * dt;
      this.player.body.setSize(69, 60);
    } else if (
      this.cursors.right.isDown &&
      this.player.x < this.cameras.main.width - 21 &&
      !this.isDead
    ) {
      this.player.flipX = false;
      this.player.play("walk", true);
      this.player.x += this.moveSpeed * dt;
      this.player.body.setSize(69, 60);
    } else {
      if (!this.isDead) {
        this.player.play("sit", true);
      }
      this.player.body.setSize(42, 60);
    }
  }
}
