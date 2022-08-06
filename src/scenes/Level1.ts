import Phaser from "phaser";

export default class Level1 extends Phaser.Scene {
  startX = 50;
  cursors!: {
    left: any;
    right: any;
    up: any;
    down?: Phaser.Input.Keyboard.Key;
    space?: Phaser.Input.Keyboard.Key;
    shift?: Phaser.Input.Keyboard.Key;
  };
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  text!: Phaser.GameObjects.Text;
  hasStar: boolean = false;
  hasShoes: boolean = false;
  moveSpeed = 250;
  deathCount = 0;
  finished = false;
  deathSound!: Phaser.Sound.BaseSound;
  victorySound!: Phaser.Sound.BaseSound;
  thudSound!: Phaser.Sound.BaseSound;

  constructor() {
    super("Level1");
  }

  preload() {
    this.load.image("player", "./assets/sylveon.png");
    this.load.image("star", "./assets/star.png");
    this.load.image("envelope", "./assets/envelope.png");
    this.load.image("shoes", "./assets/shoes.png");
    this.load.image("ground", "./assets/ground.png");

    this.load.audio("jump", "./assets/jump.mp3");
    this.load.audio("sylveon", "./assets/sylveon.mp3");
    this.load.audio("starMusic", "./assets/starmusic.mp3");
    this.load.audio("victorySound", "./assets/victory.mp3");
    this.load.audio("skid", "./assets/skid.wav");
    this.load.audio("powerup", "./assets/powerup.mp3");
    this.load.audio("whoosh", "./assets/whoosh.mp3");
    this.load.audio("thud", "./assets/thud.wav");
  }

  create() {
    this.hasStar = false;
    this.finished = false;
    this.hasShoes = false;
    this.sound.stopAll();

    this.thudSound = this.sound.add("thud");

    this.deathSound = this.sound.add("sylveon");
    this.deathSound.on("play", () => {
      this.scene.pause();
    });
    this.deathSound.on("complete", () => {
      this.deathCount++;
      this.scene.restart();
    });

    this.victorySound = this.sound.add("victorySound");
    this.victorySound.on("complete", () => {
      this.scene.start("Level2");
    });

    // Create player
    this.player = this.physics.add
      .sprite(this.startX, 400, "player")
      .setScale(0.5);
    this.player.setGravity(0, 1000);
    this.player.setBounce(0.1);
    this.player.setSize(50, 115);

    // Create platforms
    const platforms = this.physics.add.staticGroup();
    platforms.create(100, 550, "ground").setScale(7, 1).refreshBody();
    platforms.create(400, 550, "ground").setScale(7, 1).refreshBody();
    platforms.create(650, 500, "ground").setScale(3, 1).refreshBody();
    platforms.create(950, 500, "ground").setScale(3, 1).refreshBody();
    platforms.create(2800, 550, "ground").setScale(100, 1).refreshBody();
    platforms.create(4600, 500, "ground").setScale(3, 1).refreshBody();
    this.physics.add.collider(this.player, platforms);

    // Show text for star
    const starText = this.add.text(2200, 300, "NICE... AH", {
      fontSize: "200px",
      fontStyle: "Bold",
      align: "center",
    });

    // Show text for finish zoom
    const sppedText = this.add.text(
      5300,
      200,
      "SUPER SPEED NYXY.... ZOOOOOOOOOOOOOOOOOOOOOMREEEEEEEEEEEEEEE",
      {
        fontSize: "200px",
        fontStyle: "Bold",
        align: "center",
      }
    );

    //Fake traps
    const fakeTraps = this.physics.add.group();
    fakeTraps.add(this.physics.add.sprite(150, 400, "envelope").setScale(0.2));
    fakeTraps.add(this.physics.add.sprite(250, 300, "envelope").setScale(0.2));
    fakeTraps.add(this.physics.add.sprite(430, 400, "envelope").setScale(0.2));
    fakeTraps.add(this.physics.add.sprite(1050, 500, "envelope").setScale(0.2));
    fakeTraps.add(this.physics.add.sprite(1080, 500, "envelope").setScale(0.2));

    this.physics.add.collider(this.player, fakeTraps, () => {
      this.deathSound.play();
    });

    // Trap 1
    const trap1 = this.physics.add.sprite(210, 400, "envelope").setScale(0.2);
    const trap1Zone = this.add.zone(220, 500, 50, 500);
    this.physics.add.existing(trap1Zone);
    this.physics.add.overlap(this.player, trap1Zone, () => {
      this.sound.play("whoosh");
      trap1.setVelocityY(300);
      trap1Zone.destroy();
    });
    this.physics.add.collider(this.player, trap1, () => {
      this.deathSound.play();
    });

    // Trap 2
    const trap2 = this.physics.add.sprite(400, 400, "envelope").setScale(0.2);
    const trap2Zone = this.add.zone(700, 300, 400, 100);
    this.physics.add.existing(trap2Zone);
    this.physics.add.overlap(this.player, trap2Zone, () => {
      this.sound.play("whoosh");
      trap2.setVelocityX(700);
      trap2Zone.destroy();
    });
    this.physics.add.collider(this.player, trap2, () => {
      this.deathSound.play();
    });

    // Trap 3
    const trap3 = this.physics.add.sprite(450, 580, "envelope").setScale(0.2);
    const trap3Zone = this.add.zone(460, 500, 50, 400);
    this.physics.add.existing(trap3Zone);
    this.physics.add.overlap(this.player, trap3Zone, () => {
      this.sound.play("whoosh");
      trap3.setVelocityY(-300);
      trap3Zone.destroy();
    });
    this.physics.add.collider(this.player, trap3, () => {
      this.deathSound.play();
    });

    //Trap 4
    const trap4 = this.physics.add.sprite(320, 200, "envelope").setScale(0.2);
    const trap4Zone = this.add.zone(320, 500, 50, 400);
    this.physics.add.existing(trap4Zone);
    this.physics.add.overlap(this.player, trap4Zone, () => {
      this.sound.play("whoosh");
      trap4.setVelocityY(800);
      trap4Zone.destroy();
    });
    this.physics.add.collider(this.player, trap4, () => {
      this.deathSound.play();
    });

    // Invisible wall
    const invisWall = this.add.zone(1800, 400, 50, 500);
    this.physics.add.existing(invisWall, true);
    this.physics.add.collider(this.player, invisWall, () => {
      if (!this.thudSound.isPlaying) {
        this.thudSound.play();
      }
    });

    // Shoes
    const shoes = this.physics.add.sprite(1750, 400, "shoes").setScale(0.15);
    this.physics.add.overlap(this.player, shoes, () => {
      this.sound.play("powerup");
      shoes.destroy();
      this.hasShoes = true;
      star.setTint(0x00ff00);
    });

    // Shoes brake zone
    const brakeZone = this.add.zone(4200, 400, 1000, 500);
    this.physics.add.existing(brakeZone);
    let braking = false;
    this.physics.add.overlap(this.player, brakeZone, () => {
      if (this.hasShoes) {
        if (braking === false) {
          braking = true;
          this.player.setAccelerationX(-400);
          this.sound.play("skid");
        }
        if (this.player.body.velocity.x < 10) {
          this.player.setVelocityX(0);
          this.player.setAccelerationX(0);
          brakeZone.destroy();
          this.sound.stopByKey("starMusic");
          this.hasStar = false;
        }
      }
    });

    // Platform trap 1
    const platTrap1 = this.physics.add
      .sprite(4800, 400, "ground")
      .setScale(3, 1)
      .refreshBody();
    platTrap1.body.setImmovable(true);

    this.physics.add.collider(this.player, platTrap1);
    const platTrap1Zone = this.add.zone(4850, 350, 300, 100);
    this.physics.add.existing(platTrap1Zone);
    this.physics.add.overlap(this.player, platTrap1Zone, () => {
      platTrap1.body.setVelocityY(-200);
      this.time.delayedCall(5000, () => {
        platTrap1.body.setVelocityY(300);
        platTrap1.body.setVelocityX(-20);
      });
      this.time.delayedCall(8500, () => {
        platTrap1.body.setVelocityY(0);
        platTrap1.body.setVelocityX(0);
        platTrap1.body.setAccelerationX(250);
      });
      platTrap1Zone.destroy();
    });

    // Star
    const star = this.physics.add.sprite(1220, 500, "star").setScale(0.1);
    this.physics.add.overlap(this.player, star, () => {
      this.hasStar = true;
      if (!this.hasShoes) {
        starText.setText("SLOW DOWN MIU MIU");
        this.sound.play("starMusic", { rate: 1.2 });
        this.player.setVelocityX(1000);
      } else {
        this.sound.play("starMusic", { rate: 1.0 });
        this.player.setVelocityX(750);
      }
      star.destroy();
      invisWall.destroy();
      shoes.destroy();
    });

    // Setup input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Setup camera
    this.cameras.main.setBounds(0, 0, 13500, this.cameras.main.height);
    this.cameras.main.setDeadzone(100);
    this.cameras.main.startFollow(this.player);

    this.text = this.add
      .text(10, 10, this.player.x.toString())
      .setScrollFactor(0);
  }

  update() {
    if (!this.finished && this.player.x > 14000) {
      this.finished = true;
      this.victorySound.play();
      this.cameras.main.fadeOut(1000);
    }
    // Death counter
    this.text.setText(
      "You've died " +
        this.deathCount.toString() +
        " time" +
        (this.deathCount != 1 ? "s" : "")
    );

    // If off bottom of screen, restart
    if (this.player.y > 700) {
      this.deathSound.play();
    }

    // Movement
    if (!this.hasStar && !this.finished) {
      if (this.cursors.left.isDown && this.player.x > 20) {
        this.player.setVelocityX(-this.moveSpeed);
        this.player.flipX = false;
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(this.moveSpeed);
        this.player.flipX = true;
      } else {
        this.player.setVelocityX(0);
      }
    }

    // Jumping
    if (
      this.cursors.up.isDown &&
      this.player.body.touching.down &&
      !this.finished &&
      !this.hasStar
    ) {
      this.sound.play("jump");
      this.player.setVelocityY(-500);
    }
  }
}
